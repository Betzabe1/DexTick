import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EstadoPedido, Ticket } from 'src/app/models/ticket.model';
import { TicketsService } from 'src/app/services/tickets.service';
import { Timestamp } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-tickets-agent',
  templateUrl: './tickets-agent.page.html',
  styleUrls: ['./tickets-agent.page.scss'],
})
export class TicketsAgentPage implements OnInit, OnDestroy {
  user: User = {} as User;
  ticketsNuevos: Ticket[] = [];
  ticketsProceso: Ticket[] = [];
  ticketsFinalizados: Ticket[] = [];
  tickets: Ticket[] = []; // Para mostrar tickets filtrados
  private allTicketsSubscriber: Subscription | undefined;

  Estados: EstadoPedido[] = ['enviado', 'proceso', 'finalizado'];

  constructor(
    private ticketsService: TicketsService,
    private modalCtrl: ModalController,
    private firestoreService: UserService,
    private utilSvc: UtilService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtener el usuario del almacenamiento local
    if (this.user.role === 'admin' || this.user.role === 'agent') {
      this.getAllTickets();
    } else {
      console.error('User does not have permission to view all tickets.');
    }
  }

  ngOnDestroy() {
    this.allTicketsSubscriber?.unsubscribe();
  }

  async getAllTickets() {
    console.log('Fetching all tickets...');
    this.allTicketsSubscriber = this.ticketsService.getAllTickets()
      .subscribe(tickets => {
        console.log('Tickets received:', tickets);

        // Procesa los tickets directamente
        const processedTickets = tickets.map(ticket => {
          if (ticket.fecha instanceof Timestamp) {
            ticket.fecha = ticket.fecha.toDate();
          }
          if (ticket.fechaP instanceof Timestamp) {
            ticket.fechaP = ticket.fechaP.toDate();
          }
          return ticket;
        });

        this.ticketsNuevos = this.processTickets(processedTickets, 'enviado');
        this.ticketsProceso = this.processTickets(processedTickets, 'proceso');
        this.ticketsFinalizados = this.processTickets(processedTickets, 'finalizado');
        this.tickets = this.ticketsNuevos; // Inicializar con tickets nuevos por defecto

        console.log('Filtered tickets:', {
          nuevos: this.ticketsNuevos,
          proceso: this.ticketsProceso,
          finalizados: this.ticketsFinalizados
        });
      }, error => {
        console.error('Error fetching all tickets:', error);
      });
  }

  private processTickets(tickets: Ticket[], estado: string): Ticket[] {
    return tickets.filter(ticket => ticket.estado === estado);
  }

  changeSegment(ev: any) {
    const estado = ev.detail.value;
    if (estado === 'enviados') {
      this.tickets = this.ticketsNuevos;
    } else if (estado === 'proceso') {
      this.tickets = this.ticketsProceso;
    } else if (estado === 'finalizados') {
      this.tickets = this.ticketsFinalizados;
    }
  }

  async openImage(imageUrl: string) {
    const modal = await this.modalCtrl.create({
      component: ImageModalComponent,
      componentProps: {
        imageUrl: imageUrl,
      },
    });
    await modal.present();
  }

  private formatDate(date: Date): string {
    // Configura las opciones para mostrar solo fecha y hora
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',  // '2024'
      month: '2-digit', // '08'
      day: '2-digit',  // '13'
      hour: '2-digit',  // '13'
      minute: '2-digit', // '40'
      second: '2-digit', // '18'
      hour12: false // Usa el formato de 24 horas
    };
    return date.toLocaleString('en-US', options).replace(',', '');
  }

  async cambiarEstado(ticket: Ticket, nuevoEstado: EstadoPedido) {
    console.log('Ticket recibido para actualizar:', ticket);

    const userId = ticket.userId; // Obtén el userId del ticket
    const ticketId = ticket.id;   // Obtén el ID del ticket

    if (!userId || !ticketId) {
      console.error('userId o ticketId no están definidos');
      return;
    }

    const path = `users/${userId}/tickets/${ticketId}`;

    // Crea un objeto para actualizar
    const updateDoc: any = {
      estado: nuevoEstado,
    };

    if (nuevoEstado === 'proceso') {
      updateDoc.fechaPr = this.formatDate(new Date()); // Establece la fecha y hora actuales en formato deseado
      updateDoc.emailA = this.user.email; // Establece el email del usuario que hace el cambio
    }

    if (nuevoEstado === 'finalizado') {
      updateDoc.fechaF = this.formatDate(new Date());
    }

    try {
      // Actualiza el estado del ticket
      await this.firestoreService.updateDocument(path, updateDoc);
      console.log('Estado del ticket actualizado con éxito');
      this.getAllTickets(); // Actualiza la lista de tickets
    } catch (error) {
      console.error('Error al actualizar el estado del ticket:', error);
    }
  }




}
