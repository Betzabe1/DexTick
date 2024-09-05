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
  selector: 'app-ticket-admin',
  templateUrl: './ticket-admin.page.html',
  styleUrls: ['./ticket-admin.page.scss'],
})
export class TicketAdminPage implements OnInit, OnDestroy {
  user: User = {} as User;
  ticketsNuevos: Ticket[] = [];
  ticketsProceso: Ticket[] = [];
  ticketsFinalizados: Ticket[] = [];
  tickets: Ticket[] = [];
  ticket: Ticket;
  private allTicketsSubscriber: Subscription | undefined;

  Estados: EstadoPedido[] = ['enviado', 'proceso', 'finalizado'];

  constructor(
    private ticketsService: TicketsService,
    private modalCtrl: ModalController,
    private firestoreService: UserService,
    private utilSvc: UtilService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.user.role === 'admin' || this.user.role === 'agent') {
      this.getAllTickets();
    } else {
      console.error('User does not have permission to view all tickets.');
    }
  }

  ngOnDestroy() {
    this.allTicketsSubscriber?.unsubscribe();
  }

  calculateTotal(subtotal: number, fechaPr: Date | null, fechaF: Date | null): number {
    if (fechaPr && fechaF) {
      const millisecondsPerHour = 1000 * 60 * 60;
      const durationInMilliseconds = fechaF.getTime() - fechaPr.getTime();
      const durationInHours = durationInMilliseconds / millisecondsPerHour;

      // Redondear a dos decimales y asegurar que no sea negativo
      const roundedDurationInHours = Math.max(Math.round(durationInHours * 100) / 100, 0);

      // Multiplicar el subtotal por la duración en horas
      return subtotal * roundedDurationInHours;
    }

    // Si no hay fechas de inicio y fin, retorna el subtotal
    return subtotal;
  }

  async getAllTickets() {
    console.log('Fetching all tickets...');
    this.allTicketsSubscriber = this.ticketsService.getAllTickets()
      .subscribe(tickets => {
        console.log('Tickets received:', tickets);

        const processedTickets = tickets.map(ticket => {
          if (ticket.fecha instanceof Timestamp) {
            ticket.fecha = ticket.fecha.toDate();
          }
          if (ticket.fechaP instanceof Timestamp) {
            ticket.fechaP = ticket.fechaP.toDate();
          }
          if (ticket.fechaF instanceof Timestamp) {
            ticket.fechaF = ticket.fechaF.toDate();
          }

          this.calculateTotalCost(ticket); // Calcular el costo total
          return ticket;
        });

        this.ticketsNuevos = this.processTickets(processedTickets, 'enviado');
        this.ticketsProceso = this.processTickets(processedTickets, 'proceso');
        this.ticketsFinalizados = this.processTickets(processedTickets, 'finalizado');
        this.tickets = this.ticketsNuevos;

        console.log('Filtered tickets:', {
          nuevos: this.ticketsNuevos,
          proceso: this.ticketsProceso,
          finalizados: this.ticketsFinalizados
        });
      }, error => {
        console.error('Error fetching all tickets:', error);
      });
  }

  private calculateTotalCost(ticket: Ticket) {
    // Convertir fechas a objetos Date si no son null
    const startDate = ticket.fechaPr ? new Date(ticket.fechaPr) : null;
    const endDate = ticket.fechaF ? new Date(ticket.fechaF) : null;

    // Convertir subtotal a número
    const subtotal = typeof ticket.subtotal === 'string' ? parseFloat(ticket.subtotal) : ticket.subtotal;

    if (startDate && endDate && !isNaN(subtotal)) {
      // Calcular el total basado en el tiempo transcurrido
      ticket.Total = this.calculateTotal(subtotal, startDate, endDate);
    } else {
      console.error('Fechas o subtotal no válidos', { startDate, endDate, subtotal });
      ticket.Total = subtotal; // Si no se puede calcular, devolver el subtotal
    }
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
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return date.toLocaleString('en-US', options).replace(',', '');
  }


  async cambiarEstado(ticket: Ticket, nuevoEstado: EstadoPedido) {
    console.log('Ticket recibido para actualizar:', ticket);

    const userId = ticket.userId;
    const ticketId = ticket.id;

    if (!userId || !ticketId) {
      console.error('userId o ticketId no están definidos');
      return;
    }

    const path = `users/${userId}/tickets/${ticketId}`;
    const fechaActual = new Date();
    const updateDoc: any = {
      estado: nuevoEstado,
    };

    if (nuevoEstado === 'proceso') {
      updateDoc.fechaPr = this.formatDate(fechaActual);
      updateDoc.emailA = this.user.email;
    }

    if (nuevoEstado === 'finalizado') {
      updateDoc.fechaF = this.formatDate(fechaActual);
      const fechaPr = ticket.fechaPr ? new Date(ticket.fechaPr) : null;
      const fechaF = fechaActual;
      const subtotal = typeof ticket.subtotal === 'string' ? parseFloat(ticket.subtotal) : ticket.subtotal;

      // Calcular el total basado en el tiempo transcurrido
      updateDoc.Total = this.calculateTotal(subtotal, fechaPr, fechaF);
    }

    try {
      await this.firestoreService.updateDocument(path, updateDoc);
      console.log('Estado del ticket actualizado con éxito');
      this.getAllTickets(); // Actualiza la lista de tickets
    } catch (error) {
      console.error('Error al actualizar el estado del ticket:', error);
    }
  }
  }

