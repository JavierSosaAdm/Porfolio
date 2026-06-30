import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RepositoriesService } from '../../Service/repositories.service';
import { Repository } from '../../Models/repositories.model';
import { ProfileComponent } from '../../Components/profile/profile.component';
import { CardComponent } from '../../Components/card/card.component';
import { ContactComponent } from '../../Components/contact/contact.component';
import { MusicService } from '../../Service/music.service';



  @Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, CardComponent, ContactComponent, ProfileComponent ],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
  })
  export class LandingPageComponent implements OnInit {
    private platformId = inject(PLATFORM_ID);
    private _repoService = inject(RepositoriesService);
    private musicService = inject (MusicService);
    repoList: {id: string, data: Repository}[] = [];

    ngOnInit(): void {
      console.log('esto es playing 1: ', this.musicService.play)
      if (isPlatformBrowser(this.platformId)) {
        this._repoService.getRepositories().subscribe((data) => {
          this.repoList = data;
        })
      }
    }
  }
