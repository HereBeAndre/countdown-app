import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { FitTextDirective } from './fit-text.directive'
import { LocalStorageService } from './local-storage.service'
import {
  getTomorrowDate,
  INTERVAL,
  formatCountdown,
  isValidDate,
} from '../shared/utils'

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
export class AppComponent implements OnInit, OnDestroy {
  eventName: string = ''
  endDate: Date | null = null
  countdown = ''
  minDate = getTomorrowDate()
  private intervalId: ReturnType<typeof setInterval> | number = 0

  constructor(private localStorageService: LocalStorageService) {
    const savedEventName = this.localStorageService.get('eventName')
    if (savedEventName) {
      this.eventName = savedEventName
    }

    const savedEndDate = this.localStorageService.get('endDate')
    this.endDate = savedEndDate ? new Date(savedEndDate) : null
  }

  ngOnInit() {
    // Resume countdown if there's data in local storage
    if (this.eventName && isValidDate(this.endDate)) {
      this.startCountdown()
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  onEventNameChange(eventName: string) {
    if (eventName.trim() !== '') {
      this.eventName = eventName
      this.localStorageService.set('eventName', this.eventName)
      if (this.eventName && isValidDate(this.endDate)) this.startCountdown()
    } else {
      this.localStorageService.set('eventName', '')
      this.eventName = ''
    }
  }

  onEndDateChange() {
    this.localStorageService.set(
      'endDate',
      (this.endDate as Date).toString() || '',
    )
    if (this.eventName && isValidDate(this.endDate)) {
      this.startCountdown()
    }
  }

  // Makes sense to call method only from within the class since form doesn't have a proper submit
  // Also, could be refactored to use RxJS?
  private startCountdown() {
    this.intervalId = setInterval(() => {
      const now = new Date().getTime()
      // Type assertion is safe here - startCountdown is only called when endDate !== null
      const end = new Date(this.endDate as Date).getTime()
      const delta = end - now

      // Base case - when countdown hits 0 or goes negative
      if (delta <= 0) {
        clearInterval(this.intervalId)
        this.countdown = formatCountdown(0)
        // Clean up local storage to start with clean slate on page refresh
        this.localStorageService.set('eventName', '')
        this.localStorageService.set('endDate', '')
        return
      }

      this.countdown = formatCountdown(delta)
    }, INTERVAL)
  }
}
