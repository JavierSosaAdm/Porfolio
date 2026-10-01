import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

// import {GithubOutlined}


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  year = new Date().getFullYear();
}
