import { Component, inject, signal, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-quote',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './add-quote.html',
  styleUrl: './add-quote.css'
})
export class AddQuote {
  private http = inject(HttpClient);
  private router = inject(Router);

  bookId = input.required<string>();
  
  quoteText = signal<string>('');

  saveQuote() {
    if (!this.quoteText().trim()) {
      alert('Citatet kan inte vara tomt.');
      return;
    }

    const newQuote = {
      bookid: Number(this.bookId()),
      quote: this.quoteText()
    };

    this.http.post('quote', newQuote).subscribe({
      next: () => {
        console.log('Citat sparat!');
        this.router.navigate(['/books', this.bookId(), 'quotes']);
      },
      error: (err) => {
        console.error('Kunde inte spara citat:', err);
        alert('Kunde inte spara citatet på servern.');
      }
    });
  }
}
