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

    if (this.data.invalid) {
      this.data.markAllAsTouched();
      return;
    }
    
    try {
      this.UserService.getUser().subscribe({
        next:(users) => {
          const userByEmail = users.find(
            user => user.data.email === email
          )
          
          if (!userByEmail) {
            alert('El email no se encuentra registrado');
            return;
          }
          
          if (userByEmail.data.password != password) {
            if (userByEmail.data.password.length < 8) {
                alert('La contaseña debe tener al menos 8 caracteres');
                return;
              }
            alert('Contraseña incorrecta');
            return;
          }
          
          localStorage.setItem('user', JSON.stringify(userByEmail.data));
          this.authService.setIsAdmin(userByEmail.data.IsAdmin);
          this.authService.login();
          this._router.navigate(['/']);          
        }
      })
    } catch (error) {
      console.error('Error de logeo: ', error)
      alert('Hay un error de sistema');
    }
    
  }
  hasErrors(field: string, typeError: string) {
    return this.data.get(field)?.hasError(typeError) && this.data.get(field)?.touched;
  }
}

