import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'src/app/models/user.model';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketsService } from 'src/app/services/tickets.service';
import { Timestamp } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from 'src/app/components/image-modal/image-modal.component';

@Component({
  selector: 'app-tickets-user',
  templateUrl: './tickets-user.page.html',
  styleUrls: ['./tickets-user.page.scss'],
})
export class TicketsUserPage implements OnInit, OnDestroy {
  user: User = {} as User;
  ticketsNuevos: Ticket[] = [];
  ticketsProceso: Ticket[] = [];
  ticketsFinalizados: Ticket[] = [];
  tickets: Ticket[] = [];
  private nuevoSubscriber: Subscription | undefined;
  private procesoSubscriber: Subscription | undefined;
  private finalizadoSubscriber: Subscription | undefined;

  constructor(
    private firestorageService: TicketsService,
    private utilSvc: UtilService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.user = this.utilSvc.getFormLocalStorage('user');
    if (this.user.uid) {
      this.getTicketsNuevos();
    } else {
      this.loadUser().then(() => {
        if (this.user.uid) {
          this.getTicketsNuevos();
        } else {
          console.error('User UID is still not available.');
        }
      });
    }
  }

  async loadUser() {
    try {
      this.user.uid = await this.firestorageService.getUid();
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  ngOnDestroy() {
    this.nuevoSubscriber?.unsubscribe();
    this.procesoSubscriber?.unsubscribe();
    this.finalizadoSubscriber?.unsubscribe();
  }

  async getTicketsNuevos() {
    console.log('Fetching new tickets...');
    const path = `users/${this.user.uid}/tickets`;
    this.nuevoSubscriber = this.firestorageService.getCollectionData<Ticket>(path)
      .subscribe(res => {
        this.ticketsNuevos = this.processTickets(res, 'enviado');
        this.ticketsNuevos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()); // Ordenar por fecha descendente
        this.tickets = this.ticketsNuevos;
        console.log('Filtered new tickets:', this.ticketsNuevos);
      }, error => {
        console.error('Error fetching new tickets:', error);
      });
  }

  async getTicketsProceso() {
    console.log('Fetching tickets in process...');
    const path = `users/${this.user.uid}/tickets`;
    this.procesoSubscriber = this.firestorageService.getCollectionData<Ticket>(path)
      .subscribe(res => {
        this.ticketsProceso = this.processTickets(res, 'proceso');
        this.ticketsProceso.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()); // Ordenar por fecha descendente
        this.tickets = this.ticketsProceso;
        console.log('Filtered process tickets:', this.ticketsProceso);
      }, error => {
        console.error('Error fetching process tickets:', error);
      });
  }

  async getTicketsFinalizados() {
    console.log('Fetching finalized tickets...');
    const path = `users/${this.user.uid}/tickets`;
    this.finalizadoSubscriber = this.firestorageService.getCollectionData<Ticket>(path)
      .subscribe(res => {
        this.ticketsFinalizados = this.processTickets(res, 'finalizado');
        this.ticketsFinalizados.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()); // Ordenar por fecha descendente
        this.tickets = this.ticketsFinalizados;
        console.log('Filtered finalized tickets:', this.ticketsFinalizados);
      }, error => {
        console.error('Error fetching finalized tickets:', error);
      });
  }

  private processTickets(tickets: Ticket[], estado: string): Ticket[] {
    return tickets
      .filter(ticket => ticket.estado === estado)
      .map(ticket => {
        if (ticket.fecha instanceof Timestamp) {
          ticket.fecha = ticket.fecha.toDate();
        }
        if (ticket.fechaP instanceof Timestamp) {
          ticket.fechaP = ticket.fechaP.toDate();
        }
        return ticket;
      });
  }

  async doRefresh(event: any) {
    // Dependiendo del segmento seleccionado, actualiza los tickets correspondientes
    if (this.user.uid) {
      await Promise.all([
        this.getTicketsNuevos(),
        this.getTicketsProceso(),
        this.getTicketsFinalizados()
      ]);
      event.target.complete(); // Marca el evento de refresco como completado
    } else {
      event.target.complete(); // Marca el evento de refresco como completado incluso si no hay UID
    }
  }

  changeSegment(ev: any) {
    const opc = ev.detail.value;
    if (opc === 'enviados') {
      this.getTicketsNuevos();
    } else if (opc === 'proceso') {
      this.getTicketsProceso();
    } else if (opc === 'finalizados') {
      this.getTicketsFinalizados();
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
