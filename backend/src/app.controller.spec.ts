import { TestBed } from '@angular/core/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppController],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppController);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
