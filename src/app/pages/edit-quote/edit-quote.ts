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

  // 🟢 Städat bort bookId helt!
  quoteId!: number; 
  currentQuoteText = signal<string>('Laddar citat...');
  
  private passedQuoteFromNavigation: Quote | null = null;

  quoteForm = this.fb.group({
    quote: ['']
  });

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const stateQuote = navigation?.extras.state?.['quote'] as Quote;
    if (stateQuote) {
      this.passedQuoteFromNavigation = stateQuote;
    }
  }

  ngOnInit() {
    // 🟢 Hämtar endast quoteIdParam nu eftersom routen är 'edit-quote/:quoteId'
    const quoteIdParam = this.route.snapshot.paramMap.get('quoteId');

    if (quoteIdParam) this.quoteId = +quoteIdParam;

    if (this.passedQuoteFromNavigation) {
      this.setupFormData(this.passedQuoteFromNavigation.quote);
    } else if (this.quoteId) {
      this.fetchAndFindQuote();
    }
  }

  setupFormData(text: string) {
    this.currentQuoteText.set(text);
    this.quoteForm.patchValue({ quote: text });
  }

  fetchAndFindQuote() {
    // 🟢 Ändrat anrop till att hämta från det globala 'quote'-API:et
    this.http.get<Quote[]>('quote').subscribe({
      next: (quotesList) => {
        const foundQuote = quotesList.find(q => q.quoteId === this.quoteId);
        if (foundQuote) {
          this.setupFormData(foundQuote.quote);
        } else {
          this.router.navigate(['/quotes']); // 🟢 Navigera till den globala listan
        }
      },
      error: () => this.router.navigate(['/quotes']) // 🟢 Navigera till den globala listan
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
        this.router.navigate(['/quotes']); // 🟢 Gå tillbaka till globala listan efter lyckad sparning
      },
      error: (err) => {
        console.error('Kunde inte uppdatera citatet i backend:', err);
        alert(`Fel vid ändring (Status ${err.status}). Kontrollera konsolen.`);
      }
    });
  }
}
