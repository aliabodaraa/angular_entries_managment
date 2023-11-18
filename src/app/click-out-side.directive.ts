import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';
@Directive({
  selector: '[clickOutsideDir]',
})
export class ClickOutsideDirective {
  constructor(private _elementRef: ElementRef) {}

  @Output() public clickOutsideEmitter = new EventEmitter<string>();

  @HostListener('document:click', ['$event']) public onClick(
    event: MouseEvent
  ): void {
    if (!event.target) return;
    console.log('AAAAAAAAAAAAAAA', event.target);
    const clickedInside = this._elementRef.nativeElement.contains(event.target);
    if (!clickedInside) this.clickOutsideEmitter.emit();
  }
}
