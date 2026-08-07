import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../Service/user.service';
import  emailjs  from '@emailjs/browser';

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
  userValidate: any
  

  

  constructor(private FormBuilder: FormBuilder) {
    this.data = this.FormBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
    
    this.UserService.getUserByEmail(this.data.value.email).subscribe({

      next: (user) => {

        if (user) {
          alert('Ya existe una cuenta con este email');
          return;
        }
        try {
          this.UserService.postUser(this.data.value).subscribe({
            next: () => {
              emailjs.send(
                'service_v0w8st3',
                'template_6s172yp',
                {
                  name: this.data.value.name,
                  email: this.data.value.email    
                },
                'ql609On2bliwpuBro'
              )
              
              if (typeof window !== 'undefined') {
                const modal = document.getElementById('registerModal');
    
                if (modal) {
                  modal.classList.remove('show');
                  modal.style.display = 'none';
                  modal.setAttribute('aria-hidden', 'true');
    
                  document.querySelector('.modal-backdrop')?.remove();
    
                  document.body.classList.remove('modal-open');
                  document.body.style.removeProperty('padding-right');
                  document.body.style.overflow = 'auto';
                }
    
                setTimeout(() => {
                  const loginModal = document.querySelector(
                    '[data-bs-target="#loginModal"]'
                  ) as HTMLElement;
                  loginModal.click();
                }, 200);
              } 
              this._router.navigate(['/']);
            }
    
          })
    
        } catch (error) {
          console.error('Error de logeo: ', error)
        }

      }
    })
  }
  hasErrors(field: string, typeError: string) {
    return this.data.get(field)?.hasError(typeError) && this.data.get(field)?.touched;
  }
}
