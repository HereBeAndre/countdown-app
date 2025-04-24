import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FitTextDirective } from './fit-text.directive';
import { LocalStorageService } from './local-storage.service';

const INTERVAL = 1000;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FitTextDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  eventName = '';
  endDate: Date | null = null;
  countdown = '';
  // TODO: Refine this type - should be of type Timeout | number?
  intervalId: any = null;
  // Needed to set the minDate for the datepicker
  minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1
  );

  constructor(private localStorageService: LocalStorageService) {
    this.eventName = this.localStorageService.get('eventName');
    this.endDate = (() => {
      const rawDate = this.localStorageService.get('endDate');
      const parsed = new Date(rawDate);
      return isNaN(parsed.getTime()) ? null : parsed;
    })();
  }

  // constructor() {
  //   const stringDate = getLocalStorageKey('endDate');
  //   const parsed = new Date(stringDate);
  //   this.endDate = isNaN(parsed.getTime()) ? null : parsed;
  // }

  ngOnInit() {
    // Resume countdown if there's data in local storage
    if (this.eventName && this.endDate) {
      this.startCountdown();
    }
  }

  // TODO: is onDestroy needed to clear the interval?
  // ngOnDestroy() {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //   }
  //   if (this.delta && this.delta <= 0) {
  //     this.delta = null;
  //     setLocalStorageKey('eventName', '');
  //     setLocalStorageKey('endDate', '');
  //   }
  // }

  onEventNameChange() {
    this.localStorageService.set('eventName', this.eventName);
    if (this.eventName && this.endDate) this.startCountdown();
  }

  onEndDateChange() {
    if (this.endDate instanceof Date && !isNaN(this.endDate.getTime())) {
      this.localStorageService.set('endDate', this.endDate.toString());
      this.startCountdown();
    }
  }

  // Callable only from within the class since form doesn't have a proper submit
  private startCountdown() {
    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(this.endDate!).getTime();
      const delta = end - now;

      // Base case: if the countdown is over
      // if (delta <= 0) {
      //   clearInterval(this.intervalId);
      //   this.countdown = `0 days, 0 h, 0 m, 0 s`;
      //   setLocalStorageKey('eventName', '');
      //   setLocalStorageKey('endDate', '');
      //   return;
      // }

      // TODO: Could be refactored to a Pipe?
      const days = Math.floor(delta / (1000 * 60 * 60 * 24));
      const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((delta / (1000 * 60)) % 60);
      const seconds = Math.floor((delta / 1000) % 60);

      this.countdown = `${days} days, ${hours} h, ${minutes} m, ${seconds} s`;
      console.log('Countdown:', this.countdown);
    }, INTERVAL);
  }
}
