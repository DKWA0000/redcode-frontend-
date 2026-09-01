import { Component, inject, signal } from '@angular/core'; // 👈 Tog bort 'input' eftersom det inte behövs längre
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

  // 🟢 Raden med bookId = input.required<string>() är helt borttagen
  
  quoteText = signal<string>('');

  saveQuote() {
    if (!this.quoteText().trim()) {
      alert('Citatet kan inte vara tomt.');
      return;
    }

    // 🟢 Skickar nu endast med 'quote' i bodyn till ditt API
    const newQuote = {
      quote: this.quoteText()
    };

    this.http.post('quote', newQuote).subscribe({
      next: () => {
        console.log('Citat sparat!');
        // 🟢 Ändrad navigering: Går tillbaka till den globala citatlistan
        this.router.navigate(['/quotes']);
      },
      error: (err) => {
        console.error('Kunde inte spara citat:', err);
        alert('Kunde inte spara citatet på servern.');
      }
    });
  }
}
