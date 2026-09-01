import { Component, inject, OnInit } from '@angular/core'; // 👈 Lagt till OnInit
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; 
import { FaIconComponent } from '@fortawesome/angular-fontawesome'; 
import { faBook, faQuoteLeft, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'; // 👈 Importerat faSun och faMoon

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink,       
    RouterLinkActive, 
    FaIconComponent
  ], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit { // 👈 Lagt till implements OnInit
  private router = inject(Router); 
  
  iconBook = faBook;
  iconQuote = faQuoteLeft;
  iconSun = faSun;   // 👈 Exponerat sol-ikon
  iconMoon = faMoon; // 👈 Exponerat mån-ikon
  
  isSidebarCollapsed = true; 
  isDarkMode = false; // 👈 Ny variabel som håller koll på temat

  // 🟢 Läser av om användaren har valt mörkt läge tidigare när appen startar
  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }

  get showSidebar(): boolean {
    const currentUrl = this.router.url;
    return !(currentUrl.includes('/login') || currentUrl.includes('/create-user'));
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // 🟢 Ny metod som ändrar temat och sparar valet i webbläsarens minne
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }
}
