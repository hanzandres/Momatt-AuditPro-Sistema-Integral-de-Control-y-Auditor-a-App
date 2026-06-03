// src/screens/FollowUpScreen.tsx
import React, {useState,useEffect} from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,TextInput,Alert,ActivityIndicator,KeyboardAvoidingView,Platform}from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function FollowUpScreen({route,navigation}: any) {
  const { auditoria,departamento } = route.params;
  const [secciones, setSecciones] =
    useState<any[]>([]);
  const [reparaciones, setReparaciones] =
    useState<any>({});
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  // SOLO LECTURA
  const soloLectura =
    auditoria.estado === 'Terminado';
  // CARGAR DATOS
  useEffect(() => {
    const observaciones =
      typeof auditoria.observaciones_estructuradas === 'string'
        ? JSON.parse(
            auditoria.observaciones_estructuradas
          )
        : (
            auditoria.observaciones_estructuradas
            || []
          );

    const seccionesConFallas =
      observaciones.filter(
        (seccion: any) =>
          seccion.fallas &&
          seccion.fallas.length > 0
      );

    setSecciones(seccionesConFallas);
    // ESTADO INICIAL
    const estadoInicial: any = {};
    seccionesConFallas.forEach(
      (seccion: any) => {

        seccion.fallas.forEach(
          (falla: any) => {

            estadoInicial[falla.pregunta] = {

              status:
                falla.status || '',

              comentario:
                falla.comentario_reparacion || ''
            };
          }
        );
      }
    );

    setReparaciones(estadoInicial);

  }, []);

  // =========================================
  // AUTOGUARDADO
  // =========================================
  const autoGuardar = async (
    nuevosDatos: any
  ) => {

    if (soloLectura) {
      return;
    }

    try {

      const tecnicoGuardado =
        await AsyncStorage.getItem(
          'tecnico_nombre'
        ) || 'Técnico';

      const payload = {

        tecnico_seguimiento:
          tecnicoGuardado,

        reparaciones:
          nuevosDatos

      };

      const userToken = await AsyncStorage.getItem('user_token');

      const url =
        `http://10.194.134.1:8000/api/auditorias/serie/${auditoria.serie}/seguimiento`;

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          'Accept':
            'application/json',
            'Authorization': userToken ? `Bearer ${userToken}` : ''
        },
        body:
          JSON.stringify(payload)
      });
    } catch (error) {
      console.log(
        'Error autoguardado',
        error
      );
    }
  };
  const handleToggleStatus = (id: string) => {
    if (soloLectura) {
      return;
    }
    setReparaciones((prev: any) => {
      const currentState =
        prev[id];
      const isChecked =
        currentState?.status === 'pasa';
      const comentario =
        currentState?.comentario?.trim() || '';
      if (
        !isChecked &&
        comentario.length < 5
      ) {
        Alert.alert(
          'Evidencia requerida',
          'Debes escribir mínimo 5 letras.'
        );
        return prev;
      }
      const nuevosDatos = {
        ...prev,
        [id]: {
          ...prev[id],
          status: isChecked ? '' : 'pasa',
          fecha_reparacion: isChecked ? null : new Date().toLocaleDateString('es-MX')
        }
      };
      // AUTOGUARDAR
      autoGuardar(nuevosDatos);
      return nuevosDatos;
    });
  };

  // =========================================
  // COMENTARIO
  // =========================================
  const handleCommentChange = (
    id: string,
    text: string
  ) => {
    if (soloLectura) {
      return;
    }
    setReparaciones((prev: any) => {
      const nuevoEstado = {
        ...prev,
        [id]: {
          ...prev[id],
          comentario: text
        }
      };
      if (
        text.trim().length < 5 &&
        prev[id]?.status === 'pasa'
      ) {
        nuevoEstado[id].status = '';
      }
      autoGuardar(nuevoEstado);
      return nuevoEstado;
    });
  };

  // =========================================
  // GUARDAR MANUAL
  // =========================================
  const handleGuardarSeguimiento =
    async () => {
      setIsSubmitting(true);
      try {

        const userToken = await AsyncStorage.getItem('user_token');
        const tecnicoGuardado =
          await AsyncStorage.getItem(
            'tecnico_nombre'
          ) || 'Técnico';
        const payload = {
          tecnico_seguimiento:
            tecnicoGuardado,
          reparaciones:
            reparaciones
        };

        const url = `http://10.194.134.1:8000/api/auditorias/serie/${auditoria.serie}/seguimiento`;
        const response =
          await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              'Accept':
                'application/json',
                'Authorization': userToken ? `Bearer ${userToken}` : ''
            },
            body:
              JSON.stringify(payload)
          });

        const data =
          await response.json();
        if (data.status) {
          Alert.alert(
            'Éxito',
            'Seguimiento guardado',
            [
              {
                text: 'OK',
                onPress: () => {
                  
                  const arregloReparaciones = Object.entries(reparaciones).map(([textoDeLaFalla, datos] : any)=>{

                    let accionFalla = 'Sin acción definida';
                    let detalleFalla = 'Sin detalle extra';

                    for (const seccion of secciones) {
                          const fallaEncontrada = seccion.fallas.find((f: any) => f.pregunta === textoDeLaFalla);
                          if (fallaEncontrada) {
                              accionFalla = fallaEncontrada.accion;
                              detalleFalla = fallaEncontrada.detalle;
                              break; // Ya la encontramos, dejamos de buscar
                          }
                      }

                    return {
                      id: textoDeLaFalla,
                      ...datos,
                          pregunta: textoDeLaFalla,
                          fecha_reparacion: datos.fecha_reparacion || new Date().toLocaleDateString('es-MX'),

                          accion_original: accionFalla,
                          detalle_original: detalleFalla
                    };
                  });

                  const faltan = arregloReparaciones.some(rep => rep.status !== 'pasa');
                  const fechaFinal = faltan ? null : new Date().toLocaleDateString('es-MX');

                  // 3. Filtrar SÓLO los que ya están reparados
                  const soloReparados = arregloReparaciones.filter(rep => rep.status === 'pasa');

                  navigation.navigate('SendReportScreen',{
                    modelo: auditoria.modelo_equipo,
                    serie: auditoria.serie,
                    eco: auditoria.eco,
                    porcentaje_final: auditoria.calificacion || 'N/A', // O el campo que uses para calificación
                    
                    // Le pasamos los datos de la reparación
                    reparaciones: soloReparados, 
                   // Lo mandamos doble por si acaso
                    fecha_finalizacion: fechaFinal,
                    reparaciones_hechas: reparaciones,
                    
                    // LA BANDERA SECRETA 🚩
                    es_seguimiento: true,
                    isSeguimiento: true,
                    modelo_texto: auditoria.modelo_texto,
                    sucursal: auditoria.sucursal,
                    nombre_tecnico: auditoria.nombre_tecnico,
                    nombre_ejecutor: auditoria.nombre_ejecutor,
                    departamento: auditoria.departamento || 'No especificado'

                    
                  });
                }
              }
            ]
          );
        } else {
          Alert.alert(
            'Error',
            data.mensaje
          );
        }
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          'No se pudo conectar'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >
      <ScrollView
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Seguimiento
          </Text>
          <Text style={styles.subtitle}>
            {auditoria.modelo_equipo}
          </Text>
          <Text style={styles.info}>
            Serie: {auditoria.serie}
          </Text>
          {soloLectura && (
            <View style={styles.readOnlyBadge}>
              <Text style={styles.readOnlyText}>
                ✅ AUDITORÍA TERMINADA
              </Text>
            </View>
          )}
        </View>

        {/* SECCIONES */}

        {secciones.map(
          (seccion, sIndex) => (
            <View
              key={sIndex}
              style={styles.seccionCard}
            >
              <Text style={styles.seccionTitulo}>
                {seccion.titulo}
              </Text>
              {seccion.fallas.map(
                (
                  falla: any,
                  fIndex: number
                ) => (
                  <View
                    key={fIndex}
                    style={styles.fallaItem}
                  >
                    <Text style={styles.preguntaText}>
                      ❌ {falla.pregunta}
                    </Text>
                    <Text style={styles.detalleText}>
                      Acción original:
                      {' '}
                      {falla.accion}
                    </Text>
                    <Text style={styles.detalleText}>
                      Detalle:
                      {' '}
                      {falla.detalle}
                    </Text>

                    {/* INPUT */}

                    <TextInput
                      editable={!soloLectura}
                      style={[
                        styles.inputComentario,
                        soloLectura &&
                          styles.inputBloqueado
                      ]}
                      placeholder="Reparación..."
                      multiline
                      value={
                        reparaciones[
                          falla.pregunta
                        ]?.comentario || ''
                      }

                      onChangeText={(text) =>
                        handleCommentChange(
                          falla.pregunta,
                          text
                        )
                      }

                    />

                    {/* BOTÓN */}

                    <TouchableOpacity
                      disabled={soloLectura}
                      style={[
                        styles.btnUnico,
                        reparaciones[
                          falla.pregunta
                        ]?.status === 'pasa'
                          &&
                          styles.btnActivo,
                        soloLectura &&
                          styles.btnBloqueado
                      ]}
                      onPress={() =>
                        handleToggleStatus(
                          falla.pregunta
                        )
                      }
                    >

                      <Text style={styles.btnText}>
                        {
                          reparaciones[
                            falla.pregunta
                          ]?.status === 'pasa'
                            ? '✅ Reparado'
                            : '⬜ Pendiente'
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </View>
          )
        )}

        {/* BOTÓN GUARDAR */}

        {!soloLectura && (
          <TouchableOpacity
            style={styles.btnGuardar}
            onPress={
              handleGuardarSeguimiento
            }
            disabled={isSubmitting}
          >
            {
              isSubmitting
                ? (
                  <ActivityIndicator
                    color="#fff"
                  />
                )
                : (
                  <Text style={styles.btnGuardarText}>
                    GUARDAR
                  </Text>
                )
            }
          </TouchableOpacity>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9'
  },
  header: {
    backgroundColor: '#1e293b',
    padding: 25
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 4
  },
  info: {
    color: '#94a3b8',
    marginTop: 4
  },
  readOnlyBadge: {
    marginTop: 12,
    backgroundColor: '#16a34a',
    padding: 10,
    borderRadius: 8
  },
  readOnlyText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  seccionCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12
  },
  seccionTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15
  },
  fallaItem: {
    marginBottom: 20
  },
  preguntaText: {
    fontWeight: 'bold',
    color: '#991b1b'
  },
  detalleText: {
    color: '#475569',
    marginTop: 3
  },
  inputComentario: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginTop: 10,
    padding: 12,
    minHeight: 80
  },
  inputBloqueado: {
    backgroundColor: '#e2e8f0',
    color: '#334155'
  },
  btnUnico: {
    marginTop: 10,
    backgroundColor: '#e2e8f0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnActivo: {
    backgroundColor: '#16a34a'
  },
  btnBloqueado: {
    opacity: 1
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  btnGuardar: {
    backgroundColor: '#D12424',
    margin: 15,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnGuardarText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default FollowUpScreen;