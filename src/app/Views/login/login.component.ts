import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms'; 
import { UserService } from '../../Service/user.service';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, NgClass ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  data!: FormGroup;  
  showPassword = false;
  private UserService = inject(UserService)
  private _router = inject(Router);  
  private authService = inject(AuthService);

  constructor(private FormBuilder: FormBuilder) {
    this.data = this.FormBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  login(event: Event) {
    event.preventDefault();
    const { email, password } = this.data.value;

    if (this. data.invalid) {
      this.data.markAllAsTouched();
      return;
    }
    try {
      this.UserService.getUser().subscribe({
        next: (users) => {
          const userFound = users.find(
            user => 
              user.data.email === email && 
              user.data.password === password
          )

          if (userFound) {
            localStorage.setItem('user', JSON.stringify(userFound.data));
            this.authService.setIsAdmin(userFound.data.IsAdmin);
            this._router.navigate(['/']);
          } else {
            console.log('Email o contraseña incorrectos');
          }
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
