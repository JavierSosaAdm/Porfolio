import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { MusicService } from '../../Service/music.service';
import { LoginComponent } from '../../Views/login/login.component'; 
import { FormRegisterComponent } from '../../Views/form-register/form-register.component';
import { FormComponent } from '../../Views/form/form.component';
import { ContactComponent } from '../contact/contact.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, LoginComponent, FormRegisterComponent, FormComponent, ContactComponent, TranslocoPipe],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  private authService = inject(AuthService);
  private _userService = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  private _router = inject(Router);
  private musicService = inject (MusicService);
  private viewportScroller = inject(ViewportScroller);
  private translocoService = inject(TranslocoService);
  IsAdmin: boolean = false;
  userLog: boolean = false;
  playing: boolean = false;
  volume: string = '';
  currentLang = 'es';

  readonly languages = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'fr', label: 'Français' },
    { code: 'it', label: 'Italiano' },
    { code: 'ja', label: '日本語' },
    { code: 'ru', label: 'Русский' },
    { code: 'hi', label: 'हिन्दी' }
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedLang = localStorage.getItem('portfolio-language');
      this.currentLang = storedLang && this.languages.some(lang => lang.code === storedLang)
        ? storedLang
        : 'es';
      this.translocoService.setActiveLang(this.currentLang);

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

  changeLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const language = select.value;

    this.currentLang = language;
    this.translocoService.setActiveLang(language);
    localStorage.setItem('portfolio-language', language);
  }

  logout() {
    
    this.authService.logout();
    this._userService.logout();
    this._router.navigate(['/']);
  }
  
  play() {
    console.log('Deberia estar sonando Daft Punk')
    this.musicService.play();
    this.playing = true;
    this.volume = '1';
    console.log('Este es el volumen: ', this.volume); 
  }

  pause() {
    if (this.musicService.isPlaying()) {
      this.musicService.pause();
      this.playing = false;
      console.log('esto es playing 1: ');
    } 
  }

  stop() {
    if (this.musicService.isPlaying()) {
      this.musicService.stop();
      this.playing = false;
    }
  }

  changeVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    this.musicService.setVolume(Number(input.value));
    this.volume = input.value;
    console.log('Este es el cambio de volumen: ', this.volume);    
  }
  
  goToSection(sectionId: string) {
    this.viewportScroller.scrollToAnchor(sectionId);
  }
}

