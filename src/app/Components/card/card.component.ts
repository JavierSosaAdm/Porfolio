import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Input } from '@angular/core';
import { SkillService } from '../../Service/skills.service';
import { RepositoriesService } from '../../Service/repositories.service';
import { Repository } from '../../Models/repositories.model';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
    @Input() repository!: Repository;

    private skillService = inject(SkillService);

    skills: any[] = [];

    ngOnInit(): void {
      this.skillService.getSkills().subscribe({
      next: (skills) => {

        this.skills = skills.filter(skill =>
          this.repository.skills.some(repoSkill => repoSkill.toLowerCase() === skill.data.skillName.toLowerCase())
        );

      },

      error: (error) => {
        console.error('Error al obtener las skills:', error);
      }
    });
    }
}
