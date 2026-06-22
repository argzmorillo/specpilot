import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Menu } from 'lucide-angular';

import { MobileHeaderComponent } from './mobile-header.component';

describe('MobileHeaderComponent', () => {
  let component: MobileHeaderComponent;
  let fixture: ComponentFixture<MobileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileHeaderComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('menuIcon', Menu);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit openMenu event', () => {
    let emitted = false;

    component.openMenu.subscribe(() => {
      emitted = true;
    });

    component.onOpenMenu();

    expect(emitted).toBeTrue();
  });

  it('should render title', () => {
    fixture.componentRef.setInput('title', 'Test Header');

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Test Header');
  });
});
