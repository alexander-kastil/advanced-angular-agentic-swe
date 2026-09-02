import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
            providers: [LayoutStore, SideNavService]
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call layout.showGuide on showGuide', () => {
        const spy = vi.spyOn(layoutStore, 'showGuide');
        component.showGuide();
        expect(spy).toHaveBeenCalled();
    });

    it('should call layout.toggleEditor on toggleEditor', () => {
        const spy = vi.spyOn(layoutStore, 'toggleEditor');
        component.toggleEditor();
        expect(spy).toHaveBeenCalled();
    });

    it('should toggle sidenav visibility via service', () => {
        const spy = vi.spyOn(sideNavService, 'toggleMenuVisibility');
        component.toggleSideNav();
        expect(spy).toHaveBeenCalled();
    });
});