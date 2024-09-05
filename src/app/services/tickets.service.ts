import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private firestore: AngularFirestore) { }

  // Crear un nuevo ticket en la subcolección de un usuario y obtener el ID del ticket
  async createPedidoInSubcollection(userId: string, ticket: Ticket): Promise<string> {
    try {
      const ticketsCollection = this.firestore.collection(`users/${userId}/tickets`);
      const ticketDocRef = await ticketsCollection.add({
        ...ticket,
        userId: userId, // Asegúrate de incluir el userId aquí
        id: '' // Puedes eliminar esta línea si ya manejas el ID de manera automática
      });
      const ticketId = ticketDocRef.id;
      await ticketDocRef.update({ id: ticketId });
      return ticketId;
    } catch (error) {
      console.error('Error al guardar el ticket:', error);
      throw error;
    }
  }
  // tickets.service.ts
updateTicketStatus(ticketId: string, newStatus: string): Promise<void> {
  const path = `tickets/${ticketId}`;
  return this.firestore.doc(path).update({ estado: newStatus });
}


  // Obtener todos los tickets de todas las subcolecciones ordenados por fecha descendente
  getAllTickets(): Observable<Ticket[]> {
    return this.firestore.collectionGroup('tickets', ref => ref.orderBy('fecha', 'desc')).valueChanges() as Observable<Ticket[]>;
  }

// Obtener todos los tickets de un usuario ordenados por fecha descendente
getTickets(userId: string): Observable<Ticket[]> {
  return this.firestore.collection(`users/${userId}/tickets`, ref => ref.orderBy('fecha', 'desc')).valueChanges() as Observable<Ticket[]>;
}

  // Obtener un ticket específico por ID
  getTicketById(userId: string, ticketId: string): Observable<Ticket | undefined> {
    return this.firestore.collection(`users/${userId}/tickets`).doc(ticketId).valueChanges() as Observable<Ticket | undefined>;
  }

  // Actualizar un ticket
  updateTicket(userId: string, ticketId: string, ticket: Ticket): Promise<void> {
    return this.firestore.collection(`users/${userId}/tickets`).doc(ticketId).update(ticket);
  }

  // Eliminar un ticket
  deleteTicket(userId: string, ticketId: string): Promise<void> {
    return this.firestore.collection(`users/${userId}/tickets`).doc(ticketId).delete();
  }

  // Obtener datos de una colección
  getCollectionData<T>(path: string): Observable<T[]> {
    return this.firestore.collection<T>(path).valueChanges();
  }

  async getUid(): Promise<string> {
    return 'user-uid';
  }
  async getDocument<T>(path: string): Promise<T> {
    const docRef = this.firestore.doc<T>(path).ref;
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data() as T;
    } else {
      throw new Error('¡El documento no existe!');
    }
  }

  async updateDocument(path: string, data: any) {
    return await this.firestore.doc(path).update(data);
  }




}
