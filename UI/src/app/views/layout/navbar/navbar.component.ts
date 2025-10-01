import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModeService } from '../../../core/services/theme-mode.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgbDropdownModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  currentTheme: string;
  currentLang :any;
  isLoggedIn = false;
  userEmail = '';
  userName = '';

  constructor(
    private router: Router,
    private themeModeService: ThemeModeService,
    private translate: TranslateService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.themeModeService.currentTheme.subscribe( (theme) => {
      this.currentTheme = theme;
      this.showActiveTheme(this.currentTheme);
      this.showLang()
    });

    // Subscribe to authentication state
    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.loadUserInfo();
      } else {
        this.userEmail = '';
        this.userName = '';
      }
    });
  }
  showLang(){
   const savedLang = sessionStorage.getItem('lang');
    this.setLang(savedLang || 'en')

  }
  showActiveTheme(theme: string) {
    const themeSwitcher = document.querySelector('#theme-switcher') as HTMLInputElement;
    const box = document.querySelector('.box') as HTMLElement;

    if (!themeSwitcher) {
      return;
    }

    // Toggle the custom checkbox based on the theme
    if (theme === 'dark') {
      themeSwitcher.checked = true;
      box.classList.remove('light');
      box.classList.add('dark');
    } else if (theme === 'light') {
      themeSwitcher.checked = false;
      box.classList.remove('dark');
      box.classList.add('light');
    }
  }
toggleLang() {
    if (this.currentLang === 'ar') {
      this.setLang('en');
    } else {
      this.setLang('ar');
    }
  }

  private setLang(lang: string) {
    this.currentLang = lang;
     this.translate.setDefaultLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    sessionStorage.setItem('lang', lang);
  }

  /**
   * Change the theme on #theme-switcher checkbox changes
   */
  onThemeCheckboxChange(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const newTheme: string = checkbox.checked ? 'dark' : 'light';
    this.themeModeService.toggleTheme(newTheme);
    this.showActiveTheme(newTheme);
  }

  /**
   * Toggle the sidebar when the hamburger button is clicked
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    document.body.classList.add('sidebar-open');
    document.querySelector('.sidebar .sidebar-toggler')?.classList.add('active');
  }

  /**
   * Logout with confirmation
   */
  onLogout(e: Event) {
    e.preventDefault();

    Swal.fire({
      title: 'Sign Out',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, sign out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Use AuthService to handle logout
        this.authService.logout();

        // Show success message
        Swal.fire({
          title: 'Signed Out',
          text: 'You have been successfully signed out.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        // Redirect to login page
        this.router.navigate(['/auth/login']);
      }
    });
  }

  /**
   * Load user information
   */
  private loadUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        this.userEmail = parsedUserInfo.email || 'user@example.com';
        this.userName = parsedUserInfo.name || parsedUserInfo.firstName || 'User';
      } catch (error) {
        this.userEmail = 'user@example.com';
        this.userName = 'User';
      }
    } else {
      this.userEmail = 'user@example.com';
      this.userName = 'User';
    }
  }

}
