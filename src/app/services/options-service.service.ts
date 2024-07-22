import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class OptionsServiceService {

  constructor(private firestore: AngularFirestore) { }

  getOptionsBySubCategoryId(subCategoryId: string): Observable<Service[]> {
    return this.firestore.collection<Service>('sevicios', ref => ref.where('subCategoryId', '==', subCategoryId)).valueChanges();
  }
}
