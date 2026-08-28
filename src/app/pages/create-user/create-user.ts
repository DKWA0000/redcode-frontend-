import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // 🌟 RÄTTNING: Ändrat till 'email' och lagt till e-postvalidering
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    const newUserDto = this.registerForm.getRawValue();
    console.log('Skickar ny användare till backend...', newUserDto);

    // Din apiInterceptor bygger ihop URL:en automatiskt till /api/person/createuser
    this.http.post('person/createuser', newUserDto).subscribe({
      next: () => {
        alert('Användarkonto skapat! Du skickas nu till inloggningen.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Kunde inte skapa användare:', err);
        alert('Det gick inte att skapa kontot. E-postadressen kan redan vara registrerad.');
      }
    });
  }
}
