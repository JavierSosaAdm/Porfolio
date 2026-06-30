import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { MusicService } from '../../Service/music.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  private authService = inject(AuthService);
  private _userService = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  private _router = inject(Router);
  private musicService = inject (MusicService);
  IsAdmin: boolean = false;
  userLog: boolean = false;
  playing: boolean = false;
  volume: string = '';

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
  
  play() {
    console.log('Deberia estar sonando Daft Punk')
    this.musicService.play();
    this.playing = true;
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
    console.log('Este es el volumen: ', this.volume);    
  }
  
}

