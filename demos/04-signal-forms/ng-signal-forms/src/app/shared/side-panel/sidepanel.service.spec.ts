import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SidePanelService } from './sidepanel.service';
import { SidebarActions } from './sidebar.actions';

describe('SidePanelService', () => {
    let service: SidePanelService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SidePanelService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return HIDE_MARKDOWN initially', () => {
        expect(service.getCommands()()).toBe(SidebarActions.HIDE_MARKDOWN);
    });

    it('should trigger SHOW_MARKDOWN command', () => {
        service.triggerCmd(SidebarActions.SHOW_MARKDOWN);
        expect(service.getCommands()()).toBe(SidebarActions.SHOW_MARKDOWN);
    });

    it('should trigger HIDE_MARKDOWN command', () => {
        service.triggerCmd(SidebarActions.SHOW_MARKDOWN);
        service.triggerCmd(SidebarActions.HIDE_MARKDOWN);
        expect(service.getCommands()()).toBe(SidebarActions.HIDE_MARKDOWN);
    });
});
