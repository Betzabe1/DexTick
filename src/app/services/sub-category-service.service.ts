import { Injectable } from '@angular/core';
import { SubCategory } from '../models/subcategory.model';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  constructor(private afs: AngularFirestore) {}

  getSubCategoriesByCategory(categoryId: string) {
    return this.afs.collection<SubCategory>('subcategories', ref => ref.where('categoryId', '==', categoryId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as SubCategory;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  addSubCategory(subCategory: SubCategory) {
    return this.afs.collection('subcategories').add(subCategory);
  }

  updateSubCategory(id: string, subCategory: SubCategory) {
    return this.afs.doc(`subcategories/${id}`).update(subCategory);
  }

  deleteSubCategory(id: string) {
    return this.afs.doc(`subcategories/${id}`).delete();
  }
}
