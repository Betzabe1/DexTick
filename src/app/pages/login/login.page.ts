import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(private router:Router){}

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
        this.getUserInfo(res.user.uid)

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

  async getUserInfo(uid:string){
    if(this.form.valid){

      const loading=await this.utilSvc.loading();
      await loading.present();

      let path=`users/${uid}`;


      this.firebaseSvc.getDocument(path).then((user:User) => {

      this.utilSvc.saveInLocalStorage('user', user);
      this.redirectBasedOnRole(user.role);       this.form.reset();

      this.utilSvc.presentToast({
        message: `Te damos la bienvenida ${user.name}`,
        duration:2000,
        color:'primary',
        position:'middle',
        icon:'person-circle-outline'

      })

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

  redirectBasedOnRole(role: 'client' | 'agent' | 'admin') {
    switch(role) {
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
        console.error('Error tipo de usuario ni encontrado');
        // Manejo de error o redirección a una página de error
    }
  }
}

