import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  
  public spinnerUrl = '/assets/img/spinner.gif';

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    if (this._authService.isLoggedIn()) {
      this._authService.goToLogout();
    }
    else {
      this._authService.goToLogout(true);
    }
  }
}
