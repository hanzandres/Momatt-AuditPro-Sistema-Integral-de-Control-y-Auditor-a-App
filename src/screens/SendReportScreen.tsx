// src/screens/SendReportScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

export default function SendReportScreen({ route, navigation }: any) {
  const datosAuditoria = route.params;
  const isSeguimiento = datosAuditoria?.es_seguimiento === true;

  const [institucionales, setInstitucionales] = useState<any[]>([]);
  const [adicionales, setAdicionales] = useState<any[]>([]);
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [correoTecnico, setCorreoTecnico] = useState('sistema@momatt.com'); 
  const [departamentoTecnico, setDepartamentoTecnico] = useState('No especificado');

  useEffect(() => {
    const cargarCorreos = async () => {
      try {
        const c_tl = await AsyncStorage.getItem('tecnico_correo');
        const c_jt = await AsyncStorage.getItem('correo_jt');
        const c_ger = await AsyncStorage.getItem('correo_gerente');
        const c_ger_ex = await AsyncStorage.getItem('correo_gerente_extra');

        if (c_tl && c_tl !== 'null') setCorreoTecnico(c_tl);

        let listaAutomatica = [];

        if (c_tl && c_tl !== 'null' && c_tl.trim() !== '') {
          listaAutomatica.push({ id: 'tl', label: 'Técnico Líder (Tú)', email: c_tl, selected: true });
        }
        if (c_jt && c_jt !== 'null' && c_jt.trim() !== '') {
          listaAutomatica.push({ id: 'jt', label: 'Jefe Técnico', email: c_jt, selected: true });
        }
        if (c_ger && c_ger !== 'null' && c_ger.trim() !== '') {
          listaAutomatica.push({ id: 'ger', label: 'Gerente', email: c_ger, selected: true });
        }
        if (c_ger_ex && c_ger_ex !== 'null' && c_ger_ex.trim() !== '') {
          listaAutomatica.push({ id: 'ger_ex', label: 'Gerente extra', email: c_ger_ex, selected: true });
        }
        setInstitucionales(listaAutomatica);

        const depto = await AsyncStorage.getItem('tecnico_departamento');
        if (depto) setDepartamentoTecnico(depto);

      } catch (error) {
        console.error("Error al cargar correos", error);
      }
    };
    cargarCorreos();
  }, []);

  const toggleInstitucional = (index: number) => {
    const nuevaLista = [...institucionales];
    nuevaLista[index].selected = !nuevaLista[index].selected;
    setInstitucionales(nuevaLista);
  };

  const toggleAdicional = (index: number) => {
    const nuevaLista = [...adicionales];
    nuevaLista[index].selected = !nuevaLista[index].selected;
    setAdicionales(nuevaLista);
  };

  const agregarCorreoExtra = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nuevoCorreo.trim())) {
      Alert.alert('Correo inválido', 'Por favor ingresa una dirección de correo válida.');
      return;
    }
    
    const existeEnInst = institucionales.some(c => c.email.toLowerCase() === nuevoCorreo.toLowerCase().trim());
    const existeEnAdic = adicionales.some(c => c.email.toLowerCase() === nuevoCorreo.toLowerCase().trim());
    
    if (existeEnInst || existeEnAdic) {
      Alert.alert('Duplicado', 'Este correo ya está en la lista de destinatarios.');
      return;
    }

    setAdicionales([{ email: nuevoCorreo.toLowerCase().trim(), selected: true }, ...adicionales]);
    setNuevoCorreo('');
  };

  const eliminarCorreoExtra = (index: number) => {
    const nuevaLista = [...adicionales];
    nuevaLista.splice(index, 1);
    setAdicionales(nuevaLista);
  };

  // =================================================================
  // 🚀 ADUANA FINAL (EL CAJÓN DE SALIDA CON GPS ANTI-TRAMPAS)
  // =================================================================
  const handleEnviar = async () => {
    const correosActivos = [
      ...institucionales.filter(c => c.selected).map(c => c.email),
      ...adicionales.filter(c => c.selected).map(c => c.email)
    ];

    if (correosActivos.length === 0) {
      Alert.alert('Sin Destinatarios', 'Debes seleccionar al menos un correo para enviar el reporte.');
      return;
    }

    setCargando(true);

    try {
      const userToken = await AsyncStorage.getItem('user_token');
      
      // 🚀 LÓGICA ANTI-TRAMPAS DE UBICACIÓN
      let latitudFinal = route.params?.latitud || null;
      let longitudFinal = route.params?.longitud || null;

      // Si por alguna razón (sin internet/sin permiso en la pantalla setup) no llegaron las coordenadas...
      if (!latitudFinal || !longitudFinal) {
          // Buscamos en la bóveda secreta del HomeScreen
          const ubiSeguridadString = await AsyncStorage.getItem('@ubicacion_seguridad');
          if (ubiSeguridadString) {
              const ubiSeguridad = JSON.parse(ubiSeguridadString);
              latitudFinal = ubiSeguridad.lat.toString();
              longitudFinal = ubiSeguridad.lng.toString();
              console.log("Se usó ubicación de seguridad (Anti-trampas):", latitudFinal, longitudFinal);
          }
      }
      
      const payload = isSeguimiento
        ? {
            serie: datosAuditoria.serie,
            modelo: datosAuditoria.modelo,
            eco: datosAuditoria.eco,
            modelo_texto: route.params?.modelo_texto,
            sucursal: datosAuditoria.sucursal,
            nombre_tecnico: route.params?.nombre_tecnico || datosAuditoria.nombre_tecnico,
            nombre_ejecutor: route.params?.nombre_ejecutor || datosAuditoria.nombre_ejecutor,
            fecha_finalizacion: route.params?.fecha_finalizacion,
            reparaciones: route.params?.reparaciones || datosAuditoria.reparaciones_hechas,
            correo_tecnico: correoTecnico,
            correos: correosActivos,
            departamento: departamentoTecnico,
            reparaciones_hechas: route.params?.reparaciones_hechas || datosAuditoria.reparaciones_hechas,
            nuevo_estado: route.params?.fecha_finalizacion ? 'Terminado' : 'Pendiente de Seguimiento',
            // 📍 ENVIAMOS COORDENADAS (SEGUIMIENTO)
            latitud: latitudFinal,
            longitud: longitudFinal
          }
        : {
            ...datosAuditoria,
            modelo_equipo: datosAuditoria.modelo,
            modelo_texto: datosAuditoria.modelo_texto,
            nombre_ejecutor: datosAuditoria.nombreEjecutor,
            correo_tecnico: correoTecnico,
            correos: correosActivos,
            // 📍 ENVIAMOS COORDENADAS (NUEVA AUDITORÍA)
            latitud: latitudFinal,
            longitud: longitudFinal
          };

      const urlDestino = isSeguimiento 
        ? 'http://10.194.134.1:8000/api/enviar-pdf-seguimiento' 
        : 'http://10.194.134.1:8000/api/guardar-auditoria';

      // 1. REVISAMOS EL INTERNET ANTES DE ENVIAR
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected || networkState.isInternetReachable === false) {
        // NO HAY INTERNET: Guardamos en el cajón de salida
        const auditoriaPendiente = {
          id: Date.now().toString(),
          url: urlDestino,
          payload: payload,
          tipo: isSeguimiento ? 'Seguimiento' : 'Auditoría Nueva',
          fecha_guardado: new Date().toLocaleString()
        };

        const pendientesString = await AsyncStorage.getItem('@pendientes_envio');
        const listaPendientes = pendientesString ? JSON.parse(pendientesString) : [];
        
        listaPendientes.push(auditoriaPendiente);
        await AsyncStorage.setItem('@pendientes_envio', JSON.stringify(listaPendientes));
        await AsyncStorage.removeItem('@borrador_auditoria');
        
        setCargando(false);
        Alert.alert(
          'Guardado sin conexión 📶', 
          'El reporte está seguro en la tablet. Toca el botón naranja de sincronización en el inicio cuando tengas red.'
        );
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        return; 
      }

      // 2. SÍ HAY INTERNET: Envío directo a Laravel
      const response = await fetch(urlDestino, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': userToken ? `Bearer ${userToken}` : ''
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          '¡Éxito!', 
          isSeguimiento 
            ? `Seguimiento guardado.\nPDF enviado a ${correosActivos.length} destinatarios.`
            : `Auditoría guardada.\nCorreos enviados a ${correosActivos.length} destinatarios.`
        );
        await AsyncStorage.removeItem('@borrador_auditoria');
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] }); 
      } else {
        Alert.alert('Error del Servidor', result.message || 'Ocurrió un error al guardar.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de Conexión', 'Revisa la conexión con el servidor e inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
     <View style={styles.header}>
        <Text style={styles.title}>{isSeguimiento ? 'Enviar Seguimiento' : 'Enviar Reporte'}</Text>
        <Text style={styles.subtitle}>{isSeguimiento ? 'Envío de PDF de reparaciones' : 'Generación de PDF y envío automático'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumen del Envío</Text>
        <Text style={styles.resumenText}>• Equipo: {datosAuditoria.modelo}</Text>
        <Text style={styles.resumenText}>• Serie: {datosAuditoria.serie} | ECO: {datosAuditoria.eco}</Text>
        <Text style={styles.resumenText}>• Calificación: {datosAuditoria.porcentaje_final}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Destinatarios Institucionales</Text>
        <Text style={styles.helpText}>Estos correos se asignaron automáticamente según tu registro.</Text>
        
        {institucionales.length === 0 ? (
          <Text style={styles.emptyText}>No se encontraron correos institucionales.</Text>
        ) : (
          institucionales.map((item, index) => (
            <TouchableOpacity 
              key={`inst-${index}`} 
              style={styles.checkItem} 
              onPress={() => toggleInstitucional(index)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.selected ? 'checkbox' : 'square-outline'} 
                size={24} 
                color={item.selected ? '#D12424' : '#94a3b8'} 
              />
              <View style={styles.correoInfo}>
                <Text style={styles.correoRole}>{item.label}</Text>
                <Text style={styles.correoText}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>2. Agregar correos adicionales</Text>
        <Text style={styles.helpText}>Puedes añadir correos del cliente u otros contactos.</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@cliente.com"
            value={nuevoCorreo}
            onChangeText={setNuevoCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.btnAdd} onPress={agregarCorreoExtra}>
            <Text style={styles.btnAddText}>+ Añadir</Text>
          </TouchableOpacity>
        </View>

        {adicionales.map((item, index) => (
          <View key={`adic-${index}`} style={styles.checkItem}>
            <TouchableOpacity 
              style={styles.checkAction} 
              onPress={() => toggleAdicional(index)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.selected ? 'checkbox' : 'square-outline'} 
                size={24} 
                color={item.selected ? '#D12424' : '#94a3b8'} 
              />
              <Text style={[styles.correoText, { marginLeft: 10 }]}>{item.email}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => eliminarCorreoExtra(index)}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.btnFinalizar, cargando && styles.btnDeshabilitado]} 
        onPress={handleEnviar}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.btnFinalizarTexto}>
            {isSeguimiento ? 'ENVIAR PDF DE REPARACIONES 🛠️' : 'ENVIAR REPORTE PDF 📨'}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  ); 
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { backgroundColor: '#1e293b', padding: 25, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: '#ffffff', marginHorizontal: 15, marginTop: 15, padding: 18, borderRadius: 12, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 8 },
  helpText: { fontSize: 12, color: '#64748b', marginBottom: 15, fontStyle: 'italic' },
  resumenText: { fontSize: 15, color: '#334155', marginBottom: 5, fontWeight: '500' },
  emptyText: { color: '#ef4444', fontStyle: 'italic', fontSize: 14 },
  checkItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  checkAction: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  correoInfo: { marginLeft: 10, flex: 1 },
  correoRole: { fontSize: 12, color: '#D12424', fontWeight: 'bold' },
  correoText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  inputContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  input: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, height: 45, backgroundColor: '#f8fafc' },
  btnAdd: { backgroundColor: '#1e293b', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8 },
  btnAddText: { color: '#fff', fontWeight: 'bold' },
  btnFinalizar: { backgroundColor: '#16a34a', marginHorizontal: 15, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 25, elevation: 4 },
  btnDeshabilitado: { backgroundColor: '#94a3b8' },
  btnFinalizarTexto: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});