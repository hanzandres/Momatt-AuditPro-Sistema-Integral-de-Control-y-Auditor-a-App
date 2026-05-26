// importamos todos diccionarios 
import { CHECKLIST_RR, PUNTUACION_MAXIMA as MAX_RR } from './ChecklistRR';
import { CHECKLIST_SC, PUNTUACION_MAXIMA as MAX_SC } from './ChecklistSC';
import { CHECKLIST_FC, PUNTUACION_MAXIMA as MAX_FC } from './ChecklistFC';
import { CHECKLIST_FG, PUNTUACION_MAXIMA as MAX_FG } from './ChecklistFG';
import { CHECKLIST_RC, PUNTUACION_MAXIMA as MAX_RC } from './ChecklistRC';
import { CHECKLIST_SP, PUNTUACION_MAXIMA as MAX_SP } from './ChecklistSP';
import { CHECKLIST_PPT, PUNTUACION_MAXIMA as MAX_PPT } from './ChecklistPPT';
import { CHECKLIST_SX, PUNTUACION_MAXIMA as MAX_SX } from './ChecklistSX';
import { CHECKLIST_TSP, PUNTUACION_MAXIMA as MAX_TSP } from './ChecklistTSP';

// lista de modelos que apareceran en el menu desplegable de la APP
export const MODELOS_DISPONIBLES = [
    'RR','SC','FC','FG','RC','SP','PPT','SX','TSP'
];

// funcion para que eliga el diccionario correcto desde la APP
export const getChecklistByModel = (modelo: string) => {
    switch (modelo){
        case 'RR':
            return { preguntas: CHECKLIST_RR, maximo: MAX_RR};
        case 'SC':
            return { preguntas: CHECKLIST_SC, maximo: MAX_SC};
        case 'FC':
            return { preguntas: CHECKLIST_FC, maximo: MAX_FC};
        case 'FG': 
            return { preguntas: CHECKLIST_FG, maximo: MAX_FG};
        case 'RC':
            return { preguntas: CHECKLIST_RC, maximo: MAX_RC};
        case 'SP': 
            return { preguntas: CHECKLIST_SP, maximo: MAX_SP};
        case 'PPT':
            return { preguntas: CHECKLIST_PPT, maximo: MAX_PPT};
        case 'SX': 
            return { preguntas: CHECKLIST_SX, maximo: MAX_SX};
        case 'TSP': 
            return { preguntas: CHECKLIST_TSP, maximo: MAX_TSP};

        default: // por si algun error no encuentra el modelo devuelve vacio para no crashear
            return { preguntas: [], maximo: 0};
    }
}