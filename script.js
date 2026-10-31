```javascript
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');

      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ==========================================
  // CONTACT FORM — DIRECT BACKGROUND SUBMISSION
  // ==========================================

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {

    contactForm.addEventListener('submit', async (event) => {

      // Prevent the browser from opening an email application
      event.preventDefault();

      // Validate required fields
      if (!contactForm.reportValidity()) {
        return;
      }

      const status = document.getElementById('contact-form-status');
      const submitButton = contactForm.querySelector('[type="submit"]');

      // Prevent multiple submissions
      if (submitButton && submitButton.disabled) {
        return;
      }

      const originalButtonText = submitButton
        ? submitButton.textContent
        : '';

      // Show sending status
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      if (status) {
        status.textContent = 'Sending your enquiry...';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
      }

      // Collect form information
      const formData = new FormData(contactForm);

      // Configure email details
      formData.set(
        '_subject',
        'New Sterling Alliance Website Enquiry'
      );

      formData.set('_template', 'table');

      try {

        // Submit directly to FormSubmit in the background
        const response = await fetch(
          'https://formsubmit.co/ajax/echim0909@gmail.com',
          {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        // Read the service response
        const result = await response.json();

        // Check whether the submission was accepted
        if (
          !response.ok ||
          result.success === false ||
          result.success === 'false'
        ) {
          throw new Error(
            result.message || 'The email service rejected the submission.'
          );
        }

        // Display confirmation
        if (status) {
          status.textContent =
            'Thank you! Your enquiry has been submitted successfully.';
        }

        // Clear the form after successful submission
        contactForm.reset();

      } catch (error) {

        // Log details for troubleshooting
        console.error('Sterling Alliance contact form error:', error);

        // Display an error without redirecting
        if (status) {
          status.textContent =
            'Sorry, your message could not be submitted. Please try again later.';
        }

      } finally {

        // Restore the submit button
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }

      }

    });

  }

});
```