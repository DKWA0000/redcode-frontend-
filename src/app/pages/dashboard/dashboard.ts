import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome'; 
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'; // 👈 1. Importera även faPen här

interface Book {
  id: number;
  title: string;
  author: string;
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, FaIconComponent, RouterLink], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  books = signal<Book[]>([]);

  iconTrash = faTrash;
  iconEdit = faPen; // 👈 2. Gör penn-ikonen tillgänglig för din HTML-mall

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.http.get<Book[]>('book').subscribe({
      next: (data) => {
        this.books.set(data);
      },
      error: (err) => {
        console.error('Kunde inte hämta böcker:', err);
      }
    });
  }

  deleteBook(bookId: number, event: Event) {
    event.stopPropagation(); 

    if (confirm('Är du säker på att du vill radera denna bok?')) {
      this.http.delete(`book/${bookId}`).subscribe({
        next: () => {
          console.log(`Bok med ID ${bookId} raderad.`);
          this.books.update(currentBooks => currentBooks.filter(b => b.id !== bookId));
        },
        error: (err) => {
          console.error('Kunde inte radera boken:', err);
          alert('Kunde inte radera boken från servern.');
        }
      });
    }
  }

  onCardClick(book: Book) {
    console.log('Du klickade på boken:', book.title);
  }
}
