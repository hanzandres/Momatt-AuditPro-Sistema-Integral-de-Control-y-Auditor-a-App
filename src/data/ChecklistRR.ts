export const CHECKLIST_RR = [
  {
    id: 's1' ,
    title: '1.- Inspección visual',
    items: [
      { id: '1.1', text: 'Placas pivote atascadas y sin movimiento', value: 2 },
      { id: '1.2', text: 'Estabilizadores doblados', value: 2},
      { id: '1.3', text: 'Estado de ruedas en gral', value: 1},
      { id: '1.4', text: 'Revise placas de datos y calcomanias de seguridad', value: 3},
      { id: '1.5', text: 'Revise respaldos de carga por daños o tornillos perdidos', value: 1},
      { id: '1.6', text: 'Revise por si alguno de los accesorios de seguridad no opera', value: 3}

    ]
  },
  {
    id: 's2',
    title: '2.- Baterías y cables',
    items: [
      { id: '2.1', text: 'Conectores de bateria rotos (que tipo de daño)', value: 2 },
      { id: '2.2', text: 'Arneses o cables expuestos (cuantos expuestos o que daño) ', value: 2 },
      { id: '2.3', text: 'Desconector de emergencia trabaja correctamente ', value: 3 },
    ]
  },
  {
    id: 's3',
    title: '3.- Inspección de lubricacion y limpieza',
    items: [
      { id: '3.1', text: 'Todas las graseras lubricadas', value: 2 },
      { id: '3.2', text: 'Revise por fugas en Gral', value: 2 },
      { id: '3.3', text: 'Revise exceso de basura debajo de la consola y piso del operador', value: 2 },
      { id: '3.4', text: 'Revise lubricacion de palanca multifunciones', value: 3 },
      { id: '3.5', text: 'Revise el torque adecuado de tornilleria en componentes', value: 3 }
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
    title: '5.- Unidad y Motores de traccion',
    items: [
      { id: '5.1', text: 'Revise sujecion y estado del motor de tracion (Revisar ecobillas en equipos DC)', value: 3 },
      { id: '5.2', text: 'Revise operacion de ventiladores de comportamiento del motor traccion (detalle)', value: 3 },
      { id: '5.3', text: 'Revse nivel de aceite de unidad de traccion (Estime cuanto aceite tiene)'  , value: 3 },
      { id: '5.4', text: 'Revise lubricacion de la bomba de aceite dentro de la unidad (ha sido revisado antes? )', value: 3},
      { id: '5.5', text: 'Revise por la unidad de traccion (sin movimiento)', value: 3},
      { id: '5.6', text: 'Revise por fugas excesivas de aceite o basura acumulada', value: 2},
      { id: '5.7', text: 'Revise aguste de articulacion y tuerca ( LH lado: Ajuste .06 in + 0.00 - 0.02 in.),( RH lado: Ajuste distancia 3.5 in + 0.00 - 0.04 in)', value: 3,
        subItems: [
          { id: '5.7.1', text: 'Contar con toda la herramienta necesaria para ajuste', value: 1 },
          { id: '5.7.2', text: 'Describe el procedimiento de ajuste completo y de manera correcta', value: 1},
          { id: '5.7.3', text: '¿Quién valida el ajuste actual?', value: 1}
        ]
      }
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
      { id: '8.1', text: 'Revise visualmente por desgaste excesivo en zapatas de freno (No menos de .110 in)', value: 3 },
      { id: '8.2', text: 'Asegurese que el "torque gap" sea de acuerdo a la capacidad del equipo', value: 2 },
      { id: '8.3', text: 'Revise el "air gap" .040 in (maximo)', value: 2}
    ]
  },
  {
    id: 's9',
    title: '9.- Direccion',
    items: [
      { id: '9.1', text: 'Revise apropiada operacion del timon de dirreccion', value: 3 },
      { id: '9.2', text: 'Asegurese que la unidad de control de dirrecion no presente fugas excesivas', value: 2 },
      { id: '9.3', text: 'Revise sujecion y estado del motor hidrahulico de direccion (cuenta con ambos tornillos?', value: 2 },
      { id: '9.4', text: 'Revise correcta operacion del motor electrico de dirreccion (Equipos que AC que aplique', value: 2}
    ]
  },
  {
    id: 's10',
    title: '10.- Sistema Hidráulico',
    items: [
      { id: '10.1', text: 'Revise por fugas todos los cilindros y conexiones (Especifique cual cilindro y cual conexion)', value: 2 },
      { id: '10.2', text: 'Revise nivel de aceite hidrahulico(no opere sin tapon)', value: 3 },
      { id: '10.3', text: 'Revise filtro (tiene fecha de cambio?)', value: 1 },
      { id: '10.4', text: 'Revise si se han realizado cambios de aceite de cada 2000 hrs de operacion', value: 3}
    ]
  },
  {
    id: 's11',
    title: '11.- Ensamble de mastil',
    items: [
      { id: '11.1', text: 'Revise horquillas con el medidor de hosquillas Crown', value: 2 },
      { id: '11.2', text: 'Revise mastil por apropiada lubricacion y rodamientos en buen estado', value: 3 },
      { id: '11.3', text: 'Revise las cadenas por elongamiento con el medidor de cadenas', value: 3, 
        subItems: [
          { id: '11.3.1', text: 'Uso de herramienta (flexo,escala,manual)', value: 1},
          { id: '11.3.2', text: 'Detro de tolerancia de 3% y/o reportado en reporte servicio', value: 1},
          { id: '11.3.3', text: 'Condiciones de limpieza y lubricacion (suciedad, oxidacion)', value: 3}
        ]
      },
      { id: '11.4', text: 'Revise pines del reach rotos (cuantos estan rotos)', value: 3 },
      { id: '11.5', text: 'Revise el apropiado alcance del pantografo (golpea el pantografo?)', value: 1 },
      { id: '11.6', text: 'Revise los topes poly en el ensamble reach (alguno dañado)', value: 2 },
      { id: '11.7', text: 'Revise anclajes y agustes de cadenas (cuanto ajuste)', value: 3,
        subItems: [
          { id: '11.7.1', text: 'Tension de cadenas (12mm/0,5 in)',value: 1},
          { id: '11.7.2', text: 'Ajuste carro de horquillas (talon a piso)',value: 1},
          { id: '11.7.3', text: 'Ajuste escalonamiento de secciones',value: 1},
          { id: '11.7.4', text: 'Explicacion de ajuste',value: 1}
        ]
       },
      { id: '11.8', text: 'Revise por cables (cuan malo es el desgaste)', value: 3 },
      { id: '11.9', text: 'Revise mangueras deterioradas (cuan malo es el desgaste)', value: 3,
        subItems: [
          { id: '11.9.1', text: 'Cortes o rasgaduras en la cubierta exterior (Forro)',value: 1},
          { id: '11.9.2', text: 'Con arrugas, ampollas o torceduras.', value: 1},
          { id: '11.9.3', text: 'Conexiones (terminales) corroídas o con fugas', value: 1},
          { id: '11.9.4', text: 'Tensión de la misma (Estiramiento)', value: 1},
          { id: '11.9.5', text: 'Condición de poleas guía', value: 1}
        ]
      },
      { id: '11.10', text: 'Revise los resortes de los topes del mastil', value: 1}
    ]
  },
  {
    id: 's12',
    title: '12.- Revision operacional y prueba de manejo',
    items: [
      { id: '12.1', text: 'Revise distancia de frenado - Aprox 7-9.5 ft vea M5.0-1452-001', value: 3 },
      { id: '12.2', text: 'Revise apropiada operacion del claxon', value: 3 },
      { id: '12.3', text: 'Revise cortes de velocidad cuando levanta el equipo', value: 3 },
      { id: '12.4', text: 'Revise operacion de la barra de entrada', value: 3 },
      { id: '12.5', text: 'Revisar por algun problema del sistema', value: 2}
    ]
  },
];

export const PUNTUACION_MAXIMA = 134;