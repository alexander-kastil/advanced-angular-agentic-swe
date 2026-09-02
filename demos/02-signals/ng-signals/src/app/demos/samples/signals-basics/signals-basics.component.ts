import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { Topic } from './topic.model';
import { BorderDirective, CenteredDirective } from '../../../shared/formatting/formatting-directives';
@Component({
  selector: 'app-signals-basics',
  templateUrl: './signals-basics.component.html',
  styleUrls: ['./signals-basics.component.scss'],
  imports: [
    BorderDirective,
    CenteredDirective
  ]
})
export class SignalsBasicsComponent {
  injector = inject(Injector)

  netAmount = signal<number>(0);
  myString = signal('Hello World')
  topic = signal<Topic>({ name: 'Angular Signals', likes: 0 });

  tax = signal(0.2).asReadonly();
  grossAmount = computed(() => this.netAmount() * (1 + this.tax()));

  constructor() {
    effect(() => {
      console.log('totalAmount changed', this.netAmount());
      console.log('grossAmount changed', this.grossAmount());
    });
  }

  logChanges = effect(() => {
    console.log('amount changed declarative effect function', this.netAmount());
  });

  logLikes() {
    effect(() => {
      console.log('there was a like', this.topic());
    }, { injector: this.injector });
  }

  updateAmount() {
    this.netAmount.set(100);
  }

  addAmount() {
    this.netAmount.update(curr => curr + 10);
  }

  likeTopic() {
    this.topic.update(curr => {
      curr.likes++;
      return curr;
    });
  }
}
