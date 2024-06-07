import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
})
export class LogOutComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { } // Inyectar Router en el constructor

  ngOnInit() {}

  logout(): void {
    this.userService.signOut();
    this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
  }
}
