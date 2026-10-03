const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const quickReplyPanel = document.getElementById('quickReplies');
const defaultChatPlaceholder = chatInput.placeholder;
const quickReplyButtons = document.querySelectorAll('.quick-reply');
const chatInquiryForm = document.getElementById('roasterInquiryForm');
const chatOpportunityField = chatInquiryForm.querySelector('[name="interest"]');
let inquiryDraft = null;
let inquiryStep = null;
let chatSubmissionPending = false;

const opportunityTypes = [
  { label: 'Sample request', value: 'Sample request' },
  { label: 'Spot micro-lot order', value: 'Spot micro-lot order' },
  { label: 'Annual forward contract', value: 'Annual forward contract' },
  { label: 'Estate visit', value: 'Estate visit' },
  { label: 'Grower registration', value: 'Grower registration' }
];

const responses = [
  {
    matches: ['grower', 'farmer', 'register'],
    text: 'Are you a coffee grower? Share your farm, coffee, and harvest details through our grower registration form.',
    action: { label: 'Register as a grower', opportunity: 'Grower registration' }
  },
  {
    matches: ['visit', 'estate tour', 'see the farm'],
    text: 'You can enquire about an estate visit. Share your preferred dates and we’ll confirm availability and arrangements.',
    action: { label: 'Arrange an estate visit', opportunity: 'Estate visit' }
  },
  {
    matches: ['sample', 'taste', 'try'],
    text: 'Interested in tasting a lot? Request a sample and tell us which process you prefer. We’ll confirm sample availability and dispatch details.',
    action: { label: 'Request a sample', opportunity: 'Sample request' }
  },
  {
    matches: ['contract', 'forward', 'annual'],
    text: 'Planning ahead? Tell us your expected volume and delivery window, and we can discuss a forward contract for the upcoming harvest.',
    action: { label: 'Discuss a forward contract', opportunity: 'Annual forward contract' }
  },
  {
    matches: ['price', 'pricing', 'cost', 'quote'],
    text: 'Pricing depends on the lot, volume, and delivery terms. Share your requirement and destination, and we’ll confirm pricing for the available options.',
    action: { label: 'Request pricing', opportunity: 'Spot micro-lot order' }
  },
  {
    matches: ['volume', 'quantity', 'how many', 'larger order'],
    text: 'Our standard lot size is 30 kg. Current quantities and available variety/process combinations are confirmed per lot, so share the volume you need and we’ll check.',
    action: { label: 'Share your volume requirement', opportunity: 'Spot micro-lot order' }
  },
  {
    matches: ['cauvery', 's795', 'selection 9', 'chandragiri', 'variety', 'varieties'],
    text: 'The varieties in the PhiBean offering are Cauvery, S795, Selection 9, and Chandragiri. Ask us to confirm which varieties are in the current lots.',
    action: { label: 'Ask about available lots', opportunity: 'Spot micro-lot order' }
  },
  {
    matches: ['washed', 'natural', 'honey', 'process', 'processing'],
    text: 'The available processing styles are Washed, Natural, and Honey. Which process is offered depends on the current lot; we can confirm its details and cup information.',
    action: { label: 'Ask about current lots', opportunity: 'Spot micro-lot order' }
  },
  {
    matches: ['altitude', 'elevation', 'masl', 'high altitude'],
    text: 'The farms are at 1,400–1,600 metres above sea level beneath a natural forest canopy.',
    action: { label: 'Ask about sourcing', opportunity: 'Spot micro-lot order' }
  },
  {
    matches: ['harvest', 'season', 'when'],
    text: 'The harvest window is December–March. Share your timing and volume if you are planning a sample or forward contract.',
    action: { label: 'Discuss a forward contract', opportunity: 'Annual forward contract' }
  },
  {
    matches: ['cup profile', 'cupping', 'score', 'flavour', 'flavor', 'tasting notes'],
    text: 'We do not assume cup scores or flavour notes. Ask us for the verified cupping information for a specific current lot, or tell us your preferred cup profile.',
    action: { label: 'Share your cup profile', opportunity: 'Sample request' }
  },
  {
    matches: ['origin', 'mullayanagiri', 'seethalayanagiri', 'rudragiri', 'where', 'traceability'],
    text: 'PhiBean coffees come from farms in the valleys of Mullayanagiri, Seethalayanagiri, and Rudragiri in Karnataka, India. Coffee is processed at the farm, and lot details can be confirmed for each offering.',
    action: { label: 'Ask about sourcing', opportunity: 'Spot micro-lot order' }
  },
  {
    matches: ['avail', 'lot', 'coffee'],
    text: 'PhiBean offers Cauvery, S795, Selection 9, and Chandragiri, with Washed, Natural, and Honey processes. Standard lot size is 30 kg; ask us to confirm current availability, variety/process combinations, and verified cup details.',
    action: { label: 'Ask about available lots', opportunity: 'Spot micro-lot order' }
  }
];

function addButtons(wrapper, buttons) {
  if (!buttons?.length) return;

  const group = document.createElement('div');
  group.className = 'mt-3 flex flex-wrap gap-2';

  for (const { label, onClick, primary = false } of buttons) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `rounded-full border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-phibean-200 ${
      primary
        ? 'border-phibean-300 bg-phibean-300 text-stone-950'
        : 'border-white/20 text-phibean-200 hover:bg-white/10'
    }`;
    button.textContent = label;
    button.addEventListener('click', () => {
      onClick();
      group.remove();
    });
    group.appendChild(button);
  }

  wrapper.appendChild(group);
}

function addMessage(text, type = 'bot', buttons = []) {
  const wrapper = document.createElement('div');
  const isUser = type === 'user';
  wrapper.className = `max-w-[85%] rounded-2xl p-3 text-sm leading-6 ${
    isUser ? 'ml-auto rounded-br-md bg-phibean-300 text-stone-950' : 'rounded-bl-md bg-white/5 text-stone-100'
  }`;

  const message = document.createElement('p');
  message.className = 'm-0 whitespace-pre-line';
  message.textContent = text;
  wrapper.appendChild(message);
  addButtons(wrapper, buttons);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return wrapper;
}

function generateBotReply(input) {
  const normalized = input.toLowerCase();
  const response = responses.find(({ matches }) => matches.some((term) => normalized.includes(term)));

  return response || {
    text: 'I can help with available lots, samples, pricing, forward contracts, estate visits, or grower registration. What would you like to know?',
    action: null
  };
}

function askForOpportunity() {
  inquiryStep = 'opportunity';
  addMessage('What can we help you with?', 'bot', opportunityTypes.map(({ label, value }) => ({
    label,
    onClick: () => {
      addMessage(label, 'user');
      selectOpportunity(value);
    }
  })));
}

function selectOpportunity(opportunity) {
  if (!opportunityTypes.some(({ value }) => value === opportunity)) {
    throw new Error(`Unsupported inquiry opportunity: ${opportunity}`);
  }
  inquiryDraft.opportunityType = opportunity;
  if (opportunity === 'Grower registration') {
    document.dispatchEvent(new Event('phibean:grower-registration-started'));
  }
  inquiryStep = 'name';
  addMessage('First, what is your name?');
}

function startInquiry(opportunity = '') {
  inquiryDraft = {
    opportunityType: '',
    name: '',
    company: '',
    email: '',
    volume: '',
    unit: 'kg',
    notes: ''
  };
  chatInput.placeholder = 'Type your answer here';

  if (opportunity && opportunityTypes.some(({ value }) => value === opportunity)) {
    selectOpportunity(opportunity);
  } else {
    askForOpportunity();
  }
}

function askNextQuestion() {
  const isGrower = inquiryDraft.opportunityType === 'Grower registration';
  const prompts = {
    company: isGrower ? 'What is the name of your farm or estate?' : 'What is your roastery or company name?',
    email: 'What professional email address should we use to reply?',
    volume: isGrower
      ? 'How much coffee do you have available? Enter a whole number and unit, for example “500 kg” or “2 tonnes”.'
      : 'What volume do you need? The standard lot size is 30 kg. Enter a whole number and unit, for example “30 kg” or “1 tonne”.',
    notes: isGrower
      ? 'Where is your farm, and what coffee varieties and harvest details would you like to share? Type “skip” if you have nothing to add.'
      : 'Any preferred variety, process, cup profile, sample or delivery requirements, destination, or timing? Type “skip” if you have nothing to add.'
  };

  addMessage(prompts[inquiryStep]);
}

function parseVolume(value) {
  const match = value.trim().match(/^([1-9]\d*)\s*(kg|kgs|kilograms?|tonnes?|tons?|t)?$/i);
  if (!match) return null;

  const unit = match[2] || 'kg';
  return {
    amount: match[1],
    unit: /^(tonnes?|tons?|t)$/i.test(unit) ? 'tonnes' : 'kg'
  };
}

function showInquiryReview() {
  inquiryStep = 'review';
  const volumeUnit = inquiryDraft.unit === 'kg' ? 'kg' : 'tonnes';
  const notesLine = inquiryDraft.notes ? `\nDetails: ${inquiryDraft.notes}` : '';
  addMessage(
    `Please review your inquiry:\nName: ${inquiryDraft.name}\nCompany/Farm: ${inquiryDraft.company}\nEmail: ${inquiryDraft.email}\nOpportunity: ${inquiryDraft.opportunityType}\nVolume: ${inquiryDraft.volume} ${volumeUnit}${notesLine}`,
    'bot',
    [
      { label: 'Confirm and send inquiry', onClick: submitChatInquiry, primary: true },
      { label: 'Cancel', onClick: cancelInquiry }
    ]
  );
}

function processInquiryAnswer(value) {
  if (inquiryStep === 'review') {
    if (/^(cancel|stop)$/i.test(value.trim())) {
      cancelInquiry();
    } else {
      addMessage('Please use “Confirm and send inquiry” after reviewing, or choose “Cancel”.');
    }
    return;
  }

  if (inquiryStep === 'name') {
    inquiryDraft.name = value;
    inquiryStep = 'company';
  } else if (inquiryStep === 'company') {
    inquiryDraft.company = value;
    inquiryStep = 'email';
  } else if (inquiryStep === 'email') {
    const emailField = chatInquiryForm.querySelector('[name="email"]');
    emailField.value = value;
    if (!emailField.validity.valid) {
      emailField.value = '';
      addMessage('That email address doesn’t look valid. Please enter it again (for example, you@company.com).');
      return;
    }
    inquiryDraft.email = value;
    inquiryStep = 'volume';
  } else if (inquiryStep === 'volume') {
    const volume = parseVolume(value);
    if (!volume) {
      addMessage('Please enter a whole-number volume with kg or tonnes, for example “30 kg”.');
      return;
    }
    inquiryDraft.volume = volume.amount;
    inquiryDraft.unit = volume.unit;
    inquiryStep = 'notes';
  } else if (inquiryStep === 'notes') {
    inquiryDraft.notes = /^(skip|none|no)$/i.test(value.trim()) ? '' : value;
    showInquiryReview();
    return;
  }

  askNextQuestion();
}

function cancelInquiry() {
  inquiryDraft = null;
  inquiryStep = null;
  chatInput.placeholder = defaultChatPlaceholder;
  addMessage('No inquiry was sent. You can start again whenever you’re ready.');
}

function submitChatInquiry() {
  if (chatSubmissionPending) return;

  const fields = {
    name: inquiryDraft.name,
    company: inquiryDraft.company,
    email: inquiryDraft.email,
    interest: inquiryDraft.opportunityType,
    volume_requirements: inquiryDraft.volume,
    volume_unit: inquiryDraft.unit,
    notes: inquiryDraft.notes
  };

  for (const [name, value] of Object.entries(fields)) {
    chatInquiryForm.querySelector(`[name="${name}"]`).value = value;
  }

  chatOpportunityField.dispatchEvent(new Event('change', { bubbles: true }));
  if (!chatInquiryForm.reportValidity()) {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    addMessage('Please check the highlighted inquiry form fields before submitting.');
    return;
  }

  chatSubmissionPending = true;
  chatInquiryForm.requestSubmit();
  addMessage('Sending your inquiry securely…');
}

document.addEventListener('phibean:inquiry-submitted', () => {
  if (!chatSubmissionPending) return;

  chatSubmissionPending = false;
  inquiryDraft = null;
  inquiryStep = null;
  chatInput.placeholder = defaultChatPlaceholder;
  addMessage('Your inquiry has been sent. Thank you — the PhiBean team will be in touch.');
});

document.addEventListener('phibean:inquiry-submission-failed', () => {
  if (!chatSubmissionPending) return;

  chatSubmissionPending = false;
  addMessage('We couldn’t send your inquiry. Your details are still in the form; please check the form message and try again.');
});

function respondTo(input) {
  const response = generateBotReply(input);
  const buttons = response.action
    ? [{
        label: response.action.label,
        onClick: () => startInquiry(response.action.opportunity),
        primary: true
      }]
    : [];
  addMessage(response.text, 'bot', buttons);
}

function toggleChat(open) {
  chatPanel.classList.toggle('hidden', !open);
  chatToggle.setAttribute('aria-expanded', String(open));
  if (open) chatInput.focus();
}

chatToggle.addEventListener('click', () => {
  toggleChat(chatPanel.classList.contains('hidden'));
});

chatClose.addEventListener('click', () => toggleChat(false));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !chatPanel.classList.contains('hidden')) {
    toggleChat(false);
    chatToggle.focus();
  }
});

quickReplyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.textContent.trim();
    quickReplyPanel.classList.add('hidden');
    addMessage(value, 'user');

    if (button.dataset.action === 'grower-registration') {
      startInquiry('Grower registration');
    } else if (button.dataset.action === 'start-inquiry') {
      startInquiry();
    } else {
      respondTo(value);
    }
  });
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;

  addMessage(value, 'user');
  if (inquiryDraft) {
    processInquiryAnswer(value);
  } else {
    respondTo(value);
  }
  chatInput.value = '';
});
