# PhiBean Coffees — Project Brief

## Product goal
Create a refined, mobile-first B2B landing page for a specialty coffee farm that communicates premium provenance, traceable sourcing, and a calm luxury brand position while helping wholesale buyers, roasters, and importers move quickly toward micro-lot requests and forward-contract conversations.

## Brand direction
- Brand name: PhiBean Coffees
- Positioning: premium, organic, traceable, minimal, and elevated
- Visual style: restrained ivory and forest tones, editorial serif headlines, generous whitespace, and minimal ornament
- Message tone: concise, confident, elegant, and B2B-appropriate
- Core promise: exceptional coffee, cultivated with intention
- Tagline: Crafted by altitude

## Customer profile
- Specialty roastery buyers
- Green coffee importers and wholesalers
- Coffee businesses seeking direct-sourcing relationships
- Partners prioritizing origin transparency, consistency, and elegant product story

## Conversion priorities
1. Immediate trust through origin, traceability, and estate-led storytelling
2. Clear, premium micro-lot and contract messaging
3. A streamlined inquiry process with a strong call to action
4. A helpful, mobile-first sales chatbot for active procurement conversations

## Project structure
```text
/
├── index.html
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   ├── tailwind.input.css
│   │   └── tailwind.min.css
│   ├── js/
│   │   ├── chat.js
│   │   ├── site.js
│   │   └── analytics.js
│   └── images/
│       ├── phibean-coffees-mark.svg
│       ├── farm-hero.svg
│       └── micro-lot-detail.svg
├── PROJECT_BRIEF.md
├── package.json
├── package-lock.json
└── tailwind.config.js
```

## Recommended deployment stack
- Frontend: HTML5 + locally built Tailwind CSS + vanilla JavaScript
- Hosting: Cloudflare Pages or Netlify
- Form integration: Netlify Forms or Web3Forms
- Asset handling: direct-image logo file for clean brand fidelity and consistent export use

## Grower stories and lead capture
- Show grower and estate profiles as individual stories that can be extended with additional growers
- Use the shared Web3Forms inquiry form for both grower-to-business sourcing and grower registration
- Registration links select the grower opportunity and adapt the company, volume, and request-detail prompts to collect farm information
- Collect name, farm/estate or roastery/company name, and professional email
- Opportunity type: sample request, spot micro-lot order, annual forward contract, estate visit, or grower registration
- Required volume and unit, used as required or available coffee volume
- Request details for sourcing requirements or grower location, coffee varieties, growing practices, and harvest
- Traffic source, referrer, landing path, and UTM campaign fields (hidden)

## Chatbot behavior
The chatbot answers commonly high-intent buyer questions such as:
- Micro-lot availability
- Grower stories and registration
- Sample request
- Forward contracts
- Origin preferences and lot types
- Pricing and volume guidance
- It can collect inquiry details conversationally, display a review summary, and submit to the shared inquiry form only after the visitor confirms

It should feel consultative and polished, guiding visitors toward inquiry submission without friction.

## Performance and UX guidance
- Maintain a one-page responsive layout with clear CTA visibility above the fold
- Prioritize mobile-first spacing, typography, and tap targets
- Use warm earth tones, organic greens, and premium coffee-brand styling
- Keep the language concise, elegant, and B2B-oriented
- Keep the hero section visually calm while emphasizing trust and quality

## Content direction
- Lead with origin, traceability, and story
- Keep headline copy short and premium
- Use understated supporting paragraphs rather than dense sales copy
- Favor clarity over volume in the message hierarchy
- Position the farm as a refined production partner, not a commodity supplier

## Deployment checklist
- Run `npm ci` and `npm run build:css` before deploying the static site
- Add `vbn1.github.io` as the tracked domain in Umami and configure the website ID in the head script to enable page-view, inquiry-submission, and grower-registration event tracking
- For TinyURL attribution, create the short link with a destination URL containing UTM parameters, for example `https://vbn1.github.io/coffee_traction/?utm_source=tinyurl&utm_medium=shortlink&utm_campaign=campaign-name`
- Disclose analytics collection in the site's privacy notice
- Push to GitHub
- Connect repository to Netlify or Cloudflare Pages
- Enable form notifications (Netlify Forms or Web3Forms)
- Add a custom domain if needed
- Validate the chatbot flow and contact form from the live site

## Success metrics
- Inquiry form completion rate
- Chatbot engagement rate
- CTA click-through to inquiry form
- Seasonal contract conversations generated from landing page traffic
- Quality of lead inquiries from premium B2B buyers
