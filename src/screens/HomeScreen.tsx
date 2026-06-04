// src/screens/HomeScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, StatusBar, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

const COLORS = {
  red: '#D12424',
  black: '#000000',
  white: '#FFFFFF',
  grayBackground: '#F5F5F5',
  grayCard: '#E8E8E8',
  textDark: '#333333'
};

// COLOR ESTADO
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
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombreTecnico, setNombreTecnico] = useState('Técnico');

  // 🚀 NUEVOS ESTADOS PARA MODO OFFLINE
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [sincronizando, setSincronizando] = useState(false);

  // =================================================================
  // FUNCIÓN 1: CARGAR AUDITORÍAS (CON ESCUDO OFFLINE)
  // =================================================================
  const cargarAuditorias = async () => {
    setLoading(true);

    try {
      // 1. REVISAMOS EL INTERNET PRIMERO
      const networkState = await NetInfo.fetch();
      
      if (!networkState.isConnected || networkState.isInternetReachable === false) {
        // NO HAY INTERNET: Sacamos la lista de respaldo de la memoria
        const backupString = await AsyncStorage.getItem('@backup_auditorias');
        if (backupString) {
          setAuditorias(JSON.parse(backupString));
        }
        setLoading(false);
        return; // Detenemos la función aquí
      }

      // 2. SÍ HAY INTERNET: Obtenemos el nombre y el Token VIP
      const nombreGuardado = await AsyncStorage.getItem('tecnico_nombre');
      const userToken = await AsyncStorage.getItem('user_token');
      
      if (nombreGuardado) {
        setNombreTecnico(nombreGuardado.split(' ')[0]);
      }

      const url = nombreGuardado
        ? `http://10.194.134.1:8000/api/auditorias?tecnico=${encodeURIComponent(nombreGuardado)}`
        : `http://10.194.134.1:8000/api/auditorias`;

      // 3. Preparamos los headers de la petición
      const requestOptions: RequestInit = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': userToken ? `Bearer ${userToken}` : ''
          }
      };

      // 4. Hacemos la petición
      const response = await fetch(url, requestOptions);

      if (response.status === 401) {
          console.log("Token inválido o expirado. El servidor rechazó el acceso.");
          setAuditorias([]);
          return;
      }
      const data = await response.json();
      
      if (data.status === true) {
        setAuditorias(data.auditorias);
        // GUARDAMOS RESPALDO FRESCO: Por si se va el internet más tarde
        await AsyncStorage.setItem('@backup_auditorias', JSON.stringify(data.auditorias));
      }
    } catch (error) {
      console.error('Error al cargar auditorías:', error);
      // PLAN B: Si falla la conexión a medio camino, mostramos el respaldo
      const backupString = await AsyncStorage.getItem('@backup_auditorias');
      if (backupString) setAuditorias(JSON.parse(backupString));
    } finally {
      setLoading(false);
    }
  };

  // =================================================================
  // FUNCIÓN 2: EL RADAR DE PENDIENTES (MODO OFFLINE)
  // =================================================================
  const revisarPendientes = async () => {
    try {
      const pendientesString = await AsyncStorage.getItem('@pendientes_envio');
      if (pendientesString) {
        setPendientes(JSON.parse(pendientesString));
      } else {
        setPendientes([]);
      }
    } catch (error) {
      console.log("Error leyendo pendientes", error);
    }
  };

  // =================================================================
  // FUNCIÓN 3: SINCRONIZADOR AL SERVIDOR
  // =================================================================
 // =================================================================
  // FUNCIÓN 3: SINCRONIZADOR AL SERVIDOR (CON TRAMPA DE ERRORES)
  // =================================================================
  const sincronizarDatos = async () => {
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected || networkState.isInternetReachable === false) {
      Alert.alert('Sin Internet', 'Aún no tienes conexión. Intenta buscar red o WiFi.');
      return;
    }

    setSincronizando(true);
    let enviadosCorrectamente = 0;
    const userToken = await AsyncStorage.getItem('user_token');

    for (const reporte of pendientes) {
      try {
        const response = await fetch(reporte.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': userToken ? `Bearer ${userToken}` : ''
          },
          body: JSON.stringify(reporte.payload)
        });

        if (response.ok) {
          enviadosCorrectamente++;
        } else {
          // 🚀 AQUÍ ESTÁ LA TRAMPA: Leemos el enojo de Laravel
          const errorText = await response.text();
          console.log("Error de Laravel:", errorText);
          Alert.alert(
            'Laravel rechazó el reporte 🚨', 
            `Código: ${response.status}\nError: ${errorText.substring(0, 250)}` // Mostramos los primeros 250 caracteres
          );
        }
      } catch (error) {
        console.error("Error enviando reporte pendiente:", error);
      }
    }

    // Solo borramos la mochila si TODO se envió bien
    if (enviadosCorrectamente === pendientes.length && pendientes.length > 0) {
      await AsyncStorage.removeItem('@pendientes_envio');
      setPendientes([]);
      Alert.alert("Sincronización Exitosa ✅", `Se enviaron ${enviadosCorrectamente} reportes a Momatt.`);
      cargarAuditorias(); // Recargar lista
    } else {
      Alert.alert('Sincronización Incompleta', `Solo se enviaron ${enviadosCorrectamente} de ${pendientes.length} reportes.`);
    }
    
    setSincronizando(false);
  };
  // RECARGAR AL VOLVER
  useFocusEffect(
    useCallback(() => {
      cargarAuditorias();
      revisarPendientes(); // 🚀 El radar escanea cada vez que abres esta pantalla
    }, [])
  );

  // CALCULAR FALLAS
  const calcularProgreso = (item: any) => {
    let totalFallas = 0;
    let reparadas = 0;
    try {
      const observaciones =
        typeof item.observaciones_estructuradas === 'string' ? JSON.parse(item.observaciones_estructuradas) : item.observaciones_estructuradas;
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
    return { reparadas, totalFallas };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
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

        {/* 🚀 BOTÓN DE SINCRONIZACIÓN (SOLO APARECE SI HAY PENDIENTES) */}
        {pendientes.length > 0 && (
          <TouchableOpacity
            style={styles.syncButton}
            onPress={sincronizarDatos}
            disabled={sincronizando}
          >
            {sincronizando ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.syncButtonText}>
                ⚠️ Tienes {pendientes.length} reportes pendientes. Toca para sincronizar.
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

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
              const isTerminado = item.estado === 'Terminado';
              const fechaFormato = new Date(item.created_at).toLocaleDateString(
                'es-MX',
                {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }
              );

              const progreso = calcularProgreso(item);

              return (
                <TouchableOpacity
                  style={[
                    styles.card,isTerminado && styles.cardTerminada
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
                  {/* INFO */}
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
                    {/* PROGRESO */}
                    <Text style={styles.progressText}>
                      Fallas reparadas: {' '} {progreso.reparadas} / {progreso.totalFallas}
                    </Text>
                  </View>
                  {/* ESTADO */}
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
                          color: getStatusColor(item.estado)
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grayBackground
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
    shadowOffset: { width: 0, height: 4 },
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
  // 🚀 ESTILOS DEL NUEVO BOTÓN DE SINCRONIZACIÓN
  syncButton: {
    backgroundColor: '#f59e0b',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  syncButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
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