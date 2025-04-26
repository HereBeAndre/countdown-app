import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FitTextDirective } from './fit-text.directive';
import { LocalStorageService } from './local-storage.service';
import {
  getTomorrowDate,
  INTERVAL,
  formatCountdown,
  isValidDate,
} from '../shared/utils';

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
  eventName: string = '';
  endDate: Date | null = null;
  countdown = '';
  minDate = getTomorrowDate();
  private intervalId: ReturnType<typeof setInterval> | number = 0;

  constructor(private localStorageService: LocalStorageService) {
    const savedEventName = this.localStorageService.get('eventName');
    if (savedEventName) {
      this.eventName = savedEventName;
    }

    const savedEndDate = this.localStorageService.get('endDate');
    this.endDate = savedEndDate ? new Date(savedEndDate) : null;
  }

  ngOnInit() {
    // Resume countdown if there's data in local storage
    if (this.eventName && isValidDate(this.endDate)) {
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
    if (this.eventName && isValidDate(this.endDate)) this.startCountdown();

    // If user clears the event name, clear the countdown
    if (this.eventName === '') {
      this.endDate = null;
      this.countdown = '';
      this.localStorageService.set('endDate', '');

      clearInterval(this.intervalId);
    }
  }

  onEndDateChange() {
    this.localStorageService.set('endDate', this.endDate!.toString() || '');
    if (this.eventName && isValidDate(this.endDate)) {
      this.startCountdown();
    }
  }

  // Makes sense to call method only from within the class since form doesn't have a proper submit
  // Also, could be refactored to use RxJS
  private startCountdown() {
    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      // Type assertion is safe here - startCountdown is only called when endDate !== null
      const end = new Date(this.endDate as Date).getTime();
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
