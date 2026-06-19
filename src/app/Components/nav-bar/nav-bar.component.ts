import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, NgClass],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  private authService = inject(AuthService);
  private _userService = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  private _router = inject(Router);
  IsAdmin: boolean = false;
  userLog: boolean = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.IsAdmin !== undefined) {
        this.IsAdmin = user.IsAdmin;
      }
      this.authService.isAdmin$.subscribe({
        next: (value) => {
          this.IsAdmin = value;
        }
      });
      this.authService.userLog$.subscribe({
        next: (value) => {
          this.userLog = value;
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this._userService.logout();
    this._router.navigate(['/']);
  }
  
}

