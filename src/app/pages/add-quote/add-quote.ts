import { Component, inject, signal, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 Viktigt för att använda [(ngModel)]

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

  // Fångar automatiskt upp :bookId från URL:en
  bookId = input.required<string>();
  
  // Håller texten som användaren skriver
  quoteText = signal<string>('');

  saveQuote() {
    if (!this.quoteText().trim()) {
      alert('Citatet kan inte vara tomt.');
      return;
    }

    // Vi skickar med det json-format som din backend förväntar sig
    const newQuote = {
      bookid: Number(this.bookId()),
      quote: this.quoteText()
    };

    // Anpassat efter din fungerande endpoint-struktur (api/quote)
    this.http.post('quote', newQuote).subscribe({
      next: () => {
        console.log('Citat sparat!');
        // Skicka användaren tillbaka till citatsidan för den boken
        this.router.navigate(['/books', this.bookId(), 'quotes']);
      },
      error: (err) => {
        console.error('Kunde inte spara citat:', err);
        alert('Kunde inte spara citatet på servern.');
      }
    });
  }
}
