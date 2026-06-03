import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when enabled', () => {
    let emitted = false;

    component.clicked.subscribe(() => {
      emitted = true;
    });

    component.onClick();

    expect(emitted).toBeTrue();
  });

  it('should not emit clicked event when disabled', () => {
    let emitted = false;

    component.clicked.subscribe(() => {
      emitted = true;
    });

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    component.onClick();

    expect(emitted).toBeFalse();
  });
});
