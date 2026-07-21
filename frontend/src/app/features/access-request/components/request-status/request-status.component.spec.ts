import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestStatusComponent } from './request-status.component';

describe('RequestStatusComponent', () => {
  let component: RequestStatusComponent;
  let fixture: ComponentFixture<RequestStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestStatusComponent);
    component = fixture.componentInstance;
  });

  function setInputs(
    status: 'PENDING' | 'REJECTED',
    message: string | null = null,
    adminNotes: string | null = null,
  ): void {
    fixture.componentRef.setInput('status', status);
    fixture.componentRef.setInput('message', message);
    fixture.componentRef.setInput('adminNotes', adminNotes);

    fixture.detectChanges();
  }

  it('should create', () => {
    setInputs('PENDING');

    expect(component).toBeTruthy();
  });

  it('should display pending status information', () => {
    setInputs('PENDING');

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Pendiente de revisión');
    expect(text).toContain('Estamos revisando tu solicitud');
  });

  it('should display rejected status information', () => {
    setInputs('REJECTED');

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Solicitud revisada');
    expect(text).toContain('No podemos concederte acceso');
  });

  it('should display the user message when provided', () => {
    setInputs('PENDING', 'Quiero utilizar SpecPilot para mi TFG.');

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Tu mensaje');
    expect(text).toContain('Quiero utilizar SpecPilot para mi TFG.');
  });

  it('should hide the user message section when no message is provided', () => {
    setInputs('PENDING');

    const text = fixture.nativeElement.textContent;

    expect(text).not.toContain('Tu mensaje');
  });

  it('should display admin notes only for rejected requests', () => {
    setInputs('REJECTED', 'Mi mensaje', 'Necesitamos más información sobre el uso previsto.');

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Información adicional');
    expect(text).toContain('Necesitamos más información sobre el uso previsto.');
  });

  it('should not display admin notes for pending requests', () => {
    setInputs('PENDING', 'Mi mensaje', 'Estas notas no deberían mostrarse.');

    const text = fixture.nativeElement.textContent;

    expect(text).not.toContain('Información adicional');
    expect(text).not.toContain('Estas notas no deberían mostrarse.');
  });
});
