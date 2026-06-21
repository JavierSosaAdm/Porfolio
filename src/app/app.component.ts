import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './Components/footer/footer.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { ContactComponent } from './Components/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FooterComponent, NavBarComponent, ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Porfolio';
  menuSelected: string = '';

  onOption(menuOption: string) {
    this.menuSelected = menuOption;
    
  }
}
