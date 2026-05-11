import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { Contact } from '../models/portfolio.model';

interface FormField {
  name: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
}

// To enable real form submissions, create a free Formspree form at
// https://formspree.io and replace the `your-form-id` below with the one
// they give you (looks like https://formspree.io/f/abcd1234).
// If left as 'your-form-id', the form falls back to opening the user's
// email client via a mailto: link.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkoykvpg';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  contactInfo: Contact | null = null;
  isLoading = true;

  // Form state
  currentField:
    | 'name'
    | 'email'
    | 'subject'
    | 'message'
    | 'submit'
    | 'complete' = 'name';

  formData: {
    name: FormField;
    email: FormField;
    subject: FormField;
    message: FormField;
  } = {
    name: { name: 'name', value: '', isValid: false, errorMessage: '' },
    email: { name: 'email', value: '', isValid: false, errorMessage: '' },
    subject: { name: 'subject', value: '', isValid: false, errorMessage: '' },
    message: { name: 'message', value: '', isValid: false, errorMessage: '' },
  };

  commandHistory: string[] = [];
  isSubmitting = false;
  isSubmitted = false;

  constructor(private portfolioService: PortfolioDataService) {}

  ngOnInit(): void {
    this.loadContactInfo();
  }

  loadContactInfo(): void {
    this.portfolioService.getContact().subscribe((data: Contact) => {
      this.contactInfo = data;
      this.isLoading = false;
      this.addCommandToHistory('$ contact --help');
      this.addCommandToHistory(
        'Contact form initialized. Type your responses and press Enter.'
      );
    });
  }

  addCommandToHistory(command: string): void {
    this.commandHistory.push(command);
  }

  validateField(fieldName: 'name' | 'email' | 'subject' | 'message'): boolean {
    const field = this.formData[fieldName];

    switch (fieldName) {
      case 'name':
        if (!field.value.trim()) {
          field.errorMessage = 'Error: Name cannot be empty';
          field.isValid = false;
        } else if (field.value.trim().length < 2) {
          field.errorMessage = 'Error: Name must be at least 2 characters';
          field.isValid = false;
        } else {
          field.isValid = true;
          field.errorMessage = '';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!field.value.trim()) {
          field.errorMessage = 'Error: Email cannot be empty';
          field.isValid = false;
        } else if (!emailRegex.test(field.value)) {
          field.errorMessage = 'Error: Invalid email format';
          field.isValid = false;
        } else {
          field.isValid = true;
          field.errorMessage = '';
        }
        break;

      case 'subject':
        if (!field.value.trim()) {
          field.errorMessage = 'Error: Subject cannot be empty';
          field.isValid = false;
        } else if (field.value.trim().length < 3) {
          field.errorMessage = 'Error: Subject must be at least 3 characters';
          field.isValid = false;
        } else {
          field.isValid = true;
          field.errorMessage = '';
        }
        break;

      case 'message':
        if (!field.value.trim()) {
          field.errorMessage = 'Error: Message cannot be empty';
          field.isValid = false;
        } else if (field.value.trim().length < 10) {
          field.errorMessage = 'Error: Message must be at least 10 characters';
          field.isValid = false;
        } else {
          field.isValid = true;
          field.errorMessage = '';
        }
        break;
    }

    return field.isValid;
  }

  submitField(fieldName: 'name' | 'email' | 'subject' | 'message'): void {
    if (this.validateField(fieldName)) {
      const field = this.formData[fieldName];
      this.addCommandToHistory(`$ ${fieldName}: ${field.value}`);
      this.addCommandToHistory(`✓ ${fieldName} accepted`);

      // Move to next field
      switch (fieldName) {
        case 'name':
          this.currentField = 'email';
          break;
        case 'email':
          this.currentField = 'subject';
          break;
        case 'subject':
          this.currentField = 'message';
          break;
        case 'message':
          this.currentField = 'submit';
          break;
      }
    } else {
      this.addCommandToHistory(this.formData[fieldName].errorMessage);
    }
  }

  submitForm(): void {
    const allValid =
      this.validateField('name') &&
      this.validateField('email') &&
      this.validateField('subject') &&
      this.validateField('message');

    if (!allValid) return;

    this.isSubmitting = true;
    this.addCommandToHistory('$ submit --confirm');
    this.addCommandToHistory('Sending message...');

    // If Formspree isn't configured yet, fall back to a mailto link.
    if (FORMSPREE_ENDPOINT.endsWith('your-form-id')) {
      this.addCommandToHistory(
        'ℹ Formspree endpoint not configured; opening email client instead.'
      );
      window.location.href = this.buildMailtoFallback();
      this.completeSubmission();
      return;
    }

    const payload = {
      name: this.formData.name.value,
      email: this.formData.email.value,
      subject: this.formData.subject.value,
      message: this.formData.message.value,
      _replyto: this.formData.email.value,
    };

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Formspree responded with ${res.status}`);
        this.completeSubmission();
      })
      .catch((err) => {
        this.isSubmitting = false;
        this.addCommandToHistory(`✗ Send failed: ${err.message}`);
        this.addCommandToHistory('Tip: use the mailto fallback link below.');
      });
  }

  private completeSubmission(): void {
    this.isSubmitting = false;
    this.isSubmitted = true;
    this.currentField = 'complete';
    this.addCommandToHistory('✓ Message sent successfully!');
    this.addCommandToHistory(
      `Thank you, ${this.formData.name.value}! I'll get back to you soon.`
    );
  }

  buildMailtoFallback(): string {
    const to = this.contactInfo?.email || 'mawulibadassou5@gmail.com';
    const subject = encodeURIComponent(this.formData.subject.value || 'Hello from your portfolio');
    const body = encodeURIComponent(
      `From: ${this.formData.name.value} <${this.formData.email.value}>\n\n${this.formData.message.value}`
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }

  resetForm(): void {
    this.formData.name.value = '';
    this.formData.email.value = '';
    this.formData.subject.value = '';
    this.formData.message.value = '';

    this.formData.name.isValid = false;
    this.formData.email.isValid = false;
    this.formData.subject.isValid = false;
    this.formData.message.isValid = false;

    this.currentField = 'name';
    this.isSubmitted = false;
    this.commandHistory = [];
    this.addCommandToHistory('$ contact --reset');
    this.addCommandToHistory('Form reset. Starting over...');
  }

  getSocialIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      github: '🔗',
      linkedin: '💼',
      twitter: '🐦',
      dev: '📝',
    };
    return icons[iconName] || '🔗';
  }
}
