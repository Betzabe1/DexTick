import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { initializeApp } from 'firebase/app';
// Importa Firebase
import * as firebase from 'firebase/app';
import 'firebase/auth';  // Asegúrate de importar el módulo de autenticación

if (environment.production) {
  enableProdMode();
}

// firebase.initializeApp(environment.firebaseConfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

defineCustomElements(window);
