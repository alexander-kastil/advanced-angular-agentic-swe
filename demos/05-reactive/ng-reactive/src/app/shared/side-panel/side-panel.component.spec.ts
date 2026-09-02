import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidePanelComponent } from './side-panel.component';
import { LayoutStore } from '../layout/layout.store';
import { SideNavService } from '../sidenav/sidenav.service';

describe('SidePanelComponent', () => {
    let component: SidePanelComponent;
    let fixture: ComponentFixture<SidePanelComponent>;
    let layoutStore: InstanceType<typeof LayoutStore>;
    let sideNavService: SideNavService;

    beforeEach(async () => {
        localStorage.clear();
        await TestBed.configureTestingModule({
            imports: [SidePanelComponent],
            providers: [provideRouter([]), LayoutStore, SideNavService],
        }).compileComponents();

        fixture = TestBed.createComponent(SidePanelComponent);
        component = fixture.componentInstance;
        layoutStore = TestBed.inject(LayoutStore);
        sideNavService = TestBed.inject(SideNavService);
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('creates', () => {
        expect(component).toBeTruthy();
    });

    it('delegates showGuide to the layout store', () => {
        const spy = vi.spyOn(layoutStore, 'showGuide');
        component.showGuide();
        expect(spy).toHaveBeenCalled();
    });

    it('delegates toggleEditor to the layout store', () => {
        const spy = vi.spyOn(layoutStore, 'toggleEditor');
        component.toggleEditor();
        expect(spy).toHaveBeenCalled();
    });

    it('toggles sidenav visibility via the service', () => {
        const spy = vi.spyOn(sideNavService, 'toggleMenuVisibility');
        component.toggleSideNav();
        expect(spy).toHaveBeenCalled();
    });
});
