import { Component } from '@angular/core';
import { UserRespository } from './auth/auth.repository';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rmsiangmalam-kasir';
  constructor(private userRepo: UserRespository) { }
}
