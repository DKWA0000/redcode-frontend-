import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-book.html',
  styleUrl: './edit-book.css'
})
export class EditBook implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  bookId!: number;
  
  // Sparar även ursprungligt datum i en sträng för säkerhets skull
  originalDate = '';
  currentBookTitle = signal<string>('Ingen titel skickad');
  currentBookAuthor = signal<string>('Ingen författare skickad');

  bookForm = this.fb.group({
    title: [''],
    author: [''],
    date: ['']
  });

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const passedBook = navigation?.extras.state?.['book'];

    if (passedBook) {
      this.currentBookTitle.set(passedBook.title);
      this.currentBookAuthor.set(passedBook.author);
      this.originalDate = passedBook.date || '';

      if (passedBook.date) {
        const formattedDate = passedBook.date.split('T')[0]; // Säkerställ YYYY-MM-DD format
        this.bookForm.patchValue({ date: formattedDate });
      }
    } else {
      console.warn('Inget bok-state hittades i constructor.');
    }
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bookId = +idParam;
    }

    if (this.currentBookTitle() === 'Ingen titel skickad') {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    // 🌟 RÄTTNING: Skicka gamla värdena om de nya fälten är tomma, istället för null/tomma strängar
    const updatedBook = {
      id: this.bookId,
      title: this.bookForm.value.title?.trim() || this.currentBookTitle(),
      author: this.bookForm.value.author?.trim() || this.currentBookAuthor(),
      date: this.bookForm.value.date || this.originalDate
    };

    console.log('Skickar helt validerad PATCH-body...', updatedBook);

    this.http.patch('book', updatedBook).subscribe({
      next: () => {
        console.log('Boken uppdaterades framgångsrikt!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Kunde inte PATCH-uppdatera boken i backend:', err);
        
        // 💡 Felsökningstips: Om det fortfarande blir 400, skriv ut backend-svaret i en alert
        if (err.status === 400 && err.error?.errors) {
          alert('Backend valideringsfel: ' + JSON.stringify(err.error.errors));
        } else {
          alert('Ett fel uppstod vid ändring (Status 400). Kontrollera datan.');
        }
      }
    });
  }
}
