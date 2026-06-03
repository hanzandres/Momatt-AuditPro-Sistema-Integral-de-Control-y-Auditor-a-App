// src/screens/HomeScreen.tsx

import React, { useState, useCallback } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator
} from 'react-native';

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

// =====================================================
// COLOR ESTADO
// =====================================================
const getStatusColor = (status: string) => {

  if (status === 'Terminado') {
    return '#22c55e';
  }

  if (status === 'Pendiente de Seguimiento') {
    return '#f59e0b';
  }

  return '#D12424';

};

const HomeScreen = ({ navigation }: any) => {

  const [auditorias, setAuditorias] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [nombreTecnico, setNombreTecnico] =
    useState('Técnico');

  // =====================================================
  // CARGAR AUDITORÍAS (¡AHORA CON GAFETE VIP!)
  // =====================================================
  const cargarAuditorias = async () => {

    setLoading(true);

    try {

      // 1. Obtenemos el nombre y el Token VIP de la memoria
      const nombreGuardado = await AsyncStorage.getItem('tecnico_nombre');
      const userToken = await AsyncStorage.getItem('user_token');
      

      if (nombreGuardado) {
        setNombreTecnico(nombreGuardado.split(' ')[0]);
      }

      const url = nombreGuardado
        ? `http://10.194.134.1:8000/api/auditorias?tecnico=${encodeURIComponent(nombreGuardado)}`
        : `http://10.194.134.1:8000/api/auditorias`;

      // 2. Preparamos los headers de la petición
      const requestOptions: RequestInit = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              // 3. ¡Aquí enseñamos el gafete!
              'Authorization': userToken ? `Bearer ${userToken}` : ''
          }
      };

      // 4. Hacemos la petición incluyendo los headers
      const response = await fetch(url, requestOptions);

      // Si Laravel rechaza el Token (401), evitamos que la app "truene"
      if (response.status === 401) {
          console.log("Token inválido o expirado. El servidor rechazó el acceso.");
          // Aquí más adelante podríamos obligarlo a iniciar sesión de nuevo.
          setAuditorias([]);
          return;
      }

      const data = await response.json();

      if (data.status === true) {
        setAuditorias(data.auditorias);
      }

    } catch (error) {

      console.error(
        'Error al cargar auditorías:',
        error
      );

    } finally {

      setLoading(false);

    }

  };

  // =====================================================
  // RECARGAR AL VOLVER
  // =====================================================
  useFocusEffect(
    useCallback(() => {

      cargarAuditorias();

    }, [])
  );

  // =====================================================
  // CALCULAR FALLAS
  // =====================================================
  const calcularProgreso = (item: any) => {

    let totalFallas = 0;
    let reparadas = 0;

    try {

      const observaciones =

        typeof item.observaciones_estructuradas === 'string'

          ? JSON.parse(
              item.observaciones_estructuradas
            )

          : item.observaciones_estructuradas;

      observaciones?.forEach((seccion: any) => {

        seccion.fallas?.forEach((falla: any) => {

          totalFallas++;

          if (
            falla.status === 'pasa'
          ) {

            reparadas++;

          }

        });

      });

    } catch (e) {

      console.log(e);

    }

    return {
      reparadas,
      totalFallas
    };

  };

  return (

    <View style={styles.container}>

      <StatusBar barStyle="dark-content" />

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <View style={styles.header}>

        <View>

          <Text style={styles.greeting}>
            Hola, {nombreTecnico}
          </Text>

          <Text style={styles.subtitle}>
            ¿Qué montacargas revisaremos hoy?
          </Text>

        </View>

      </View>

      {/* ================================================= */}
      {/* BOTÓN */}
      {/* ================================================= */}

      <View style={styles.actionContainer}>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() =>
            navigation.navigate(
              'SetupAuditScreen'
            )
          }
        >

          <Text style={styles.mainButtonText}>
            + NUEVA AUDITORÍA
          </Text>

        </TouchableOpacity>

      </View>

      {/* ================================================= */}
      {/* HISTORIAL */}
      {/* ================================================= */}

      <View style={styles.historyContainer}>

        <Text style={styles.sectionTitle}>
          Auditorías Recientes
        </Text>

        {loading ? (

          <ActivityIndicator
            size="large"
            color={COLORS.red}
            style={{ marginTop: 20 }}
          />

        ) : auditorias.length === 0 ? (

          <Text style={styles.emptyText}>
            Aún no tienes auditorías registradas.
          </Text>

        ) : (

          <FlatList
            data={auditorias}
            keyExtractor={(item) =>
              item.id.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20
            }}

            renderItem={({ item }) => {

              const isTerminado =
                item.estado === 'Terminado';

              const fechaFormato =
                new Date(
                  item.created_at
                ).toLocaleDateString(
                  'es-MX',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }
                );

              const progreso =
                calcularProgreso(item);

              return (

                <TouchableOpacity

                  style={[
                    styles.card,

                    isTerminado &&
                      styles.cardTerminada
                  ]}

                  onPress={() => {

                    navigation.navigate(
                      'FollowUpScreen',
                      {
                        auditoria: item
                      }
                    );

                  }}
                >

                  {/* ================================= */}
                  {/* INFO */}
                  {/* ================================= */}

                  <View
                    style={{
                      flex: 1,
                      paddingRight: 10
                    }}
                  >

                    <Text style={styles.cardTitle}>
                      Serie: {item.serie}
                    </Text>

                    <Text style={styles.cardDate}>
                      ECO: {item.eco} • {fechaFormato}
                    </Text>

                    {/* ============================= */}
                    {/* PROGRESO */}
                    {/* ============================= */}

                    <Text style={styles.progressText}>

                      Fallas reparadas:
                      {' '}
                      {progreso.reparadas}
                      /
                      {progreso.totalFallas}

                    </Text>

                  </View>

                  {/* ================================= */}
                  {/* ESTADO */}
                  {/* ================================= */}

                  <View
                    style={{
                      alignItems: 'flex-end',
                      width: 110
                    }}
                  >

                    <Text
                      style={[
                        styles.cardStatus,
                        {
                          color:
                            getStatusColor(
                              item.estado
                            )
                        }
                      ]}
                    >

                      {item.estado}

                    </Text>

                  </View>

                </TouchableOpacity>

              );

            }}
          />

        )}

      </View>

    </View>

  );

};

// =====================================================
// ESTILOS
// =====================================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      COLORS.grayBackground
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },

  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },

  actionContainer: {
    padding: 25,
    alignItems: 'center'
  },

  mainButton: {
    backgroundColor: COLORS.red,
    width: '100%',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.red,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8
  },

  mainButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1
  },

  historyContainer: {
    flex: 1,
    paddingHorizontal: 25
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 15
  },

  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontStyle: 'italic'
  },

  card: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.grayCard
  },

  cardTerminada: {
    borderColor: '#22c55e',
    borderWidth: 2
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark
  },

  cardDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 4
  },

  progressText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    fontWeight: '600'
  },

  cardStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right'
  }

});

export default HomeScreen;