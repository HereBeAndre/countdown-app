import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

const getLocalStorageKey = (key: 'eventName' | 'endDate') =>
  localStorage.getItem(key) || '';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  eventName = getLocalStorageKey('eventName');
  endDate = getLocalStorageKey('endDate');
  countdown = '';
  // TODO: Refine this type
  intervalId: number | null = null;

  ngOnInit() {}
}
