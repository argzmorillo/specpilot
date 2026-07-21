import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisSidebarNavigationComponent } from './analysis-sidebar-navigation.component';

describe('AnalysisSidebarNavigationComponent', () => {
  let component: AnalysisSidebarNavigationComponent;
  let fixture: ComponentFixture<AnalysisSidebarNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisSidebarNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisSidebarNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
