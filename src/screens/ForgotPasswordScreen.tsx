// src/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bgBlack: '#000000',
  bgRedDark: '#4D0000',
  accentRed: '#D12424',
  white: '#FFFFFF',
  grayInput: 'rgba(255, 255, 255, 0.1)',
  grayBorder: 'rgba(255, 255, 255, 0.3)',
};

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');

  const handleRestore = async () => {
    // 1. Limpiamos el texto de espacios fantasmas que deje el teclado
    const emailLimpio = email.trim();

    if (!emailLimpio) {
      Alert.alert("Error", "Por favor ingresa tu correo.");
      return;
    }

    try {
      const response = await fetch('http://192.168.4.124:8000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: emailLimpio }) // Mandamos el correo ya limpio
      });

      const data = await response.json();

      if (data.status === true) {
        Alert.alert("Código Enviado", `Tu código de prueba es: ${data.pin_de_prueba}`);
        navigation.navigate('ResetPassword', { email: emailLimpio });
      } else {
        // 2. Si hay error, mostramos lo que realmente nos contesta Laravel
        // (Si el correo no existe, Laravel dirá "The selected email is invalid")
        Alert.alert("Error", data.message || "Error al procesar la solicitud.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <LinearGradient colors={[COLORS.bgBlack, COLORS.bgRedDark]} style={styles.container}>
      <SafeAreaView style={styles.content}>
        <StatusBar barStyle="light-content" />
        
        {/* Botón para volver atrás */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.main}>
          <Ionicons name="lock-open-outline" size={80} color={COLORS.accentRed} style={{ alignSelf: 'center' }} />
          <Text style={styles.title}>Recuperar Acceso</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo electrónico y te enviaremos los pasos para restablecer tu contraseña.
          </Text>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Correo Electrónico</Text>
            <TextInput 
              style={styles.input}
              placeholder="tecnico@empresa.com"
              placeholderTextColor="#AAA"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleRestore}>
              <Text style={styles.buttonText}>ENVIAR INSTRUCCIONES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30 },
  backButton: { marginTop: 20 },
  main: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 15, color: COLORS.white, opacity: 0.7, textAlign: 'center', marginTop: 10, marginBottom: 30 },
  form: { width: '100%' },
  inputLabel: { fontSize: 14, color: COLORS.white, fontWeight: '600', marginBottom: 8 },
  input: { width: '100%', height: 55, borderWidth: 1, borderColor: COLORS.grayBorder, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, color: COLORS.white, backgroundColor: COLORS.grayInput, marginBottom: 25 },
  button: { width: '100%', height: 55, backgroundColor: COLORS.accentRed, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});

export default ForgotPasswordScreen;