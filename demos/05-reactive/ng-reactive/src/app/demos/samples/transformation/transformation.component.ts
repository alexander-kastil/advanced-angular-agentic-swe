import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { fromEvent, interval, of } from 'rxjs';
import {
  concatMap,
  delay, exhaustMap, mergeMap,
  switchMap, take, tap
} from 'rxjs/operators';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { TopicService } from '../../topics/topic.service';

@Component({
  selector: 'app-transformation',
  templateUrl: './transformation.component.html',
  styleUrls: ['./transformation.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    BoxedDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransformationComponent {
  ts = inject(TopicService);

  useSwitchMap() {
    console.clear();
    fromEvent(document, 'click')
      .pipe(
        // restart counter on every click
        switchMap(() => interval(1000).pipe(take(5)))
      )
      .subscribe(console.log);
  }

  useConcatMap() {
    const source = of('Hello', 'Goodbye', 'Never mind');

    //can also be used with promises
    const examplePromise = (val: string) =>
      new Promise((resolve) => resolve(`${val} World!`));

    //result of first param passed to second param selector function before being  returned
    const example = source.pipe(concatMap((val) => examplePromise(val)));
    example.subscribe((val) => console.log('Result:', val));
  }

  useMergeMap() {
    // faking network request for save
    const saveLocation = (location: any) => {
      return of(location).pipe(delay(1500));
    };

    // click as stream
    const click$ = fromEvent(document, 'click');
    click$
      .pipe(
        mergeMap((e: Event) => {
          return saveLocation({
            x: (e as MouseEvent).clientX,
            y: (e as MouseEvent).clientY,
            timestamp: Date.now(),
          });
        })
      )
      .subscribe((r) => console.log('Saved!', r));
  }

  useExhaustMap() {
    fromEvent(document, 'click')
      .pipe(
        exhaustMap(() =>
          this.ts.insertTopicSlow({ id: 0, title: 'a new topic', sortOrder: 9 })
        ),
        delay(3000),
        tap(() => console.log('save completed'))
      )
      .subscribe();
  }
}
