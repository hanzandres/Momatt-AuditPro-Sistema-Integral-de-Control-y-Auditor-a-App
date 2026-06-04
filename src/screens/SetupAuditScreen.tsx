// src/screens/SetupAuditScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MODELOS_DISPONIBLES } from '../data/ChecklistMaster';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 🚀 NUEVO IMPORT PARA MODO OFFLINE
import NetInfo from '@react-native-community/netinfo';

export default function SetupAuditScreen({ navigation }: any) {
  const [modeloSeleccionado, setModeloSeleccionado] = useState('');
  const [serie, setSerie] = useState('');
  const [eco, setEco] = useState('');
  const [instalado, setInstalado] = useState('');
  
  // --- ESTADOS ---
  const [nombreTecnico, setNombreTecnico] = useState(''); // Auditor (Bloqueado)
  const [nombreEjecutor, setNombreEjecutor] = useState(''); // Ejecutor (Editable)
  const [sucursal, setSucursal] = useState('');
  const [departamento, setDepartamento] = useState(''); 
  
  const [horasInspeccion, setHorasInspeccion] = useState('');
  const [reporte, setReporte] = useState('');
  
  const [fechaUltimoMp, setFechaUltimoMp] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date());

  const [horasMp, setHorasMp] = useState('');
  const [aplicacion, setAplicacion] = useState('');
  const [fechaAuditoria, setFechaAuditoria] = useState(new Date().toLocaleDateString('es-MX'));
  const [diagSeguimiento, setDiagSeguimiento] = useState('');
  const [horasTrabajadas, setHorasTrabajadas] = useState('');
  const [checklistNum, setChecklistNum] = useState('Cargando...');

  // Nuevo estado para saber si el usuario tiene permiso de editar sucursal
  const [esUsuarioCorporativo, setEsUsuarioCorporativo] = useState(false);

  // Nuevo campo de texto para el modelo en la sección 2
  const [modeloTexto, setModeloTexto] = useState('');

  // --- CÁLCULO AUTOMÁTICO DE HORAS TRABAJADAS ---
  useEffect(() => {
    const hMp = parseFloat(horasMp.replace(/[^0-9.]/g, '')) || 0;
    const hInsp = parseFloat(horasInspeccion.replace(/[^0-9.]/g, '')) || 0;
    
    if (horasMp !== '' && horasInspeccion !== '') {
      let resultado = hInsp - hMp;
      setHorasTrabajadas(resultado.toString());
    } else {
      setHorasTrabajadas('');
    }
  }, [horasMp, horasInspeccion]);

  // --- AUTO-LLENADO DESDE ASYNCSTORAGE ---
  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        // 1. Jalamos todos los datos que guardó el Login
        const nombreGuardado = await AsyncStorage.getItem('tecnico_nombre');
        const sucursalGuardada = await AsyncStorage.getItem('tecnico_sucursal');
        const deptoGuardado = await AsyncStorage.getItem('tecnico_departamento');
        const userToken = await AsyncStorage.getItem('user_token'); // ¡Sacamos el gafete de la memoria!

        if (sucursalGuardada) {
            // Si originalmente dice Corporativo o está vacío, le damos permiso de editar
            if (sucursalGuardada === 'Corporativo' || sucursalGuardada.trim() === '') {
                setEsUsuarioCorporativo(true);
                setSucursal(''); // Dejamos la caja limpia para que ellos escriban
            } else {
                // Si es un técnico normal, ponemos su sucursal fija
                setSucursal(sucursalGuardada);
            }
        }

        if (deptoGuardado) setDepartamento(deptoGuardado);
        if (nombreGuardado) setNombreTecnico(nombreGuardado);
        if (sucursalGuardada) setSucursal(sucursalGuardada);
        if (deptoGuardado) setDepartamento(deptoGuardado);

        // ==========================================================
        // 🚀 2. LÓGICA OFFLINE PARA EL NÚMERO DE CHECKLIST
        // ==========================================================
        const networkState = await NetInfo.fetch();

        // Si no hay red O el internet no es alcanzable (Evita el error Network request failed)
        if (!networkState.isConnected || networkState.isInternetReachable === false) {
          setChecklistNum('Pendiente (Offline)');
        } else {
          // SÍ HAY INTERNET: Buscamos el siguiente número de checklist
          let url = 'http://10.194.134.1:8000/api/siguiente-checklist';
          if (nombreGuardado) url += `?tecnico=${encodeURIComponent(nombreGuardado)}`;
          
          const requestOptions: RequestInit = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': userToken ? `Bearer ${userToken}` : '' // Mostramos el gafete
            }
          };

          const response = await fetch(url, requestOptions); 
          
          if (response.status === 401) {
              console.log("Token inválido. No se puede obtener el Check List.");
              setChecklistNum('Sin Acceso');
              return;
          }

          const data = await response.json();
          setChecklistNum(data.siguiente_numero.toString());
        }

      } catch (error) {
        setChecklistNum('N/A');
        console.error("Error cargando datos iniciales: ", error);
      }
    };
    
    inicializarDatos();
  }, []);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObj(selectedDate);
      setFechaUltimoMp(selectedDate.toLocaleDateString('es-MX'));
    }
  };

  const handleComenzar = () => {
    if (!modeloSeleccionado || !serie || !eco || !nombreEjecutor) {
      Alert.alert('Campos Obligatorios', 'Por favor llena Modelo, Serie, ECO y el nombre del Técnico Ejecutor.');
      return;
    }

    navigation.navigate('AuditFormScreen', {
      modelo: modeloSeleccionado,
      serie,
      modelo_texto: modeloTexto,
      eco,
      instalado,
      checklistNo: checklistNum,
      nombreTecnico,     // Se manda el auditor
      nombreEjecutor,    // Se manda el ejecutor
      sucursal, 
      departamento,
      horasInspeccion,
      reporte,
      fechaUltimoMp,
      horasMp,
      aplicacion,
      fechaAuditoria,
      diagSeguimiento,
      horasTrabajadas
    });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Nueva Auditoría</Text>
          <Text style={styles.subtitle}>Inicialización de datos de control de MP</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Modelo del Equipo</Text>
          <View style={styles.modelsContainer}>
            {MODELOS_DISPONIBLES.map((mod) => (
              <TouchableOpacity 
                key={mod} 
                style={[styles.modelBadge, modeloSeleccionado === mod && styles.modelBadgeActive]}
                onPress={() => setModeloSeleccionado(mod)}
              >
                <Text style={[styles.modelText, modeloSeleccionado === mod && styles.modelTextActive]}>{mod}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Identificación del Montacargas</Text>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Serie # *</Text>
              <TextInput style={styles.input} placeholder="Serie" value={serie} onChangeText={setSerie} />
            </View>

            <View style={styles.flex1}>
              <Text style={styles.label}>Eco # *</Text>
              <TextInput style={styles.input} placeholder="ECO" value={eco} onChangeText={setEco} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Modelo *</Text>
              <TextInput 
                style={styles.input} 
                value={modeloTexto} 
                onChangeText={setModeloTexto} 
                placeholder="Ej. 5000" 
              />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Cliente</Text>
              <TextInput style={styles.input} placeholder="Ej. Andres" value={instalado} onChangeText={setInstalado} />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Conteo de auditorias (Auto)</Text>
              <TextInput style={[styles.input, styles.inputDisabled]} value={checklistNum} editable={false} />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Datos de la Inspección</Text>
          
          {/* Técnico que ejecuta el trabajo en campo (Editable) ARRIBA */}
          <Text style={styles.label}>Técnico</Text>
          <TextInput style={styles.input} placeholder="Ej. Nombre del técnico" value={nombreEjecutor} onChangeText={setNombreEjecutor} />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Sucursal *</Text>
              <TextInput 
                style={[styles.input, !esUsuarioCorporativo && styles.inputDisabled]} 
                value={sucursal} 
                onChangeText={setSucursal} 
                editable={esUsuarioCorporativo} 
                placeholder="Ej. Toluca"
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Departamento *</Text>
              <TextInput 
                style={[styles.input, !esUsuarioCorporativo && styles.inputDisabled]} 
                value={departamento} 
                onChangeText={setDepartamento} 
                editable={esUsuarioCorporativo} 
                placeholder="Ej. Postventa"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Horas de Inspección</Text>
              <TextInput style={styles.input} placeholder="Ej. 2" keyboardType="numeric" value={horasInspeccion} onChangeText={setHorasInspeccion} />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Ult. Reporte del MP</Text>
              <TextInput style={styles.input} placeholder="Ult. Reporte" value={reporte} onChangeText={setReporte} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Fecha Auditoría</Text>
              <TextInput style={[styles.input, styles.inputDisabled]} value={fechaAuditoria} editable={false} />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Horas Trabajadas (Auto)</Text>
              <TextInput style={[styles.input, styles.inputDisabled]} value={horasTrabajadas} editable={false} />
            </View>
          </View>

          {/* Técnico que inició sesión (Bloqueado) ABAJO */}
          <Text style={styles.label}>Persona que Audito</Text>
          <TextInput style={[styles.input, styles.inputDisabled]} value={nombreTecnico} editable={false} />

        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>4. Historial de MP e Historial Clínico</Text>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.label}>Fecha Último MP</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: fechaUltimoMp ? '#334155' : '#94a3b8' }}>{fechaUltimoMp || "Elegir fecha"}</Text>
              </TouchableOpacity>
              {showDatePicker && <DateTimePicker value={dateObj} mode="date" display="default" onChange={onChangeDate} />}
            </View>
            <View style={styles.flex1}>
              <Text style={styles.label}>Horas del Ultimo MP</Text>
              <TextInput style={styles.input} placeholder="Hrs en MP" keyboardType="numeric" value={horasMp} onChangeText={setHorasMp} />
            </View>
          </View>
          <Text style={styles.label}>Aplicación/Area de trabajo</Text>
          <TextInput style={styles.input} placeholder="Ej. Almacén / Producción" value={aplicacion} onChangeText={setAplicacion} />
          <Text style={styles.label}>Diag. Seguimiento</Text>
          <TextInput style={styles.input} placeholder="Detalles de seguimiento" value={diagSeguimiento} onChangeText={setDiagSeguimiento} />
        </View>

        <TouchableOpacity style={styles.btnComenzar} onPress={handleComenzar}>
          <Text style={styles.btnComenzarText}>INICIAR EVALUACIÓN 🚀</Text>
        </TouchableOpacity>
        
        {/* Colchón extra de espacio para permitir el scroll cuando el teclado esté arriba */}
        <View style={{ height: 150 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { backgroundColor: '#1e293b', padding: 25, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: '#ffffff', marginHorizontal: 15, marginTop: 15, padding: 15, borderRadius: 12, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 5 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  flex1: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 5, marginTop: 5 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: '#f8fafc', color: '#334155', justifyContent: 'center', height: 48 },
  inputDisabled: { backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: 'bold' },
  modelsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modelBadge: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#e2e8f0', borderWidth: 1, borderColor: '#cbd5e1' },
  modelBadgeActive: { backgroundColor: '#D12424', borderColor: '#D12424' },
  modelText: { color: '#475569', fontWeight: 'bold', fontSize: 13 },
  modelTextActive: { color: '#ffffff' },
  btnComenzar: { backgroundColor: '#D12424', marginHorizontal: 15, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20, elevation: 3 },
  btnComenzarText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 }
});