import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../../Components/profile/profile.component';
import { TercerComponenteComponent } from '../../Components/tercer-componente/tercer-componente.component';
import { ProfileAdminComponent } from '../../Components/profile-admin/profile-admin.component'

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, ProfileComponent, ProfileAdminComponent, TercerComponenteComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
    selectedIndex = 0;
    selectScreem(index: number) {
      this.selectedIndex = index;
    }

    previous() {
      if (this.selectedIndex > 0) {
        this.selectedIndex --;
      }
    }

    next() {
      if (this.selectedIndex < 2) {
        this.selectedIndex++;
      }
    }
}
