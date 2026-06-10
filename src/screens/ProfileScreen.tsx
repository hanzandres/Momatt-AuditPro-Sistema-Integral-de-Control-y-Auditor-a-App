// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bgBlack: '#000000',
  accentRed: '#D12424',
  white: '#FFFFFF',
  grayText: '#666666',
  lightGray: '#F5F5F5'
};

const ProfileScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const obtenerPerfilServidor = async () => {
      try {
        // 1. Jalamos la llave secreta de la memoria del celular
        const token = await AsyncStorage.getItem('user_token');

        if (!token) {
          // Si no hay token, lo mandamos a loguearse de nuevo
          navigation.replace('Login');
          return;
        }

        // 2. Le consultamos a Laravel usando la IP de tu servidor (192.168.4.137)
        const response = await fetch('http://10.145.215.1:8000/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` // Le pasamos la llave en el sobre de seguridad
          }
        });

        const data = await response.json();

        if (response.ok && data.status === true) {
          // 3. Almacenamos los datos frescos de la Base de Datos en el estado
          setNombre(data.usuario.name);
          setCorreo(data.usuario.email);
        } else {
          // Si el token ya venció o es inválido
          await AsyncStorage.removeItem('user_token');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor de perfiles:', error);
        alert('No se pudieron sincronizar los datos del perfil.');
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfilServidor();
  }, []);

  // Función para cerrar sesión (idéntica a la del sistema web/móvil anterior)
  const handleCerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem('user_token'); // Borramos solo la llave
      navigation.replace('Login'); // Expulsamos al Login
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accentRed} />
        <Text style={styles.loadingText}>Sincronizando con el servidor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={110} color={COLORS.accentRed} />
        {/* Aquí se imprimen los datos traídos en tiempo real de MySQL */}
        <Text style={styles.nameText}>{nombre}</Text>
        <Text style={styles.emailText}>{correo}</Text>
        <Text style={styles.roleTag}>Técnico Especializado</Text>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Panel de Control</Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray },
  loadingText: { marginTop: 10, color: COLORS.grayText, fontSize: 16 },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
  },
  nameText: { fontSize: 26, fontWeight: 'bold', color: '#222', marginTop: 12 },
  emailText: { fontSize: 16, color: COLORS.grayText, marginTop: 4 },
  roleTag: {
    marginTop: 12,
    backgroundColor: 'rgba(209, 36, 36, 0.1)',
    color: COLORS.accentRed,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuContainer: { padding: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentRed,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accentRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', marginLeft: 10, letterSpacing: 0.5 }
});

export default ProfileScreen;