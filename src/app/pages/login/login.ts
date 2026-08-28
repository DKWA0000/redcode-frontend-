import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FaIconComponent, RouterLink], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Setup Icons
  iconEmail = faEnvelope;
  iconLock = faLock;

  // Define Form
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get emailInvalid(): boolean {
    const control = this.loginForm.get('email');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get passwordInvalid(): boolean {
    const control = this.loginForm.get('password');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginCredentials = this.loginForm.getRawValue();
      
      console.log('Skickar loginuppgifter till backend...', loginCredentials);

      // 🌟 Skicka anropet och lägg till { withCredentials: true }
      this.http.post<any>('person/loginuser', loginCredentials, { withCredentials: true }).subscribe({
       // Inne i din login.ts (under next-blocket för person/loginuser):
    next: (response) => {
      console.log('Inloggning lyckades!');
  
  // Sätt flaggan som vår nya guard letar efter 🌟
      sessionStorage.setItem('is_logged_in', 'true');

      this.router.navigate(['/dashboard']);
      },
        error: (err) => {
          console.error('Inloggning misslyckades:', err);
          alert('Inloggning misslyckades: ' + (err.error?.message || 'Felaktiga uppgifter'));
        }
      });
    }
  }
}
