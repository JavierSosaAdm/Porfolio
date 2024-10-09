import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepositoriesService } from '../../Service/repositories.service';
import { Router } from 'express';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  data!: FormGroup;
  private RepService = inject(RepositoriesService)
  private _router = inject(Router);

  constructor(private FormBuilder: FormBuilder) {
    this.data = this.FormBuilder.group({
      name: ['', [Validators.required]],
      link: ['', [Validators.required]],
      description: [''],
      skills:[[''], [Validators.required]]
    })
  }

  async postRepositories(event: Event) {
    event.preventDefault();
    const {name, link, skills, description } = this.data.value;

    try {
      await this.RepService.postRepositories(this.data.value).subscribe({
        next: () => {
          console.log('postRepositories exitoso? ', this.data.value);
          this._router.navigate(['/']); // redirección a home page
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
