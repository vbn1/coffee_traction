document.addEventListener('phibean:grower-registration-started', () => {
  window.umami?.track?.('grower_registration_started');
});

document.addEventListener('phibean:inquiry-submitted', (event) => {
  window.umami?.track?.('inquiry_submitted', {
    opportunity_type: event.detail.opportunityType
  });
});

document.addEventListener('phibean:grower-registration-submitted', () => {
  window.umami?.track?.('grower_registration_submitted');
});
