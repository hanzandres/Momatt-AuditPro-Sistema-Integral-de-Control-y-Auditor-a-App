export const CHECKLIST_PPT = [
    {
    id: 's1' ,
    title: '1.- Inspección visual',
    items: [
      { id: '1.1', text: 'Revisar soldadura y uñas dobladas ', value: 2 },
      { id: '1.2', text: 'Revisar placa de datos y calcomanías de seguridad ( ser específico )', value: 3},
      { id: '1.3', text: 'Revisar respaldo de carga por daño o tornillos perdidos', value: 1},
      { id: '1.4', text: 'Revisar operación de potenciometros del maneral', value: 2}
    ]
  },
  {
    id: 's2',
    title: '2.- Baterías y cables',
    items: [
      { id: '2.1', text: 'Revisar por cables de baterías rotos o cables expuestos ( Cuán expuestos o que daños)', value: 2 },
      { id: '2.2', text: 'Revisar estado de conectores (Que tipo de daño)', value: 3 }
    ]
  },
  {
    id: 's3',
    title: '3.- Inspección de lubricacion y limpieza',
    items: [
      { id: '3.1', text: 'Revise lubricación de todas las graseras ( Ponga particular atención en la parte inferior )', value: 2 },
      { id: '3.2', text: 'Revise torque adecuado en tornilleria en componentes', value: 2 },
      { id: '3.3', text: 'Revise si hay basura acumulada en el compartimiento del motor', value: 3 }
    ]
  },
  {
    id: 's4',
    title: '4.- Bomba(s) Hidráulicas & Motor(es)',
    items: [
      { id: '4.1', text: 'Revise bombas por fugas excesivas ( Que tan grave y que tiempo a tenido la fuga )', value: 2 },
      { id: '4.2', text: 'Revise escobillas de motor de bomba por desgaste excesivo  ( Detalle que largo aprox. in. )', value: 3 },
      { id: '4.3', text: 'Revise si hay suciedad en el porta escobillas', value: 2},
      { id: '4.4', text: 'Revise nivel de aceite y asegúrese que el tapón de llenado no este fuera de su lugar ', value: 3},
      { id: '4.5', text: 'Revise que el equipo puede recoger una carga completa', value: 2}
    ]
  },
  {
    id: 's5',
    title: '5.- Unidad de Tracción y Motor de Tracción',
    items: [
      { id: '5.1', text: 'Revise escobillas de motor de tracción por desgaste excesivo ', value: 3 },
      { id: '5.2', text: 'Asegúrese que el cubre escobillas este en el motor ( Excepto PE4500)', value: 1 },
      { id: '5.3', text: 'Revise fuga en retén de flecha del motor y/o movmiento excesivo en flecha'  , value: 2 },
      { id: '5.4', text: 'Revisar nivel de aceite en unidad de tracción (Con una varilla estime cuanto fluído esta bajo)', value: 3},
      { id: '5.5', text: 'RRevise  exceso fuga de aceite ', value: 2},
      { id: '5.6', text: 'Revise el montaje superior de la unidad de traccción (revisar torque)' , value: 3}
    ]
  },
  {
    id: 's6',
    title: '6.- Cables de alimentación y Cableado de control',
    items: [
      { id: '6.1', text: 'Revise por cables expuestos o empalmados', value: 3 },
      { id: '6.2', text: 'Revise por cables de alimentación y arneses sueltos ', value: 3 }
    ]
  },
  {
    id: 's7',
    title: '7.- Panel de contactores y Contactores de alimentacion',
    items: [
      { id: '7.1', text: 'Revise por contactos quemados  ( Cuan mal estan , Algún daño significativo )', value: 3 },
      { id: '7.2', text: 'Revise por cableado suelto en el panel de contactores y barras de fusibles sueltas', value: 3 }
    ]
  },
  {
    id: 's8',
    title: '8.- Frenos',
    items: [
      { id: '8.1', text: 'Revise visualmente desgaste excesivo en zapatas de freno', value: 3 },
      { id: '8.2', text: 'Revise ajuste de micro-switch de freno y sistema de actuación ', value: 3 }
    ]
  },
  {
    id: 's9',
    title: '9.- Direccion',
    items: [
      { id: '9.1', text: 'Revise si hay una reacción adecuada al operar la dirección (Algún daño en balero cónico)', value: 3 },
      { id: '9.2', text: 'Revise la tensión del montaje del maneral', value: 3 },
      { id: '9.3', text: 'Revise el generador de torque por fugas (orbitrol)', value: 2 },
      { id: '9.4', text: 'Revise cadena de dirección por falta de ajuste ', value: 3}
    ]
  },
  {
    id: 's10',
    title: '10.- Sistema Hidráulico',
    items: [
      { id: '10.1', text: 'Revise fugas en cilindro de levante', value: 2 },
      { id: '10.2', text: 'Revise nivel de aceite hidráulico  ', value: 3 },
      { id: '10.3', text: 'Revise por mangueras deterioradas', value: 3, 
        subItems: [
            { id: '10.3.1', text: 'Cortes o rasgaduras en la cubierta exterior (Forro)', value: 1},
            { id: '10.3.2', text: 'Con arrugas, ampollas o torceduras', value: 1},
            { id: '10.3.3', text: 'Conexiones (terminales) corroídas o con fugas', value: 1},
            { id: '10.3.4', text: 'Tensión de la misma (Estiramiento)', value: 1},
            { id: '10.3.5', text: 'Condición de poleas guía', value: 1}
        ]
      }
    ]
  },
  {
    id: 's11',
    title: '11.- Ensamble de mástil / Estructura de levante',
    items: [
      { id: '11.1', text: 'Revise estructura de levante (tornillos y pernos  de la chumacera)', value: 2 },
      { id: '11.2', text: 'Revise por desgaste ruedas en Gral. (caster, carga, traccion)', value: 2 },
      { id: '11.3', text: 'Revise bujes y partes de la estructura de levante por desgaste ( Distancia del piso a la parte superior de las uñas cuando estan abajo )', value: 2 },
      { id: '11.4', text: 'Revise ajuste apropiado de talón : ( 3.62 a 3.75 in. 60in. Corta ) ( 3.75 a 3.88 in. 60in. Larga ) ( Vea M7.0-6435-001 )', value: 2},
      { id: '11.5', text: 'Revise operación de los rodillos entrada/salida', value: 1},
      { id: '11.6', text: 'Revise ajuste de la tuerca del kit tenon (DESAJUSTADA)', value: 2},
      { id: '11.7', text: 'Revise ensambles caster (tensión, operación)', value: 2}
    ]
  },
  {
    id: 's12',
    title: '12.- Revision operacional y prueba de manejo',
    items: [
      { id: '12.1', text: 'Revise distancia de frenado  - Aprox. 4’ ft.', value: 3 },
      { id: '12.2', text: 'Revise apropiada operacion del claxon', value: 3 },
      { id: '12.3', text: 'Revise operación apropiada de switches en el  control pod', value: 3 },
      { id: '12.4', text: 'Revise corte de levante', value: 3 },
      { id: '12.5', text: 'Revise operación de switch de seguridad reversa ', value: 3}
    ]
  }
];

export const PUNTUACION_MAXIMA = 110;