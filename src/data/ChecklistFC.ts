

export const CHECKLIST_FC = [
    {
    id: 's1' ,
    title: '1.- Inspección visual',
    items: [
      { id: '1.1', text: 'Estado de ruedas en Gral', value: 1 },
      { id: '1.2', text: 'Revise placa de datos y calcomanias de seguridad(estan en su lugar?)', value: 3},
      { id: '1.3', text: 'Revise resplado de carga por daños', value: 1},
      { id: '1.4', text: 'Revise por accesorios de seguridad que no operen (ej. estorbo, alarma de viaje, etc)', value: 3}
    ]
  },
  {
    id: 's2',
    title: '2.- Baterías y cables',
    items: [
      { id: '2.1', text: 'Opera desconectador de emergencia o es inoperable? ( ED Dañado )', value: 3 },
      { id: '2.2', text: 'Revise conector de batería roto ( Que tipo de daño)', value: 2 },
      { id: '2.3', text: 'Revise por cables expuestos', value: 2 },
    ]
  },
  {
    id: 's3',
    title: '3.- Inspección de lubricacion y limpieza',
    items: [
      { id: '3.1', text: 'Todas las graseras lubricadas incluyendo ruedas de direccion', value: 2 },
      { id: '3.2', text: 'Revise torque adecuado en tornillos de componentes', value: 2 },
      { id: '3.3', text: 'Revise acumulación de basura bajo el piso ( ej. trapos, basura, fugas considerables )', value: 2 },
      { id: '3.4', text: 'Revise lubrication en palancas de funciones y dirección ( Busque algún desgaste )', value: 2 },
    ]
  },
  {
    id: 's4',
    title: '4.- Bomba(s) y Motor(es) hidrahulicos',
    items: [
      { id: '4.1', text: 'Revise por fugas en bombas', value: 2 },
      { id: '4.2', text: 'Revise sujeción segura y condiciones del motor de bomba y dirección ( Revisar el desgaste de escobillas, equipos DC )', value: 3 }
    ]
  },
  {
    id: 's5',
    title: '5.- Unidad y Motores de traccion',
    items: [
      { id: '5.1', text: 'Revise sujeción segura y condiciones del motor de tracción', value: 3 },
      { id: '5.2', text: 'Revise nivel de aceite de unidad de tracción ( Revise que nivel tiene )', value: 3 },
      { id: '5.3', text: 'Revise por fugas  de aceite'  , value: 2 },
    ]
  },
  {
    id: 's6',
    title: '6.- Cables de alimentacion y control',
    items: [
      { id: '6.1', text: 'Revise por cableado expuesto ( Cuán mal estan los cables )', value: 3 },
      { id: '6.2', text: 'Revise por cables y arneses de alimentación y cableado de control sueltos', value: 3 },
    ]
  },
  {
    id: 's7',
    title: '7.- Panel de contactores y Contactores de alimentacion',
    items: [
      { id: '7.1', text: 'Revise por contactos quemados ( Cuán quemado y algún daño )', value: 3 },
      { id: '7.2', text: 'Revise por cableado suelto en panel de contactores y barras de fusibles', value: 3 }
    ]
  },
  {
    id: 's8',
    title: '8.- Frenos',
    items: [
      { id: '8.1', text: 'Revise fugas de lineas y pistón de freno de estacionamiento ( Específique algún daño )', value: 2 },
      { id: '8.2', text: 'Revisar pastas del freno de estacionamiento (espesor mínimo 2.0 mm en equipos 5200)', value: 2 },
      { id: '8.3', text: 'Revise operación del pedal de freno', value: 3},
      { id: '8.4', text: 'Revise apropiada operación del freno de estacionamiento(el equipo de desplaza con el freno aplicado?)', value: 3}
    ]
  },
  {
    id: 's9',
    title: '9.- Direccion',
    items: [
      { id: '9.1', text: 'Revise por apropiada reacción del timón de dirección (El juego es normal?)', value: 2 },
      { id: '9.2', text: 'Revise columna de dirección y palanca de control direccional', value: 2 },
      { id: '9.3', text: 'Revise generador de torque por fugas excesivas', value: 3 },
      { id: '9.4', text: 'Revise operación adecuada en dirección (Específique daño) ', value: 3},
      { id: '9.5', text: 'Revise condiciones de escobillas de motor de dirección', Value: 3}
    ]
  },
  {
    id: 's10',
    title: '10.- Sistema Hidráulico',
    items: [
      { id: '10.1', text: 'Revise por fugas en cilindros  ( Específique cuál cilindro )', value: 2 },
      { id: '10.2', text: 'Revise el nivel de aceite hidráulico ( Retire colador para identificar el nivel de aceite )', value: 3 },
      { id: '10.3', text: 'Revise fecha del filtro', value: 2 },
      { id: '10.4', text: 'Revise montajes de  cilindros', value: 3}
    ]
  },
  {
    id: 's11',
    title: '11.- Ensamble de mastil',
    items: [
      { id: '11.1', text: 'Revise horquillas con el medidor de  horquillas Crown', value: 2 },
      { id: '11.2', text: 'Revise apropiada lubricación de canales de mástil y estado de los rodamientos', value: 3 },
      { id: '11.3', text: 'Revise cadenas por elongamiento con el medidor de cadenas ', value: 3,
        subItems: [
            { id: '11.3.1', text: 'Uso de herramienta (flexo,escala,manual)', value: 1},
            { id: '11.3.2', text: 'Detro de tolerancia de 3% y/o reportado en reporte servicio', value: 1},
            { id: '11.3.3', text: 'Condiciones de limpieza y lubricacion (suciedad, oxidacion)', value: 1}
        ]
       },
      { id: '11.4', text: 'Revise torque de tornillos de montaje del mástil', value: 3},
      { id: '11.5', text: 'Revise ajuste de cadenas o anclajes de la parte inferior ( Cuánto espacio queda en el ancla )', value: 3,
        subItems: [
            { id: '11.5.1', text: 'Tension de cadenas (12mm/0,5 in)', value: 1},
            { id: '11.5.2', text: 'Ajuste carro de horquillas (talon a piso)', value: 1},
            { id: '11.5.3', text: 'Ajuste escalonamiento de secciones', value: 1},
            { id: '11.5.4', text: 'Explicacion de ajuste', value: 1}
        ]
      },
      { id: '11.6', text: 'Revise por deterioro cables ( Cuán malo es el desgaste? )', value: 3},
      { id: '11.7', text: 'Revise por deterioro mangueras del mástil ( Cuán malo es el desgaste? )', value: 3,
        subItems: [
            { id: '11.7.1', text: 'Cortes o rasgaduras en la cubierta exterior (Forro)', value: 1},
            { id: '11.7.2', text: 'Con arrugas, ampollas o torceduras', value: 1},
            { id: '11.7.3', text: 'Conexiones (terminales) corroídas o con fugas', value: 1},
            { id: '11.7.4', text: 'Tensión de la misma (Estiramiento)', value: 1},
            { id: '11.7.5', text: 'Condición de poleas guía', value: 1}
        ]
      }
    ]
  },
  {
    id: 's12',
    title: '12.- Revision operacional y prueba de manejo',
    items: [
      { id: '12.1', text: 'Revise distancia de frenado - Aprox. 1.5 -3m. (Con uñas hacia enfrente)', value: 3 },
      { id: '12.2', text: 'Revise apropiada operación del claxon', value: 2 },
      { id: '12.3', text: 'Revise la operación del switch de inclinación', value: 3 },
      { id: '12.4', text: 'Revise operación del switch del asiento', value: 3 },
      { id: '12.5', text: 'Revisar por algún problema del sistema', value: 3}
    ]
  },
];

export const PUNTUACION_MAXIMA = 115;