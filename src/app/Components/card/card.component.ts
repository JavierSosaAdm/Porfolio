import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Input } from '@angular/core';
import { InformationService } from '../../Service/information.service';
import { RepositoriesService } from '../../Service/repositories.service';
import { Repository } from '../../Models/repositories.model';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
    @Input() repository!: Repository;
  //   private _infoService = inject(InformationService);
  //   private _repoService = inject(RepositoriesService);
  //   repoList: {id: string, data: Repository}[] = [];

  // ngOnInit(): void {
  //   this._repoService.getRepositories().subscribe((data) => {
  //     console.log("esto es data: ", data);
  //     this.repoList = data;
  //     console.log("esto es repolist: ", this.repoList);
  //   });
  // }
}
