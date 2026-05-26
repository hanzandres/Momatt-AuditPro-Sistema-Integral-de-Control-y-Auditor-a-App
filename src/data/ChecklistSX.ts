export const CHECKLIST_SX = [
    {
    id: 's1' ,
    title: '1.- Inspección visual',
    items: [
      { id: '1.1', text: 'Estabilizadores doblados o medidas disparejas', value: 2 },
      { id: '1.2', text: 'Estado de ruedas en Gral', value: 1},
      { id: '1.3', text: 'Revise placa de datos y calcomanías de seguridad ( especificar rotas o dañadas )', value: 3},
      { id: '1.4', text: 'Revise por si alguno de los accesorios de seguridad no opera', value: 3}
    ]
  },
  {
    id: 's2',
    title: '2.- Baterías y cables',
    items: [
      { id: '2.1', text: 'Conectores de batería rotos ( Que tipo de daño )', value: 2 },
      { id: '2.2', text: 'Correcto funcionamiento del cargador ', value: 2 },
      { id: '2.3', text: 'Arneses o Cables expuestos ( Cuan expuestos o que daño )', value: 2 },
      { id: '2.4', text: 'Desconectador de emergencia trabaja correctamente', value: 3}
    ]
  },
  {
    id: 's3',
    title: '3.- Inspección de lubricacion y limpieza',
    items: [
      { id: '3.1', text: 'Todas las graseras lubricadas', value: 2 },
      { id: '3.2', text: 'Revise por fugas en Gral', value: 2 },
      { id: '3.3', text: 'Revise exceso de basura o polvo', value: 2 },
      { id: '3.4', text: 'Revise el torque adecuado de tornilleria en componentes', value: 3 }
    ]
  },
  {
    id: 's4',
    title: '4.- Bomba(s) y Motor(es) hidrahulicos',
    items: [
      { id: '4.1', text: 'Revise sujecion y estado del motor de bomba (Revisar escobillas en equipos DC)', value: 3 },
      { id: '4.2', text: 'Revise montaje de motores', value: 1 }
    ]
  },
  {
    id: 's5',
    title: '5.- Unidad y Motores de tracción',
    items: [
      { id: '5.1', text: 'Revise sujeción y estado del motor de tracción ', value: 3 },
      { id: '5.2', text: 'Revise nivel aceite de unidad de tracción ( Estime cuanto aceite tiene )', value: 3 },
      { id: '5.3', text: 'Revise por unidad de tracción (sin movimiento)', value: 3},
      { id: '5.4', text: 'Revise por fugas excesivas de aceite o basura acumulada ', value: 2}
    ]
  },
  {
    id: 's6',
    title: '6.- Cables de alimentacion y control',
    items: [
      { id: '6.1', text: 'Revise por cableado expuesto', value: 3 },
      { id: '6.2', text: 'Revise por cables de alimentacion y control sueltos ', value: 3 },
      { id: '6.3', text: 'Revise cubiertas de cables de comunicacion entre los Access', value: 2 },
      { id: '6.4', text: 'Revise por cables empalmados', value: 2}
    ]
  },
  {
    id: 's7',
    title: '7.- Panel de contactores y Contactores de alimentacion',
    items: [
      { id: '7.1', text: 'Revise contactos quemados (Cuan mal estan, algun daño significativo?)', value: 3 },
      { id: '7.2', text: 'Revise por cables sueltos en el panel de contactores y fusibles', value: 3 }
    ]
  },
  {
    id: 's8',
    title: '8.- Frenos',
    items: [
      { id: '8.1', text: 'Revise la tensión del montaje del maneral', value: 3 },
      { id: '8.2', text: 'Revise la separacion de aire (no mayor a 0 .2mm, 0.008in)', value: 3 }
    ]
  },
  {
    id: 's9',
    title: '9.- Sistema hidráulico',
    items: [
      { id: '9.1', text: 'Revise por fugas en todos los cilindros y conexiones ( Específique cuál cilindro y cual conexion )', value: 2 },
      { id: '9.2', text: 'Revise nivel de aceite hidráulico (no opere sin tapón)', value: 3 },
      { id: '9.3', text: 'Revise si se han realizado cambios de aceite de cada 2000 hrs de operación', value: 3 }
    ]
  },
  {
    id: 's10',
    title: '10.- Ensamble de Mástil',
    items: [
      { id: '10.1', text: 'Revise horquillas con el medidor de horquillas  Crown (tornillo de seguridad de horquillas)', value: 2 },
      { id: '10.2', text: 'Revise el mástil por apropiada lubricación y rodamientos en buen estado', value: 3 },
      { id: '10.3', text: 'Revise las cadenas por elongamiento con el medidor de cadenas', value: 3, 
        subItems: [
            { id: '10.3.1', text: 'Uso de herramienta (flexo,escala,manual)', value: 1},
            { id: '10.3.2', text: 'Detro de tolerancia de 3% y/o reportado en reporte servicio', value: 1},
            { id: '10.3.3', text: 'Condiciones de limpieza y lubricacion (suciedad, oxidacion)', value: 1}
        ]
      },
      { id: '10.4', text: 'Revise anclajes y ajuste de cadenas (Cuánto ajuste?)', value: 3,
        subItems: [
            { id: '10.4.1', text: 'Tension de cadenas (12mm/0,5 in)', value: 1},
            { id: '10.4.2', text: 'Ajuste carro de horquillas (talon a piso)', value: 1},
            { id: '10.4.3', text: 'Ajuste escalonamiento de secciones ', value: 1},
            { id: '10.4.4', text: 'Explicacion de ajuste', value: 1}
        ]
      },
      { id: '10.5', text: 'Revise por cables o mangueras deterioradas ( Cuán malo es el desgaste? )', value: 3},
      { id: '10.6', text: 'Revise por mangueras deterioradas ( Cuán malo es el desgaste? )', value: 3,
        subItems: [
            { id: '10.6.1', text: 'Cortes o rasgaduras en la cubierta exterior (Forro)', value: 1},
            { id: '10.6.2', text: 'Con arrugas, ampollas o torceduras', value: 1},
            { id: '10.6.3', text: 'Conexiones (terminales) corroídas o con fugas', value: 1},
            { id: '10.6.4', text: 'Tensión de la misma (Estiramiento)', value: 1},
            { id: '10.6.5', text: 'Condición de poleas guía', value: 1}
        ]
      }
    ]
  },
  {
    id: 's11',
    title: '11.- Revisión Operacional y Prueba de manejo',
    items: [
      { id: '11.1', text: 'Revise apropiada operación del claxon', value: 3 },
      { id: '11.2', text: 'Revise operación de switch de seguridad reversa', value: 3 },
      { id: '11.3', text: 'Revise operación apropiada de switches en el  control pod', value: 3 },
      { id: '11.4', text: 'Revisar por algún problema del sistema (Identificar si se requiere recalibración)', value: 2}
    ]
  },
]

export const PUNTUACION_MAXIMA = 100;