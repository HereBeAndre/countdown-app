import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get = (key: 'eventName' | 'endDate') => localStorage.getItem(key) || ''

  set = (key: 'eventName' | 'endDate', value: string) =>
    localStorage.setItem(key, value)
}
