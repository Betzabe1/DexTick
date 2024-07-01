import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @Input() control!: FormControl;
  @Input() type!: string;
  isPassword: boolean = true;
  hide: boolean = true;
  currentUser: firebase.User | null = null;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  firebaseSvc = inject(UserService);
  utilSvc = inject(UtilService);

  constructor(private router: Router) {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig);
    }
  }

  async ngOnInit() {
    this.type = 'password';
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user;
      if (this.currentUser) {
        this.getUserInfo(this.currentUser.uid);
      }
    });
  }

  showOrHidePassword() {
    this.hide = !this.hide;
    this.type = this.hide ? 'password' : 'text';
  }

  async logInUser(): Promise<void> {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    if (email && password) {
      try {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        this.currentUser = userCredential.user;
        await this.getUserInfo(userCredential.user?.uid || '');
      } catch (error) {
        console.error(error);
        this.utilSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }
    }
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      await this.logInUser();

      loading.dismiss();
    }
  }

  async getUserInfo(uid: string) {
    const loading = await this.utilSvc.loading();
    await loading.present();

    const path = `users/${uid}`;
    try {
      const user = await this.firebaseSvc.getDocument(path);
      this.utilSvc.saveInLocalStorage('user', user);
      this.redirectBasedOnRole(user.role);
      this.form.reset();
      this.utilSvc.presentToast({
        message: `Te damos la bienvenida ${user.name}`,
        duration: 2000,
        color: 'primary',
        position: 'middle',
        icon: 'person-circle-outline'
      });
    } catch (error) {
      console.error(error);
      this.utilSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  redirectBasedOnRole(role: 'client' | 'agent' | 'admin') {
    switch (role) {
      case 'client':
        this.router.navigateByUrl('/tabs/home-user');
        break;
      case 'agent':
        this.router.navigateByUrl('/tabs-agent/home-agent');
        break;
      case 'admin':
        this.router.navigateByUrl('/tabs-admin/home-admin');
        break;
      default:
        console.error('Error tipo de usuario no encontrado');
    }
  }
}
