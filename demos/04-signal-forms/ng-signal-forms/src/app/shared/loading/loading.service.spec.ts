import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    let service: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoadingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return false initially', () => {
        expect(service.getLoading()()).toBe(false);
    });

    it('should set loading to true', () => {
        service.setLoading(true);
        expect(service.getLoading()()).toBe(true);
    });

    it('should set loading back to false', () => {
        service.setLoading(true);
        service.setLoading(false);
        expect(service.getLoading()()).toBe(false);
    });
});
