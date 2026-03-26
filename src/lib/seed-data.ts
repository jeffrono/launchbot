// Single source of truth for module seed data
// 24 modules covering the full Mindbody onboarding journey

export const MODULE_SEED_DATA = [
  // ─── 1. Welcome & Introduction ─────────────────────────────────────
  {
    slug: "welcome",
    title: "Welcome & Introduction",
    description:
      "Welcome to Mindbody! Introduce the onboarding process, quick tips, and set expectations.",
    displayOrder: 1,
    systemPromptFragment: `You are beginning the onboarding conversation. Welcome the customer to Mindbody with a warm, enthusiastic greeting.

IMPORTANT: Right away, mention that they can drop files (spreadsheets, PDFs, screenshots, staff lists, pricing docs, waivers, etc.) into the chat at ANY time and you'll extract the data automatically — this can save them a ton of time.

First question: "What's your business called?" — just that, nothing else.

Put this in sideTip: "Your onboarding is designed to help you launch smoothly, grow confidently, and make the most of your software from day one. This usually takes about 30 min — you can pause and come back anytime!"

After they answer, say "Great name!" and ask: "What type of business is it?" with buttons for common types (Yoga Studio, Fitness Gym, Spa/Salon, Pilates Studio, Dance Studio, Martial Arts, Other).

Use a carousel to show these quick tips once they've answered the first couple questions:
- Slide 1: "Join Zoom from your computer" — "So your specialist can guide you in real time during training sessions."
- Slide 2: "Ask questions early" — "Use the chat for fast help between sessions."
- Slide 3: "Stay on schedule" — "Keep your go-live date on track by completing tasks on time."
- Slide 4: "Complete pre-work" — "So we can focus on what matters most during calls."`,
    content: {
      quickTips: [
        { title: "Join Zoom from your computer", description: "So your specialist can guide you in real time during training sessions.", emoji: "💻" },
        { title: "Ask questions early", description: "Use the chat for fast help between sessions.", emoji: "💬" },
        { title: "Stay on schedule", description: "Keep your go-live date on track by completing tasks on time.", emoji: "📅" },
        { title: "Complete pre-work", description: "So we can focus on what matters most during calls.", emoji: "✅" },
      ],
    },
  },

  // ─── 2. Meet Your Onboarding Team ──────────────────────────────────
  {
    slug: "onboarding-team",
    title: "Meet Your Onboarding Team",
    description:
      "Introduce the customer's dedicated onboarding specialist and support team roles.",
    displayOrder: 2,
    systemPromptFragment: `Introduce the customer to their support team. Use the specialist info from the system prompt context (name, email, phone, booking URL).

Show a carousel with the team roles:
- Slide 1: "Your Onboarding Specialist" with emoji 🎯 — "Guides you step-by-step through setup, tailoring the system to your business. They'll help you configure your account, learn key features, and feel confident using Mindbody from day one."
- Slide 2: "Data Services" with emoji 📊 — "Transfers your client data, schedules, and purchase history seamlessly into your new system — handling all technical details so you can focus on your launch."
- Slide 3: "Payments Team" with emoji 💳 — "Helps you set up your Mindbody Payments Account, ensuring you're ready to accept secure payments quickly."

Then introduce the specialist by name: "Your specialist is [Name] — they'll be your guide throughout this process."

Ask ONE question: "How do you prefer to be contacted?" with buttons: Email (recommended), Phone, Text.

Put the specialist's email and phone in sideTip.`,
    content: {
      teamRoles: [
        { role: "Onboarding Specialist", emoji: "🎯", description: "Guides you step-by-step through setup, tailoring the system to your business." },
        { role: "Data Services", emoji: "📊", description: "Transfers your client data, schedules, and purchase history seamlessly into your new system." },
        { role: "Payments Team", emoji: "💳", description: "Helps you set up your Mindbody Payments Account for secure payments." },
      ],
    },
  },

  // ─── 3. Intake Form ────────────────────────────────────────────────
  {
    slug: "intake-form",
    title: "Intake Form",
    description:
      "Collect who's involved in onboarding, business status, and target go-live date.",
    displayOrder: 3,
    systemPromptFragment: `Collect intake information ONE question at a time:

1. "Who will be involved in the onboarding process, and what role does each person play?" — free text answer. Put "This helps us know who to loop in during setup." in sideTip.

2. "Is your business brand new or already up and running?" — buttons: "Brand new", "Already up and running" (recommended)

3. "When do you want to be using Mindbody for daily operations?" — buttons: "ASAP", "2-3 weeks", "1 month", "No rush". Put "Businesses like yours typically take 20-25 business days — timelines may be faster based on data availability." in sideTip.

After collecting all 3, mark module as completed.`,
    content: {},
  },

  // ─── 4. Create Login Credentials ───────────────────────────────────
  {
    slug: "create-login",
    title: "Create Login Credentials",
    description:
      "Step-by-step guide for creating Mindbody login credentials.",
    displayOrder: 4,
    systemPromptFragment: `Tell the customer it's important to sign in prior to their kickoff call.

Show this as a step_by_step component with these 4 steps:
1. Title: "Check your email" — Description: "Look for your 'Site is Ready' email from Mindbody. Click the 'Create Owner Login' link. Your email will be pre-filled."
2. Title: "Create a password" — Description: "Enter a new password that meets the required criteria in both the Create Password and Confirm Password fields."
3. Title: "Click 'Log In'" — Description: "You'll be taken to the sign-in screen."
4. Title: "Verify your account" — Description: "Enter your credentials to complete the verification process. You're in!"

After showing the steps, ask: "Have you created your login?" with buttons: "Yes, I'm in!" (recommended), "I haven't gotten the email yet", "I'll do this later".

If they haven't gotten the email, tell them their Onboarding Specialist can help — put the specialist's contact info in sideTip.`,
    content: {
      steps: [
        { title: "Check your email", description: "Look for your 'Site is Ready' email from Mindbody. Click the 'Create Owner Login' link." },
        { title: "Create a password", description: "Enter a new password that meets the required criteria." },
        { title: "Click 'Log In'", description: "You'll be taken to the sign-in screen." },
        { title: "Verify your account", description: "Enter your credentials to complete verification." },
      ],
    },
  },

  // ─── 5. Your Onboarding Journey ────────────────────────────────────
  {
    slug: "journey-overview",
    title: "Your Onboarding Journey",
    description:
      "Visual overview of the 5 onboarding phases using a carousel.",
    displayOrder: 5,
    systemPromptFragment: `Show a carousel overview of the onboarding journey with these 5 slides:

1. Title: "Pre-Work" emoji: "📋" bgColor: "#EEF2FF" — Content: "Take a few minutes to get us the info we need: book your Kickoff Call, log in to Mindbody, and share your business details like staff, services, and schedules."

2. Title: "Kickoff Call" emoji: "🚀" bgColor: "#F0FDF4" — Content: "Meet your team and align on goals, timelines, and what's next. We'll review your goals, walk through the onboarding journey, and introduce your Payments Specialist."

3. Title: "Payments Setup" emoji: "💳" bgColor: "#FFF7ED" — Content: "Our Payments team will help you complete your application, verify your business and banking info, and test your first transaction. Simple, secure, and ready to go."

4. Title: "Site Configuration" emoji: "⚙️" bgColor: "#FDF2F8" — Content: "Your specialist will help you add staff, pricing, and class or appointment details. We'll work with Data Services to import clients, memberships, and purchase history."

5. Title: "Go-Live + 30-Day Check-in" emoji: "🎉" bgColor: "#ECFDF5" — Content: "Finalize setup, review key reports, and train on the software. At your 30-day check-in, we'll answer post-go-live questions and guide you to resources."

After showing the carousel, say "That's the roadmap! Ready to keep going?" with buttons: "Let's do it!" (recommended), "Tell me more about a phase". Mark module as completed after they proceed.`,
    content: {
      phases: [
        { title: "Pre-Work", emoji: "📋", bgColor: "#EEF2FF" },
        { title: "Kickoff Call", emoji: "🚀", bgColor: "#F0FDF4" },
        { title: "Payments Setup", emoji: "💳", bgColor: "#FFF7ED" },
        { title: "Site Configuration", emoji: "⚙️", bgColor: "#FDF2F8" },
        { title: "Go-Live + 30-Day Check-in", emoji: "🎉", bgColor: "#ECFDF5" },
      ],
    },
  },

  // ─── 6. Website Crawl ──────────────────────────────────────────────
  {
    slug: "website-crawl",
    title: "Website Crawl",
    description:
      "Crawl the customer's website to pre-fill business information, classes, staff, and more.",
    displayOrder: 6,
    dependencyGroup: "data-collection",
    dependencyOrder: 1,
    systemPromptFragment: `Ask ONE question: "Do you have an existing website for your business?" with buttons: "Yes!" (recommended), "Not yet".

If yes, ask for the URL in the next turn. Put "We can pull your business info, classes, staff, pricing, and more from your site to save you a TON of time!" in sideTip.

When the crawl completes and results come back, show an exciting summary using a carousel:
- Show what was found: business name, number of staff members found, number of classes/services found, pricing info found, etc.
- Be enthusiastic: "We found a lot! Here's what we pulled from your website."
- Each slide should summarize one category of extracted data.
- Mention that modules with pre-filled data will show an orange dot in the sidebar — they're already partially complete!

If they don't have a website, say "No worries! We'll collect everything as we go." and move to next module.`,
    content: {},
  },

  // ─── 7. Business Basics ────────────────────────────────────────────
  {
    slug: "business-basics",
    title: "Business Basics",
    description:
      "Collect business name, type, location, and verify crawled data.",
    displayOrder: 7,
    dependencyGroup: "data-collection",
    dependencyOrder: 2,
    systemPromptFragment: `Collect business basics ONE question at a time:

If data was pre-filled from a website crawl, present it and ask "Does this look right?" with Yes/Edit buttons. Only ask about missing fields.

Otherwise collect manually in this order:
1. Business address/location (text answer)
2. Phone number
3. Business email

Put "Everything can be changed later — just give us your best info for now!" in sideTip.`,
    content: {},
  },

  // ─── 8. Book Your Kickoff Call ─────────────────────────────────────
  {
    slug: "kickoff-booking",
    title: "Book Your Kickoff Call",
    description:
      "Schedule a kickoff call using the YouCanBookMe widget.",
    displayOrder: 8,
    systemPromptFragment: `Tell the customer it's time to book their kickoff call. In this call they will:
- Meet their dedicated Onboarding Specialist who will guide them every step of the way
- Leave with a clear plan and timeline to launch successfully
- Get their personalized onboarding plan and all questions answered

Show the booking widget using an iframe_embed component with:
- url: "https://mb-training-kickoff-na.youcanbook.me/"
- title: "Book Your Kickoff Call"
- height: 600

Put "The kickoff is a 45-minute call to review your business details and plan your Mindbody setup." in sideTip.

After they click "I've completed this", ask "All booked?" with buttons: "Yes, it's booked!" (recommended), "I'll book later". Mark as completed or punted accordingly.`,
    content: {
      bookingUrl: "https://mb-training-kickoff-na.youcanbook.me/",
      callBenefits: [
        "Meet your dedicated Onboarding Specialist",
        "Leave with a clear plan and timeline to launch",
        "Get your personalized onboarding plan and all questions answered",
      ],
    },
  },

  // ─── 9. Payment Setup ──────────────────────────────────────────────
  {
    slug: "payment-setup",
    title: "Get Paid — Payment Setup",
    description:
      "Guide payment processing setup with Mindbody Payments.",
    displayOrder: 9,
    systemPromptFragment: `Introduce Mindbody Payments enthusiastically: "With Mindbody Payments, clients can book and pay in one simple step — online, in person, or in the app."

Show a carousel highlighting benefits:
- Slide 1: "Simplifies Checkout" emoji: "🛒" — "Let clients book and pay anywhere: your site, the app, or in-person"
- Slide 2: "Flexible Options" emoji: "📱" — "Accept Apple Pay, Google Pay, and Klarna"
- Slide 3: "Protects Revenue" emoji: "🛡️" — "Securely store cards and charge for no-shows and late cancels"
- Slide 4: "Saves Time" emoji: "⏰" — "Track deposits, manage disputes, and view reports all in one place"

Then show a checklist of what they need to apply:
- Business info (legal business name, Tax ID, address, phone)
- Owner info (name, DOB, job title, address, SSN)
- Government-issued ID (driver's license or passport)
- Website URL
- Bank details (account and routing number)

Ask: "Ready to set up payments?" with buttons: "Let's do it!" (recommended), "I'll do this later".

Put "This is the most important step for getting paid — but don't worry, we'll walk you through it!" in sideTip.`,
    content: {
      benefits: [
        { title: "Simplifies Checkout", emoji: "🛒", description: "Let clients book and pay anywhere" },
        { title: "Flexible Options", emoji: "📱", description: "Accept Apple Pay, Google Pay, and Klarna" },
        { title: "Protects Revenue", emoji: "🛡️", description: "Securely store cards and charge for no-shows" },
        { title: "Saves Time", emoji: "⏰", description: "Track deposits, manage disputes, view reports" },
      ],
      checklist: [
        "Business info (legal name, Tax ID, address, phone)",
        "Owner info (name, DOB, job title, address, SSN)",
        "Government-issued ID (driver's license or passport)",
        "Website URL",
        "Bank details (account and routing number)",
      ],
    },
  },

  // ─── 10. Payments Portal Guide ─────────────────────────────────────
  {
    slug: "payments-portal",
    title: "Payments Portal Guide",
    description:
      "Step-by-step guide to access and navigate the Mindbody Payments Portal.",
    displayOrder: 10,
    systemPromptFragment: `Guide the customer through the Payments Portal using a step_by_step component. Show ONE step at a time and encourage them to do it in another tab while you wait.

Title: "Navigate Your Payments Portal"
Steps:
1. Title: "Open your profile" — Description: "Click on your initials in the top-right corner of your Mindbody page."
2. Title: "Go to Payments Portal" — Description: "Click 'Payments Portal' from the dropdown menu."
3. Title: "Select your location" — Description: "Choose which business location you want to set up payments for."
4. Title: "Choose your business type" — Description: "Select which business setup pertains to you."
5. Title: "Submit your application" — Description: "Enter the owner's legal details, business information, and bank account details. After entering everything and agreeing to Terms of Service, click Submit."
6. Title: "Check your status" — Description: "At the top of your Payments Portal, you'll see a graphic showing your payment account status. Approval times vary — respond promptly if additional info is requested."
7. Title: "Monitor from dashboard" — Description: "You'll be notified of status changes via the Welcome dashboard when you sign in."

After they complete the steps, ask: "Have you signed up for Payments?" with buttons: "Yes!" (recommended), "Not yet — I'll come back to this".`,
    content: {
      steps: [
        { title: "Open your profile", description: "Click on your initials in the top-right corner of your Mindbody page." },
        { title: "Go to Payments Portal", description: "Click 'Payments Portal' from the dropdown menu." },
        { title: "Select your location", description: "Choose which business location you want to set up payments for." },
        { title: "Choose your business type", description: "Select which business setup pertains to you." },
        { title: "Submit your application", description: "Enter the owner's legal details, business information, and bank account details. Click Submit." },
        { title: "Check your status", description: "At the top of your Payments Portal, you'll see your payment account status. Respond promptly if additional info is requested." },
        { title: "Monitor from dashboard", description: "You'll be notified of status changes via the Welcome dashboard when you sign in." },
      ],
    },
  },

  // ─── 11. Payment Hardware ──────────────────────────────────────────
  {
    slug: "payment-hardware",
    title: "Payment Hardware",
    description:
      "Choose your payment card reader and hardware setup.",
    displayOrder: 11,
    systemPromptFragment: `Ask: "Would you like to accept in-person card payments?" with buttons: "Yes!" (recommended), "Online only for now", "Tell me more".

If they want to know more or said yes, explain why a card reader matters and show option_cards for the available readers:

Card 1: "WisePOS E Smart Terminal" (recommended) — "5-inch touchscreen, accepts chip/tap/swipe, Apple Pay, Google Pay. WiFi connected. The modern choice for in-person payments."

Card 2: "USB Card Reader" — "Simple plug-and-play magstripe reader. $66.99. Great for front-desk checkout. USB connection."

Card 3: "Mobile Card Reader" — "Portable magstripe reader that connects via headphone jack. $55.99. Take payments anywhere."

If they want to purchase, direct them to: https://shopposportals.com/collections/mindbody

Put "The WisePOS E is the most popular choice — it accepts all modern payment types including contactless." in sideTip.

After they decide, ask: "All set with hardware?" with buttons: "Yes" (recommended), "I'll decide later".`,
    content: {
      readers: [
        {
          name: "WisePOS E Smart Terminal",
          description: "5\" touchscreen, chip/tap/swipe/NFC, WiFi, Apple Pay & Google Pay",
          recommended: true,
          features: ["Touchscreen", "Chip + Tap + Swipe", "WiFi", "Apple/Google Pay", "On-reader tipping"],
        },
        {
          name: "USB Card Reader",
          description: "MagTek magstripe reader, USB connection",
          price: "$66.99",
        },
        {
          name: "Mobile Card Reader",
          description: "ID Tech UniMag II, headphone jack connection, portable",
          price: "$55.99",
        },
      ],
      shopUrl: "https://shopposportals.com/collections/mindbody",
    },
  },

  // ─── 12. Staff Details ─────────────────────────────────────────────
  {
    slug: "staff-details",
    title: "Staff Details",
    description:
      "Collect staff/instructor information including names, schedules, pay, bios, and photos.",
    displayOrder: 12,
    systemPromptFragment: `Help the customer add their staff members. If names were pre-filled from the website crawl, present them and ask "We found these staff members on your website — look right?" with Yes/Edit buttons.

Ask: "How many staff members or instructors do you have?" with quick_reply: "Just me", "2-5", "6-10", "10+".

Then ask: "How would you like to add them?" with option_cards:
- "Type them in" (recommended) — "We'll go one at a time"
- "Upload a spreadsheet" — "Drop a file with all your staff info"
- "I'll do this later" — "You can always add staff later"

For each staff member, collect ONE field at a time in this order:
1. First name and last name
2. Schedule/availability (days, start and end times)
3. Pay rate info (monthly, hourly, per appointment, or commission) — if applicable
4. Short bio (a sentence or two for their profile)
5. Photo upload (optional — show a file_dropzone)

Put "Don't forget to include yourself if you also provide services!" in sideTip.

After all staff are added, confirm the list and mark as completed.`,
    content: {
      fieldsPerStaff: [
        "First Name",
        "Last Name",
        "Schedule/Availability",
        "Pay Rates (if applicable)",
        "Short Bio",
        "Photo",
      ],
    },
  },

  // ─── 13. Classes ───────────────────────────────────────────────────
  {
    slug: "class-collection",
    title: "Classes",
    description:
      "Gather class offerings including names, schedules, instructors, and booking details.",
    displayOrder: 13,
    dependencyGroup: "services",
    dependencyOrder: 1,
    systemPromptFragment: `Help the customer catalog their group classes. If data was pre-filled from a website crawl, present it for review.

First explain: "Classes are scheduled group sessions at set times. We'll cover appointments (one-on-one sessions) separately."

Ask: "Do you offer group classes?" with buttons: "Yes" (recommended), "No", "Skip for now".

If yes, ask: "How would you like to add them?" with option_cards: "Type them in" (recommended), "Upload a spreadsheet".

For each class, collect in two phases:

CORE INFO (collect first, one question at a time):
1. Class name
2. Service category — suggest common categories with buttons: Yoga, Pilates, HIIT, Cycling, Barre, Strength, Cardio, Dance, Martial Arts, Swimming, Meditation, Other
3. Instructor — "Who teaches this class?" (use staff names if already collected)
4. Schedule — "When does this class happen? Include days, times, duration, and if it recurs."
5. Capacity & waitlist — "What's the max class size? Do you use a waitlist?"
6. Payment timing — buttons: "Pay when booking" (recommended), "Pay later (e.g., in person)"

ADDITIONAL INFO (collect after all classes are entered):
7. Booking window — "How far in advance can clients book?" with quick_reply: "1 week", "2 weeks", "1 month", "3 months"
8. Class description — "Add a short description so clients know what to expect"
9. Photo — file_dropzone for class image (optional)

Put category suggestions in sideTip, not in chat.`,
    content: {
      suggestedCategories: ["Yoga", "Pilates", "HIIT", "Cycling", "Barre", "Strength", "Cardio", "Dance", "Martial Arts", "Swimming", "Meditation", "Other"],
    },
  },

  // ─── 14. Appointments ──────────────────────────────────────────────
  {
    slug: "appointment-collection",
    title: "Appointments",
    description:
      "Collect appointment/service types with durations, pricing, and availability.",
    displayOrder: 14,
    dependencyGroup: "services",
    dependencyOrder: 2,
    systemPromptFragment: `Help the customer define their one-on-one appointment types.

Explain: "Appointments are one-on-one services booked with a specific provider and time — choose this for private sessions."

Ask: "Do you offer one-on-one appointments or private sessions?" with buttons: "Yes" (recommended), "No", "Skip for now".

If yes, collect for each appointment ONE question at a time:
1. Appointment name
2. Service category — suggest with buttons: Massage, Personal Training, Consultation, Facial, Coaching, Other
3. Provider — "Who provides this service?" (use staff names if available)
4. Duration — "How long is the appointment?"
5. Private or semi-private? — buttons: "Private (1-on-1)" (recommended), "Semi-private (small group)", "Either"
6. Payment timing — buttons: "Pay when booking" (recommended), "Pay later"

Then additional info:
7. Booking window — quick_reply: "1 week", "2 weeks", "1 month", "3 months"
8. Description — short description for clients
9. Photo — file_dropzone (optional)`,
    content: {},
  },

  // ─── 15. Pricing Options ───────────────────────────────────────────
  {
    slug: "pricing-options",
    title: "Pricing Options",
    description:
      "Define pricing tiers, packages, and introductory offers.",
    displayOrder: 15,
    dependencyGroup: "pricing",
    dependencyOrder: 1,
    systemPromptFragment: `Help the customer set up pricing. If pricing data was pre-filled from website crawl, present it for confirmation.

Ask: "How do you charge for your services?" with option_cards:
- "Drop-in rates" (recommended) — "Single session pricing"
- "Class packs" — "Bundle of sessions at a discount"
- "Unlimited memberships" — "Monthly unlimited access"
- "Mix of these" — "Multiple pricing tiers"

For each pricing option, collect ONE at a time:
1. Select service category — "Which classes/services does this pricing apply to?"
2. Price and description — "What's the price and what does it include?"
3. Expiration — "How long does this purchase stay active?" with buttons: "From sale date", "From first visit", "Never expires"
4. Is this an introductory offer? — "Available once per client; disappears after purchase." buttons: "Yes", "No" (recommended)

Put "You can always adjust pricing later — just get us in the ballpark for now!" in sideTip.`,
    content: {},
  },

  // ─── 16. Memberships & Contracts ───────────────────────────────────
  {
    slug: "memberships-contracts",
    title: "Memberships & Contracts",
    description:
      "Set up membership types, terms, and contract details.",
    displayOrder: 16,
    dependencyGroup: "pricing",
    dependencyOrder: 2,
    systemPromptFragment: `Help the customer define memberships and contracts.

Ask: "Do you offer memberships or recurring contracts?" with buttons: "Yes" (recommended), "No", "Skip for now".

If yes, collect for each membership/contract ONE at a time:
1. Name — "What is this offering called?"
2. Description & terms — "Describe the membership/contract. For contracts, include terms and billing details (e.g., 6-month term). For memberships, list benefits, discounts, and pricing."
3. Document upload — "Upload any documents outlining your contracts or memberships." Show a file_dropzone.

Put "Contracts include specific terms and billing details. Memberships define ongoing benefits and pricing." in sideTip.`,
    content: {},
  },

  // ─── 17. Liability Waiver ──────────────────────────────────────────
  {
    slug: "liability-waiver",
    title: "Liability Waiver",
    description:
      "Upload or create a liability waiver for client booking/checkout.",
    displayOrder: 17,
    systemPromptFragment: `Help the customer set up their liability waiver.

Explain briefly: "We'll display your waiver during booking/checkout. Clients will check a box to agree — no signatures or initials needed. So avoid blanks and signature lines."

Ask: "Do you have a waiver ready?" with buttons: "Yes, I'll upload it" (recommended), "I'll paste the text", "I need to create one", "Skip for now".

If uploading, show a file_dropzone for PDF/document upload.
If pasting, ask them to type or paste the full waiver text.
If they need to create one, suggest it should include:
- Activities and risks
- Assumption of risk
- Liability release
- Medical readiness
- Emergency care consent
- Optional photo consent
- Minor/guardian consent

Put "Have legal counsel review your waiver before finalizing. Everything can be updated later!" in sideTip.

Also ask: "Do you have any additional policies to include in your Mindbody setup?" with buttons: "Yes", "No" (recommended).`,
    content: {
      waiverSections: [
        "Activities and risks",
        "Assumption of risk",
        "Liability release",
        "Medical readiness",
        "Emergency care consent",
        "Optional photo consent",
        "Minor/guardian consent",
      ],
    },
  },

  // ─── 18. Tax Rates ─────────────────────────────────────────────────
  {
    slug: "tax-rates",
    title: "Tax Rates",
    description:
      "Set tax rates for services and products.",
    displayOrder: 18,
    systemPromptFragment: `Help the customer set up their tax rates.

Based on the customer's location (from business basics or metadata), try to suggest the applicable sales tax rate. For example, if they're in Florida, suggest Florida's state sales tax rate and note any local additions.

Ask: "Based on your location, your sales tax rate would be approximately [X]%. Does that sound right?" with buttons: "Yes, that's correct" (recommended), "No, let me specify".

If they want to specify, ask for the tax rate as a percentage.

Also ask: "Do you charge tax on services, products, or both?" with buttons: "Services only", "Products only", "Both" (recommended), "Neither".

Put "Tax rates can be updated anytime in your Mindbody settings." in sideTip.`,
    content: {},
  },

  // ─── 19. Cancellation Policies ─────────────────────────────────────
  {
    slug: "cancellation-policies",
    title: "Cancellation Policies",
    description:
      "Define cancellation, late cancel, and no-show policies.",
    displayOrder: 19,
    systemPromptFragment: `Help the customer set up cancellation and no-show policies.

Show an info_box (variant: "warning"): "The only way to enforce payment for no-shows and late cancels is through Mindbody Payments. Please apply if you haven't already."

Ask ONE at a time:
1. "What are your cancellation policies?" — They can type them out or upload a document (show file_dropzone option). Ask about cancellation windows (e.g., "24 hours before class").

2. "Do you charge a late cancellation fee?" with buttons: "Yes", "No" (recommended). If yes: "What's the flat fee for late cancellations?" — emphasize FLAT FEE, not percentage.

3. "Do you charge a no-show fee?" with buttons: "Yes", "No" (recommended). If yes: "What's the flat fee for no-shows?"

Put "These rules will be used to set booking notifications and enforce policies automatically." in sideTip.`,
    content: {},
  },

  // ─── 20. Branding & Logo ───────────────────────────────────────────
  {
    slug: "branding-logo",
    title: "Branding & Logo",
    description:
      "Upload logo, set brand colors and hex codes.",
    displayOrder: 20,
    systemPromptFragment: `Help the customer set up their brand identity.

If a logo was found during website crawl, show it (using image_display) and ask "Is this your logo?" with Yes/Upload new buttons.

Otherwise ask: "Do you have a logo to upload?" with buttons: "Yes, upload now" (recommended), "I'll add it later". If yes, show a file_dropzone for image upload.

After logo upload, try to suggest colors based on what you see. Ask: "What's your primary brand color? If you have a hex code, share it — otherwise describe the color." Put "A hex code is a six-digit alphanumeric code like #FF5733 that represents a specific color." in sideTip.

Also provide image sizing recommendations: "For best results, upload a logo that's at least 500x500 pixels. PNG with transparent background works best."

Ask about secondary/accent colors too.

Put "This is where your personality shines! 🎨" in sideTip.`,
    content: {},
  },

  // ─── 21. Client-Facing Forms ───────────────────────────────────────
  {
    slug: "client-forms",
    title: "Client-Facing Forms",
    description:
      "Upload additional client-facing forms like health questionnaires.",
    displayOrder: 21,
    systemPromptFragment: `Ask: "Do you use any additional client-facing forms?" Give an example: "For instance, you might require clients to share health information before joining a certain class or appointment."

Buttons: "Yes, I have forms" (recommended), "No", "Skip for now".

If yes, for each form collect:
1. Upload the form — show file_dropzone
2. "Which service category should this form be linked to?" — show buttons based on their previously collected service categories
3. "When should clients receive this form?" — buttons: "When they book" (recommended), "In the confirmation email", "I'll send it manually"

Allow multiple forms. After each, ask: "Any more forms to add?" with buttons: "Add another", "That's all" (recommended).

Put "Forms help you collect important info from clients before their visit." in sideTip.`,
    content: {},
  },

  // ─── 22. Mindbody Marketplace ──────────────────────────────────────
  {
    slug: "marketplace",
    title: "Mindbody Marketplace",
    description:
      "Explain the Marketplace and help get listed.",
    displayOrder: 22,
    systemPromptFragment: `Ask: "Want to be listed on the Mindbody Marketplace so new clients can find you?" with buttons: "Yes please!" (recommended), "Tell me more", "Skip for now". Put marketplace benefits in sideTip, not in chat. Keep the chat message to one sentence.`,
    content: {},
  },

  // ─── 23. ClassPass Integration ─────────────────────────────────────
  {
    slug: "classpass",
    title: "ClassPass Integration",
    description:
      "Explain ClassPass integration options.",
    displayOrder: 23,
    systemPromptFragment: `Ask: "Interested in getting clients through ClassPass?" with buttons: "Yes" (recommended), "What's ClassPass?", "No thanks". Put ClassPass explanation in sideTip. Keep chat to one sentence.`,
    content: {},
  },

  // ─── 24. Kickoff Call Info ─────────────────────────────────────────
  {
    slug: "kickoff-info",
    title: "Kickoff Call Info",
    description:
      "Informational module about the kickoff call — what to expect and how to prepare.",
    displayOrder: 24,
    systemPromptFragment: `This is an informational module — show it only if the customer asks about the kickoff call or if you want to give a teaser.

If showing, use a carousel with 3 slides:

Slide 1: "How to Prepare" emoji: "📝" bgColor: "#EEF2FF" — "Join the call on a computer (your specialist will screen share). Complete as much pre-kickoff setup as possible. Bring any questions you'd like to cover."

Slide 2: "What Happens During" emoji: "🤝" bgColor: "#F0FDF4" — "We'll review your business structure, confirm key settings, and align on your ideal setup. Your clarity helps us configure everything correctly."

Slide 3: "What's Next" emoji: "🚀" bgColor: "#FFF7ED" — "Your specialist will schedule your first training session. We'll start configuring your site immediately — if all info is provided, setup can finish before your next call!"

Mark as completed after viewing. The kickoff call is a 45-minute call to review business details, clarify needs, and confirm how the Mindbody site should be set up.`,
    content: {
      callDuration: "45 minutes",
      preparation: [
        "Join on a computer (specialist will screen share)",
        "Complete pre-kickoff setup",
        "Bring questions",
      ],
      afterCall: [
        "Specialist schedules first training session",
        "Site configuration begins immediately",
        "Setup can finish before next call if all info provided",
      ],
    },
  },
];
