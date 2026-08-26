import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RepositoriesService } from '../../Service/repositories.service';
import { Repository } from '../../Models/repositories.model';
import { SkillsComponent } from '../../Components/skills/skills.component';
import { ContactComponent } from '../../Components/contact/contact.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { ChatComponent } from '../../Components/chat/chat.component';
import { CarouselRepositoryComponent } from '../../Components/carousel-repository/carousel-repository.component';
// import { AdminChatComponent } from '../../Components/admin-chat/admin-chat.component';
import { IntroductionComponent } from '../../Components/introduction/introduction.component';
import { AuthService, LoggerUser } from '../../Service/auth.service';
import { Subscription } from 'rxjs';



  @Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, ContactComponent, SkillsComponent, ChatComponent, CarouselComponent, IntroductionComponent, CarouselRepositoryComponent ],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
  })
  export class LandingPageComponent implements OnInit {
    private platformId = inject(PLATFORM_ID);
    private _repoService = inject(RepositoriesService);
    private authService = inject(AuthService);
    repoList: {id: string, data: Repository}[] = [];
    IsAdmin: boolean = false;
    showChat: boolean = false;
    currentUser: LoggerUser | null = null;
    private authSub!: Subscription;
    

    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this._repoService.getRepositories().subscribe((data) => {
          this.repoList = data;
        })
      }
      this.authSub = this.authService.currentUser$.subscribe(user => {
        this.currentUser = user
        this.IsAdmin = user?.data.IsAdmin ?? false;
          console.log('Usuario actual:', user);
          console.log('¿Es admin?', this.IsAdmin);
      });
    }
   
  }
