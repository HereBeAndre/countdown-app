import { NgZone } from '@angular/core';
import { FitTextDirective } from './fit-text.directive';

describe('FitTextDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    };
    const mockNgZone = {
      runOutsideAngular: (fn: () => void) => fn(),
    } as NgZone;

    const directive = new FitTextDirective(mockElementRef, mockNgZone);
    expect(directive).toBeTruthy();
  });
});
