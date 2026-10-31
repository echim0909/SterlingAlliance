document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }


  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const status = document.getElementById('contact-form-status');

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      // Honeypot field helps reject simple automated spam submissions.
      const data = new FormData(contactForm);
      if (String(data.get('_honey') || '').trim()) return;

      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const company = String(data.get('company') || '').trim();
      const topic = String(data.get('topic') || '').trim();
      const message = String(data.get('message') || '').trim();
      if (!name || !email || !topic || !message) {
        if (status) status.textContent = 'Please complete all required fields.';
        return;
      }

      data.set('_subject', `Sterling Alliance website enquiry: ${topic}`);
      data.set('_template', 'table');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
      }
      if (status) status.textContent = 'Sending your message…';

      try {
        const response = await fetch('https://formsubmit.co/ajax/echim0909@gmail.com', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.message || 'The message could not be sent.');
        }
        contactForm.reset();
        if (status) status.textContent = 'Thank you. Your message has been submitted. Sterling Alliance will follow up using the email address you provided.';
      } catch (error) {
        if (status) status.textContent = 'We could not send your message just now. Please try again, or email echim0909@gmail.com directly.';
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send message ↗';
        }
      }
    });
  }
});
