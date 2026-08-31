import { Component, inject, signal, input, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

interface Quote {
  quoteId: number;
  bookid: number;
  quote: string;
}

@Component({
  selector: 'app-show-quotes',
  standalone: true,
  imports: [RouterLink, FaIconComponent],
  templateUrl: './show-quotes.html',
  styleUrl: './show-quotes.css'
})
export class ShowQuotes {
  private http = inject(HttpClient);

  id = input.required<string>(); 
  quotes = signal<Quote[]>([]);

  iconTrash = faTrash;
  iconEdit = faPen;

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.fetchQuotes(currentId);
      }
    });
  }

  fetchQuotes(bookId: string) {
    this.http.get<Quote[]>(`quote/${bookId}`).subscribe({
      next: (data) => this.quotes.set(data),
      error: (err) => console.error('Kunde inte hämta citat:', err)
    });
  }

  deleteQuote(quoteItem: Quote, event: Event) {
    event.stopPropagation();

    if (confirm('Är du säker på att du vill radera detta citat?')) {
      this.http.delete(`quote/${quoteItem.quoteId}`).subscribe({
        next: () => {
          this.quotes.update(current => current.filter(q => q.quoteId !== quoteItem.quoteId));
        },
        error: (err) => console.error('Kunde inte radera citatet:', err)
      });
    }
  }
}
