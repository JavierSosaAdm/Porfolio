import { Component, inject, OnInit} from '@angular/core';
import { UserService } from '../../Service/user.service';
import { CommonModule, NgClass } from '@angular/common';
import { SkillService } from '../../Service/skills.service';


@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit {
  private UserService = inject(UserService);
  private SkillService = inject(SkillService);
  skills: {id: string, data: any}[] = [];
  admin: any[] = [];


  ngOnInit(): void {
    this.UserService.getUser().subscribe({
      next: (users) => {
        this.admin = users.filter((user: any) => user.data.IsAdmin === true);
      }
    });
    this.SkillService.getSkills().subscribe({
      next: (skills) => {
        this.skills = skills;
      }
    });
  }

}
