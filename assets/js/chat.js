const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const quickReplyButtons = document.querySelectorAll('.quick-reply');

const botResponses = {
  default: 'We grow single-origin Arabica in the foothills of Mullayyanagiri. Current listed lots are Arabica naturals and washed, 50 kg each, with a Jan–Mar harvest window. Ask me about a lot, samples, contracts, pricing, or a farm visit.',
  availability: 'The current listed lots are 50 kg of Arabica naturals (82+ cup score potential) and 50 kg of Arabica washed (85+ cup score potential). The harvest window is Jan–Mar. Please contact us to confirm availability.',
  naturals: 'Arabica naturals: 50 kg, with 82+ cup score potential. Harvest window: Jan–Mar. Contact us to confirm current availability and request details.',
  washed: 'Arabica washed: 50 kg, with 85+ cup score potential. Harvest window: Jan–Mar. Contact us to confirm current availability and request details.',
  sample: 'Tell us which lot you are interested in and request a sample through the inquiry form. Our team can confirm sample availability and dispatch timing.',
  contract: 'We can discuss a forward contract for the Jan–Mar harvest. Pricing, quantities, and delivery terms need to be confirmed with our team through an inquiry.',
  origin: 'Our coffee is single-origin Arabica from the foothills of Mullayyanagiri. The listed lots are processed as naturals and washed.',
  volume: 'The lots currently listed are 50 kg each: one natural and one washed. Ask our team to confirm availability or discuss a larger requirement.',
  pricing: 'Prices are not listed here. Send an inquiry with the lot you are interested in and your required quantity so our team can provide current pricing and terms.',
  visit: 'You are welcome to visit the estate and inspect the lots in person. Use the “Schedule a visit” option in the inquiry form and our team can coordinate the details.'
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

  if (normalized.includes('visit') || normalized.includes('estate') || normalized.includes('farm')) return botResponses.visit;
  if (normalized.includes('sample')) return botResponses.sample;
  if (normalized.includes('contract') || normalized.includes('forward')) return botResponses.contract;
  if (normalized.includes('price') || normalized.includes('pricing') || normalized.includes('cost') || normalized.includes('quote')) return botResponses.pricing;
  if (normalized.includes('volume') || normalized.includes('quantity') || normalized.includes('how many')) return botResponses.volume;
  if (normalized.includes('natural')) return botResponses.naturals;
  if (normalized.includes('washed')) return botResponses.washed;
  if (normalized.includes('origin') || normalized.includes('mullayyanagiri') || normalized.includes('where')) return botResponses.origin;
  if (normalized.includes('avail') || normalized.includes('lot') || normalized.includes('arabica')) return botResponses.availability;

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
