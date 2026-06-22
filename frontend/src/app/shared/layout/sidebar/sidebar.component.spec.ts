import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('history', []);
    fixture.componentRef.setInput('historyLoading', false);
    fixture.componentRef.setInput('historyError', null);
    fixture.componentRef.setInput('selectedHistoryItemId', null);
    fixture.componentRef.setInput('isMobile', false);
    fixture.componentRef.setInput('closeIcon', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
