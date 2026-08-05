import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Input } from '@angular/core';

import { RepositoriesService } from '../../Service/repositories.service';
import { Repository } from '../../Models/repositories.model';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
    @Input() repository!: Repository;
}
