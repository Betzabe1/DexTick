import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from './user.service';
import { UtilService } from './util.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Importar desde los módulos específicos de Capacitor
import { PushNotifications, PushNotificationActionPerformed, PushNotificationToken } from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationActionPerformed } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private platform: Platform,
    private firebaseauthService: UserService,
    private firestoreService: UtilService,
    private http: HttpClient,
    private router: Router
  ) {
    // this.stateUser();
    // this.inicializar();
  }

  stateUser() {
    // Implementar lógica para manejar el estado del usuario si es necesario
  }

  inicializar() {
    // if (this.platform.is('capacitor')) {
    //   PushNotifications.requestPermissions().then(result => {
    //     console.log('PushNotifications.requestPermissions()');
    //     if (result.receive === 'granted') {
    //       console.log('Permisos concedidos');

    //       PushNotifications.register();
    //       this.addListeners();
    //     } else {
    //       console.error('Push notifications permission not granted');
    //     }
    //   }).catch(error => {
    //     console.error('Error requesting push notifications permission:', error);
    //   });
    // } else {
    //   console.log('Push notifications not supported on this platform');
    // }
  }

  addListeners() {
    // // Escuchar notificaciones push recibidas
    // PushNotifications.addListener('pushNotificationReceived', (notification) => {
    //   console.log('Push notification received:', notification);
    //   // Aquí puedes agregar la lógica para manejar la notificación recibida
    // });

    // // Escuchar acciones realizadas en notificaciones push
    // PushNotifications.addListener('pushNotificationActionPerformed', (action: PushNotificationActionPerformed) => {
    //   console.log('Push notification action performed:', action);
    //   // Navegar a una página específica o manejar la acción
    //   this.router.navigate(['/some-page']); // Ejemplo de navegación
    // });

    // // Escuchar acciones realizadas en notificaciones locales
    // LocalNotifications.addListener('localNotificationActionPerformed', (action: LocalNotificationActionPerformed) => {
    //   console.log('Local notification action performed:', action);
    //   // Navegar a una página específica o manejar la acción
    //   this.router.navigate(['/some-page']); // Ejemplo de navegación
    // });
  }
}
