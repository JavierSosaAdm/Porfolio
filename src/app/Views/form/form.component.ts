import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepositoriesService } from '../../Service/repositories.service';
import { Router } from '@angular/router';
import { Skill } from '../../Models/skills.model';
import { SkillService } from '../../Service/skills.service';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  skills: {id: string, data: Skill} [] = [];
  listSkills: string[] = [];
  data!: FormGroup;
  private RepService = inject(RepositoriesService)
  private _router = inject(Router);
  private skillService = inject(SkillService);

  
  constructor(private FormBuilder: FormBuilder) {
    this.data = this.FormBuilder.group({
      name: ['', [Validators.required]],
      link: ['', [Validators.required]],
      description: [''],
      skills:[[], [Validators.required]]
    })
  }

  ngOnInit() {
    this.skillService.getSkills().subscribe({
      next: (skills) => {
        this.skills = skills;
      }
    });
  }

  onSkillChange(event: Event, skillName: string) {
    const checkbox = event.target as HTMLInputElement;
    const selectSkills = this.data.get('skills')?.value as string[];

    if (checkbox.checked) {
        selectSkills.push(skillName);
    } else {
      const index = selectSkills.indexOf(skillName);
      if (index >= 0) {
        selectSkills.splice(index, 1);
      }
    }
    this.data.get('skills')?.setValue(selectSkills); 
  }

  async postRepositories(event: Event) {
    event.preventDefault();
    const {name, link, skills, description } = this.data.value;

    try {
        this.RepService.postRepositories(this.data.value).subscribe({
        next: () => {
          this._router.navigate(['/']); // redirectionn to home page
        }
      })
    } catch (error) {
      console.error('Error al crear repositorio:', error);
    }
  }
  hasErrors(field: string, typeError: string) {
    return this.data.get(field)?.hasError(typeError) && this.data.get(field)?.touched;
  }
}
