import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const getLocalStorageKey = (key: 'eventName' | 'endDate') =>
  localStorage.getItem(key) || '';

const setLocalStorageKey = (key: 'eventName' | 'endDate', value: string) =>
  localStorage.setItem(key, value);

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  eventName = getLocalStorageKey('eventName');
  endDate = getLocalStorageKey('endDate');
  countdown = '';
  // TODO: Refine this type - should be of type Timeout | number?
  intervalId: any = null;

  // Only used to set the minDate for the datepicker
  today = new Date();
  minDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate() + 1
  );

  // Runs on component mount
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

  startCountdown() {
    setLocalStorageKey('eventName', this.eventName);
    setLocalStorageKey('endDate', this.endDate);

    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(this.endDate).getTime();
      const delta = end - now;

      // if (this.delta === 0) {
      //   this.countdown = 'Event has started!';
      //   clearInterval(this.intervalId);
      //   // return;
      // }

      // if (this.delta < 0) {
      //   this.countdown = 'Event has ended!';
      //   clearInterval(this.intervalId);
      //   // return;
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
