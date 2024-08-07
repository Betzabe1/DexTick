export interface Ticket{
  id:string;
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
  Total:string;
}

export type EstadoPedido="enviado"|"visto"|"proceso"|"finalizado";
