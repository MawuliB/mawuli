import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('starts in the name field state', () => {
    expect(component.currentField).toBe('name');
  });

  it('validates a missing name', () => {
    component.formData.name.value = '';
    expect(component.validateField('name')).toBe(false);
    expect(component.formData.name.errorMessage).toContain('Name');
  });

  it('validates an invalid email', () => {
    component.formData.email.value = 'not-an-email';
    expect(component.validateField('email')).toBe(false);
  });

  it('advances through the progressive form', () => {
    component.formData.name.value = 'Test User';
    component.submitField('name');
    expect(component.currentField).toBe('email');

    component.formData.email.value = 'test@example.com';
    component.submitField('email');
    expect(component.currentField).toBe('subject');
  });

  it('builds a mailto fallback with encoded values', () => {
    component.formData.name.value = 'Test';
    component.formData.email.value = 'test@example.com';
    component.formData.subject.value = 'Hi';
    component.formData.message.value = 'Body';
    const url = component.buildMailtoFallback();
    expect(url.startsWith('mailto:')).toBe(true);
    expect(url).toContain('subject=Hi');
  });
});
