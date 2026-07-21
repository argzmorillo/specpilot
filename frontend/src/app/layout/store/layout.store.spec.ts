import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LayoutStore } from './layout.store';

@Component({
  selector: 'app-test-sidebar',
  template: '',
})
class TestSidebarComponent {}

@Component({
  selector: 'app-other-sidebar',
  template: '',
})
class OtherSidebarComponent {}

describe('LayoutStore', () => {
  let store: LayoutStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutStore],
    });

    store = TestBed.inject(LayoutStore);
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(store.sidebarComponent()).toBeNull();
    expect(store.mobileMenuOpen()).toBeFalse();
  });

  it('should show sidebar navigation', () => {
    store.showSidebarNavigation(TestSidebarComponent);

    expect(store.sidebarComponent()).toBe(TestSidebarComponent);
  });

  it('should replace the current sidebar navigation', () => {
    store.showSidebarNavigation(TestSidebarComponent);
    store.showSidebarNavigation(OtherSidebarComponent);

    expect(store.sidebarComponent()).toBe(OtherSidebarComponent);
  });

  it('should hide sidebar navigation without a component argument', () => {
    store.showSidebarNavigation(TestSidebarComponent);

    store.hideSidebarNavigation();

    expect(store.sidebarComponent()).toBeNull();
  });

  it('should hide sidebar navigation when the provided component matches', () => {
    store.showSidebarNavigation(TestSidebarComponent);

    store.hideSidebarNavigation(TestSidebarComponent);

    expect(store.sidebarComponent()).toBeNull();
  });

  it('should not hide sidebar navigation when the provided component does not match', () => {
    store.showSidebarNavigation(TestSidebarComponent);

    store.hideSidebarNavigation(OtherSidebarComponent);

    expect(store.sidebarComponent()).toBe(TestSidebarComponent);
  });

  it('should open the mobile menu', () => {
    store.openMobileMenu();

    expect(store.mobileMenuOpen()).toBeTrue();
  });

  it('should close the mobile menu', () => {
    store.openMobileMenu();

    store.closeMobileMenu();

    expect(store.mobileMenuOpen()).toBeFalse();
  });
});
