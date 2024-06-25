import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
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
  utilSvc = inject(UtilService);
  alertController=inject(AlertController);

  user(): User {
    return this.utilSvc.getFormLocalStorage('user');
  }
  constructor() {}
}
