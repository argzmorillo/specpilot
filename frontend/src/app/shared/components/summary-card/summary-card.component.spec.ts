import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileText } from 'lucide-angular';
import { SummaryCardComponent } from './summary-card.component';

describe('SummaryCardComponent', () => {
  let fixture: ComponentFixture<SummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCardComponent);
    fixture.componentRef.setInput('title', 'Resumen técnico');
    fixture.componentRef.setInput('content', 'Contenido de prueba');
    fixture.componentRef.setInput('icon', FileText);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title and content', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Resumen técnico');
    expect(text).toContain('Contenido de prueba');
  });
});
