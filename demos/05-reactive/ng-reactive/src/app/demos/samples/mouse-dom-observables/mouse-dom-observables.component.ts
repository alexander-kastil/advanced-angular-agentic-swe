import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { fromEvent } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-mouse-dom-observables',
  templateUrl: './mouse-dom-observables.component.html',
  styleUrls: ['./mouse-dom-observables.component.scss'],
  imports: [
    MatButton,
    BoxedDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MouseDomObservablesComponent {
  signPad = viewChild<ElementRef>('signPad');
  result = signal<{ X: number; Y: number }>({ X: -1, Y: -1 });
  cx: CanvasRenderingContext2D | null = null;

  subscribeMouse() {
    console.log('subscribeMouse');
    this.captureEvents();
  }

  captureEvents() {
    const pad = this.signPad();
    if (pad) {
      const canvasEl: HTMLCanvasElement = pad.nativeElement;
      const rect = canvasEl.getBoundingClientRect();

      // set the internal canvas to the correct aspect ratio of the element
      this.cx = canvasEl.getContext('2d');
      if (this.cx) {
        this.cx.canvas.width = rect.width;
        this.cx.canvas.height = rect.height;
        this.cx.lineWidth = 2;
        this.cx.lineCap = 'round';

        // this will capture all mousedown events from the canvas element
        const mouse$ = fromEvent<MouseEvent>(canvasEl, 'mousedown').pipe(
          switchMap((e) => {
            // after a mouse down, we'll record all mouse moves
            return fromEvent<MouseEvent>(canvasEl, 'mousemove').pipe(
              // stop once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // stop once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            );
          })
        );

        mouse$.subscribe((res: [Event, Event]) => {
          const rectangle = this.signPad()?.nativeElement.getBoundingClientRect();

          // previous and current position with the offset
          var evtA = res[0] as MouseEvent;
          var evtB = res[1] as MouseEvent;
          const prevPos = {
            x: evtA.clientX - rectangle.left,
            y: evtA.clientY - rectangle.top,
          };

          const currentPos = {
            x: evtB.clientX - rectangle.left,
            y: evtB.clientY - rectangle.top,
          };

          // do the actual drawing
          this.drawOnCanvas(prevPos, currentPos);
        });
      }
    }
  }

  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    if (!this.cx) {
      return;
    }

    if (
      Math.abs(prevPos.x - currentPos.x) > 0 ||
      Math.abs(prevPos.y - currentPos.y) > 0
    ) {
      this.cx.beginPath();
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
      this.cx.closePath();

      this.result.set({ X: currentPos.x, Y: currentPos.y });
    }
  }
}
