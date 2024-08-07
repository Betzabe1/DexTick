import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketsService } from 'src/app/services/tickets.service';
import { Timestamp } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-tickets-agent',
  templateUrl: './tickets-agent.page.html',
  styleUrls: ['./tickets-agent.page.scss'],
})
export class TicketsAgentPage implements OnInit, OnDestroy {
  user: User = {} as User; // Asegúrate de obtener el rol del usuario correctamente
  ticketsNuevos: Ticket[] = [];
  ticketsProceso: Ticket[] = [];
  ticketsFinalizados: Ticket[] = [];
  tickets: Ticket[] = []; // Para mostrar tickets filtrados
  private allTicketsSubscriber: Subscription | undefined;

  constructor(
    private ticketsService: TicketsService,
    private modalCtrl: ModalController
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
            console.log('Converting timestamp to date:', ticket.fecha);
            ticket.fecha = ticket.fecha.toDate();
          }
          if (ticket.fechaP instanceof Timestamp) {
            console.log('Converting timestamp to date:', ticket.fechaP);
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

  async doRefresh(event: any) {
    await this.getAllTickets();
    event.target.complete(); // Marca el evento de refresco como completado
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
}
