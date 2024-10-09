import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from '../../Views/landing-page/landing-page.component';
import { InformationService } from '../../Service/information.service';
import { RepositoriesService } from '../../Service/repositories.service';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { enviroment } from '../../enviroment.prod';
import { AppComponent } from '../../app.component';
import { FormsModule } from '@angular/forms';
import { FormComponent } from '../../Views/form/form.component';


@NgModule({
  declarations: [
    LandingPageComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    NgModule,
    AngularFireModule.initializeApp(enviroment.firebaseConfig),
    AngularFireStorageModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    LandingPageComponent,
    FormComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    InformationService,
    RepositoriesService,
    provideHttpClient(
      withFetch()
    )
  ]
})
export class AppModuleModule { }
