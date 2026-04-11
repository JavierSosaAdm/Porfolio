import { Routes } from '@angular/router';
import { LandingPageComponent } from './Views/landing-page/landing-page.component';
import { FormComponent } from './Views/form/form.component';
import { CardComponent } from './Components/card/card.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'register', component: FormComponent},
    {path: 'card', component: CardComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'},

];
