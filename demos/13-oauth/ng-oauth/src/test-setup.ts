import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach } from 'vitest';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideRouter([])]
  });
});
