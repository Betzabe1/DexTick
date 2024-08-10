import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserService } from './user.service';
import { UtilService } from './util.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
// Importar desde los módulos específicos de Capacitor
import { PushNotifications, PushNotificationActionPerformed, PushNotificationToken, PushNotification } from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationActionPerformed } from '@capacitor/local-notifications';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private auth: Auth,
    private platform: Platform,
    private firebaseauthService: UserService,
    private firestoreService: UtilService, // UtilService que tiene updateDoc
    private http: HttpClient,
    private router: Router
  ) {
    this.stateUser();
  }


  stateUser() {
    // Observa el estado de autenticación
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        console.log('Usuario autenticado:', user);
        this.inicializar(); // Llama a inicializar si el usuario está autenticado
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }


  inicializar() {
    if (this.platform.is('capacitor')) {
      PushNotifications.requestPermissions().then(result => {
        console.log('PushNotifications.requestPermissions()');
        if (result.receive === 'granted') {
          PushNotifications.register();
          this.addListeners();
        } else {
          console.error('Push notifications permission not granted');
        }
      }).catch(error => {
        console.error('Error requesting push notifications permission:', error);
      });
    } else {
      console.log('Push notifications not supported on this platform');
    }
  }

  addListeners() {
    // Escuchar notificaciones push recibidas
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log('The token is:', token);
        this.guardarToken(token.value);
      }
    );

    // Escuchar errores en la registración
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error('Error on registration', error);
      }
    );

    // Primer plano
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received (foreground):', notification);
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'Local Notification',
              body: notification.body,
              id: 1,
            }
          ]
        });
      }
    );

    // Escuchar acciones realizadas en notificaciones push
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed in background', notification);
        this.router.navigate(['/tickets']);
      }
    );

    // Escuchar acciones realizadas en notificaciones locales
    LocalNotifications.addListener('localNotificationActionPerformed',
      (notification: LocalNotificationActionPerformed) => {
        console.log('Local notification action performed', notification);
        this.router.navigate(['/perfil']);
      }
    );
  }

  async guardarToken(token: string) {
    // try {
    //   const user = await this.firebaseauthService.getCurrentUser();
    //   if (user) {
    //     const userId = user.uid; // Obtiene el ID del usuario
    //     console.log('Guardar Token en Firebase ->', userId);
    //     const path = users/${userId};
    //     const userUpdate = { token: token };
    //     await this.firestoreService.updateDoc(path, userUpdate); // Actualiza el documento del usuario
    //     console.log('Token guardado en Firebase');
    //   } else {
    //     console.error('No user found');
    //   }
    // } catch (error) {
    //   console.error('Error al guardar el token en Firebase:', error);
    // }
  }


  newNotification() {
  }
}
