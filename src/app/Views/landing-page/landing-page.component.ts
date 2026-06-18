import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RepositoriesService } from '../../Service/repositories.service';
import { Repository } from '../../Models/repositories.model';
import { Observable } from 'rxjs';
import { CardComponent } from '../../Components/card/card.component';



  @Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, CardComponent ],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
  })
  export class LandingPageComponent implements OnInit {
    private platformId = inject(PLATFORM_ID);
    private _repoService = inject(RepositoriesService);
    repoList: {id: string, data: Repository}[] = [];

    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this._repoService.getRepositories().subscribe((data) => {
          this.repoList = data;
        })
      }
    }
  }
