export const CHECKLIST_TSP = [
    {
    id: 's1' ,
    title: '1.- Inspección visual',
    items: [
      { id: '1.1', text: 'Revise estado de la cabina y unidad de potencia ', value: 2 },
      { id: '1.2', text: 'Fugas visibles al realizar la inspección', value: 1},
      { id: '1.3', text: 'Revise placa de datos y calcomanías de seguridad ( Están en su lugar? )', value: 3},
      { id: '1.4', text: 'Revise puertas por daños y tornillos perdidos', value: 2}, 
      { id: '1.5', text: 'Revise por accesorios de seguridad que no operen (ej.estrobo, alarma de viaje, etc.)', value: 3},
      { id: '1.6', text: 'Revise condiciones del mástil auxiliar', value: 2}
    ]
  },
  {
    id: 's2',
    title: '2.- Baterías y cables',
    items: [
      { id: '2.1', text: 'Revise por conector de batería roto ( Qué tipo de daño )', value: 2 },
      { id: '2.2', text: 'Cables o arneses expuestos ( Cuán expuestos o dañados )', value: 2 },
      { id: '2.3', text: 'Opera desconectador de emergencia o es inoperable', value: 3}
    ]
  },
  {
    id: 's3',
    title: '3.- Inspección de lubricacion y limpieza',
    items: [
      { id: '3.1', text: 'Revise lubricación de todos los puntos lubricables (Reporte graseras perdidas y algún daño colateral) ', value: 2 },
      { id: '3.2', text: 'Revise por suciedad excesiva dentro de la unidad de potencia', value: 1 },
      { id: '3.3', text: 'Revise lubricación de canales de mástil, cremallera y engranes de dirección', value: 3 }
    ]
  },
  {
    id: 's4',
    title: '4.- Motor(es) y Bomba(s) Hidráulicos',
    items: [
      { id: '4.1', text: 'Revise por exceso de fugas en las bombas ( Cuan mal y prolongada ha estado presente)', value: 2 },
      { id: '4.2', text: 'Revise estado y montaje del motor de bomba', value: 3 },
      { id: '4.3', text: 'Cubiertas de motores en su lugar?', value: 1},
      { id: '4.4', text: 'Revise estado  de conexiones de cables al motor ', value: 2}
    ]
  },
  {
    id: 's5',
    title: '5.-  Motor y Unidad de Tracción',
    items: [
      { id: '5.1', text: 'Revise sujeción y estado del motor de tracción ', value: 3 },
      { id: '5.2', text: 'Revise nivel de aceite de unidad de tracción (Estime que cantidad de aceite tiene)', value: 3 },
      { id: '5.3', text: 'Revise por unidad de  tracción suelta (Específique cuanto movimiento)'  , value: 3 },
      { id: '5.4', text: 'Revise por fugas excesivas de aceite ( Cuán prolongadas han sido? )', value: 2},
      { id: '5.5', text: 'Cubierta del motor en su lugar?', value: 1}
    ]
  },
  {
    id: 's6',
    title: '6.- Cables de Alimentación y de control',
    items: [
      { id: '6.1', text: 'Revise por cables expuestos', value: 3 },
      { id: '6.2', text: 'Revise por cables de alimentación y control sueltos', value: 3 },
      { id: '6.3', text: 'Revise por cables torcidos o dañados en mástil', value: 3}
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
      { id: '8.1', text: 'Revise por desgaste excesivo en zapatas de freno (no menos de 2.8 mm)', value: 2 },
      { id: '8.2', text: 'Revise ajustes del sistema de frenos (air gap y torque gap)', value: 3 },
      { id: '8.3', text: 'Revise operación del pedal de freno', value: 2}
    ]
  },
  {
    id: 's9',
    title: '9.- Direccion',
    items: [
      { id: '9.1', text: 'Revise por apropiada reacción del timón de dirección (Encoder opera correctamente)', value: 3 },
      { id: '9.2', text: 'Revise sujeción y condiciones del motor de dirección (Desgaste de escobillas en equipos DC)', value: 3 }
    ]
  },
  {
    id: 's10',
    title: '10.- Sistema Hidráulico',
    items: [
      { id: '10.1', text: 'Revise por fugas todos los pistones (Específique cual pistón )', value: 2 },
      { id: '10.2', text: 'Revise nivel de aceite hidráulico', value: 3 },
      { id: '10.3', text: 'Revise si el filtro y aceite hidráulico, han sido cambiados en un apropiado intervalo de tiempo', value: 2 },
      { id: '10.4', text: 'Revise por fugas alrededor del block de valvúlas, depósito de aceite y unidad de potencia ', value: 2}
    ]
  },
  {
    id: 's11',
    title: '11.-  Ensamble de Mástil y Mástil Aux',
    items: [
      { id: '11.1', text: 'Revise ajuste de horquillas de mástil auxiliar (63.6 a 76.2 mm)', value: 2 },
      { id: '11.2', text: 'Revise mástil por estado de rodamientos y desgaste de canales del mástil', value: 3 },
      { id: '11.3', text: 'Revise cadenas por elongamiento con el medidor de cadenas', value: 3,
        subItems: [
            { id: '11.3.1', text: 'Uso de herramienta (flexo,escala,manual)', value: 1},
            { id: '11.3.2', text: 'Detro de tolerancia de 3% y/o reportado en reporte servicio', value: 1},
            { id: '11.3.3', text: 'Condiciones de limpieza y lubricacion (suciedad, oxidacion)', value: 1},

        ]
       },
      { id: '11.4', text: 'Revisar los cilindros de levante (Especificar tipo de daño )', value: 3},
      { id: '11.5', text: 'Revise por tornillos rotos o perdidos en el montaje de los cilindros', value: 3},
      { id: '11.6', text: 'Revise por tornillos de unidad de poder rotos o perdidos (Revisar torque)', value: 3},
      { id: '11.7', text: 'Revise topes poly en ensamble de mástil ( Aguno dañado? )', value: 2},
      { id: '11.8', text: 'Revise por desajuste en cadenas o anclajes de la parte inferior (460 mm, del piso a la base de plataforma)', value: 3,
        subItems: [
            { id: '11.8.1', text: 'Tension de cadenas (12mm/0,5 in)', value: 1},
            { id: '11.8.2', text: 'Ajuste carro de horquillas (talon a piso)', value: 1},
            { id: '11.8.3', text: 'Ajuste escalonamiento de secciones', value: 1},
            { id: '11.8.4', text: 'Explicacion de ajuste', value: 1},
        ]
      },
      { id: '11.9', text: 'Revise por deterioro de cables ( Cuán mal es el deterioro ? )', value: 3},
      { id: '11.10', text: 'Revise por deterioro de mangueras ( Cuán mal es el deterioro ? )', value: 3,
        subItems: [
            { id: '11.10.1', text: 'Cortes o rasgaduras en la cubierta exterior (Forro)', value: 1},
            { id: '11.10.2', text: 'Con arrugas, ampollas o torceduras', value: 1},
            { id: '11.10.3', text: 'Conexiones (terminales) corroídas o con fugas', value: 1},
            { id: '11.10.4', text: 'Tensión de la misma (Estiramiento)', value: 1},
            { id: '11.10.5', text: 'Condición de poleas guía', value: 1},
        ]
      },
      { id: '11.11', text: 'Revise los resortes de los topes del mástil', value: 1}
    ]
  },
  {
    id: 's12',
    title: '12.- Revision operacional y prueba de manejo',
    items: [
      { id: '12.1', text: 'Distancia de frenado 2.5 a 3.0 m', value: 3 },
      { id: '12.2', text: 'Revise por apropiada operación de claxon', value: 3 },
      { id: '12.3', text: 'Revise corte de velocidad cuando levante mástil', value: 3 },
      { id: '12.4', text: 'Revise por algún problema en el sistema ( Identifique si necesita recalibración )', value: 2 },
      { id: '12.5', text: 'Revise por apropiada operación de puertas en posición cerrada / abierta', value: 3},
      { id: '12.6', text: 'Revise operación adecuada del asiento del operador (switches, mecanismo de rotación y sensores) ', value: 3},
      { id: '12.7', text: 'Revise funcionamiento de luces de cabina y accesorios ', value: 2}
    ]
  }
]


export const PUNTUACION_MAXIMA = 110;