import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-add-book',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-book.html',
  styleUrl: './add-book.css'
})
export class AddBook {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // 1. Lagt till 'date' i formulärstrukturen
  bookForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    date: ['', Validators.required] // 👈 Nytt obligatoriskt datumfält
  });

  onSubmit() {
    if (this.bookForm.valid) {
      // 2. Hämta alla värden direkt från formuläret
      const newBook = this.bookForm.getRawValue();

      console.log('Sparar ny bok med valt datum i backend...', newBook);

      this.http.post('book', newBook).subscribe({
        next: () => {
          console.log('Boken sparades framgångsrikt!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Kunde inte spara boken:', err);
          alert('Ett fel uppstod när boken skulle sparas.');
        }
      });
    }
  }
}
