import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated: boolean = false;
  private authenticatedStatusSubs: Subscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.authenticatedStatusSubs = this.authService.getAutheticationStatusListener().subscribe(
      isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
      }
    );
  }

  onLogout(){
    this.authService.logout()
  }

  ngOnDestroy(): void {
    this.authenticatedStatusSubs.unsubscribe();
  }
}
