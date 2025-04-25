import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FitTextDirective } from './fit-text.directive';
import { LocalStorageService } from './local-storage.service';
import { formatCountdown } from '../shared/utils/countdown.util';
import { DEFAULT_EVENT_NAME, INTERVAL } from '../shared/utils/constants';

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
  eventName = DEFAULT_EVENT_NAME;
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
    // this.eventName = this.localStorageService.get('eventName');
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

  // Makes sense to call method only from within the class since form doesn't have a proper submit
  // Also, could be refactored to use RxJS
  private startCountdown() {
    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(this.endDate!).getTime();
      const delta = end - now;

      // Base case - when countdown hits 0 or goes negative
      if (delta <= 0) {
        clearInterval(this.intervalId);
        this.countdown = formatCountdown(0);
        // Clean up local storage to start with clean slate on page refresh
        this.localStorageService.set('eventName', '');
        this.localStorageService.set('endDate', '');
        return;
      }

      this.countdown = formatCountdown(delta);
    }, INTERVAL);
  }
}
