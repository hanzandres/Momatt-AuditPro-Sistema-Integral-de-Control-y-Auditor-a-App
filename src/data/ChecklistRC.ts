export const CHECKLIST_RC = [
    {
    id: 's1' ,
    title: '1.- Inspección visual',
    items: [
      { id: '1.1', text: 'Estado de ruedas en Gral', value: 1 },
      { id: '1.2', text: 'Revise placa de datos y calcomanías de seguridad ( Están en su lugar?) ', value: 3},
      { id: '1.3', text: 'Revise respaldo de carga por daños', value: 1},
      { id: '1.4', text: 'Revise por accesorios de seguridad que no operen  (ej.estrobo, alarma de viaje, etc.)', value: 3}
    ]
  },
  {
    id: 's2',
    title: '2.- Baterías y cables',
    items: [
      { id: '2.1', text: 'Opera desconectador de emergencia o es inoperable? ( ED Dañado )', value: 3 },
      { id: '2.2', text: 'Revise conector de batería roto ( Que tipo de daño)', value: 2 },
      { id: '2.3', text: 'Revise por cables  expuestos', value: 2 },
    ]
  },
  {
    id: 's3',
    title: '3.- Inspección de lubricacion y limpieza',
    items: [
      { id: '3.1', text: 'Todas las graseras lubricadas ( Reporte cuantas perdidas)', value: 2 },
      { id: '3.2', text: 'Revise torque adecuado de tornilleria en componentes', value: 2 },
      { id: '3.3', text: 'Revise acumulación de basura bajo la consola y el piso ( ej. trapos, basura, fugas considerables )', value: 2 },
      { id: '3.4', text: 'Revise lubricación en palanca  multi-funciones ( Busque algún desgaste )', value: 2 }
    ]
  },
  {
    id: 's4',
    title: '4.- Bomba(s) y Motor(es) hidrahulicos',
    items: [
      { id: '4.1', text: 'Revise por fugas  en bombas', value: 2 },
      { id: '4.2', text: 'Revise sujeción  y estado de motor de bomba (Revisar escobillas en equipos DC)', value: 3 }
    ]
  },
  {
    id: 's5',
    title: '5.- Motor(es) y Unidad de Tracción',
    items: [
      { id: '5.1', text: 'Revise sujeción y estado de los motores de tracción ', value: 3 },
      { id: '5.2', text: 'Revise por fugas de aceite', value: 2 },
      { id: '5.3', text: 'Revise nivel de aceite de unidad de tracción '  , value: 3 },
      { id: '5.4', text: 'Revise tapón de respiración (Que este libre de obstrucción)', value: 1}
    ]
  },
  {
    id: 's6',
    title: '6.- Cables de alimentacion y control',
    items: [
      { id: '6.1', text: 'Revise por cableado y arneses expuesto ( Cuán mal estan los cables )', value: 3 },
      { id: '6.2', text: 'Revise por cables de alimentación y de control sueltos ', value: 3 }
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
      { id: '8.1', text: 'Revise operación del pedal del freno', value: 3 },
      { id: '8.2', text: 'Revise el rotor de freno por desgaste ( Separación de aire ) (Reemplazar si mide más de 0.9 mm)', value: 3 },
      { id: '8.3', text: 'Revise apropiada operación del freno de estacionamiento ( Libera y se aplica correctamente)', value: 2},
      { id: '8.4', text: 'Revise funcionamiento del RPS1 (Está dentro de rango de operación?) 20 a 30%', value: 2}
    ]
  },
  {
    id: 's9',
    title: '9.- Direccion',
    items: [
      { id: '9.1', text: 'Revise por apropiada reacción del timón de dirección (el juego es normal)', value: 3 },
      { id: '9.2', text: 'Revise generador de torque por fugas excesivas', value: 2 },
      { id: '9.3', text: 'Revise sujeción y estado del motor hidráulico de dirección (Cuenta con ambos tornillos?)', value: 2 },
      { id: '9.4', text: 'Revise sujeción de unidad de dirección (Asegúrese que cuente con el torque adecuado)', value: 3}
    ]
  },
  {
    id: 's10',
    title: '10.- Sistema Hidráulico',
    items: [
      { id: '10.1', text: 'Revise por fugas en cilindros  ( Específique cuál cilindro )', value: 2 },
      { id: '10.2', text: 'Revise el nivel de aceite hidráulico', value: 3 },
      { id: '10.3', text: 'Revise fecha del filtro reemplazos cada 2000h', value: 2 },
      { id: '10.4', text: 'Revise montaje de cilindros y mastil', value: 3}
    ]
  },
  {
    id: 's11',
    title: '11.- Ensamble de Mástil',
    items: [
      { id: '11.1', text: 'Revise horquillas con el medidor de  horquillas Crown', value: 2 },
      { id: '11.2', text: 'Revise apropiada lubricación de canales de mástil y estado de rodamientos', value: 3 },
      { id: '11.3', text: 'Revise cadenas por elongamiento con el medidor de cadenas', value: 3, 
        subItems: [
          { id: '11.3.1', text: 'Uso de herramienta (flexo,escala,manual)', value: 1},
          { id: '11.3.2', text: 'Detro de tolerancia de 3% y/o reportado en reporte servicio', value: 1},
          { id: '11.3.3', text: 'Condiciones de limpieza y lubricacion (suciedad, oxidacion)', value: 1}
        ]
       },
      { id: '11.4', text: 'Revise ajuste de cadenas o anclajes de la parte inferior ( Cuánto espacio queda en el ancla )', value: 3,
        subItems: [
          { id: '11.4.1', text: 'Tension de cadenas (12mm/0,5 in)', value: 1},
          { id: '11.4.2', text: 'Ajuste carro de horquillas (talon a piso)', value: 1},
          { id: '11.4.3', text: 'Ajuste escalonamiento de secciones', value: 1},
          { id: '11.4.4', text: 'Explicacion de ajuste', value: 1}
        ]
      },
      { id: '11.5', text: 'Revise por deterioro cables ( Cuán malo es el desgaste? )', value: 3},
      { id: '11.6', text: 'Revise por deterioro mangueras del mástil ( Cuán malo es el desgaste? )', value: 3,
        subItems: [
          { id: '11.6.1', text: 'Cortes o rasgaduras en la cubierta exterior (Forro)', value: 1},
          { id: '11.6.2', text: 'Con arrugas, ampollas o torceduras.', value: 1},
          { id: '11.6.3', text: 'Conexiones (terminales) corroídas o con fugas', value: 1},
          { id: '11.6.4', text: 'Tensión de la misma (Estiramiento)', value: 1},
          { id: '11.6.5', text: 'Condición de poleas guía', value: 1},
        ]
      }
    ]
  },
  {
    id: 's12',
    title: '12.- Revision operacional y prueba de manejo',
    items: [
      { id: '12.1', text: 'Revise distancia de frenado - Aprox. 69 - 81 in. (Con uñas hacia enfrente)', value: 3 },
      { id: '12.2', text: 'Revise apropiada operacion del claxon', value: 2 },
      { id: '12.3', text: 'Revise la operación del switch de inclinación', value: 3 },
      { id: '12.4', text: 'Revise operacion de la barra de entrada', value: 3 },
      { id: '12.5', text: 'Revisar por algun daño en el sistema', value: 3}
    ]
  },
]

export const PUNTUACION_MAXIMA = 110;