// src/screens/AuditResultsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignatureScreen from 'react-native-signature-canvas';

export default function AuditResultsScreen({ route, navigation }: any) {
  const { 
    respuestas, 
    preguntas, 
    maximo, 
    modelo, eco, serie, nombreTecnico, sucursal, 
    tiempoEvaluacion, 
    comentariosSeccion 
  } = route.params;

  const [puntosObtenidos, setPuntosObtenidos] = useState(0);
  const [porcentaje, setPorcentaje] = useState(0);
  const [rango, setRango] = useState({ texto: '', color: '' });
  
  // --- TABLAS EXTRAS ---
  const [modulosExtra, setModulosExtra] = useState<any[]>([]);
  const [totalFotos, setTotalFotos] = useState(0);
  
  // --- OBSERVACIONES ---
  const [observacionesEstructuradas, setObservacionesEstructuradas] = useState<any[]>([]);

  // --- FIRMAS ---
  const [firmaTecnico, setFirmaTecnico] = useState('');
  const [firmaLider, setFirmaLider] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Referencias para controlar los botones por fuera del dibujo
  const refFirmaTecnico = useRef<any>(null);
  const refFirmaLider = useRef<any>(null);

  useEffect(() => {
    let puntosTemp = 0;
    let extrasTemp: any[] = []; 
    let conteoFotosTemp = 0; 
    let obsEstructuradasTemp: any[] = [];

    const maximoSeguro = Number(maximo) || 1; 

    preguntas.forEach((seccion: any) => {
      let fallasSeccion: any[] = []; 

      seccion.items.forEach((item: any) => {
        const res = respuestas[item.id];
        
        if (res) {
          if (res.status === 'pasa') {
            puntosTemp += Number(item.value || 0); 
          } else if (res.status === 'nopasa') {
            const fotosCount = res.fotos ? res.fotos.length : 0;
            conteoFotosTemp += fotosCount;
            fallasSeccion.push({
              pregunta: `${item.id} - ${item.text}`,
              accion: res.accion || 'Revisión',
              detalle: res.detalle || 'Sin detalles',
              evidencia: fotosCount
            });
          }
        }

        // --- CÁLCULO DE TABLAS EXTRAS ---
        if (item.subItems && item.subItems.length > 0) {
          let subMaximo = 0;
          let subObtenidos = 0;

          item.subItems.forEach((sub: any) => {
            subMaximo += Number(sub.value || 0); 
            const resSub = respuestas[sub.id];

            if (resSub) {
              if (resSub.status === 'pasa') {
                subObtenidos += Number(sub.value || 0); 
              } else if (resSub.status === 'nopasa') {
                const fotosCount = resSub.fotos ? resSub.fotos.length : 0;
                conteoFotosTemp += fotosCount;
                fallasSeccion.push({
                  pregunta: `${sub.id} - ${sub.text}`,
                  accion: resSub.accion || 'Revisión',
                  detalle: resSub.detalle || 'Sin detalles',
                  evidencia: fotosCount
                });
              }
            }
          });

          extrasTemp.push({
            id: item.id,
            titulo: item.text, 
            obtenidos: subObtenidos,
            maximo: subMaximo,
            color: subObtenidos === subMaximo ? '#22c55e' : '#ef4444'
          });
        }
      });

      const comentarioDeEstaSeccion = comentariosSeccion[seccion.id];

      if (fallasSeccion.length > 0 || (comentarioDeEstaSeccion && comentarioDeEstaSeccion.trim() !== '')) {
        obsEstructuradasTemp.push({
          id: seccion.id,
          titulo: seccion.title,
          fallas: fallasSeccion,
          comentario: comentarioDeEstaSeccion
        });
      }
    });

    setModulosExtra(extrasTemp);
    setTotalFotos(conteoFotosTemp); 
    setObservacionesEstructuradas(obsEstructuradasTemp);
    setPuntosObtenidos(puntosTemp);
    
    const calcPorcentaje = (puntosTemp / maximoSeguro) * 100;
    setPorcentaje(Number(calcPorcentaje.toFixed(1)));

    if (calcPorcentaje >= 90) setRango({ texto: 'BUENA CONDICIÓN', color: '#22c55e' });
    else if (calcPorcentaje >= 80) setRango({ texto: 'REQUIERE ATENCIÓN', color: '#3b82f6' });
    else setRango({ texto: 'MALO', color: '#ef4444' });

  }, []);

  const handleGuardar = async () => {
    if (!firmaTecnico || !firmaLider) {
        Alert.alert('Faltan Firmas', 'Por favor, asegúrate de que ambas firmas estén guardadas.');
        return;
    }

    // --- NUEVO: BORRAR EL BORRADOR DE LA MEMORIA AL ENVIAR ---
    try {
        await AsyncStorage.removeItem('@borrador_auditoria');
    } catch (e) {
        console.error("Error al limpiar borrador", e);
    }

    navigation.navigate('SendReportScreen', {
        modelo, eco, serie, nombre_tecnico: nombreTecnico, sucursal, porcentaje_final: porcentaje, 
        datos_completos: respuestas,
        tiempo_evaluacion: tiempoEvaluacion,
        comentarios_seccion: comentariosSeccion,
        firma_tecnico: firmaTecnico,
        firma_lider: firmaLider
    });
};

  return (
    <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Resultados Finales</Text>
          <View style={styles.tiempoBadge}>
            <Text style={styles.tiempoText}>⏱️ {tiempoEvaluacion}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{modelo} | ECO: {eco} | Serie: {serie}</Text>
        <Text style={styles.tecnico}>Técnico: {nombreTecnico} {sucursal ? `| Sucursal: ${sucursal}` : ''}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Calificación General</Text>
        <View style={styles.scoreContainer}>
          <View style={[styles.circle, { borderColor: rango.color }]}>
            <Text style={[styles.percentage, { color: rango.color }]}>{porcentaje}%</Text>
            <Text style={styles.pointsText}>{puntosObtenidos} / {maximo} pts</Text>
          </View>
          <View style={[styles.rangoBadge, { backgroundColor: rango.color }]}>
            <Text style={styles.rangoTexto}>ESTADO: {rango.texto}</Text>
          </View>
          {totalFotos > 0 && (
            <View style={styles.fotosBadge}>
              <Text style={styles.fotosTexto}>📸 {totalFotos} fotos de evidencia adjuntas</Text>
            </View>
          )}
        </View>
      </View>

      {/* --- TABLAS EXTRAS VISIBLES DE NUEVO --- */}
      {modulosExtra.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Análisis de Tablas Extras</Text>
          <Text style={styles.helpText}>Puntos obtenidos en componentes específicos.</Text>
          
          {modulosExtra.map((modulo) => (
            <View key={modulo.id} style={[styles.moduloExtraCard, { borderLeftColor: modulo.color }]}>
              <View style={styles.moduloExtraInfo}>
                <Text style={styles.moduloExtraTitle}>{modulo.titulo}</Text>
              </View>
              <View style={[styles.moduloExtraScoreBadge, { backgroundColor: modulo.color }]}>
                <Text style={styles.moduloExtraScoreText}>{modulo.obtenidos} / {modulo.maximo} pts</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* --- OBSERVACIONES --- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Observaciones Detalladas</Text>
        
        {observacionesEstructuradas.length === 0 ? (
          <Text style={styles.textoLimpio}>✅ Equipo en óptimas condiciones. Sin fallas reportadas ni comentarios extra.</Text>
        ) : (
          observacionesEstructuradas.map((seccion, index) => (
            <View key={index} style={styles.seccionObsCard}>
              <Text style={styles.seccionObsTitulo}>{seccion.titulo}</Text>
              
              {seccion.fallas.map((falla: any, i: number) => (
                <View key={i} style={styles.fallaItem}>
                  <Text style={styles.fallaPregunta}>❌ {falla.pregunta}</Text>
                  <Text style={styles.fallaDetalle}>↳ Acción: {falla.accion}</Text>
                  <Text style={styles.fallaDetalle}>↳ Detalle: {falla.detalle}</Text>
                  {falla.evidencia > 0 && <Text style={styles.fallaEvidencia}>📸 {falla.evidencia} foto(s)</Text>}
                </View>
              ))}

              {seccion.comentario && (
                <View style={styles.comentarioFinalCaja}>
                  <Text style={styles.comentarioFinalTitulo}>💬 Nota del técnico para esta sección:</Text>
                  <Text style={styles.comentarioFinalTexto}>{seccion.comentario}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* --- FIRMAS DIGITALES --- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Firmas de Conformidad</Text>
        
        {/* FIRMA TÉCNICO */}
        <Text style={styles.firmaLabel}>Firma del Técnico ({nombreTecnico}) *</Text>
        {firmaTecnico ? (
          <View style={styles.firmaGuardadaContainer}>
            <Image source={{ uri: firmaTecnico }} style={styles.firmaImagen} resizeMode="contain" />
            <TouchableOpacity style={styles.btnRehacerFirma} onPress={() => setFirmaTecnico('')}>
              <Text style={styles.btnRehacerFirmaTexto}>🔄 Volver a firmar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contenedorMaestroFirma}>
            <View 
              style={styles.lienzoFirmaContainer} 
              onTouchStart={() => setScrollEnabled(false)} 
              onTouchEnd={() => setScrollEnabled(true)}
              onTouchCancel={() => setScrollEnabled(true)}
            >
              <SignatureScreen
                ref={refFirmaTecnico}
                onOK={(img) => setFirmaTecnico(img)}
                onEmpty={() => Alert.alert('Lienzo vacío', 'Debes firmar antes de guardar.')}
                webStyle={estilosCanvasFirmaLimpios} 
              />
            </View>
            <View style={styles.botonesFirmaNativos}>
              <TouchableOpacity style={styles.btnBorrarNativo} onPress={() => refFirmaTecnico.current?.clearSignature()}>
                <Text style={styles.textoBtnBorrar}>Borrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardarNativo} onPress={() => refFirmaTecnico.current?.readSignature()}>
                <Text style={styles.textoBtnGuardar}>Guardar Firma</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* FIRMA LÍDER */}
        <Text style={[styles.firmaLabel, { marginTop: 30 }]}>Firma Técnico Líder / Supervisor *</Text>
        {firmaLider ? (
          <View style={styles.firmaGuardadaContainer}>
            <Image source={{ uri: firmaLider }} style={styles.firmaImagen} resizeMode="contain" />
            <TouchableOpacity style={styles.btnRehacerFirma} onPress={() => setFirmaLider('')}>
              <Text style={styles.btnRehacerFirmaTexto}>🔄 Volver a firmar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contenedorMaestroFirma}>
            <View 
              style={styles.lienzoFirmaContainer} 
              onTouchStart={() => setScrollEnabled(false)} 
              onTouchEnd={() => setScrollEnabled(true)}
              onTouchCancel={() => setScrollEnabled(true)}
            >
              <SignatureScreen
                ref={refFirmaLider}
                onOK={(img) => setFirmaLider(img)}
                onEmpty={() => Alert.alert('Lienzo vacío', 'Debes firmar antes de guardar.')}
                webStyle={estilosCanvasFirmaLimpios}
              />
            </View>
            <View style={styles.botonesFirmaNativos}>
              <TouchableOpacity style={styles.btnBorrarNativo} onPress={() => refFirmaLider.current?.clearSignature()}>
                <Text style={styles.textoBtnBorrar}>Borrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardarNativo} onPress={() => refFirmaLider.current?.readSignature()}>
                <Text style={styles.textoBtnGuardar}>Guardar Firma</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.btnContinuarFinal} onPress={handleGuardar}>
        <Text style={styles.btnContinuarFinalTexto}>CONTINUAR (ENVIAR REPORTE) ➡️</Text>
      </TouchableOpacity>
      
      <View style={{ height: 60 }}/>
    </ScrollView>
  );
}

// Apagamos los controles HTML de la librería por completo para usar los nuestros
const estilosCanvasFirmaLimpios = `
  .m-signature-pad--footer { display: none; } 
  .m-signature-pad { box-shadow: none; border: none; background-color: transparent; margin: 0; padding: 0; }
  .m-signature-pad--body { border: none; border-radius: 0px; position: absolute; left: 0; right: 0; top: 0; bottom: 0; background-color: #fff; }
`;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { backgroundColor: '#1e293b', padding: 25, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  tiempoBadge: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tiempoText: { color: '#fff', fontWeight: 'bold', fontSize: 14, fontVariant: ['tabular-nums'] },
  subtitle: { color: '#cbd5e1', fontSize: 16, marginTop: 4 },
  tecnico: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: '#ffffff', marginHorizontal: 15, marginTop: 15, padding: 20, borderRadius: 12, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 5 },
  helpText: { fontSize: 12, color: '#64748b', marginBottom: 15, fontStyle: 'italic' },
  scoreContainer: { alignItems: 'center', marginVertical: 10 },
  circle: { width: 140, height: 140, borderRadius: 70, borderWidth: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  percentage: { fontSize: 32, fontWeight: 'bold' },
  pointsText: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  rangoBadge: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  rangoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  fotosBadge: { marginTop: 15, backgroundColor: '#eff6ff', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#bfdbfe' },
  fotosTexto: { color: '#1d4ed8', fontSize: 13, fontWeight: 'bold' },
  
  // TABLAS EXTRAS
  moduloExtraCard: { flexDirection: 'row', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 10, borderLeftWidth: 5, alignItems: 'center', justifyContent: 'space-between' },
  moduloExtraInfo: { flex: 1, paddingRight: 10 },
  moduloExtraTitle: { fontSize: 13, fontWeight: 'bold', color: '#334155' },
  moduloExtraScoreBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  moduloExtraScoreText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  // OBSERVACIONES DETALLADAS ESTRUCTURADAS
  textoLimpio: { fontSize: 14, color: '#16a34a', fontStyle: 'italic', fontWeight: 'bold' },
  seccionObsCard: { marginBottom: 15, backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  seccionObsTitulo: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10, textTransform: 'uppercase' },
  fallaItem: { marginBottom: 10, paddingLeft: 5, borderLeftWidth: 3, borderLeftColor: '#ef4444' },
  fallaPregunta: { fontSize: 14, fontWeight: 'bold', color: '#991b1b' },
  fallaDetalle: { fontSize: 13, color: '#475569', marginLeft: 10, marginTop: 2 },
  fallaEvidencia: { fontSize: 13, color: '#2563eb', marginLeft: 10, marginTop: 2, fontStyle: 'italic', fontWeight: 'bold' },
  comentarioFinalCaja: { marginTop: 10, backgroundColor: '#fef3c7', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#fde68a' },
  comentarioFinalTitulo: { fontSize: 12, fontWeight: 'bold', color: '#d97706', marginBottom: 4 },
  comentarioFinalTexto: { fontSize: 14, color: '#451a03' },

  // LIENZOS DE FIRMAS (NUEVO DISEÑO BLINDADO)
  firmaLabel: { fontSize: 15, fontWeight: 'bold', color: '#334155', marginBottom: 10 },
  contenedorMaestroFirma: { marginBottom: 10 },
  lienzoFirmaContainer: { height: 200, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: '#cbd5e1', borderStyle: 'dashed' }, 
  firmaGuardadaContainer: { height: 160, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
  firmaImagen: { width: '100%', height: 100 },
  btnRehacerFirma: { marginTop: 10, backgroundColor: '#e2e8f0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
  btnRehacerFirmaTexto: { color: '#334155', fontWeight: 'bold' },

  // BOTONES NATIVOS
  botonesFirmaNativos: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 12 },
  btnBorrarNativo: { flex: 1, backgroundColor: '#ef4444', padding: 14, borderRadius: 8, alignItems: 'center', elevation: 2 },
  btnGuardarNativo: { flex: 1, backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center', elevation: 2 },
  textoBtnBorrar: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  textoBtnGuardar: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  btnContinuarFinal: { backgroundColor: '#D12424', marginHorizontal: 15, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 25, elevation: 4 },
  btnContinuarFinalTexto: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});