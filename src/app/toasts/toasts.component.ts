import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { ToastsService } from '../toasts.service';

@Component({
  selector: 'toasts',
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsComponent {
  constructor(public toastService: ToastsService) {}
  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}