import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SignalQueriesComponent } from './signal-queries.component';

describe('SignalQueriesComponent', () => {
    let component: SignalQueriesComponent;
    let fixture: ComponentFixture<SignalQueriesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignalQueriesComponent],
            providers: [provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(SignalQueriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('resolves viewChildren without a lifecycle hook', () => {
        expect(component.fieldCount()).toBe(2);
    });

    it('writes the calculated cost through viewChild.required', () => {
        component.liters().nativeElement.value = '4';
        component.calculate();
        expect(component.cost().nativeElement.value).toBe('5.00');
    });

    it('pulses the badge queried by component type', () => {
        component.tagFields();
        expect(component.badge().label()).toBe('2 fields tagged');
        expect(component.liters().nativeElement.placeholder).toBe('field 1');
    });
});
