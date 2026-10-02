const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const quickReplyButtons = document.querySelectorAll('.quick-reply');

const botResponses = {
  default: 'I can help with micro-lot availability, sample requests, and forward contracting. Tell me your preferred origin, volume range, or shipping window.',
  availability: 'We typically allocate the next 2–4 months of micro-lots based on harvest stage and roasting profile. Share your preferred origin and volume range, and I’ll recommend a fit.',
  sample: 'Sample requests are usually dispatched within 48 hours after we confirm your preferred lot type and roast profile. I can guide you toward the closest matching micro-lot.',
  contract: 'Forward contracts are best for roasters planning a seasonal allocation. We can coordinate pricing, deposit terms, and delivery timing based on your forecast window.',
  kenya: 'Kenyan washed lots are popular for clarity and citrus notes. We can review current lot sizes and traceability details for your target quantity.',
  ethiopia: 'Ethiopian lots often suit floral, tea-like profiles. We can match you with a harvest lot that fits your preferred cup character and shipping timeline.',
  colombia: 'Colombian honey and washed lots can be strong for balance and sweetness. I can recommend current availability based on your roast profile.',
  volume: 'We commonly support allocations from 250kg up to multi-container volumes. Tell me your total monthly target and I can suggest a contracting structure.',
  pricing: 'Pricing depends on origin, harvest timing, and contracting terms. If you share your estimated annual volume and desired arrival month, I can outline a realistic structure.'
};

function addMessage(text, type = 'bot') {
  const wrapper = document.createElement('div');
  const isUser = type === 'user';
  wrapper.className = `max-w-[85%] rounded-2xl p-3 text-sm leading-6 ${
    isUser ? 'ml-auto rounded-br-md bg-phibean-300 text-stone-950' : 'rounded-bl-md bg-white/5 text-stone-100'
  }`;
  wrapper.textContent = text;
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotReply(input) {
  const normalized = input.toLowerCase();

  if (normalized.includes('kenya') || normalized.includes('washed')) return botResponses.kenya;
  if (normalized.includes('ethiopia') || normalized.includes('floral')) return botResponses.ethiopia;
  if (normalized.includes('colombia') || normalized.includes('honey')) return botResponses.colombia;
  if (normalized.includes('sample')) return botResponses.sample;
  if (normalized.includes('contract') || normalized.includes('forward')) return botResponses.contract;
  if (normalized.includes('price') || normalized.includes('cost')) return botResponses.pricing;
  if (normalized.includes('volume') || normalized.includes('quantity')) return botResponses.volume;
  if (normalized.includes('avail') || normalized.includes('lot')) return botResponses.availability;

  return botResponses.default;
}

function toggleChat(open) {
  chatPanel.classList.toggle('hidden', !open);
}

chatToggle.addEventListener('click', () => {
  const isHidden = chatPanel.classList.contains('hidden');
  toggleChat(isHidden);
});

chatClose.addEventListener('click', () => toggleChat(false));

quickReplyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.textContent.trim();
    addMessage(value, 'user');
    addMessage(generateBotReply(value), 'bot');
  });
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();

  if (!value) return;

  addMessage(value, 'user');
  addMessage(generateBotReply(value), 'bot');
  chatInput.value = '';
});

const triggerButtons = document.querySelectorAll('a[href="#contact"], button[type="submit"]');
triggerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.closest('form') && button.type === 'submit') return;
    setTimeout(() => toggleChat(true), 250);
  });
});
