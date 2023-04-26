export class PlayerResponse {
    jugador: string;
}

export class PlayerListResponse {
  listaJugadores: string[];
  listaDineros: number[];
  listaPosiciones: Coordenadas[];
}

export class Coordenadas{
  h: number;
  v: number;
}
export class PropertiesBoughtResponse {
  casillas:
    [
      {
        coordenadas: {
          h: number;
          v: number;
          _id: string;
        }
      cuatrimestre: number;
      jugador: string;
      partida: number;
      precio: number;
      nombre: string;
      __v: number;
      _id: string;
      }
    ]
}

export interface RandomCard{
    "cobrarPagarNada": string;
    "descripcion": string;
    "dinero": number;
    "nombre": string;
    "tipo": string;
    "_id": string;
}

export interface Party {
  casillaInfo: {
    _id: string;
    nombre: string;
    precioCompra: number;
    matricula: number;
    precio2M: number;
    precio3M: number;
    precio4M: number;
    devolucionMatricula: number;
    tipo: string;
    coordenadas: {
      h: number;
      v: number;
      _id: string;
    };
  }
}

export interface Propriety {
  casillaInfo: {
    _id: string;
    nombre: string;
    precioCompra: number;
    matricula: number;
    precio1C: number;
    precio2C: number;
    precio3C: number;
    precio4C: number;
    devolucionMatricula: number;
    tipo: string;
    coordenadas: {
      h: number;
      v: number;
      _id: string;
    };
    cuatrisemestre: number;
  }
}
