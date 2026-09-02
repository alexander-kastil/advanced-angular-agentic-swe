import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SideNavService } from './sidenav.service';

describe('SideNavService', () => {
    let service: SideNavService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(SideNavService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have visible true initially', () => {
        expect(service.getSideNavVisible()()).toBe(true);
    });

    it('should have position side initially', () => {
        expect(service.getSideNavPosition()()).toBe('side');
    });

    it('should toggle visibility', () => {
        service.toggleMenuVisibility();
        expect(service.getSideNavVisible()()).toBe(false);
    });

    it('should toggle visibility back', () => {
        service.toggleMenuVisibility();
        service.toggleMenuVisibility();
        expect(service.getSideNavVisible()()).toBe(true);
    });

    it('should set visibility explicitly', () => {
        service.setSideNavEnabled(false);
        expect(service.getSideNavVisible()()).toBe(false);
    });

    it('should expose an empty top item list before the request resolves', () => {
        expect(service.getTopItems()()).toEqual([]);
    });

    it('should load top items from the API', async () => {
        const mockItems = [{ label: 'Home', url: 'home' }];

        TestBed.tick();
        const req = httpMock.expectOne('http://localhost:3000/top-links');
        expect(req.request.method).toBe('GET');
        req.flush(mockItems);

        await new Promise((resolve) => setTimeout(resolve));
        TestBed.tick();

        expect(service.getTopItems()()).toEqual(mockItems);
    });
});
