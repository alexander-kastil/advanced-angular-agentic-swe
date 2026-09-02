import { Component } from '@angular/core';
import { HoverListenerDirective } from './hover-listener.directive';
import { BindingComponent } from './binding/binding.component';

@Component({
    selector: 'app-host-binding-listener',
    templateUrl: './host-binding-listener.component.html',
    styleUrls: ['./host-binding-listener.component.scss'],
    imports: [
        BindingComponent,
        HoverListenerDirective,
    ],
})
export class HostBindingListenerComponent { }
