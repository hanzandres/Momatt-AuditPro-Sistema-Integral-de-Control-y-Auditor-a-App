export const CHECKLIST_FG = [
    {
    id: 's1' ,
    title: '1.- Inspección visual',
    items: [
      { id: '1.1', text: 'Revise placa de datos y calcomanías de seguridad ( Están en su lugar?) ', value: 3 },
      { id: '1.2', text: 'Revise torque de birlos y estado de llantas en gral. (Específique que tipo de daño)', value: 2},
      { id: '1.3', text: 'Rines por abocardado, masas abocardadas y con birlos soldados', value: 3},
      { id: '1.4', text: 'Revise respaldo de carga por daños', value: 1}
    ]
  },
  {
    id: 's2',
    title: '2.- Batería y Sit de enecendido',
    items: [
      { id: '2.1', text: 'Revise estado de la batería ( sujeción y sulfatación)', value: 2 },
      { id: '2.2', text: 'Revise votaje de marcha y carga', value: 3 },
      { id: '2.3', text: 'Revise por cables o arneses expuestos', value: 2 },
      { id: '2.4', text: 'Revise por correcta operación de motor de arraque ', value: 2},
      { id: '2.5', text: 'Revise por correcta operación del alternador y estado de la banda', value: 2},
      { id: '2.6', text: 'Revise estado de las bujías', value: 3}
    ]
  },
  {
    id: 's3',
    title: '3.- Inspección de lubricacion y limpieza',
    items: [
      { id: '3.1', text: 'Todas las graseras lubricadas ( Reporte cuantas perdidas)', value: 2 },
      { id: '3.2', text: 'Revise por lubricación en ruedas de dirección', value: 2 },
      { id: '3.3', text: 'Revise por acumulación de basura', value: 1 }
    ]
  },
  {
    id: 's4',
    title: '4.- Motor',
    items: [
      { id: '4.1', text: 'Revise por bajo nivel de aceite ( estado de aceite y filtro )', value: 2 },
      { id: '4.2', text: 'Compresión de motor. (Despues de 10,000 horas) (105-145 Psi)', value: 3 },
      { id: '4.3', text: 'Revise ajuste de valvúlas  ( 0.38mm (0.015pulg ) (Despues de 10,000 horas)', value: 3},
      { id: '4.4', text: 'Lavado general del equipo', value: 1},
      { id: '4.5', text: 'Inspección de líneas de escape y catalizador ', value: 3},
      { id: '4.6', text: 'Revise el estado de las mangueras de enfriamiento que van a la trasmision', value: 3}
    ]
  },
  {
    id: 's5',
    title: '5.- Sistema de Enfriamiento',
    items: [
      { id: '5.1', text: 'Revise por bajo nivel de refrigerante', value: 2 },
      { id: '5.2', text: 'Revise operación correcta del radiador (Retirar tolva de plastico del ventilador,tapón, fijación, fugas y limpieza )', value: 3 }
    ]
  },
  {
    id: 's6',
    title: '6.- Combustible Gasolina/LPG',
    items: [
      { id: '6.1', text: 'Revise por fugas en tubos, conexiones y tapón del tanque (Gasolina)', value: 3 },
      { id: '6.2', text: 'Revise por fugas o desgaste de mangueras y conexiones (LPG )', value: 2 },
      { id: '6.3', text: 'Revise por daño el montaje del tanque (LPG)', value: 1 },
      { id: '6.4', text: 'limpieza y remplazo del filtro (LPG)', value: 3},
      { id: '6.5', text: 'Asegúrese que se purgue el evaporizador en cada MP (LPG)', value: 3}
    ]
  },
  {
    id: 's7',
    title: '7.- Transmicion y Diferencial',
    items: [
      { id: '7.1', text: 'Revise por bajo nivel de aceite para transmisión', value: 3 },
      { id: '7.2', text: 'Aplicapruebas de presión de la transmisión. (Despues de 10,000 horas)', value: 3 },
      { id: '7.3', text: 'Revise ajuste de pedal de acercamiento', value: 3},
      { id: '7.4', text: 'Revise diferencial por bajo nivel de aceite', value: 2}
    ]
  },
  {
    id: 's8',
    title: '8.- Frenos',
    items: [
      { id: '8.1', text: 'Revise por bajo nivel de fluído de frenos', value: 2 },
      { id: '8.2', text: 'Revise apropiada operación del freno de estacionamiento', value: 3 },
      { id: '8.3', text: 'Revise que los frenos no tengan una acción irregular (Que se jale o tire a la derecha o izquierda)', value: 2}
    ]
  },
  {
    id: 's9',
    title: '9.- Direccion',
    items: [
      { id: '9.1', text: 'Revise estado de la unidad de dirección (orbitrol; especifique por algun daño)', value: 2 },
      { id: '9.2', text: 'Revisar bujes del puente de dirección', value: 3 },
      { id: '9.3', text: 'Ajuste del contrapeso', value: 2 },
      { id: '9.4', text: 'Revise por apropiada reacción del timón de dirección (Bujes de dirección)', value: 3},
      { id: '9.5', text: 'Revise operación adecuada de cilindro de dirección (específique por algún daño)', value: 3}
    ]
  },
  {
    id: 's10',
    title: '10.- Hidráulico',
    items: [
      { id: '10.1', text: 'Revise nivel de aceite y estado de filtro', value: 2 },
      { id: '10.2', text: 'Revise por fugas en cilindros de levante', value: 3 },
      { id: '10.3', text: 'Revise por funcionamiento adecuado de la bomba hidráulica (Presenta alguna fuga?)', value: 3 },
      { id: '10.4', text: 'Revise montaje de cilindros', value: 3}
    ]
  },
  {
    id: 's11',
    title: '11.- Ensamble de mastil',
    items: [
      { id: '11.1', text: 'Revise horquillas con el medidor de  horquillas Crown, Juego del cilindro del desplazador, fracturas y desgastes en general.', value: 2 },
      { id: '11.2', text: 'Revise apropiada lubricación de canales de mástil ', value: 2 },
      { id: '11.3', text: 'Revise cadenas por elongamiento con el medidor de cadenas ', value: 3,
        subItems: [
            { id: '11.3.1', text: 'Uso de herramienta (flexo,escala,manual)', value: 1},
            { id: '11.3.2', text: 'Detro de tolerancia de 3% y/o reportado en reporte servicio.', value: 1},
            { id: '11.3.3', text: 'Condiciones de limpieza y lubricacion (suciedad, oxidacion)', value: 1}
        ]
       },
      { id: '11.4', text: 'Revise tensión de tornillos de montaje del mástil y Juego en las chumaceras del mismo.', value: 3},
      { id: '11.5', text: 'Revise ajuste de cadenas o anclajes de la parte inferior y desajuse en las rodajas del carro de horquillas.', value: 1,
        subItems: [
            { id: '11.5.1', text: 'Tension de cadenas (12mm/0,5 in)', value: 1},
            { id: '11.5.2', text: 'Ajuste carro de horquillas (talon a piso)', value: 1},
            { id: '11.5.3', text: 'Ajuste escalonamiento de secciones', value: 1},
            { id: '11.5.4', text: 'Explicacion de ajuste', value: 1}
        ]
      },
      { id: '11.6', text: 'Revise condición de  mangueras del mástil.', value: 2,
        subItems: [
            { id: '11.6.1', text: 'Cortes o rasgaduras en la cubierta exterior (Forro)', value: 1},
            { id: '11.6.2', text: 'Con arrugas, ampollas o torceduras.', value: 1},
            { id: '11.6.3', text: 'Conexiones (terminales) corroídas o con fugas', value: 1},
            { id: '11.6.4', text: 'Tensión de la misma (Estiramiento)', value: 1},
            { id: '11.6.5', text: 'Condición de poleas guía', value: 1}
        ]
      }
    ]
  },
  {
    id: 's12',
    title: '12.- Revision operacional y prueba de manejo',
    items: [
      { id: '12.1', text: 'Revise apropiada operación del claxon', value: 2 },
      { id: '12.2', text: 'Revise operación adecuada de medidor de horas e indicadores', value: 2 },
      { id: '12.3', text: 'Revise por accesorios de seguridad que no operen  (sist.KOPS,estrobo, alarma de viaje, etc.)', value: 3 },
      { id: '12.4', text: 'Revisar por algun daño en el sistema', value: 2 },
      { id: '12.5', text: 'Revise operación de las luces direccionales, freno, cuartos y de trabajo', value: 2}
    ]
  },
]

export const PUNTUACION_MAXIMA = 126;