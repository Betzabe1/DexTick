import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private firebaseauthService: UserService,
    private firestoreService: UtilService,
    private notificationService: NotificationService,
    private alertController: AlertController
  ) {
    this.form = new FormGroup({
      uid: new FormControl(''),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      empresa: new FormControl(''),
      tel: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', [Validators.minLength(6)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      role: new FormControl('client'),
    });
  }

  user(): User {
    return this.firestoreService.getFormLocalStorage('user');
  }

  async ngOnInit() {
    // Configura la persistencia de sesión
    try {
      await this.afAuth.setPersistence('local');
    } catch (error) {
      console.error('Error setting persistence:', error);
    }
  }



  async redirectToPage() {
    await this.router.navigate(['tabs-admin/usuarios']);
  }
}
