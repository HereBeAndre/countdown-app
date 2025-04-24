import {
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  NgZone,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appFitText]',
  standalone: true,
})
export class FitTextDirective implements AfterViewInit, OnDestroy {
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private el: HTMLElement;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {
    this.el = this.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    const container = this.el.parentElement;
    if (!container) return;

    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => this.resizeText());
      this.resizeObserver.observe(container);

      this.mutationObserver = new MutationObserver(() => this.resizeText());
      this.mutationObserver.observe(this.el, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    });

    this.resizeText();
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeText();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  private resizeText() {
    const container = this.el.parentElement;
    if (!container) return;

    const maxFontSize = 300;
    const minFontSize = 10;
    const step = 1;

    this.el.style.whiteSpace = 'nowrap';
    this.el.style.display = 'inline-block';

    let fontSize = minFontSize;

    // Use smallest font size to start
    this.el.style.fontSize = `${fontSize}px`;

    while (fontSize <= maxFontSize) {
      this.el.style.fontSize = `${fontSize}px`;

      if (this.el.scrollWidth > container.clientWidth) {
        this.el.style.fontSize = `${fontSize - step}px`;
        break;
      }

      fontSize += step;
    }
  }
}
