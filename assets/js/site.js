const inquiryForm = document.getElementById('roasterInquiryForm');
const opportunityField = inquiryForm.querySelector('[name="interest"]');
const companyLabel = inquiryForm.querySelector('label[for="company"]');
const companyField = inquiryForm.querySelector('[name="company"]');
const volumeLabel = inquiryForm.querySelector('label[for="volume"]');
const volumeField = inquiryForm.querySelector('[name="volume_requirements"]');
const notesField = inquiryForm.querySelector('[name="notes"]');
const standardFormCopy = {
  companyLabel: companyLabel.textContent,
  companyPlaceholder: companyField.placeholder,
  volumeLabel: volumeLabel.textContent,
  volumePlaceholder: volumeField.placeholder,
  notesPlaceholder: notesField.placeholder
};

function updateInquiryContext() {
  const isGrowerRegistration = opportunityField.value === 'Grower registration';

  companyLabel.textContent = isGrowerRegistration ? 'Farm or Estate Name' : standardFormCopy.companyLabel;
  companyField.placeholder = isGrowerRegistration ? 'Your farm or estate name' : standardFormCopy.companyPlaceholder;
  volumeLabel.textContent = isGrowerRegistration ? 'Available Coffee Volume' : standardFormCopy.volumeLabel;
  volumeField.placeholder = isGrowerRegistration ? 'Available volume' : standardFormCopy.volumePlaceholder;
  notesField.placeholder = isGrowerRegistration
    ? 'Share your farm location, coffee varieties, growing practices, and harvest details.'
    : standardFormCopy.notesPlaceholder;
}

function startGrowerRegistration() {
  opportunityField.value = 'Grower registration';
  updateInquiryContext();
  document.dispatchEvent(new Event('phibean:grower-registration-started'));
}

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

    document.dispatchEvent(new CustomEvent('phibean:inquiry-submitted', {
      detail: { opportunityType: opportunityField.value }
    }));

    if (opportunityField.value === 'Grower registration') {
      document.dispatchEvent(new Event('phibean:grower-registration-submitted'));
    }

    inquiryForm.reset();
    captureTrafficSource(inquiryForm);
    updateInquiryContext();
    successMessage.classList.remove('hidden');
  } catch (error) {
    console.error('Unable to submit form:', error);
    document.dispatchEvent(new Event('phibean:inquiry-submission-failed'));
    errorMessage.classList.remove('hidden');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

window.addEventListener('pageshow', () => {
  inquiryForm.reset();
  captureTrafficSource(inquiryForm);
  updateInquiryContext();
  successMessage.classList.add('hidden');
  errorMessage.classList.add('hidden');
});

opportunityField.addEventListener('change', (event) => {
  updateInquiryContext();
  if (opportunityField.value === 'Grower registration' && event.isTrusted) {
    document.dispatchEvent(new Event('phibean:grower-registration-started'));
  }
});

document.getElementById('visitButton')?.addEventListener('click', () => {
  opportunityField.value = 'Estate visit';
  updateInquiryContext();
});

document.querySelectorAll('[data-opportunity]').forEach((link) => {
  link.addEventListener('click', () => {
    opportunityField.value = link.dataset.opportunity;
    updateInquiryContext();
  });
});

document.querySelectorAll('[data-grower-registration]').forEach((link) => {
  link.addEventListener('click', () => {
    startGrowerRegistration();
  });
});

updateInquiryContext();
