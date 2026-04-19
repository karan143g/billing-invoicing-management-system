import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarService } from '@app/services/sidebar.service';
import { AuthService } from '@app/services/auth.service';
import { CanActivate, Router } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-header-component',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
    // @Output() toggleSidebar = new EventEmitter<void>();

   constructor(private sidebarService: SidebarService,public auth:AuthService, private router: Router,) {}

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}

}
