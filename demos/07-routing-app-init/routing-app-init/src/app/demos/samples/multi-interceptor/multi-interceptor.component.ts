import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-multi-interceptor',
  templateUrl: './multi-interceptor.component.html',
  styleUrls: ['./multi-interceptor.component.scss'],
  imports: [MarkdownRendererComponent, JsonPipe],
})
export class MultiInterceptorComponent {
  protected readonly requestUrl = signal('https://jsonplaceholder.typicode.com/todos/1');

  protected readonly data = httpResource<unknown>(() => this.requestUrl());

  protected requestData() {
    this.requestUrl.set('https://jsonplaceholder.typicode.com/todos/1');
  }

  protected requestXMLData() {
    this.requestUrl.set(
      'https://api.openweathermap.org/data/2.5/weather?q=London&mode=xml&appid=25a0801691214cdec4c44e5b125b6396'
    );
  }

  protected request404Data() {
    this.requestUrl.set('https://jsonplaceholder.typicode.com/todos/7878');
  }
}
