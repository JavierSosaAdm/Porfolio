import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from '../../Views/landing-page/landing-page.component';
import { InformationService } from '../../Service/information.service';
import { RepositoriesService } from '../../Service/repositories.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { enviroment } from '../../enviroment.prod';


@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    NgModule,
    AngularFireModule.initializeApp(enviroment.firebaseConfig),
    AngularFireStorageModule,
  ],
  providers: [
    InformationService,
    RepositoriesService,
    provideHttpClient(
      withFetch()
    )
  ]
})
export class AppModuleModule { }
