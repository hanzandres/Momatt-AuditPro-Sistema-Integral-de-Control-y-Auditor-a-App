export const CHECKLIST_SC = [

    {
    id: 's1' ,
    title: '1.- Inspección visual',
    items: [
      { id: '1.1', text: 'Estado de ruedas en Gral', value: 1 },
      { id: '1.2', text: 'Revise placa de datos y calcomanias de seguridad(estan en su lugar?)', value: 3},
      { id: '1.3', text: 'Revise resplado de cargapor daños o tornillos perdidos', value: 1},
      { id: '1.4', text: 'Revise por accesorios de seguridad que no operen (ej. estorbo, alarma de viaje, etc)', value: 3}
    ]
  },
  {
    id: 's2',
    title: '2.- Baterías y cables',
    items: [
        { id: '2.1', text: 'Opera desconectados de emergencia o es inoperable? (ED Dañado)', value: 3 },
        { id: '2.2', text: 'Revise conector de bateria roto (Que tipo de daño)', value: 2},
        { id: '2.3', text: 'Revise por cables o arneses expuestos (cuan expuestos o dañados)', value: 2}
    ] 
  },
  {
    id: 's3',
    title: '3.- Inspección de lubricacion y limpieza',
    items: [
      { id: '3.1', text: 'Todas las graseras lubricadas(incluyendo ruedas de dirreccion)', value: 2 },
      { id: '3.2', text: 'Revise torque adecuado de tornilleria en componente', value: 2 },
      { id: '3.3', text: 'Revise acumulacion de basura bajo el piso (ej. trapos, basura, fugas considerables)', value: 2 },
      { id: '3.4', text: 'Revise lubricacion en palancas de funciones y dirreccion(busque algun desgaste)', value: 2 }
    ]
  },
  {
    id: 's4',
    title: '4.- Bomba(s) y Motor(es) hidrahulicos',
    items: [
      { id: '4.1', text: 'Revise por fugas en bombas', value: 2 },
      { id: '4.2', text: 'Revise desgaste excesivo de escobillas de motor de bomba y direccion (sist. DC)', value: 3 },
      { id: '4.3', text: 'Revise sujecion segura del motor', value: 2}
    ]
  },
  {
    id: 's5',
    title: '5.- Motor(es) y Unidad de traccion',
    items: [
      { id: '5.1', text: 'Revise desgaste excesivo de escobillas en motor de traccion (en sist DC)', value: 3 },
      { id: '5.2', text: 'Revise sujecion segura de motores', value: 2 },
      { id: '5.3', text: 'Revse nivel de aceite de unidad de traccion(Revise que nivel tiene'  , value: 3 },
      { id: '5.4', text: 'Revise por fugas de aceite (determine si debio haber sido detectado en ultimo Mp )', value: 2}
    ]
  },
  {
    id: 's6',
    title: '6.- Cables de alimentacion y control',
    items: [
      { id: '6.1', text: 'Revise por cableado expuesto (cuan mal estan los cables)', value: 3 },
      { id: '6.2', text: 'Revise por cables de alimentacion y cableado de control sueltos ', value: 3 }
    ]
  },
  {
    id: 's7',
    title: '7.- Panel de contactores y Contactores de alimentacion',
    items: [
      { id: '7.1', text: 'Revise por contactos quemados (cuan quemado y algun daño)', value: 3 },
      { id: '7.2', text: 'Revise por cables suelto en el panel de contactores y barras de  fusibles', value: 3 }
    ]
  },
  {
    id: 's8',
    title: '8.- Frenos',
    items: [
      { id: '8.1', text: 'Revise operacion de pedal del freno', value: 2 },
      { id: '8.2', text: 'Revise el rotor de freno por desgaste(separacion de aire)(si mide 0.70 a 0.75 mm, es necesario su remplazo)', value: 3 },
      { id: '8.3', text: 'Revise operacion de switches de pedal del freno', value: 2},
      { id: '8.4', text: 'Revise apropiada operacion del freno de estacionamiento (cuando se aplica y libera durante el levante y descenso', value: 3}
    ]
  },
  {
    id: 's9',
    title: '9.- Direccion',
    items: [
      { id: '9.1', text: 'Revise apropiada reaccion del timon de dirreccion (condicion de la columna de dirrecion, el juego es normal?', value: 3 },
      { id: '9.2', text: 'Revise generador de torque por fugas excesivas', value: 2 },
      { id: '9.3', text: 'Revise condiciones del cilindro de dirrecion (especifique por algun daño', value: 2 },
      { id: '9.4', text: 'Revise sujecion segura y condiciones del motor (en equipos DC, revisar escobillas)', value: 3}
    ]
  },
  {
    id: 's10',
    title: '10.- Sistema Hidráulico',
    items: [
      { id: '10.1', text: 'Revise por fugas en pistones (especifique cual piston?)', value: 2 },
      { id: '10.2', text: 'Revise nivel de aceite hidrahulico(retire colador para identificar el nivel de aceite)', value: 3 },
      { id: '10.3', text: 'Revise fecha del filtro (tienes fechas de cambio)', value: 2 },
      { id: '10.4', text: 'Revise si se han realizado cambios de aceite de cada 2000 hrs de operacion', value: 2},
      { id: '10.5', text: 'Revise montajes de cilindros', value: 3}
    ]
  },
  {
    id: 's11',
    title: '11.- Ensamble de mastil',
    items: [
      { id: '11.1', text: 'Revise horquillas con el medidor de hosquillas Crown', value: 2 },
      { id: '11.2', text: 'Revise apropiada lubricacion de canales de mastil y estado de rodamientos', value: 3 },
      { id: '11.3', text: 'Revise las cadenas por elongamiento con el medidor de cadenas', value: 3,
        subItems: [
          { id: '11.3.1', text: 'Uso de herramienta (flexo,escala,manual)', value: 1},
          { id: '11.3.2', text: 'Detro de tolerancia de 3% y/o reportado en reporte servicio', value: 1},
          { id: '11.3.3', text: 'Condiciones de limpieza y lubricacion (suciedad, oxidacion)', value: 1}
        ]
      },
      { id: '11.4', text: 'Revise torque de tornillos de montaje del mastil', value: 3 },
      { id: '11.5', text: 'Revise ajuste de cadenas o anclajes de la parte inferior (cuanto espacio queda)', value: 3,
        subItems: [
          { id: '11.5.1', text: 'Tension de cadenas (12mm/0,5 in)', value: 1},
          { id: '11.5.2', text: 'Ajuste carro de horquillas (talon a piso)', value: 1},
          { id: '11.5.3', text: 'Ajuste escalonamiento de secciones', value: 1},
          { id: '11.5.4', text: 'Explicacion de ajuste', value: 1}
        ]
      },
      { id: '11.6', text: 'Revise por deterioro de cables (cuan malo es el desgate)', value: 3 },
      { id: '11.7', text: 'Revise por deterioro mangueras del mastil (cuan malo es el desgate?)', value: 3,
        subItems: [
          { id: '11.7.1', text: 'Cortes o rasgaduras en la cubierta exterior (Forro)', value: 1},
          { id: '11.7.2', text: 'Con arrugas, ampollas o torceduras', value: 1},
          { id: '11.7.3', text: 'Conexiones (terminales) corroídas o con fugas', value: 1},
          { id: '11.7.4', text: 'Tensión de la misma (Estiramiento)', value: 1},
          { id: '11.7.5', text: 'Condición de poleas guía', value: 1}
        ]
       },
    ]
  },
  {
    id: 's12',
    title: '12.- Revision operacional y prueba de manejo',
    items: [
      { id: '12.1', text: 'Revise distancia de frenado - Aprox 122 in (con uñas hacia enfrente)', value: 3 },
      { id: '12.2', text: 'Revise apropiada operacion del claxon', value: 2 },
      { id: '12.3', text: 'Revise la operacion del switch de inclinacion', value: 3 },
      { id: '12.4', text: 'Revise operacion del switch del asiento', value: 3 },
    ]
  }
];

export const PUNTUACION_MAXIMA = 116;