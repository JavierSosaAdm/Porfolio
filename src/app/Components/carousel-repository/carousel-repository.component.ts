import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { Repository } from '../../Models/repositories.model';


@Component({
  selector: 'app-carousel-repository',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './carousel-repository.component.html',
  styleUrl: './carousel-repository.component.css'
})
export class CarouselRepositoryComponent {
  @Input() repositories: {id: string, data: Repository}[] = [];

  selectedIndex: number = 0;

  selectCard(index: number) {
    this.selectedIndex = index;
  }

  next() {
    if (this.repositories.length === 0) {
      return
    }
    this.selectedIndex = (this.selectedIndex + 1) % this.repositories.length;
    console.log('funciono el next: ', this.selectedIndex)
  }

  previous() {
    if (this.repositories.length === 0) {
      return
    }
    this.selectedIndex = (this.selectedIndex - 1 + this.repositories.length) % this.repositories.length;
    console.log('funciono el prev: ', this.selectedIndex)
  }

  getCardPosition(index: number): string {

    const total = this.repositories.length;

    if (total === 0) {
      return '';
    }

    let difference = index - this.selectedIndex;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return `translateY(${difference * 230}px)`;
  }

  getCardClass(index: number): string {
    
    const total = this.repositories.length;

    if (total === 0) {
      return '';
    }

    let difference = index - this.selectedIndex;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    if (difference === 0) {
      return 'active'
    }

    if (difference === -1) {
      return 'previous'
    }

    if (difference === 1) {
      return 'next'
    }
    return 'hidden'
  }
}
