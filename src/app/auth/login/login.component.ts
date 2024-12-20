import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  // public spinnerUrl = 'public/assets/img/loader.gif';
  public byPass = !environment.SingleSignOn;

  public mostrarLoader = true;
  public token: string = '';

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    this._authService.loginResponse();
  }


  goToByPass() {
    if (!this.byPass)
      return;

    if (!this.token) {
      this.mostrarLoader = false;
      return;
    }
    this.mostrarLoader = false;
    this._authService.byPass(this.token);
  }




}
