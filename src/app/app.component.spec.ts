import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`has the 'mawuli' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toEqual('mawuli');
  });

  it('renders the skip-to-content link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const skip = (fixture.nativeElement as HTMLElement).querySelector('.skip-to-content');
    expect(skip?.textContent).toContain('Skip to content');
  });

  it('starts with chromeless=false when html.chromeless is not present', () => {
    document.documentElement.classList.remove('chromeless');
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.chromeless).toBe(false);
  });

  it('starts with chromeless=true when html.chromeless is present', () => {
    document.documentElement.classList.add('chromeless');
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.chromeless).toBe(true);
    // cleanup so it doesn't leak into other tests
    document.documentElement.classList.remove('chromeless');
  });
});
