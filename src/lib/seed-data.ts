// Single source of truth for module seed data
// 31 modules organized into 5 sections

export const MODULE_SEED_DATA = [
  // ═══════════════════════════════════════════════════════════════════
  // SECTION 1: Getting Started
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "welcome",
    title: "Welcome to Mindbody!",
    description: "Welcome the customer by name and introduce the onboarding process.",
    displayOrder: 1,
    sectionSlug: "getting-started",
    sectionTitle: "Getting Started",
    sectionOrder: 1,
    moduleType: "content",
    systemPromptFragment: `The customer's name is already known — it's in the Customer Context above. Do NOT ask "What's your business called?" — you already know it.

Your FIRST message must be a single text message that says: "Welcome [customer name] to Mindbody! What type of business are you?" — combine the greeting and question into ONE sentence.

Then show buttons for business types: Yoga Studio, Fitness Gym, Spa/Salon, Pilates Studio, Dance Studio, Martial Arts, Other. Mark the most likely type based on the business name as recommended.

Put this in sideTip: "You can upload files (spreadsheets, PDFs, screenshots, staff lists, pricing docs, waivers) using the panel on the right at any time — it'll save you a ton of typing!"

Do NOT show a carousel. Do NOT show tips in the chat. Keep it to ONE text message + buttons. That's it.

After they answer, give a brief specific acknowledgment related to their business type, then mark module as completed and move to the next module.`,
    content: {},
  },

  {
    slug: "website-crawl",
    title: "Website Crawl",
    description: "Crawl the customer's website to pre-fill business data.",
    displayOrder: 2,
    sectionSlug: "getting-started",
    sectionTitle: "Getting Started",
    sectionOrder: 1,
    moduleType: "action",
    systemPromptFragment: `Ask: "Do you have a website? We can scan it to pre-fill a lot of your setup automatically."

Show a text_input component with:
- label: "My website URL"
- placeholder: "https://yourbusiness.com"
- validation: "url"
- submitLabel: "Scan my site!"

Below the text_input, show buttons: "No website yet", "Skip for now".

Put "We'll pull your business info, classes, staff, pricing, and more — saving you a ton of time!" in sideTip.

When the user submits a URL, the system will automatically trigger a crawl. Say "Scanning your website now..." and show a progress_widget with status "loading" and label "Analyzing your website...". Do NOT let them skip while crawl is in progress.

When crawl completes (you'll see crawl results in the system prompt context), show an excited summary of what was found. Mark affected modules as partially_complete.

If no website, say "No worries! We'll collect everything step by step." and move to the next module.`,
    content: {},
  },

  {
    slug: "onboarding-team",
    title: "Meet Your Onboarding Team",
    description: "Introduce the support team and assigned specialist.",
    displayOrder: 3,
    sectionSlug: "getting-started",
    sectionTitle: "Getting Started",
    sectionOrder: 1,
    moduleType: "content",
    systemPromptFragment: `Introduce the customer to their support team using a carousel:
- Slide 1: "Your Onboarding Specialist" emoji: "🎯" bgColor: "#EEF2FF" — "Guides you step-by-step through setup, tailoring the system to your business."
- Slide 2: "Data Services" emoji: "📊" bgColor: "#F0FDF4" — "Transfers your client data, schedules, and purchase history seamlessly."
- Slide 3: "Payments Team" emoji: "💳" bgColor: "#FFF7ED" — "Helps you set up Mindbody Payments for secure transactions."

Then introduce the specialist by name from the system prompt context. Ask: "How do you prefer to be contacted?" with buttons: "Email" (recommended), "Phone", "Text".`,
    content: {},
  },

  {
    slug: "journey-overview",
    title: "Your Onboarding Journey",
    description: "Visual overview of the 5 onboarding phases.",
    displayOrder: 4,
    sectionSlug: "getting-started",
    sectionTitle: "Getting Started",
    sectionOrder: 1,
    moduleType: "content",
    systemPromptFragment: `Show a carousel of the 5 onboarding phases:
1. "Pre-Work" emoji: "📋" bgColor: "#EEF2FF" — "Book your Kickoff Call, log in to Mindbody, and share your business details."
2. "Kickoff Call" emoji: "🚀" bgColor: "#F0FDF4" — "Meet your team, align on goals and timelines."
3. "Payments Setup" emoji: "💳" bgColor: "#FFF7ED" — "Complete your application, verify info, test your first transaction."
4. "Site Configuration" emoji: "⚙️" bgColor: "#FDF2F8" — "Add staff, pricing, classes. Import client data."
5. "Go-Live + 30-Day Check-in" emoji: "🎉" bgColor: "#ECFDF5" — "Finalize, train, and launch!"

After carousel, show buttons: "Let's keep going!" (recommended), "Skip to Payments", "Skip to Site Setup".
Mark as completed after viewing.`,
    content: {},
  },

  {
    slug: "create-login",
    title: "Site Sign-In Guide",
    description: "Step-by-step guide for creating Mindbody login credentials.",
    displayOrder: 5,
    sectionSlug: "getting-started",
    sectionTitle: "Getting Started",
    sectionOrder: 1,
    moduleType: "content",
    systemPromptFragment: `Show a step_by_step guide for creating login credentials:
1. "Check your email" — "Look for your 'Site is Ready' email from Mindbody. Click the 'Create Owner Login' link."
2. "Create a password" — "Enter a new password that meets the required criteria."
3. "Click 'Log In'" — "You'll be taken to the sign-in screen."
4. "Verify your account" — "Enter your credentials to complete verification."

After steps, ask: "Have you created your login?" with buttons: "Yes, I'm in!" (recommended), "I haven't gotten the email yet", "I'll do this later".`,
    content: {},
  },

  {
    slug: "intake-form",
    title: "Intake Form",
    description: "Collect who's involved in onboarding, business status, target date.",
    displayOrder: 6,
    sectionSlug: "getting-started",
    sectionTitle: "Getting Started",
    sectionOrder: 1,
    moduleType: "action",
    systemPromptFragment: `Collect intake info ONE question at a time:
1. "Who will be involved in the onboarding process?" — free text.
2. "Is your business brand new or already up and running?" — buttons: "Brand new", "Already up and running" (recommended).
3. "When do you want to be using Mindbody?" — buttons: "ASAP", "2-3 weeks", "1 month", "No rush". Put "Businesses like yours typically take 20-25 business days." in sideTip.

After all 3, show: "Continue to booking" (recommended), "Skip to Payments".`,
    content: {},
  },

  {
    slug: "kickoff-booking",
    title: "Book Your Kickoff Call",
    description: "Schedule the kickoff call using embedded booking widget.",
    displayOrder: 7,
    sectionSlug: "getting-started",
    sectionTitle: "Getting Started",
    sectionOrder: 1,
    moduleType: "action",
    systemPromptFragment: `Show the booking widget using iframe_embed:
- url: "https://mb-training-kickoff-na.youcanbook.me/"
- title: "Book Your Kickoff Call"
- height: 600

After they complete, ask: "All booked?" with buttons: "Yes, it's booked!" (recommended), "I'll book later".`,
    content: {},
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 2: Payments Setup
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "payment-info",
    title: "Get Paid — No Matter How Clients Book",
    description: "Overview of Mindbody Payments benefits.",
    displayOrder: 8,
    sectionSlug: "payments-setup",
    sectionTitle: "Payments Setup",
    sectionOrder: 2,
    moduleType: "content",
    systemPromptFragment: `Show a carousel of payment benefits:
- Slide 1: "Simplifies Checkout" emoji: "🛒" bgColor: "#FFF7ED" — "Let clients book and pay anywhere: your site, the app, or in-person."
- Slide 2: "Flexible Options" emoji: "📱" bgColor: "#EEF2FF" — "Accept Apple Pay, Google Pay, and Klarna."
- Slide 3: "Protects Revenue" emoji: "🛡️" bgColor: "#F0FDF4" — "Securely store cards and charge for no-shows and late cancels."
- Slide 4: "Saves Time" emoji: "⏰" bgColor: "#ECFDF5" — "Track deposits, manage disputes, and view reports all in one place."

Then show a checklist of what they need:
- Business info (legal name, Tax ID, address, phone)
- Owner info (name, DOB, job title, address, SSN)
- Government-issued ID
- Website URL
- Bank details (account and routing number)

Buttons: "I'm ready to sign up!" (recommended), "I'll do this later", "Skip to Site Setup".`,
    content: {},
  },

  {
    slug: "payments-portal",
    title: "Payments — Step-by-Step Guide",
    description: "7-step walkthrough of the Mindbody Payments Portal.",
    displayOrder: 9,
    sectionSlug: "payments-setup",
    sectionTitle: "Payments Setup",
    sectionOrder: 2,
    moduleType: "content",
    systemPromptFragment: `Show the Payments Portal guide as a step_by_step component:
1. "Open your profile" — "Click on your initials in the top-right corner of your Mindbody page."
2. "Go to Payments Portal" — "Click 'Payments Portal' from the dropdown menu."
3. "Select your location" — "Choose which business location to set up payments for."
4. "Choose your business type" — "Select which business setup pertains to you."
5. "Submit your application" — "Enter owner details, business info, and bank account. Click Submit."
6. "Check your status" — "At the top of your Payments Portal, you'll see your payment account status."
7. "Monitor from dashboard" — "You'll be notified of status changes via the Welcome dashboard."

Buttons: "Continue" (recommended), "I'll come back to this".`,
    content: {},
  },

  {
    slug: "payment-hardware",
    title: "Choosing Your Payment Hardware",
    description: "Card reader options and hardware setup.",
    displayOrder: 10,
    sectionSlug: "payments-setup",
    sectionTitle: "Payments Setup",
    sectionOrder: 2,
    moduleType: "content",
    systemPromptFragment: `Show option_cards for card readers:
- "WisePOS E Smart Terminal" (recommended) — "5\" touchscreen, chip/tap/swipe, Apple Pay, Google Pay. WiFi."
- "USB Card Reader" — "Plug-and-play magstripe reader. $66.99."
- "Mobile Card Reader" — "Portable, headphone jack. $55.99."

If they want to purchase: https://shopposportals.com/collections/mindbody

Buttons: "Continue" (recommended), "I'll decide later".`,
    content: {},
  },

  {
    slug: "sign-up-payments",
    title: "Sign Up For Payments",
    description: "Complete Mindbody Payments registration.",
    displayOrder: 11,
    sectionSlug: "payments-setup",
    sectionTitle: "Payments Setup",
    sectionOrder: 2,
    moduleType: "action",
    systemPromptFragment: `Ask: "Have you signed up for Mindbody Payments?" with buttons: "Yes!" (recommended), "Not yet — walk me through it", "I'll do this later".

If "not yet", guide them through the 7-step portal process one step at a time using step_by_step. After they complete, confirm and mark as completed.

If "I'll do this later", mark as punted and move on.`,
    content: {},
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 3: Pre-Kickoff: Site Setup
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "kickoff-info",
    title: "Kickoff Overview",
    description: "What to expect from the kickoff call.",
    displayOrder: 12,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "content",
    systemPromptFragment: `Show a carousel about the kickoff call:
- Slide 1: "How to Prepare" emoji: "📝" bgColor: "#EEF2FF" — "Join on a computer (specialist will screen share). Complete pre-kickoff setup. Bring questions."
- Slide 2: "What Happens During" emoji: "🤝" bgColor: "#F0FDF4" — "Review your business structure, confirm key settings, align on ideal setup."
- Slide 3: "What's Next" emoji: "🚀" bgColor: "#FFF7ED" — "Specialist schedules first training. Site configuration begins immediately."

Buttons: "Let's set up my site!" (recommended), "Skip to a specific section".
Mark as completed after viewing.`,
    content: {},
  },

  {
    slug: "staff-details",
    title: "Staff Details",
    description: "Collect staff names, schedules, pay rates, bios, and photos.",
    displayOrder: 13,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `If staff data was pre-filled from website crawl, present it: "We found these staff members — look right?"

Ask: "How many staff members?" with quick_reply: "Just me", "2-5", "6-10", "10+".
Then: "How would you like to add them?" with option_cards: "Type them in" (recommended), "Upload a spreadsheet".

For each staff member collect ONE at a time: first name, last name, schedule, pay rates (if applicable), short bio, photo (optional file_dropzone).

After all staff added, buttons: "Continue to Classes" (recommended), "Add more staff", "Skip to another section".`,
    content: {},
  },

  {
    slug: "class-collection",
    title: "Classes",
    description: "Gather class offerings, schedules, instructors, booking details.",
    displayOrder: 14,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `"Classes are scheduled group sessions at set times."

Ask: "Do you offer group classes?" with buttons: "Yes" (recommended), "No", "Skip for now".

If yes, collect per class ONE at a time: name, category (Yoga, Pilates, HIIT, etc.), instructor, schedule, capacity/waitlist, payment timing. Then additional: booking window, description, photo.

After classes: "Continue to Appointments" (recommended), "Add more classes", "Skip to another section".`,
    content: { suggestedCategories: ["Yoga", "Pilates", "HIIT", "Cycling", "Barre", "Strength", "Cardio", "Dance", "Martial Arts", "Swimming", "Meditation", "Other"] },
  },

  {
    slug: "appointment-collection",
    title: "Appointments",
    description: "Collect appointment types, durations, providers.",
    displayOrder: 15,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `"Appointments are one-on-one services booked with a specific provider."

Ask: "Do you offer one-on-one appointments?" with buttons: "Yes" (recommended), "No", "Skip for now".

Collect per appointment: name, category, provider, duration, private/semi-private, payment timing, booking window, description, photo.

After: "Continue to Pricing" (recommended), "Skip to another section".`,
    content: {},
  },

  {
    slug: "pricing-options",
    title: "Pricing Options",
    description: "Define pricing tiers, packages, introductory offers.",
    displayOrder: 16,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `Ask: "How do you charge?" with option_cards: "Drop-in rates" (recommended), "Class packs", "Unlimited memberships", "Mix of these".

Collect per pricing option: service category, price/description, expiration, intro offer flag.

After: "Continue" (recommended), "Skip to another section".`,
    content: {},
  },

  {
    slug: "memberships-contracts",
    title: "Memberships & Contracts",
    description: "Set up membership types, terms, contract details.",
    displayOrder: 17,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `Ask: "Do you offer memberships or recurring contracts?" with buttons: "Yes" (recommended), "No", "Skip for now".

Collect: name, description/terms, document upload (file_dropzone).

After: "Continue" (recommended), "Skip to another section".`,
    content: {},
  },

  {
    slug: "liability-waiver",
    title: "Liability Waiver",
    description: "Upload or create a liability waiver.",
    displayOrder: 18,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `Ask: "Do you have a waiver ready?" with buttons: "Yes, I'll upload it" (recommended), "I'll paste the text", "I need to create one", "Skip for now".

If uploading, show file_dropzone. If creating, suggest sections: activities/risks, assumption of risk, liability release, medical readiness, emergency consent, photo consent, minor consent.

Also ask about additional policies. After: "Continue" (recommended), "Skip".`,
    content: {},
  },

  {
    slug: "tax-rates",
    title: "Tax Rates",
    description: "Set tax rates based on location.",
    displayOrder: 19,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `Based on customer location, suggest the applicable sales tax rate. Ask: "Your sales tax would be approximately [X]%. Sound right?" with buttons: "Yes" (recommended), "No, let me specify".

Also: "Tax on services, products, or both?" with buttons: "Both" (recommended), "Services only", "Products only", "Neither".

After: "Continue" (recommended).`,
    content: {},
  },

  {
    slug: "cancellation-policies",
    title: "Cancellation Policies",
    description: "Define cancellation, late cancel, and no-show policies.",
    displayOrder: 20,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `Show info_box (warning): "The only way to enforce no-show/late cancel fees is through Mindbody Payments."

Collect ONE at a time: cancellation policies (text or upload), late cancellation flat fee, no-show flat fee.

After: "Continue" (recommended).`,
    content: {},
  },

  {
    slug: "branding-logo",
    title: "Upload Your Logo",
    description: "Upload logo and set brand colors.",
    displayOrder: 21,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `If logo found in crawl, show it and ask "Is this your logo?"

Otherwise: "Do you have a logo?" with buttons: "Yes, upload now" (recommended), "I'll add it later". Show file_dropzone.

Ask for hex codes. Recommend: "500x500px minimum, PNG with transparent background."

After: "Continue" (recommended).`,
    content: {},
  },

  {
    slug: "client-forms",
    title: "Client-Facing Forms",
    description: "Upload additional client-facing forms.",
    displayOrder: 22,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `Ask: "Do you use additional client-facing forms? (e.g., health questionnaires)" with buttons: "Yes" (recommended), "No", "Skip for now".

If yes, per form: upload (file_dropzone), link to service category, delivery timing (at booking, confirmation, manual).

After: "Continue" (recommended), "Add another form".`,
    content: {},
  },

  {
    slug: "attend-kickoff",
    title: "Attend Your Kickoff Call",
    description: "Confirm readiness for the kickoff call.",
    displayOrder: 23,
    sectionSlug: "pre-kickoff-setup",
    sectionTitle: "Pre-Kickoff: Site Setup",
    sectionOrder: 3,
    moduleType: "action",
    systemPromptFragment: `Summarize what's been collected so far. Show a checklist of completed vs remaining items.

Ask: "Are you ready for your kickoff call?" with buttons: "Yes, I'm prepared!" (recommended), "I need to finish a few things", "When is my call again?".

If they need to finish things, suggest which modules are incomplete.`,
    content: {},
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 4: Get The Most Out Of Mindbody
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "marketplace-info",
    title: "What is the Mindbody Marketplace?",
    description: "Explain the Mindbody Marketplace and its benefits.",
    displayOrder: 24,
    sectionSlug: "get-most-out",
    sectionTitle: "Get The Most Out Of Mindbody",
    sectionOrder: 4,
    moduleType: "content",
    systemPromptFragment: `Explain the Mindbody Marketplace in one sentence. Put detailed benefits in sideTip. Show buttons: "Tell me more", "I'm interested!" (recommended), "Skip".
Mark as completed after viewing.`,
    content: {},
  },

  {
    slug: "marketplace-howto",
    title: "How To Get Listed",
    description: "Steps to get listed on the Marketplace.",
    displayOrder: 25,
    sectionSlug: "get-most-out",
    sectionTitle: "Get The Most Out Of Mindbody",
    sectionOrder: 4,
    moduleType: "content",
    systemPromptFragment: `Explain how marketplace listings work and what info is needed. Show as info_box or step_guide. Buttons: "Let's get listed!" (recommended), "I'll do this later".
Mark as completed after viewing.`,
    content: {},
  },

  {
    slug: "classpass-info",
    title: "What is ClassPass?",
    description: "Explain ClassPass integration.",
    displayOrder: 26,
    sectionSlug: "get-most-out",
    sectionTitle: "Get The Most Out Of Mindbody",
    sectionOrder: 4,
    moduleType: "content",
    systemPromptFragment: `Explain ClassPass in one sentence. Put pros/considerations in sideTip. Buttons: "I'm interested!" (recommended), "Not for me", "Tell me more".
Mark as completed after viewing.`,
    content: {},
  },

  {
    slug: "get-listed-marketplace",
    title: "Getting Listed on the Marketplace",
    description: "Complete Marketplace listing setup.",
    displayOrder: 27,
    sectionSlug: "get-most-out",
    sectionTitle: "Get The Most Out Of Mindbody",
    sectionOrder: 4,
    moduleType: "action",
    systemPromptFragment: `Guide the customer through getting listed on the Marketplace. Collect any additional info needed for the listing. Buttons: "Done!" (recommended), "I'll finish later".`,
    content: {},
  },

  {
    slug: "sign-up-classpass",
    title: "Get Signed Up For ClassPass",
    description: "Complete ClassPass integration setup.",
    displayOrder: 28,
    sectionSlug: "get-most-out",
    sectionTitle: "Get The Most Out Of Mindbody",
    sectionOrder: 4,
    moduleType: "action",
    systemPromptFragment: `Guide through ClassPass setup requirements. Buttons: "Done!" (recommended), "I'll finish later".`,
    content: {},
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 5: Training
  // ═══════════════════════════════════════════════════════════════════

  {
    slug: "training-overview",
    title: "Training Overview",
    description: "Overview of available training sessions and resources.",
    displayOrder: 29,
    sectionSlug: "training",
    sectionTitle: "Training",
    sectionOrder: 5,
    moduleType: "content",
    systemPromptFragment: `Show a carousel about training:
- Slide 1: "Live Training Sessions" emoji: "🎓" bgColor: "#EEF2FF" — "Your specialist will walk you through key features in live sessions."
- Slide 2: "On-Demand Resources" emoji: "📚" bgColor: "#F0FDF4" — "Access video tutorials and guides anytime in the Mindbody University."
- Slide 3: "Community Support" emoji: "👥" bgColor: "#FFF7ED" — "Connect with other business owners in the Mindbody community."

Buttons: "Let's choose my training focus" (recommended), "I'll explore later".
Mark as completed after viewing.`,
    content: {},
  },

  {
    slug: "deep-dive-areas",
    title: "Deep-Dive Areas Of Interest",
    description: "Select which areas to focus training on.",
    displayOrder: 30,
    sectionSlug: "training",
    sectionTitle: "Training",
    sectionOrder: 5,
    moduleType: "action",
    systemPromptFragment: `Ask: "Which areas would you like to focus your training on?" with option_cards (allow multiple):
- "Scheduling & Booking" — "Master your calendar and booking flows"
- "Client Management" — "Track client info, visits, and communications"
- "Marketing & Retention" — "Automated campaigns, reviews, and referrals"
- "Reports & Analytics" — "Understand your business metrics"
- "Staff Management" — "Permissions, payroll, and scheduling"
- "Point of Sale" — "Retail, products, and in-person transactions"

After selection, confirm their choices and mark as completed.
Buttons: "Continue to Final Checklist" (recommended).`,
    content: {},
  },

  {
    slug: "final-checklist",
    title: "Final Checklist",
    description: "Summary checklist of all onboarding items.",
    displayOrder: 31,
    sectionSlug: "training",
    sectionTitle: "Training",
    sectionOrder: 5,
    moduleType: "action",
    systemPromptFragment: `Show a comprehensive checklist summarizing all onboarding modules and their status. Use the module progress data from the system prompt.

Group by section:
- Getting Started: login created, kickoff booked, intake completed
- Payments: signed up, hardware chosen
- Site Setup: staff, classes, appointments, pricing, memberships, waiver, tax rates, cancellation, logo, forms
- Marketplace & ClassPass: listed, signed up
- Training: areas selected

Celebrate what's done! For incomplete items, offer buttons to jump to them.

If everything is done: "Congratulations! You're all set for launch! 🎉" with a celebratory gif.
Buttons: "I'm done!" (recommended), "Let me review [incomplete item]".`,
    content: {},
  },
];
