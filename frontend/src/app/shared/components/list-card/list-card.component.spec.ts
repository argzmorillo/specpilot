import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListChecks } from 'lucide-angular';
import { ListCardComponent } from './list-card.component';

describe('ListCardComponent', () => {
  let fixture: ComponentFixture<ListCardComponent>;

  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListCardComponent);
    fixture.componentRef.setInput('title', 'Tareas técnicas');
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('emptyMessage', 'No hay elementos.');
    fixture.componentRef.setInput('icon', ListChecks);
    fixture.componentRef.setInput('maxVisibleItems', 3);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title and item count', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Tareas técnicas');
    expect(text).toContain('4');
  });

  it('should render only max visible items by default', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Item 1');
    expect(text).toContain('Item 2');
    expect(text).toContain('Item 3');
    expect(text).not.toContain('Item 4');
  });

  it('should render all items after clicking show all', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Item 4');
    expect(text).toContain('Ver menos');
  });

  it('should render empty message when items are empty', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('No hay elementos.');
  });
});
