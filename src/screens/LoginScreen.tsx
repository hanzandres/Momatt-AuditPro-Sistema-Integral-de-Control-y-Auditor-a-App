// src/screens/LoginScreen.tsx
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
  Platform,
  Dimensions,
  Image,
  Alert // <-- Agregado para usar Alert nativo
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const COLORS = {
  bgBlack: '#000000',
  bgRedDark: '#4D0000',
  accentRed: '#D12424',
  white: '#FFFFFF',
  grayInput: 'rgba(255, 255, 255, 0.1)',
  grayBorder: 'rgba(255, 255, 255, 0.3)',
  textPlaceHolder: '#AAAAAA'
};

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async () => {
    console.log(`Intentando loguear con: ${email}`);

    try {
      // 1. LOGIN NORMAL (Verificar contraseña)
      const response = await fetch('http://10.122.224.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.status === true) {
        
        // Guardamos los datos básicos del login
        await AsyncStorage.setItem('user_token', data.token);
        await AsyncStorage.setItem('tecnico_nombre', data.usuario.name);
        await AsyncStorage.setItem('tecnico_correo', email.toLowerCase().trim());
        
        // 2. NUEVA MAGIA: Jalar los datos del Excel (Sucursal, Jefes, etc)
        const userToken = await AsyncStorage.getItem('user_token');
      
        try {
          const verifResponse = await fetch('http://10.122.224.1:8000/api/verificar-usuario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': userToken ? `Bearer ${userToken}` : ''
            },
            body: JSON.stringify({ correo: email.toLowerCase().trim() })
          });

          const verifData = await verifResponse.json();

          if (verifResponse.ok && verifData.status === true) {
            const tecnico = verifData.datos;
            // Guardamos la info extraída del Excel en la memoria
            await AsyncStorage.setItem('tecnico_sucursal', tecnico.sucursal || '');
            await AsyncStorage.setItem('tecnico_departamento', tecnico.departamento || '');
            await AsyncStorage.setItem('correo_jt', tecnico.correo_jt || '');
            await AsyncStorage.setItem('correo_gerente', tecnico.correo_gerente || '');
            await AsyncStorage.setItem('correo_gerente_extra', tecnico.correo_gerente_extra || '');
            
            console.log("Datos de la sucursal y jefes guardados con éxito.");
          } else {
            console.warn("El correo no está en el Excel de técnicos, la sucursal quedará en blanco.");
          }
        } catch (errorValidacion) {
          console.error("No se pudo cargar la info del Excel: ", errorValidacion);
        }
        // ------------------------------------------------------------------

        alert('¡Bienvenido! ' + data.usuario.name);
        
        // SALTO DIRECTO AL CENTRO DE MANDO
        navigation.replace('Main'); 
      } else {
        Alert.alert('Error', data.message || 'Correo o contraseña incorrectos.');
      }

    } catch (error) {
      alert('No se pudo conectar con la computadora. Revisa la IP y el WiFi.');
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
              <Image 
                source={require('../../assets/momatt.png')} 
                style={styles.logo}
                resizeMode="contain" 
              />
              <Text style={styles.title}>Iniciar Sesión</Text>
              <Text style={styles.subtitle}>Auditoría de Montacargas</Text>
              <View style={styles.redDivider} />
            </View>

            <View style={styles.form}>
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <TextInput 
                style={styles.input}
                placeholder="tecnico@momatt.com"
                placeholderTextColor={COLORS.textPlaceHolder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.inputLabel}>Contraseña</Text>

              <View style={styles.passwordContainer}>
                <TextInput 
                style={styles.passwordInput}
                placeholder='***********'
                placeholderTextColor={COLORS.textPlaceHolder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize='none'
                />

                <TouchableOpacity
                style={styles.eyelcon}
                onPress={()=> setShowPassword(!showPassword)}
                >
                  <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.forgotPassword} 
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>ENTRAR</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
                </TouchableOpacity>
              </View>

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
  header: { marginBottom: 35, alignItems: 'center', width: '100%' },
  logo: { width: '100%', height: 150, marginBottom: 25 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.white, marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.white, opacity: 0.8, marginBottom: 10, textAlign: 'center' },
  redDivider: { height: 4, width: 60, backgroundColor: COLORS.accentRed, borderRadius: 2, alignSelf: 'center' },
  form: { width: '100%' },
  inputLabel: { fontSize: 14, color: COLORS.white, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { width: '100%', height: 55, borderWidth: 1, borderColor: COLORS.grayBorder, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, color: COLORS.white, backgroundColor: COLORS.grayInput },
  forgotPassword: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 20 },
  forgotPasswordText: { color: COLORS.white, opacity: 0.7, fontSize: 14, fontWeight: '500' },
  button: { width: '100%', height: 55, backgroundColor: COLORS.accentRed, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: COLORS.accentRed, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  registerText: { fontSize: 15, color: COLORS.white, opacity: 0.8 },
  registerLink: { fontSize: 15, color: COLORS.accentRed, fontWeight: 'bold' },
  passwordContainer:{
    flexDirection:'row',
    alignItems:'center',
    width:'100%',
    height:55,
    borderWidth:1,
    borderColor: COLORS.grayBorder,
    borderRadius:8,
    backgroundColor: COLORS.grayInput
  },
  passwordInput:{
    flex:1,
    height:'100%',
    paddingHorizontal:15,
    fontSize:16,
    color:COLORS.white,
  },
  eyelcon:{
    paddingHorizontal:15,
    justifyContent: 'center',
    height:'100%'
  }
});

export default LoginScreen;