import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome'; // 👈 Import the component
import { faBook } from '@fortawesome/free-solid-svg-icons'; // 👈 Import a test icon

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FaIconComponent], // 👈 Declare FaIconComponent here
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  // Expose the icon to the template
  iconBook = faBook;
}
