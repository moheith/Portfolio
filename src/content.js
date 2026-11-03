/*
 * Portfolio content lives here so project facts, links and owner details can be
 * updated without editing the presentation or interaction code.
 */
export const SITE = {
  person: {
    name: "Mohieth Mayura S Y",
    brand: "MOHIETH",
    handle: "moheith",
    rolePrimary: "Full Stack Developer",
    roleSecondary: "Designer",
    location: "Bengaluru, India",
    timezone: "Asia/Kolkata",
    email: "moheithmayura@gmail.com",
    phoneDisplay: "+91 8660227877",
    whatsapp: "918660227877",
    availability: "Open to opportunities",
    experienceLabel: "4+ years learning, building & iterating",
    projectCountLabel: "10+ projects & experiments",
    intro: "I build thoughtful digital experiences — from AI-powered applications and developer tools to responsive websites and polished interfaces. I enjoy working across the stack, connecting ambitious ideas with practical engineering and design.",
    tagline: ["Curious by nature.", "Builder by choice."],
    portrait: "assets/img/mayura.png",
    cvUrl: null,
    showreelUrl: null
  },
  education: [{
    institution: "SFGC",
    programme: "Bachelor of Computer Applications (BCA)",
    status: "In progress",
    expectedYear: "2027"
  }],
  socials: [
    { label: "GitHub", url: "https://github.com/moheith" },
    { label: "LinkedIn", url: "https://linkedin.com/in/mohieth" },
    { label: "Instagram", url: "https://www.instagram.com/mohieth_mayura/" },
    { label: "Ollama", url: "https://ollama.com/moheith" },
    { label: "Hugging Face", url: "https://huggingface.co/moheith" },
    { label: "X", url: "https://x.com/mohiethh" },
    { label: "Yulya Discord Project", url: "https://discord.yulya.me" }
  ],
  projects: [
    {
      id: "yulya-studio", number: "01", category: "AI & AUTOMATION", kind: "AI DEVELOPER TOOL / WEB PLATFORM",
      title: "YULYA STUDIO", stage: "ACTIVE PROJECT / PROTOTYPE",
      summary: "A browser-native game creation studio combining conversational AI, voice, visual context and code generation for playable HTML5 Canvas experiences.",
      stack: ["React", "TypeScript", "Monaco", "FastAPI", "MongoDB", "Gemini Live"],
      repo: "https://github.com/moheith/yulya-studio", site: null,
      context: "The product site is linked as a live destination when available; the repository remains the source of technical detail.",
      challenge: "Make game prototyping accessible in a browser without asking creators to install a local toolchain.",
      approach: "A browser workspace brings together an AI architect, code generation, project files and a sandboxed game preview.",
      decisions: "The documented design focuses on streaming interaction, project-scoped files, persistence and iframe/CSP boundaries. These are implementation decisions, not an independent security audit.",
      features: ["Conversational AI architecture", "Voice and optional visual context", "Project files and code editor", "Sandboxed Canvas preview"],
      visual: "studio"
    },
    {
      id: "desktop-companion", number: "02", category: "DESKTOP", kind: "DESKTOP AI / ELECTRON",
      title: "YULYA — DESKTOP COMPANION", stage: "DESKTOP APPLICATION",
      summary: "A desktop AI companion with a Live2D mascot, transparent Electron window, local model support, voice input and persistent memory.",
      stack: ["Electron", "JavaScript", "PixiJS", "Ollama", "whisper.cpp", "Live2D"],
      repo: "https://github.com/moheith/desktop-ai-companion", site: null,
      context: "Feature descriptions follow the project documentation. Live2D artwork shown here is an original interface illustration, not an included model screenshot.",
      challenge: "Connect an always-available desktop overlay with AI chat and voice while keeping mascot placement and app settings in the user's control.",
      approach: "A transparent desktop window and control panel coordinate chat, local model options, voice input and mascot preferences.",
      decisions: "The documented stack includes Electron, PixiJS, Ollama and local Whisper speech recognition with an OpenAI Whisper fallback.",
      features: ["Transparent, configurable mascot window", "Local AI through Ollama", "Local Whisper and fallback speech input", "Persistent memory and model selection"],
      visual: "desktop"
    },
    {
      id: "discord-bot", number: "03", category: "AI & AUTOMATION", kind: "AI ASSISTANT / DISCORD INTEGRATION",
      title: "YULYA FOR DISCORD", stage: "CONNECTED PROJECT / BOT",
      summary: "A multi-persona AI companion for Discord with vision and research tools, voice interaction, contextual recall and interactive server systems.",
      stack: ["AI", "Voice", "Vision", "Research", "Discord"],
      repo: "https://github.com/moheith/Discord-Bot", site: "https://discord.yulya.me",
      repoOwnerOnly: true,
      context: "The repository may not be publicly accessible. The public project destination is the Yulya project site. Any in-server economy is a simulated game system, not real money.",
      challenge: "Bring conversational, voice and research features together in a community bot with multiple interaction styles.",
      approach: "The documented commands and systems include persona chat, analysis, research, recall, duplex voice and server dashboards.",
      decisions: "The scope spans AI interactions and community features; the in-server virtual currency and bonding systems are described as simulated game mechanics.",
      features: ["Multiple AI personas", "Vision analysis and research commands", "Duplex voice with screenshare vision support", "Profile, social, game and dashboard features"],
      visual: "discord"
    },
    {
      id: "learnexa", number: "04", category: "WEB APPS", kind: "FULL STACK WEB APP / EDUCATION",
      title: "LEARNEXA — SKILL EXCHANGE", stage: "COLLEGE PROJECT / DEMONSTRATION",
      summary: "A student skill-exchange platform for offering skills, finding compatible peers, requesting exchanges, scheduling sessions and sharing feedback.",
      stack: ["Next.js", "TypeScript", "Flask", "Python", "SQL", "TF-IDF"],
      repo: "https://github.com/moheith/LEARNEXA-2.0", site: null,
      context: "The README describes this as a college project; demonstration data is fictional.",
      challenge: "Help learners discover useful skill exchanges and coordinate the steps from matching to a session.",
      approach: "The documented app combines skill listings, TF-IDF/cosine similarity recommendations, exchange requests, session scheduling and feedback.",
      decisions: "The README documents JWT authentication, SQLite for a local demo and MySQL configuration, with reward points and admin tools.",
      features: ["Offer and discover skills", "Similarity-based peer recommendations", "Requests and session scheduling", "Feedback and reward points"],
      visual: "learnexa"
    }
  ],
  stack: ["React", "TypeScript", "Python", "Next.js", "Electron", "FastAPI", "Ollama", "Gemini API", "PixiJS", "MongoDB", "SQL", "Git"],
  skills: [
    { title: "Programming languages", items: ["Python", "JavaScript", "TypeScript", "C#", "Java", "C", "C++", "SQL", "HTML", "CSS", "PHP", "Bash", "PowerShell"] },
    { title: "Frameworks & platforms", items: ["React", "Next.js", "Node.js", "Express.js", "Electron", "Unity", "Tailwind CSS", "Bootstrap", "FastAPI", "Flask", "Django", "ASP.NET"] },
    { title: "AI & creative technology", items: ["Ollama", "Google Gemini API", "Local LLM workflows", "PixiJS", "Live2D", "Blender"] },
    { title: "Design & workflow", items: ["UI/UX design", "Graphic design", "Responsive web design", "Prototyping", "Git", "GitHub"] }
  ],
  process: [
    { title: "UNDERSTAND", text: "Clarify the problem, audience and what success should look like." },
    { title: "MAP IT OUT", text: "Break the idea into flows, components, architecture and milestones." },
    { title: "DESIGN & BUILD", text: "Shape the interface and implement the underlying logic." },
    { title: "TEST & REFINE", text: "Find edge cases, improve details and make the experience consistent." },
    { title: "SHIP & LEARN", text: "Deliver a usable result, document what matters and keep improving." }
  ],
  journey: [
    { phase: "CURRENT", title: "Full Stack Development & Design", text: "Building across frontend, backend, AI and desktop experiences." },
    { phase: "ONGOING", title: "Yulya Ecosystem", text: "Exploring AI companions, browser-native creation tools and connected experiences." },
    { phase: "ONGOING", title: "Learning Through Projects", text: "Developing practical applications and experimenting with modern technologies." }
  ],
  sections: { awards: false, clientLogos: false, showreel: false, beforeAfter: false, testimonials: false }
};
