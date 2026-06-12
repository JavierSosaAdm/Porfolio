import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../Service/user.service';
//import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-form-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.css'
})
export class FormRegisterComponent {
  data!: FormGroup;
  showPassword = false;
  private UserService = inject(UserService)
  private _router = inject(Router);
  

  constructor(private FormBuilder: FormBuilder) {
    this.data = this.FormBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      IsAdmin: [false]
    })
  }

  async register(event: Event) {
    event.preventDefault();
    const {name, lastName, email, password, IsAdmin} = this.data.value;

    if (this.data.invalid) {
      this.data.markAllAsTouched();
      return;
    }

    try {
      this.UserService.postUser(this.data.value).subscribe({
        next: () => {
          console.log('PostUser exitoso: ', this.data.value);
          this._router.navigate(['/']);
        }
      })
    } catch (error) {
      console.error('Error de logeo: ', error)
    }
  }
  hasErrors(field: string, typeError: string) {
    return this.data.get(field)?.hasError(typeError) && this.data.get(field)?.touched;
  }
}
