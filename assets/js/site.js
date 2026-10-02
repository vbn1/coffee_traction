const inquiryForm = document.getElementById('roasterInquiryForm');

function captureTrafficSource(form) {
  const query = new URLSearchParams(window.location.search);
  const referrer = document.referrer ? new URL(document.referrer) : null;
  const values = {
    traffic_source: query.get('utm_source') || referrer?.hostname || 'direct',
    referrer: referrer?.origin || '',
    landing_page: window.location.pathname,
    utm_source: query.get('utm_source') || '',
    utm_medium: query.get('utm_medium') || '',
    utm_campaign: query.get('utm_campaign') || '',
    utm_content: query.get('utm_content') || '',
    utm_term: query.get('utm_term') || ''
  };

  for (const [name, value] of Object.entries(values)) {
    const field = form.querySelector(`[data-attribution="${name}"]`);
    if (field) field.value = value;
  }
}

const successMessage = inquiryForm.querySelector('[data-form-success]');
const errorMessage = inquiryForm.querySelector('[data-form-error]');

captureTrafficSource(inquiryForm);

inquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = inquiryForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  successMessage.classList.add('hidden');
  errorMessage.classList.add('hidden');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  try {
    const response = await fetch(inquiryForm.action, {
      method: 'POST',
      body: new FormData(inquiryForm),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error(`Form submission failed (${response.status})`);
    }

    inquiryForm.reset();
    captureTrafficSource(inquiryForm);
    successMessage.classList.remove('hidden');
  } catch (error) {
    console.error('Unable to submit form:', error);
    errorMessage.classList.remove('hidden');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

window.addEventListener('pageshow', () => {
  inquiryForm.reset();
  captureTrafficSource(inquiryForm);
  successMessage.classList.add('hidden');
  errorMessage.classList.add('hidden');
});

document.getElementById('visitButton')?.addEventListener('click', () => {
  const interest = inquiryForm?.querySelector('[name="interest"]');
  if (interest) interest.value = 'Estate visit';
});

document.getElementById('reserveLotButton')?.addEventListener('click', () => {
  const interest = inquiryForm?.querySelector('[name="interest"]');
  if (interest) interest.value = 'Spot micro-lot order';
});
