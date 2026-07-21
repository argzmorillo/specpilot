import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../../auth/auth.service';
import { LayoutStore } from '../store/layout.store';
import { ApplicationLayoutComponent } from './application-layout.component';

describe('ApplicationLayoutComponent', () => {
  let component: ApplicationLayoutComponent;
  let fixture: ComponentFixture<ApplicationLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationLayoutComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUsername: () => 'Adrián',
            logout: jasmine.createSpy('logout'),
          },
        },
        {
          provide: LayoutStore,
          useValue: {
            sidebarComponent: () => null,
            mobileMenuOpen: () => false,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
