import emailjs from '@emailjs/browser';
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  isEmailConfigured,
} from './emailConfig.js';

// Honest scope note: EmailJS just emails the address to us -- it is NOT a
// mailing-list product. Until a real ESP (MailerLite / Buttondown) is wired
// up, a signup means "we've received your address", so the confirmation copy
// says exactly that rather than implying an automated welcome email.
export function initNewsletter() {
  document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-newsletter-status]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        status.textContent = 'Please enter a valid email address.';
        status.dataset.state = 'error';
        return;
      }

      const original = button.textContent;
      button.disabled = true;
      button.textContent = 'Subscribing…';
      status.textContent = '';
      delete status.dataset.state;

      try {
        if (isEmailConfigured) {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              from_name: 'Newsletter subscriber',
              from_email: email,
              services: 'Newsletter signup',
              budget: '—',
              time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            },
            { publicKey: EMAILJS_PUBLIC_KEY }
          );
        } else {
          console.warn('EmailJS not configured — newsletter signup not sent:', email);
        }
        form.reset();
        status.textContent = "You're on the list. We'll be in touch.";
        status.dataset.state = 'success';
      } catch (err) {
        console.error('Newsletter signup failed:', err);
        status.textContent = "Couldn't sign you up — please try again.";
        status.dataset.state = 'error';
      } finally {
        button.disabled = false;
        button.textContent = original;
      }
    });
  });
}
