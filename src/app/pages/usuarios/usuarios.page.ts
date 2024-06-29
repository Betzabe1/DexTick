import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    empresa: new FormControl(''),
    tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    password: new FormControl('', [Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    role: new FormControl('client'),
  });
  firebaseSvc = inject(UserService);
  user: User | null = null;
  users(): User {
    return this.utilSvc.getFormLocalStorage('user');
  }
  constructor(private afAuth: AngularFireAuth, private utilSvc: UtilService,  router:Router) {}

  ngOnInit() {
    this.afAuth.setPersistence('local')  // Esto asegura que la sesión persista incluso después de cerrar y abrir el navegador.
      .catch(error => {
        console.error('Error setting persistence:', error);
      });
  
    this.loadUser();
  }

  loadUser() {
    this.user = this.utilSvc.getFromLocalStorage('user');
  }


}
