import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface Quote {
  quoteId: number; 
  quote: string;
}

@Component({
  selector: 'app-edit-quote',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-quote.html',
  styleUrl: './edit-quote.css'
})
export class EditQuote implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  bookId!: string; 
  quoteId!: number; 
  currentQuoteText = signal<string>('Laddar citat...');
  
  // 🌟 Spara temporärt state från constructorn
  private passedQuoteFromNavigation: Quote | null = null;

  quoteForm = this.fb.group({
    quote: ['']
  });

  constructor() {
    // 🌟 RÄTTNING: getCurrentNavigation MÅSTE köras här i constructorn för att inte bli null!
    const navigation = this.router.getCurrentNavigation();
    const stateQuote = navigation?.extras.state?.['quote'] as Quote;
    if (stateQuote) {
      this.passedQuoteFromNavigation = stateQuote;
    }
  }

  ngOnInit() {
    const bookIdParam = this.route.snapshot.paramMap.get('id');
    const quoteIdParam = this.route.snapshot.paramMap.get('quoteId');

    if (bookIdParam) this.bookId = bookIdParam;
    if (quoteIdParam) this.quoteId = +quoteIdParam;

    // 🌟 Kontrollera om vi fick med ett state från constructorn
    if (this.passedQuoteFromNavigation) {
      this.setupFormData(this.passedQuoteFromNavigation.quote);
    } else if (this.quoteId) {
      // Fallback om sidan laddas om (F5): hämta listan och leta upp rätt quoteId
      this.fetchAndFindQuote();
    }
  }

  setupFormData(text: string) {
    this.currentQuoteText.set(text);
    this.quoteForm.patchValue({ quote: text });
  }

  fetchAndFindQuote() {
    this.http.get<Quote[]>(`quote/${this.bookId}`).subscribe({
      next: (quotesList) => {
        const foundQuote = quotesList.find(q => q.quoteId === this.quoteId);
        if (foundQuote) {
          this.setupFormData(foundQuote.quote);
        } else {
          this.router.navigate(['/books', this.bookId, 'quotes']);
        }
      },
      error: () => this.router.navigate(['/books', this.bookId, 'quotes'])
    });
  }

  onSubmit() {
    const updatedText = this.quoteForm.value.quote?.trim() || this.currentQuoteText();

    const updatedQuote = {
      quoteId: this.quoteId, 
      quote: updatedText
    };

    console.log('Skickar uppdaterat citat till backend...', updatedQuote);

    this.http.patch('quote', updatedQuote).subscribe({
      next: () => {
        console.log('Citatet uppdaterades framgångsrikt!');
        this.router.navigate(['/books', this.bookId, 'quotes']);
      },
      error: (err) => {
        console.error('Kunde inte uppdatera citatet i backend:', err);
        alert(`Fel vid ändring (Status ${err.status}). Kontrollera konsolen.`);
      }
    });
  }
}
