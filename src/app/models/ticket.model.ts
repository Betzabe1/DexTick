export interface Ticket{
  id:string;
  userId: string;
  emailA?:string;
  emailClient:string;
  telClient:string;
  nameClient:string;
  servicio:string;
  desc:string;
  solicitud:string;
  estado:EstadoPedido;
  imagenes:string[];
  fecha:Date;
  fechaP:Date;
  fechaPr?:Date;
  fechaF?:Date;
  subtotal:number;
  Total?:number;

}

export type EstadoPedido="enviado"|"visto"|"proceso"|"finalizado";
