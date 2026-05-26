// src/screens/HomeScreen.tsx
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, StatusBar, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const COLORS = {
  red: '#D12424',
  black: '#000000',
  white: '#FFFFFF',
  grayBackground: '#F5F5F5',
  grayCard: '#E8E8E8',
  textDark: '#333333'
};

// Función para darle color al texto según el estado (ahora lee el estado de la base de datos)
const getStatusColor = (status: string) => {
  if (status === 'Terminado') return '#22c55e'; // Verde
  if (status === 'Pendiente de Seguimiento') return '#f59e0b'; // Naranja
  return '#D12424'; // Rojo por defecto
};

const HomeScreen = ({ navigation }: any) => {
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombreTecnico, setNombreTecnico] = useState('Técnico');

  // --- NUEVA FUNCIÓN PARA CONECTARSE A LARAVEL ---
  const cargarAuditorias = async () => {
    setLoading(true);
    try {
      // 1. Obtenemos quién es el técnico
      const nombreGuardado = await AsyncStorage.getItem('tecnico_nombre');
      if (nombreGuardado) {
        setNombreTecnico(nombreGuardado.split(' ')[0]); // Solo su primer nombre para saludarlo
      }

      // 2. Pedimos la lista a tu compu
      const url = nombreGuardado
        ? `http://192.168.4.124:8000/api/auditorias?tecnico=${encodeURIComponent(nombreGuardado)}`
        : `http://192.168.4.124:8000/api/auditorias`;

      const response = await fetch(url);
      const data = await response.json();

      // 3. Guardamos la lista en la pantalla
      if (data.status === true) {
        setAuditorias(data.auditorias);
      }
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    } finally {
      setLoading(false);
    }
  };

  // Esto hace que la pantalla se actualice sola cada vez que el técnico entra a ella
  useFocusEffect(
    useCallback(() => {
      cargarAuditorias();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {nombreTecnico}</Text>
          <Text style={styles.subtitle}>¿Qué montacargas revisaremos hoy?</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => navigation.navigate('SetupAuditScreen')}
        >
          <Text style={styles.mainButtonText}>+ NUEVA AUDITORÍA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Auditorías Recientes</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.red} style={{ marginTop: 20 }} />
        ) : auditorias.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 20, fontStyle: 'italic' }}>
            Aún no tienes auditorías registradas.
          </Text>
        ) : (
          <FlatList
            data={auditorias}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => {
              const isTerminado = item.estado === 'Terminado';
              // Formateamos la fecha (ej. "25 may. 2026")
              const fechaFormato = new Date(item.created_at).toLocaleDateString('es-MX', {
                day: 'numeric', month: 'short', year: 'numeric'
              });

              return (
                <TouchableOpacity 
                  style={styles.card}
                  onPress={() => {
                    if (!isTerminado) {
                      // AQUÍ ES DONDE PASA LA MAGIA AL DARLE CLIC
                      navigation.navigate('SeguimientoScreen', { auditoria: item });
                    } else {
                      Alert.alert('Auditoría Terminada', 'Este equipo no tiene fallas pendientes.');
                    }
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    {/* MOSTRAMOS LA SERIE COMO TÍTULO */}
                    <Text style={styles.cardTitle}>Serie: {item.serie}</Text>
                    <Text style={styles.cardDate}>ECO: {item.eco} • {fechaFormato}</Text>
                  </View>
                  
                  <View style={{ alignItems: 'flex-end', flexShrink: 0, width: 90 }}>
                     <Text style={[styles.cardStatus, { color: getStatusColor(item.estado), textAlign: 'right' }]}>
                      {item.estado}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayBackground },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: COLORS.black },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  actionContainer: { padding: 25, alignItems: 'center' },
  mainButton: { backgroundColor: COLORS.red, width: '100%', paddingVertical: 20, borderRadius: 12, alignItems: 'center', shadowColor: COLORS.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  mainButtonText: { color: COLORS.white, fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  historyContainer: { flex: 1, paddingHorizontal: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 15 },
  card: { backgroundColor: COLORS.white, padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: COLORS.grayCard },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark },
  cardDate: { fontSize: 13, color: '#888', marginTop: 4 },
  cardStatus: { fontSize: 12, fontWeight: 'bold' }
});

export default HomeScreen;