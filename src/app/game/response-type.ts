export class PlayerResponse {
    jugador: string;
}

export class PlayerListResponse {
  listaJugadores: string[];
  listaDineros: number[];
  listaPosiciones: Coordenadas[];
}

export class PlayerListResponseEspera{
  nombresUsuarios: string[];
}
export class Coordenadas{
  h: number;
  v: number;
}
export class PropertyBoughtResponse {

  _id: string;
  coordenadas: {
    h: number;
    v: number;
    _id: string;
  };
  partida: number;
  jugador: string;
  precio: number;
  cuatrimestre: number;
  nombre: string;
  __v: number;
}

  export interface RandomCard{
    cobrarPagarNada: string;
    descripcion: string;
    dinero: number;
    nombre: string;
    tipo: string;
    _id: string;
}

export interface CartaSuerte{
  _id: string;
  nombre: string;
  descripcion: string;
  cobrarPagarNada: string;
  dinero: number;
  tipo: string;
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
    _id: string;
    nombre: string;
    descripcion: string;
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
    cuatrimestre: number;
    precioCompraCreditos: number;
}


export interface Partida{
  _id: string;
  id: number;
  nombreJugadores: string[];
  posicionJugadores: Coordenadas[];
  dineroJugadores: number[];
  numeroJugadores: number;
  dados: {dado1: number
          dado2: number
          jugador: string
          _id: string };
  }

export interface Product{
  _id: string;
  comprado: boolean;
  usado: boolean;
  nombre: string;
  imagen: string;
  precio: number;
}

export interface InfoPlayerResponse {
  nombreUser: string;
  correo: string;
  monedas: number;
  victorias: number;
  partidasJugadas: number;
  partidasEnJuego: number;
  token: string;
}
