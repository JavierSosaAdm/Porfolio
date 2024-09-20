import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { initializeApp } from 'firebase/app'
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "AIzaSyCRvKnkKq59RHE4hy8H79G4hB42Z6xV8C8",
  authDomain: "porfolio-1e22d.firebaseapp.com",
  projectId: "porfolio-1e22d",
  storageBucket: "porfolio-1e22d.appspot.com",
  messagingSenderId: "162706270904",
  appId: "1:162706270904:web:875f1c999d4ff42077624d",
  measurementId: "G-D2N5KKRGP2"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()), 
    provideClientHydration(),
    importProvidersFrom(
      HttpClientModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireModule
    )
  ]
};
