export interface Party{
  casillaInfo: {
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
    };
  }
  
}
