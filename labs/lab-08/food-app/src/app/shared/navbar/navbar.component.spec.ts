import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../material.module';
import { NavbarComponent } from './navbar.component';

describe('navbar.component', () => {
  let comp: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NavbarComponent],
    imports: [MaterialModule],
    providers: [provideHttpClient(withInterceptorsFromDi())]
}).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    comp = fixture.componentInstance;
    el = fixture.debugElement;
    comp.ngOnInit();
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should render 3 nav items', () => {
    const divs = el.queryAll(By.css('.navItem'));
    expect(divs.length).toBe(3);
  });

  it('should toggle the side menu when clicked', () => {
    let visisble = comp.ms.sideNavVisible.value;
    comp.toggleMenu();
    fixture.detectChanges();
    expect(comp.ms.sideNavVisible.value).toEqual(!visisble);
  });
});
