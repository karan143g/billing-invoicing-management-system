import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '@app/services/sidebar.service';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-sidebar-component',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
  ],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss',
})
export class SidebarComponent {
  @Input() isOpen = true;

  constructor(
    public sidebarService: SidebarService,
    public auth: AuthService,
  ) {}

  onMenuItemClick() {
    this.sidebarService.close();
  }

  menu = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'Masters',
      icon: 'settings',
      children: [
        { label: 'Customers', route: '/customers' },
        { label: 'Products', route: '/products' },
      ],
    },
    {
      label: 'Transactions',
      icon: 'receipt',
      children: [
        {
          label: 'Create Invoice',
          route: '/invoice/create',
          roles: ['Admin', 'Manager'],
        },
        { label: 'Invoice List', route: '/invoice/list' },
      ],
    },
  ];

  canShow(child: any): boolean {
    if (!child.roles || child.roles.length === 0) return true;
    return child.roles.includes(this.auth.user?.role);
  }
}
