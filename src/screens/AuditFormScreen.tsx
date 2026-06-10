// src/screens/AuditFormScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { getChecklistByModel } from '../data/ChecklistMaster';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const LIMITE_FOTOS_POR_PUNTO = 3;

export default function AuditFormScreen({ route, navigation }: any) {
  const { modelo, serie, eco, departamento } = route.params; 
  const { preguntas, maximo } = getChecklistByModel(modelo);

  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<any>({});
  const [comentariosSeccion, setComentariosSeccion] = useState<any>({}); 
  const [segundos, setSegundos] = useState(0); 
  const [cargandoBorrador, setCargandoBorrador] = useState(true);

  // 🚀 NUEVO ESTADO PARA LA CAJA DE "NO EVALUADO"
  const [justificacionNoEvaluado, setJustificacionNoEvaluado] = useState('');

  // --- 1. CRONÓMETRO ---
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSegundos((s) => s + 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const formatearTiempo = (totalSegundos: number) => {
    const h = Math.floor(totalSegundos / 3600);
    const m = Math.floor((totalSegundos % 3600) / 60);
    const s = totalSegundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- 2. CARGAR BORRADOR ---
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const cargarBorrador = async () => {
        try {
          const borrador = await AsyncStorage.getItem('@borrador_auditoria');
          if (borrador) {
            const dataGuardada = JSON.parse(borrador);
            if (dataGuardada.eco === eco) { 
              if (isMounted) {
                setRespuestas(dataGuardada.respuestas || {});
                setComentariosSeccion(dataGuardada.comentariosSeccion || {});
                if (dataGuardada.justificacionNoEvaluado) setJustificacionNoEvaluado(dataGuardada.justificacionNoEvaluado);
                if (dataGuardada.segundos) setSegundos(dataGuardada.segundos);
              }
            } else {
              if (isMounted) {
                setRespuestas({});
                setComentariosSeccion({});
                setJustificacionNoEvaluado('');
                setSegundos(0);
              }
              await AsyncStorage.removeItem('@borrador_auditoria');
            }
          } else {
             if (isMounted) {
               setRespuestas({});
               setComentariosSeccion({});
               setJustificacionNoEvaluado('');
               setSegundos(0);
             }
          }
        } catch (error) {
          console.error("Error al cargar borrador", error);
        } finally {
          if (isMounted) setCargandoBorrador(false);
        }
      };

      cargarBorrador();

      return () => {
        isMounted = false;
      };
    }, [eco])
  );

  // --- GUARDAR BORRADOR AUTOMÁTICO ---
  useEffect(() => {
    if (!cargandoBorrador) {
      const dataParaGuardar = { respuestas, comentariosSeccion, segundos, eco, justificacionNoEvaluado };
      AsyncStorage.setItem('@borrador_auditoria', JSON.stringify(dataParaGuardar));
    }
  }, [respuestas, comentariosSeccion, segundos, cargandoBorrador, eco, justificacionNoEvaluado]);

  const handleRespuesta = (idPregunta: string, status: 'pasa' | 'nopasa') => {
    setRespuestas({ ...respuestas, [idPregunta]: { ...respuestas[idPregunta], status: status } });
  };

  const handleDetalleAccion = (idPregunta: string, campo: 'accion' | 'detalle', valor: string) => {
    setRespuestas({ ...respuestas, [idPregunta]: { ...respuestas[idPregunta], [campo]: valor } });
  };

  const tomarFotoEvidencia = async (idPregunta: string) => {
    const fotosActuales = respuestas[idPregunta]?.fotos || [];
    if (fotosActuales.length >= LIMITE_FOTOS_POR_PUNTO) {
      Alert.alert('Límite alcanzado', `Máximo de ${LIMITE_FOTOS_POR_PUNTO} fotos por punto.`);
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara.');

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, quality: 0.4, base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setRespuestas({
        ...respuestas,
        [idPregunta]: { ...respuestas[idPregunta], fotos: [...fotosActuales, result.assets[0].base64] }
      });
    }
  };

  const eliminarFoto = (idPregunta: string, index: number) => {
    const nuevasFotos = (respuestas[idPregunta]?.fotos || []).filter((_: any, i: number) => i !== index);
    setRespuestas({ ...respuestas, [idPregunta]: { ...respuestas[idPregunta], fotos: nuevasFotos } });
  };

  const getEstadoPadre = (item: any) => {
    if (!item.subItems || item.subItems.length === 0) return null;
    let totalHijos = item.subItems.length;
    let pasados = 0, fallados = 0;
    item.subItems.forEach((sub: any) => {
      const stat = respuestas[sub.id]?.status;
      if (stat === 'pasa') pasados++;
      if (stat === 'nopasa') fallados++;
    });
    if (fallados > 0) return 'nopasa';
    if (pasados === totalHijos) return 'pasa';
    return 'pendiente';
  };

  // 🚀 MEJORA 1: CALCULAR PROGRESO CONTANDO SUB-TABLAS
  const calcularProgresoSeccion = (seccion: any) => {
    let totalPreguntas = seccion.items.length;
    let respondidas = 0;
    
    seccion.items.forEach((item: any) => {
      if (item.subItems && item.subItems.length > 0) {
        // Es un padre con sub-tabla. Verificamos si ya está "Terminado" (Pasa o No Pasa)
        const estado = getEstadoPadre(item);
        if (estado === 'pasa' || estado === 'nopasa') {
          respondidas++;
        }
      } else {
        // Es un item normal
        if (respuestas[item.id] && respuestas[item.id].status) {
          respondidas++;
        }
      }
    });

    const completo = totalPreguntas > 0 && respondidas === totalPreguntas;
    return { respondidas, totalPreguntas, completo };
  };

  // 🚀 MEJORA 2: VERIFICAR SI TODA LA AUDITORÍA ESTÁ COMPLETA
  const verificarProgresoGlobal = () => {
    let preguntasTotalesApp = 0;
    let respondidasTotalesApp = 0;

    preguntas.forEach((seccion: any) => {
        const progreso = calcularProgresoSeccion(seccion);
        preguntasTotalesApp += progreso.totalPreguntas;
        respondidasTotalesApp += progreso.respondidas;
    });

    return preguntasTotalesApp === respondidasTotalesApp;
  };

  const isAuditoriaCompletada = verificarProgresoGlobal();
  const isJustificacionSuficiente = justificacionNoEvaluado.trim().length >= 6;
  
  // El botón se activa SI la auditoría está al 100% O SI escribieron en la justificación
  const isBotonActivo = isAuditoriaCompletada || isJustificacionSuficiente;


  const renderItem = (item: any, isSubItem = false) => {
    const res = respuestas[item.id] || {};
    const isPadre = item.subItems && item.subItems.length > 0;
    let isPasa = false, isNoPasa = false;

    if (isPadre) {
      const estadoCalculado = getEstadoPadre(item);
      isPasa = estadoCalculado === 'pasa';
      isNoPasa = estadoCalculado === 'nopasa';
    } else {
      isPasa = res.status === 'pasa';
      isNoPasa = res.status === 'nopasa';
    }

    const fotos = res.fotos || [];

    return (
      <View key={item.id} style={[styles.itemCard, isSubItem ? styles.subItemCard : null]}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemText}>{item.id} - {item.text} <Text style={styles.itemValue}>({item.value} pts)</Text></Text>
        </View>

        {isPadre ? (
          <View style={styles.badgePadreContainer}>
            {isPasa && <Text style={styles.badgePadreVerde}>✔️ Sección Aprobada</Text>}
            {isNoPasa && <Text style={styles.badgePadreRojo}>❌ Falló en tabla extra</Text>}
            {!isPasa && !isNoPasa && <Text style={styles.badgePadreGris}>Contesta la tabla de abajo...</Text>}
          </View>
        ) : (
          <View style={styles.botonesContainer}>
            <TouchableOpacity style={[styles.btnOpcion, isPasa && styles.btnPasaActivo]} onPress={() => handleRespuesta(item.id, 'pasa')}>
              <Text style={[styles.btnTexto, isPasa && styles.btnTextoActivo]}>✔️ Pasa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnOpcion, isNoPasa && styles.btnNoPasaActivo]} onPress={() => handleRespuesta(item.id, 'nopasa')}>
              <Text style={[styles.btnTexto, isNoPasa && styles.btnTextoActivo]}>❌ No Pasa</Text>
            </TouchableOpacity>
          </View>
        )}

        {isNoPasa && !isPadre && (
          <View style={styles.cajaJustificacion}>
            <Text style={styles.labelAccion}>¿Qué acción requiere?</Text>
            <View style={styles.accionesContainer}>
              {['Cambio/Diagnostico', 'Ajuste/lubricacion'].map((accion) => (
                <TouchableOpacity key={accion} style={[styles.btnAccionMini, res.accion === accion && styles.btnAccionMiniActivo]} onPress={() => handleDetalleAccion(item.id, 'accion', accion)}>
                  <Text style={[styles.btnAccionTexto, res.accion === accion && styles.btnTextoActivo]}>{accion}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.inputDetalle} placeholder="Describe el problema detectado..." value={res.detalle || ''} onChangeText={(texto) => handleDetalleAccion(item.id, 'detalle', texto)} />
            
            <View style={styles.zonaFoto}>
              <View style={styles.labelFotosRow}>
                <Text style={styles.labelAccion}>Evidencia Fotográfica ({fotos.length}/{LIMITE_FOTOS_POR_PUNTO})</Text>
                {fotos.length < LIMITE_FOTOS_POR_PUNTO && (
                    <TouchableOpacity style={styles.btnAñadirFotoChico} onPress={() => tomarFotoEvidencia(item.id)}>
                        <Ionicons name="camera" size={18} color="#D12424" />
                        <Text style={styles.textoAñadirChico}>+ Añadir</Text>
                    </TouchableOpacity>
                )}
              </View>
              {fotos.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carruselFotos}>
                  {fotos.map((fotoBase64: string, index: number) => (
                    <View key={index} style={styles.contenedorFotoMiniatura}>
                      <Image source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }} style={styles.fotoMiniaturaMulti} />
                      <TouchableOpacity style={styles.btnEliminarFoto} onPress={() => eliminarFoto(item.id, index)}>
                        <Ionicons name="close-circle" size={24} color="#dc2626" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <TouchableOpacity style={styles.btnTomarFotoLargo} onPress={() => tomarFotoEvidencia(item.id)}>
                  <Ionicons name="camera" size={24} color="#D12424" />
                  <Text style={styles.btnTomarFotoTextoLargo}>Tomar Foto de Evidencia</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {item.subItems && item.subItems.length > 0 && (
          <View style={styles.subItemsContainer}>
            <Text style={styles.subItemsTitle}>👇 Tabla Extra de Inspección</Text>
            {item.subItems.map((sub: any) => renderItem(sub, true))}
          </View>
        )}
      </View>
    );
  };

  const finalizarAuditoria = async () => {
    let respuestasParaEnviar = { ...respuestas };
    
    // 🚀 INYECTAMOS LOS DATOS INICIALES DENTRO DEL JSON DE RESPUESTAS 🚀
    // Tomamos las variables que nos mandó SetupAuditScreen y las guardamos
    // con las llaves exactas que Laravel está esperando leer.
    respuestasParaEnviar['Cliente'] = route.params.instalado || 'N/A';
    respuestasParaEnviar['Departamento'] = route.params.departamento || 'N/A';
    respuestasParaEnviar['Horas_Inspeccion'] = route.params.horasInspeccion || 'N/A';
    respuestasParaEnviar['Fecha_Ultimo_MP'] = route.params.fechaUltimoMp || 'N/A';
    respuestasParaEnviar['Horas_Ultimo_MP'] = route.params.horasMp || 'N/A';
    respuestasParaEnviar['Aplicacion'] = route.params.aplicacion || 'N/A';
    respuestasParaEnviar['Diagnostico'] = route.params.diagSeguimiento || 'N/A';
    // ----------------------------------------------------------------------

    // LÓGICA EXISTENTE: Recorremos todas las secciones y preguntas para inyectar el título y los puntos
    preguntas.forEach((seccion: any) => {
      seccion.items.forEach((item: any) => {
        
        // Si el usuario contestó esta pregunta (ya sea normal o padre)
        if (respuestasParaEnviar[item.id] || (item.subItems && item.subItems.length > 0)) {
            
            // Si es un padre (tiene sub-tablas), calculamos su estado final
            if (item.subItems && item.subItems.length > 0) {
              const estadoCalculado = getEstadoPadre(item);
              if (estadoCalculado === 'pasa' || estadoCalculado === 'nopasa') {
                respuestasParaEnviar[item.id] = { ...respuestasParaEnviar[item.id], status: estadoCalculado };
              }
            }

            // INYECTAMOS EL TÍTULO Y LA SECCIÓN EN LA RESPUESTA
            if (respuestasParaEnviar[item.id]) {
                respuestasParaEnviar[item.id].titulo_pregunta = item.text;
                respuestasParaEnviar[item.id].seccion = seccion.title;
            }

            // Si tiene subItems, también le inyectamos los títulos a los hijos
            if (item.subItems && item.subItems.length > 0) {
                item.subItems.forEach((sub: any) => {
                    if (respuestasParaEnviar[sub.id]) {
                        respuestasParaEnviar[sub.id].titulo_pregunta = sub.text;
                        respuestasParaEnviar[sub.id].seccion = seccion.title;
                    }
                });
            }
        }
      });
    });

    // Añadimos el comentario "No Evaluado" al objeto general de comentarios para que llegue a Laravel
    let comentariosFinales = { ...comentariosSeccion };
    if (justificacionNoEvaluado.trim() !== '') {
        comentariosFinales['NO_EVALUADO'] = justificacionNoEvaluado;
    }

    navigation.navigate('AuditResultsScreen', {
      ...route.params, 
      respuestas: respuestasParaEnviar,
      preguntas, 
      maximo, 
      tiempoEvaluacion: formatearTiempo(segundos),
      comentariosSeccion: comentariosFinales,
      modelo_texto: route.params.modelo_texto,
      departamento: route.params.departamento,      
    });
  };
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.headerInfo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Auditoría: {modelo}</Text>
            <Text style={styles.headerSubtitle}>ECO: {eco} | Serie: {serie}</Text>
          </View>
          <View style={styles.cronometroContainer}>
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.cronometroTexto}>{formatearTiempo(segundos)}</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {preguntas.map((seccion: any) => {
            const isOpen = seccionActiva === seccion.id;
            const progreso = calcularProgresoSeccion(seccion);

            return (
              <View key={seccion.id} style={styles.seccionContainer}>
                <TouchableOpacity style={styles.acordeonHeader} onPress={() => setSeccionActiva(isOpen ? null : seccion.id)}>
                  <Text style={styles.acordeonTitle}>{seccion.title}</Text>
                  
                  <View style={[styles.progresoBadge, { backgroundColor: progreso.completo ? '#22c55e' : '#f59e0b' }]}>
                    <Text style={styles.progresoTexto}>{progreso.respondidas}/{progreso.totalPreguntas}</Text>
                  </View>
                  
                  <Text style={styles.acordeonIcon}>{isOpen ? '🔼' : '🔽'}</Text>
                </TouchableOpacity>
                
                {isOpen && (
                  <View style={styles.acordeonBody}>
                    {seccion.items.map((item: any) => renderItem(item))}

                    <View style={styles.cajaComentarioSeccion}>
                      <Text style={styles.labelComentarioSeccion}>Observaciones de {seccion.title} (Opcional):</Text>
                      <TextInput 
                        style={styles.inputComentarioSeccion}
                        placeholder="Agrega un comentario general sobre esta sección..."
                        multiline
                        value={comentariosSeccion[seccion.id] || ''}
                        onChangeText={(txt) => setComentariosSeccion({...comentariosSeccion, [seccion.id]: txt})}
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          {/* 🚀 MEJORA 2: CAJA DE JUSTIFICACIÓN DE "NO EVALUADO" */}
          {!isAuditoriaCompletada && (
            <View style={styles.cajaNoEvaluado}>
                <Text style={styles.tituloNoEvaluado}>¿No se puede evaluar el equipo?</Text>
                <Text style={styles.subTituloNoEvaluado}>
                    Si el cliente no permite la evaluación o el equipo no está disponible, explica el motivo aquí para poder continuar. (Mín. 6 letras)
                </Text>
                <TextInput 
                    style={styles.inputNoEvaluado}
                    placeholder="Ej: El cliente está usando el equipo y no puede detenerse..."
                    multiline
                    value={justificacionNoEvaluado}
                    onChangeText={setJustificacionNoEvaluado}
                />
            </View>
          )}

          {/* 🚀 MEJORA 2: BOTÓN BLOQUEADO / DESBLOQUEADO */}
          <TouchableOpacity 
            style={[styles.btnFinalizar, !isBotonActivo && styles.btnFinalizarBloqueado]} 
            onPress={isBotonActivo ? finalizarAuditoria : () => Alert.alert('Auditoría Incompleta', 'Debes contestar todos los puntos o justificar por qué no se evaluó el equipo en la caja de arriba.')}
            activeOpacity={isBotonActivo ? 0.7 : 1}
          >
            <Text style={styles.btnFinalizarTexto}>
                {isBotonActivo ? 'FINALIZAR Y EVALUAR' : 'COMPLETA PARA CONTINUAR'}
            </Text>
          </TouchableOpacity>
          
          <View style={{height: 150}} /> 
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width: widthScreen } = Dimensions.get('window');
const tamañoThumbnail = (widthScreen - 80) / 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  headerInfo: { backgroundColor: '#1e293b', padding: 20, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#94a3b8', fontSize: 16 },
  
  cronometroContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#475569' },
  cronometroTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 6, fontVariant: ['tabular-nums'] },

  scroll: { padding: 15 },
  seccionContainer: { marginBottom: 10, borderRadius: 10, backgroundColor: '#fff', overflow: 'hidden', elevation: 2 },
  acordeonHeader: { backgroundColor: '#e2e8f0', padding: 18, flexDirection: 'row', alignItems: 'center' },
  acordeonTitle: { fontSize: 15, fontWeight: 'bold', color: '#334155', flex: 1 },
  acordeonIcon: { fontSize: 18, marginLeft: 10 },
  progresoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  progresoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  acordeonBody: { padding: 10, backgroundColor: '#f8fafc' },
  itemCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  subItemCard: { marginLeft: 15, borderLeftWidth: 4, borderLeftColor: '#D12424', marginTop: 8 },
  itemHeader: { marginBottom: 10 },
  itemText: { fontSize: 15, color: '#1e293b', fontWeight: '500' },
  itemValue: { color: '#64748b', fontWeight: 'normal' },
  botonesContainer: { flexDirection: 'row', gap: 10 },
  btnOpcion: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  btnPasaActivo: { backgroundColor: '#22c55e', borderColor: '#16a34a' },
  btnNoPasaActivo: { backgroundColor: '#ef4444', borderColor: '#dc2626' },
  btnTexto: { fontWeight: 'bold', color: '#64748b' },
  btnTextoActivo: { color: '#fff' },
  badgePadreContainer: { padding: 10, borderRadius: 8, backgroundColor: '#f8fafc', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  badgePadreGris: { color: '#64748b', fontWeight: 'bold', fontStyle: 'italic' },
  badgePadreVerde: { color: '#16a34a', fontWeight: 'bold' },
  badgePadreRojo: { color: '#dc2626', fontWeight: 'bold' },
  cajaJustificacion: { marginTop: 15, backgroundColor: '#fee2e2', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#fca5a5' },
  labelAccion: { fontSize: 14, fontWeight: 'bold', color: '#991b1b', marginBottom: 10 },
  accionesContainer: { flexDirection: 'row', gap: 5, marginBottom: 10 },
  btnAccionMini: { flex: 1, padding: 8, backgroundColor: '#fff', borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#fca5a5' },
  btnAccionMiniActivo: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  btnAccionTexto: { fontSize: 12, fontWeight: 'bold', color: '#991b1b' },
  inputDetalle: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 6, padding: 10, fontSize: 14 },
  
  cajaComentarioSeccion: { marginTop: 15, padding: 15, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'dashed' },
  labelComentarioSeccion: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  inputComentarioSeccion: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 10, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },

  // 🚀 ESTILOS NUEVOS PARA LA CAJA DE "NO EVALUADO"
  cajaNoEvaluado: { backgroundColor: '#fff7ed', padding: 20, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: '#bfdbfe' },
  tituloNoEvaluado: { fontSize: 16, fontWeight: 'bold', color: '#1e40af', marginBottom: 5 },
  subTituloNoEvaluado: { fontSize: 13, color: '#475569', marginBottom: 10 },
  inputNoEvaluado: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#93c5fd', borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },

  zonaFoto: { marginTop: 15 },
  labelFotosRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  btnAñadirFotoChico: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#D12424' },
  textoAñadirChico: { color: '#D12424', fontSize: 12, fontWeight: 'bold', marginLeft: 3 },
  carruselFotos: { flexDirection: 'row', marginBottom: 5 },
  contenedorFotoMiniatura: { marginRight: 10, position: 'relative' },
  fotoMiniaturaMulti: { width: tamañoThumbnail, height: tamañoThumbnail, borderRadius: 8 },
  btnEliminarFoto: { position: 'absolute', top: -10, right: -10, backgroundColor: '#fff', borderRadius: 12 },
  btnTomarFotoLargo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D12424', borderStyle: 'dashed', width: '100%', justifyContent: 'center' },
  btnTomarFotoTextoLargo: { color: '#D12424', fontWeight: 'bold', marginLeft: 8 },
  subItemsContainer: { marginTop: 15, backgroundColor: '#eff6ff', padding: 10, borderRadius: 8 },
  subItemsTitle: { fontSize: 13, fontWeight: 'bold', color: '#1d4ed8', marginBottom: 10 },
  
  // 🚀 ESTILOS DEL BOTÓN FINALIZAR MODIFICADOS
  btnFinalizar: { backgroundColor: '#0f172a', padding: 20, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnFinalizarBloqueado: { backgroundColor: '#94a3b8' },
  btnFinalizarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});