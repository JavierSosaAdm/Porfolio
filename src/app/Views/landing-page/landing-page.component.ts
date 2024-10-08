import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { InformationService } from '../../Service/information.service';
import { RepositoriesService } from '../../Service/repositories.service';
import { Repository } from '../../Models/repositories.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {

  private _infoService = inject(InformationService);
  private _repoService = inject(RepositoriesService);
  repoList: {id: string, data: Repository}[] = [];

 ngOnInit(): void {
   this._repoService.getRepositories().subscribe((data) => {
    console.log("esto es data: ", data);

    this.repoList = data;
    console.log("esto es repolist: ", this.repoList);
    
   })
 }
}
