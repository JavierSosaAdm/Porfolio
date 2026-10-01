import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { routes } from './app.routes';
// import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { enviroment } from './enviroment.prod';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './i18n/transloco-http-loader';


const firebaseConfig = {
  apiKey: enviroment.firebaseConfig.apiKey,
  authDomain: enviroment.firebaseConfig.authDomain,
  projectId: enviroment.firebaseConfig.projectId,
  storageBucket: enviroment.firebaseConfig.storageBucket,
  messagingSenderId: enviroment.firebaseConfig.messagingSenderId,
  appId: enviroment.firebaseConfig.appId,
  measurementId: enviroment.firebaseConfig.measurementId
};



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()), 
    // provideClientHydration(),
    provideHttpClient(withFetch()),
    ...provideTransloco({
      config: {
        availableLangs: ['es', 'en', 'pt', 'fr', 'it', 'ja', 'ru', 'hi'],
        defaultLang: 'es',
        fallbackLang: 'es',
        reRenderOnLangChange: true,
        prodMode: true
      },
      loader: TranslocoHttpLoader
    }),
    importProvidersFrom(
//      HttpClientModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireModule
    )
  ]
};
