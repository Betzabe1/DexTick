import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PushNotifications, PushNotificationActionPerformed, PushNotificationToken, PushNotification } from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationActionPerformed } from '@capacitor/local-notifications';
import { UserService } from './user.service';
import { UtilService } from './util.service';
import { HttpClient } from '@angular/common/http';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private platform: Platform,
    private userService: UserService,
    private firestoreService: UtilService,
    private router: Router,
    private http:HttpClient,
    private afAuth: AngularFireAuth
  )
  {
    this.stateUser();
  }

  stateUser() {
    // this.afAuth.onAuthStateChanged((user) => {
    //   if (user) {
    //     console.log('Usuario autenticad:', user);
    //     this.initialize();
    //   } else {
    //     console.error('No se encontró un usuario autenticad. Guardando token falló.');
    //   }
    // });
  }

  initialize() {
    if (this.platform.is('capacitor')) {
      PushNotifications.requestPermissions().then(result => {
        console.log('Push Notifications: Requesting permission');

        if (result.receive === 'granted') {
          PushNotifications.register();
          console.log('Permisos para notificaciones push');
          this.addListeners();
        } else {
          console.error('Permisos denegados para notificaciones push');
        }
      }).catch(error => {
        console.error('No es un móvil', error);
      });
    }
  }

  addListeners() {
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log('Su token es:', token);
        // this.guardarToken(token.value);
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error('Error on push registration', error);
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Notificación push recibida:', notification);
        this.showLocalNotification(notification);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Acción de notificación push realizada en segundo:', notification);
        // this.router.navigate(['/home-admin']);
      }
    );

    LocalNotifications.addListener('localNotificationActionPerformed',
      (notification: LocalNotificationActionPerformed) => {
        console.log('Local notification action performed:', notification);


// Obtener el estado de autenticación
this.afAuth.authState.subscribe(user => {
  if (user) {
    // Obtener el documento del usuario desde Firestore
    this.userService.getDocument(`users/${user.uid}`).then(doc => {
      const userRole = doc?.['role'];

      // Redirigir según el rol del usuario
      if (userRole === 'admin') {
        this.router.navigate(['tabs-admin/ticket-admin']);
      } else if (userRole === 'agent') {
        this.router.navigate(['tabs-agent/tickets-agent']);
      } else if (userRole === 'client') {
        this.router.navigate(['tabs/tickets-user']);
      } else {
        console.error('Unknown user role:', userRole);
      }
    }).catch(error => {
      console.error('Error fetching user document:', error);
      this.router.navigate(['/login']); // Redirigir al login en caso de error
    });
  }
});
}    );
  }

  // async guardarToken(token: string) {
  //   try {
  //     const user = await this.afAuth.currentUser;
  //     if (user) {
  //       const userId = user.uid;
  //       console.log('Guardar Token en Firebase ->', userId);
  //       const path = `users/${userId}`;
  //       const userUpdate = { token };
  //       await this.firestoreService.updateDoc(path, userUpdate);
  //       console.log('Token guardado en Firebase');
  //     } else {
  //       console.error('No se encontró un usuario autenticado. Guardando token falló.');
  //     }
  //   } catch (error) {
  //     console.error('Error al guardar el token en Firebase:', error);
  //   }
  // }

  async showLocalNotification(notification: PushNotification) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Notificación Local',
            body: notification.body ,
            id:1,
            extra:{
              data: notification.data
            }
          }
        ]
      });
      console.log('Notificación local programada');
    } catch (error) {
      console.error('Error al programar la notificación local:', error);
    }
  }

}
