import { NgClass, CommonModule } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { UserService } from '../../Service/user.service';

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './introduction.component.html',
  styleUrl: './introduction.component.css'
})
export class IntroductionComponent implements OnInit {

  private UserService = inject(UserService);
  admin: any[] = [];

  ngOnInit(): void {
      this.UserService.getUser().subscribe({
      next: (users) => {
        this.admin = users.filter((user: any) => user.data.IsAdmin === true);
      }
    });
  }
}
