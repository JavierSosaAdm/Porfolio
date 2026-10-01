import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Input } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SkillService } from '../../Service/skills.service';
import { Repository } from '../../Models/repositories.model';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
    @Input() repository!: Repository;

    private skillService = inject(SkillService);
    private transloco = inject(TranslocoService);

    skills: any[] = [];
    activeLang = 'es';

    ngOnInit(): void {
      this.activeLang = this.transloco.getActiveLang() || 'es';
      this.transloco.langChanges$.subscribe(lang => {
        this.activeLang = lang;
      });

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

    getDescription(): string {
      return this.repository.descriptionTranslations?.[this.activeLang as keyof NonNullable<Repository['descriptionTranslations']>]
        || this.repository.description;
    }
}
