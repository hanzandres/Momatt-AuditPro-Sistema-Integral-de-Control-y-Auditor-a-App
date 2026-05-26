// src/screens/SendReportScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function SendReportScreen({ route, navigation }: any) {
  // Recibimos todo el paquete de datos de la auditoría
  const datosAuditoria = route.params;

  const [institucionales, setInstitucionales] = useState<any[]>([]);
  const [adicionales, setAdicionales] = useState<any[]>([]);
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [cargando, setCargando] = useState(false);

  // 1. Cargar los correos desde la memoria al iniciar la pantalla
  useEffect(() => {
    const cargarCorreos = async () => {
      try {
        const c_tl = await AsyncStorage.getItem('tecnico_correo');
        const c_jt = await AsyncStorage.getItem('correo_jt');
        const c_ger = await AsyncStorage.getItem('correo_gerente');

        let listaAutomatica = [];
        if (c_tl) listaAutomatica.push({ id: 'tl', label: 'Técnico Líder (Tú)', email: c_tl, selected: true });
        if (c_jt) listaAutomatica.push({ id: 'jt', label: 'Jefe Técnico', email: c_jt, selected: true });
        if (c_ger) listaAutomatica.push({ id: 'ger', label: 'Gerente', email: c_ger, selected: true });

        setInstitucionales(listaAutomatica);
      } catch (error) {
        console.error("Error al cargar correos", error);
      }
    };
    cargarCorreos();
  }, []);

  // 2. Funciones para manejar los checks
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

  // 3. Función para agregar un correo extra (El cliente, etc)
  const agregarCorreoExtra = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nuevoCorreo.trim())) {
      Alert.alert('Correo inválido', 'Por favor ingresa una dirección de correo válida.');
      return;
    }
    
    // Evitar duplicados
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

  // 4. ENVÍO FINAL AL SERVIDOR LARAVEL
  const handleEnviar = async () => {
    // Juntar todos los correos que tienen "selected: true"
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
      // Preparamos el paquete de datos para Laravel agregando el arreglo de correos
      const payload = {
        ...datosAuditoria,
        modelo_equipo: datosAuditoria.modelo,
        correos: correosActivos
      };

      // Sustituye por la ruta correcta de tu API en Laravel donde guardas la auditoría
      const response = await fetch('http://192.168.4.124:8000/api/guardar-auditoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('¡Éxito! 🚀', `Auditoría guardada.\nCorreos enviados a ${correosActivos.length} destinatarios.`);
        // Borramos el borrador por seguridad (aunque ya lo hicimos antes, es buena práctica)
        await AsyncStorage.removeItem('@borrador_auditoria');
        
        // Te regresamos a la pantalla de inicio o al Home
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] }); 
      } else {
        Alert.alert('Error del Servidor', result.message || 'Ocurrió un error al guardar la auditoría.');
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
        <Text style={styles.title}>Enviar Reporte</Text>
        <Text style={styles.subtitle}>Generación de PDF y envío automático</Text>
      </View>

      {/* RESUMEN DE LA AUDITORÍA */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumen del Envío</Text>
        <Text style={styles.resumenText}>• Equipo: {datosAuditoria.modelo}</Text>
        <Text style={styles.resumenText}>• Serie: {datosAuditoria.serie} | ECO: {datosAuditoria.eco}</Text>
        <Text style={styles.resumenText}>• Calificación: {datosAuditoria.porcentaje_final}%</Text>
      </View>

      {/* DESTINATARIOS AUTOMÁTICOS (EXCEL) */}
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

      {/* AGREGAR DESTINATARIOS EXTRA */}
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

      {/* BOTÓN FINAL DE ENVÍO */}
      <TouchableOpacity 
        style={[styles.btnFinalizar, cargando && styles.btnDeshabilitado]} 
        onPress={handleEnviar}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.btnFinalizarTexto}>ENVIAR REPORTE PDF 📨</Text>
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
  
  // Elementos del Checkbox
  checkItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  checkAction: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  correoInfo: { marginLeft: 10, flex: 1 },
  correoRole: { fontSize: 12, color: '#D12424', fontWeight: 'bold' },
  correoText: { fontSize: 14, color: '#334155', fontWeight: '500' },

  // Inputs
  inputContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  input: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, height: 45, backgroundColor: '#f8fafc' },
  btnAdd: { backgroundColor: '#1e293b', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8 },
  btnAddText: { color: '#fff', fontWeight: 'bold' },

  // Botón Principal
  btnFinalizar: { backgroundColor: '#16a34a', marginHorizontal: 15, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 25, elevation: 4 },
  btnDeshabilitado: { backgroundColor: '#94a3b8' },
  btnFinalizarTexto: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});