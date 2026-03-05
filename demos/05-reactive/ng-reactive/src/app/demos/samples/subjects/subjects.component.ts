import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectsComponent {

  sub$: Subject<number> = new Subject<number>();

  bs$: BehaviorSubject<number> = new BehaviorSubject<number>(-1); // -1 is initialization value - requires

  rs$: ReplaySubject<number> = new ReplaySubject<number>(2); // 2 is number of replay subjects

  as$: AsyncSubject<number> = new AsyncSubject<number>();

  runSubjectInit() {
    console.log('init subject');
    this.sub$.next(0);
    this.sub$.subscribe((val) => console.log('Subscriber A', val));
    this.sub$.subscribe((val) => console.log('Subscriber B', val));
    this.sub$.next(10);
  }

  emitNext() {
    this.sub$.subscribe((val) => console.log('Subscriber Late', val));
    this.sub$.next(20);
  }

  runBSubjectInit() {
    console.log('init behaviour subject');
    this.bs$.next(0);
    this.bs$.subscribe((val) => console.log('BS Subscriber A', val));
    this.bs$.subscribe((val) => console.log('BS Subscriber B', val));
    this.bs$.next(10);
    this.bs$.next(11);
    this.bs$.next(15);
  }

  emitNextBS() {
    this.bs$.subscribe((val) => console.log('Subscriber Late', val));
    this.bs$.next(20);
  }

  runRPSubjectInit() {
    console.log('init replay subject');
    this.rs$.next(0);
    this.rs$.subscribe((val) => console.log('RS Subscriber A', val));
    this.rs$.subscribe((val) => console.log('RS Subscriber B', val));
    this.rs$.next(10);
  }

  emitNextRS() {
    this.rs$.subscribe((val) => console.log('Subscriber Late', val));
    this.rs$.next(20);
  }

  runASubjectInit() {
    console.log('init async subject - nothing will be emitted until complete is called');
    this.as$.next(0);
    this.as$.subscribe((val) => console.log('RS Subscriber A', val));
    this.as$.subscribe((val) => console.log('RS Subscriber B', val));
    this.as$.next(10);
  }

  emitNextAS() {
    this.as$.subscribe(
      (val) => console.log('Subscriber Late', val),
    );
    console.log('completing async subject in order to emit last value');
    this.as$.complete();
  }
}
