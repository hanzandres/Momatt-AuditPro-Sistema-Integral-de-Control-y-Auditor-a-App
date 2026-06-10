// src/screens/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, StatusBar, Alert, KeyboardAvoidingView, Platform 
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

const ResetPasswordScreen = ({ route, navigation }: any) => {
  // Recibimos el email de la pantalla anterior
  const { email } = route.params;
  
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (!pin || !newPassword) {
      Alert.alert("Error", "Por favor llena todos los campos.");
      return;
    }

    try {
      // RECUERDA CAMBIAR LA IP POR LA TUYA
      const response = await fetch('http://10.145.215.1:8000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email,
          pin: pin,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (data.status === true) {
        Alert.alert("¡Éxito!", data.message, [
          { text: "Ir al Login", onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <LinearGradient colors={[COLORS.bgBlack, COLORS.bgRedDark]} style={styles.container}>
      <SafeAreaView style={styles.content}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
            <View style={styles.main}>
            <Text style={styles.title}>Nueva Contraseña</Text>
            <Text style={styles.subtitle}>Ingresa el PIN enviado a {email}</Text>

            <View style={styles.form}>
                <Text style={styles.inputLabel}>Código PIN</Text>
                <TextInput 
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#AAA"
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                maxLength={6}
                />

                <Text style={styles.inputLabel}>Nueva Contraseña</Text>
                <View style={styles.passwordContainer}>
                    <TextInput 
                        style={styles.passwordInput}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor="#AAA"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>ACTUALIZAR CONTRASEÑA</Text>
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
  content: { flex: 1, paddingHorizontal: 30 },
  main: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.white, opacity: 0.7, textAlign: 'center', marginTop: 10, marginBottom: 30 },
  form: { width: '100%' },
  inputLabel: { fontSize: 14, color: COLORS.white, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { width: '100%', height: 55, borderWidth: 1, borderColor: COLORS.grayBorder, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, color: COLORS.white, backgroundColor: COLORS.grayInput },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 55, borderWidth: 1, borderColor: COLORS.grayBorder, borderRadius: 8, backgroundColor: COLORS.grayInput },
  passwordInput: { flex: 1, height: '100%', paddingHorizontal: 15, fontSize: 16, color: COLORS.white },
  eyeIcon: { paddingHorizontal: 15 },
  button: { width: '100%', height: 55, backgroundColor: COLORS.accentRed, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});

export default ResetPasswordScreen;