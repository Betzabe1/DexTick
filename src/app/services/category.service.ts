// category.service.ts
import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private afs: AngularFirestore) {}

  getCategories() {
    return this.afs.collection<Category>('categories').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addCategory(category: Category) {
    return this.afs.collection('categories').add(category);
  }

  updateCategory(id: string, category: Category) {
    return this.afs.doc(`categories/${id}`).update(category);
  }

  deleteCategory(id: string) {
    return this.afs.doc(`categories/${id}`).delete();
  }
}
