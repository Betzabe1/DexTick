import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PushNotifications, PushNotificationActionPerformed, PushNotificationToken, PushNotification } from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationActionPerformed } from '@capacitor/local-notifications';
import { UserService } from './user.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private platform: Platform,
    private firebaseauthService: UserService,
    private firestoreService: UtilService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.initialize();
    this.stateUser();
  }

  stateUser() {
    this.firebaseauthService.stateAuth().subscribe(res => {
      if (res) {
        this.initialize();
      }
    });
  }

  initialize() {
    if (!this.platform.is('capacitor')) {
      PushNotifications.requestPermissions().then(result => {
        console.log('Push notificatiospermisos negados');

        if (result.receive === 'granted') {
          PushNotifications.register();
          this.addListeners();
        } else {
          console.error('Push notifications permission not granted');
        }
      }).catch(error => {
        console.error('Error requesting push notifications permissions', error);
      });
    }
  }


  addListeners() {
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log('Push registration token:', token);
        this.guardarToken(token.value);
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error('Error on push registration', error);
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push notification received (foreground):', notification);
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || 'Notification Local',
              body: notification.body || 'You have a new notification',
              id: new Date().getTime(), // Usa un ID único para la notificación
            }
          ]
        }).then(() => {
          console.log('Local notification scheduled');
        }).catch(error => {
          console.error('Error scheduling local notification', error);
        });
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push notification action performed in background:', notification);
        this.router.navigate(['/home-admin']);
      }
    );

    LocalNotifications.addListener('localNotificationActionPerformed',
      (notification: LocalNotificationActionPerformed) => {
        console.log('Local notification action performed:', notification);
        this.router.navigate(['/home-admin']);
      }
    );

  }


  async guardarToken(token: string) {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        console.log('Guardar Token en Firebase ->', userId);

        // Define la ruta para el documento del usuario en Firestore
        const path = `users/${userId}`;

        // Crea el objeto de actualización con el nuevo token
        const userUpdate = { token };

        // Llama al método para actualizar el documento en Firestore
        await this.firestoreService.updateDoc(path, userUpdate);

        console.log('Token guardado en Firebase');
      } else {
        console.error('No user found');
      }
    } catch (error) {
      console.error('Error al guardar el token en Firebase:', error);
    }
  }
}
