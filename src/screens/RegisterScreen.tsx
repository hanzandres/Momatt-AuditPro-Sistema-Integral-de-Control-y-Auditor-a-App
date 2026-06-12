// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  bgBlack: '#000000',
  bgRedDark: '#4D0000',
  accentRed: '#D12424',
  white: '#FFFFFF',
  grayInput: 'rgba(255, 255, 255, 0.1)',
  grayBorder: 'rgba(255, 255, 255, 0.3)',
  textPlaceHolder: '#AAAAAA'
};

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Por favor, llena todos los campos');
      return;
    }

    try {
      // ¡Recuerda mantener tu IP actualizada!
      const response = await fetch('http://10.122.224.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.status === true) {
        alert('¡Cuenta creada exitosamente!');
        
        // --- CÓDIGO NUEVO: GUARDAR EN MEMORIA ---
        // Guardamos los datos del técnico recién registrado para que la App lo recuerde
        await AsyncStorage.setItem('tecnico_nombre', name);
        await AsyncStorage.setItem('tecnico_correo', email);
        // ----------------------------------------

        // Lo mandamos directamente adentro de la App (ya no lo regresamos al Login)
        navigation.replace('Main');
      } else {
        // Laravel nos avisará si el correo ya existe
        alert('Error al registrar: ' + (data.message || 'El correo ya está en uso.'));
      }

    } catch (error) {
      alert('No se pudo conectar con el servidor. Revisa tu WiFi y la IP.');
      console.error(error);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.bgBlack, COLORS.bgRedDark]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View style={styles.content}>
            
            <View style={styles.header}>
              <Text style={styles.title}>Registro</Text>
              <Text style={styles.subtitle}>Alta de nuevo técnico</Text>
              <View style={styles.redDivider} />
            </View>

            <View style={styles.form}>
              
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <TextInput 
                style={styles.input}
                placeholder="Ej. Juan Pérez"
                placeholderTextColor={COLORS.textPlaceHolder}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <TextInput 
                style={styles.input}
                placeholder="tecnico@empresa.com"
                placeholderTextColor={COLORS.textPlaceHolder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Contraseña (mínimo 6 caracteres)</Text>
              <TextInput 
                style={styles.input}
                placeholder="**********"
                placeholderTextColor={COLORS.textPlaceHolder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>CREAR CUENTA</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Ya tengo cuenta, volver al Login</Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardContainer: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center', width: '100%' },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.white, marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.white, opacity: 0.8, marginBottom: 10, textAlign: 'center' },
  redDivider: { height: 4, width: 60, backgroundColor: COLORS.accentRed, borderRadius: 2, alignSelf: 'center' },
  form: { width: '100%' },
  inputLabel: { fontSize: 14, color: COLORS.white, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { width: '100%', height: 55, borderWidth: 1, borderColor: COLORS.grayBorder, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, color: COLORS.white, backgroundColor: COLORS.grayInput },
  button: { width: '100%', height: 55, backgroundColor: COLORS.accentRed, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 30, shadowColor: COLORS.accentRed, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  backButton: { marginTop: 25, alignItems: 'center' },
  backButtonText: { color: COLORS.white, opacity: 0.8, fontSize: 15, fontWeight: 'bold' }
});

export default RegisterScreen;