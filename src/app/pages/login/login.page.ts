import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { error } from 'jquery';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @Input() control!:FormControl;
  @Input() type!:string;
  isPassword:boolean=true;
  hide:boolean=true;

  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

firebaseSvc=inject(UserService);
utilSvc=inject(UtilService);

  ngOnInit() {
    this.type = 'password';
  }


  showOrHidePassword(){
    this.hide = !this.hide;
    this.type = this.hide ? 'password' : 'text';
  }


  async submit(){
    if(this.form.valid){

      const loading=await this.utilSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        console.log(res);

      }).catch(error =>{
        console.log(error);

        this.utilSvc.presentToast({
          message:error.message,
          duration:2500,
          color:'primary',
          position:'middle',
          icon:'alert-circle-outline'

        })
      }).finally(() => {
        loading.dismiss();
      })
    }

  }
}

