/* js/content.js — ALL visible text and links for the site. English only.
   Lines marked // EDIT are honest placeholders the owner will replace later. */
const CONTENT = {
  meta: {
    name: "MAYURA", fullName: "Mohieth Mayura S Y", initial: "M",
    heroWord: "PORTFOLIO",              // giant word behind the portrait; may be changed to "MAYURA"
    city: "BENGALURU, INDIA", tz: "Asia/Kolkata", tzLabel: "IST",
    email: "moheithmayura@gmail.com",
    instagram: "@moheith_mayura",
    phoneDisplay: "+91 86602 27877", whatsapp: "918660227877",
    siteUrl: "https://example.com"      // EDIT: replace when the domain is bought
  },
  links: {
    github: "https://github.com/moheith",
    githubRepos: "https://github.com/moheith?tab=repositories",
    linkedin: "https://linkedin.com/in/mohieth",
    x: "https://x.com/mohiethh",
    huggingface: "https://huggingface.co/moheith",
    ollama: "https://ollama.com/moheith",
    instagram: "https://instagram.com/moheith_mayura",
    yulyaBot: "https://discord.yulya.me",
    yulyaInvite: "https://invite.yulya.me",
    yulyaStudio: "https://studio.yulya.me",
    yulyaSpace: "https://huggingface.co/moheith/spaces",
    cv: "assets/cv/Mayura_CV.pdf",         // EDIT: placeholder. If the file is missing, show toast "CV coming soon"
    resume: "assets/cv/Mayura_Resume.pdf"  // EDIT: placeholder. Same toast behaviour
  },
  en: {
    nav: ["Work","Highlights","About","Journey","Contact"], motionOff: "Motion off", talk: "Let's talk",
    tags: ["FULL STACK DEVELOPER / DESIGNER","GRAPHICS DESIGNER","OPEN TO WORK"],
    hello: "Hello, I'm", role: ["FULL STACK DEV","& DESIGNER"],
    intro: "I build AI products, game tools and web experiences, then design the visuals around them, from Discord bots and local LLMs to Unity, Blender and Live2D art.",
    motto: "Code that works. Design that feels.",
    cta: "See my work", tagline: ["Built with logic.","Finished with feeling."],
    stats: [["4+","Years of building & designing"],["10+","Projects shipped"],["13+","Public repositories on GitHub"]],
    cv: "Download CV",
    demo: ["TRY YULYA","AI DISCORD BOT"],
    scroll: "SCROLL TO DISCOVER", range: "SELECTED WORK · 2022 – 2026",
    work: { eyebrow: "01 / SELECTED WORK", title: "WORK THAT SHIPS.", all: "ALL WORK", search: "Search title or category",
            filters: ["All","AI & ML","Full Stack","Bots","Desktop","Games","Web Design","Art & 3D"], seeAll: "SEE ALL" },
    logos: ["BUILT WITH","THE RIGHT TOOLS."],
    highlights: { eyebrow: "HIGHLIGHTS & PROOF", title: ["THE WORK.","THE PROOF."], big: "10+", caption: "PROJECTS SHIPPED",
                  text: "No trophies yet. Just shipped products, public code and local AI models that anyone can download.",
                  link: "VIEW GITHUB", listTitle: "SELECTED HIGHLIGHTS", range: "PUBLIC & VERIFIABLE",
                  live: ["LATEST ACTIVITY","REPOSITORIES","FOLLOWERS"] },
    raw: { eyebrow: "A LOOK UNDER THE SURFACE", title: ["FROM RAW.","TO REAL."],
           text: "One interface. Many iterations. Drag to watch a screen go from grey boxes to a finished, living UI.",
           meta: ["YULYA STUDIO / 2026","UI DESIGN · FRONT-END · MOTION"], solid: "WIREFRAME", final: "FINAL UI", hint: "DRAG TO SEE THE PROCESS" },
    about: { eyebrow: "02 / BEHIND THE SCREEN", title: ["CODE THAT WORKS.","DESIGN THAT FEELS."],
             text: "I'm Mohieth Mayura S Y, a full stack developer and graphics designer from Bengaluru. I build AI tools, bots and games, then design every pixel around them in Krita, Blender and Live2D. I speak English, Kannada and Hindi, and I'm studying BCA at SFGC.",
             eduTitle: "EDUCATION & SKILLS", eduLabel: "EDUCATION", toolkit: "CREATIVE TOOLKIT",
             processTitle: "FROM IDEA TO LAUNCH",
             quote: ["Build it like an engineer.","Finish it like an artist."], signature: "Mayura", quoteFoot: ["LET'S BUILD","SOMETHING WORTH USING"] },
    journey: { eyebrow: "03 / THE JOURNEY", title: "KEEP MOVING. KEEP BUILDING.", resume: "RESUME",
               milestonesLabel: "A FEW MILESTONES", milestonesTitle: ["LITTLE WINS.","BIG MEANING."] },
    contact: { eyebrow: "04 / YOUR NEXT PROJECT", title: ["LET'S WORK","TOGETHER."],
               text: "Got an idea you want to bring to life? Let's build something worth using.",
               cta: "START A CONVERSATION", labels: ["EMAIL","INSTAGRAM","WHATSAPP","BASED IN"],
               poster: ["BUILD IT.","MAKE IT FEEL ALIVE."], brief: "Tell me about your project",
               term: ["$ whoami","$ ls projects/","$ ./ship --now"] },
    footer: { rights: "All rights reserved.", top: "Back to top" },
    toasts: { emailCopied: "Email copied ✓", cvSoon: "CV coming soon", resumeSoon: "Resume coming soon" }
  },

  /* 11 projects. Real ones come from github.com/moheith, huggingface.co/moheith, discord.yulya.me and studio.yulya.me.
     "img" is optional: if the file is missing, draw the generated code-poster (see 6.2). "cats" = every filter the card belongs to. */
  projects: [
    { slug:"yulya-discord-bot", n:"01", title:"YULYA — AI DISCORD BOT", meta:"BOTS / 2026", tag:"AI / DISCORD BOT", cats:["Bots","AI & ML"],
      img:"assets/img/work-01.jpg", live:"https://discord.yulya.me", repo:"https://github.com/moheith/Yulya",
      desc:"A free, multimodal AI for Discord. Real-time voice and screen-share chat, rolling neural channel memory, image generation, live web research, and a simulated crypto stock market with heists, bounties and server leaderboards.",
      tech:["Python","Discord API","Gemini Live","WebRTC voice"] },
    { slug:"yulya-studio", n:"02", title:"YULYA STUDIO — GAME MAKER", meta:"GAMES / 2026", tag:"BROWSER GAME ENGINE", cats:["Games","Full Stack"],
      img:"assets/img/work-02.jpg", live:"https://studio.yulya.me", repo:"https://github.com/moheith?tab=repositories",   // EDIT: paste the exact studio repo link
      desc:"Make real games in your browser. A Monaco-powered IDE with a Gemini AI coding assistant, Canvas 2D and WebGL support, one-click live hosting, and an open online arcade to play what people build.",
      tech:["JavaScript","Monaco Editor","Gemini AI","Canvas 2D","WebGL"] },
    { slug:"yulya-model-family", n:"03", title:"YULYA — LOCAL AI MODELS", meta:"AI & ML / 2026", tag:"FINE-TUNED LLMS", cats:["AI & ML"],
      img:"assets/img/work-03.jpg", live:"https://huggingface.co/moheith", repo:"https://github.com/moheith/Yulya",
      desc:"A family of fine-tuned language models I trained and published on Hugging Face, from tiny 135M models to an 8B model. Shipped as GGUF and adapters so they run locally with llama.cpp, Ollama and LM Studio.",
      tech:["Python","Unsloth","GGUF","llama.cpp","Ollama","Hugging Face"] },
    { slug:"desktop-ai-companion", n:"04", title:"DESKTOP AI COMPANION", meta:"DESKTOP / 2026", tag:"DESKTOP APP", cats:["Desktop","AI & ML","Art & 3D"],
      img:"assets/img/work-04.jpg", live:"", repo:"https://github.com/moheith/desktop-ai-companion",
      desc:"A Live2D mascot that lives on your desktop in a transparent, click-through window. It chats with a local AI through Ollama, listens with whisper.cpp, and keeps persistent memory of you.",
      tech:["Electron","PixiJS","Live2D","Ollama","whisper.cpp","JavaScript"] },
    { slug:"yulya-api", n:"05", title:"YULYA API", meta:"FULL STACK / 2026", tag:"API / EMBEDDINGS", cats:["Full Stack","AI & ML"],
      img:"assets/img/work-05.jpg", live:"", repo:"https://github.com/moheith/Yulya-API",
      desc:"A Python API that generates unlimited embedding files, built to power Yulya's long-term memory.",
      tech:["Python","REST API","Embeddings"] },
    { slug:"neural-deck", n:"06", title:"YULYA NEURAL DECK", meta:"WEB DESIGN / 2026", tag:"WEBSITE & DASHBOARD", cats:["Web Design","Bots"],
      img:"assets/img/work-06.jpg", live:"https://discord.yulya.me", repo:"",
      desc:"The landing page and sign-in flow for the Yulya bot: a dark, animated site with a live command ledger, simulated market charts and Discord OAuth2 login.",
      tech:["HTML","CSS","JavaScript","Discord OAuth2"] },
    { slug:"mascot-live2d-art", n:"07", title:"MASCOT & LIVE2D ART", meta:"ART & 3D / 2026", tag:"KRITA + LIVE2D", cats:["Art & 3D","Desktop"],
      img:"assets/img/work-07.jpg", live:"", repo:"https://github.com/moheith/desktop-ai-companion",
      desc:"Original mascot artwork drawn in Krita and rigged as Live2D models for the desktop companion, with expressions, idle motion and custom model versions.",
      tech:["Krita","Live2D Cubism","PixiJS"] },
    { slug:"mascot-website", n:"08", title:"MASCOT WEBSITE TEMPLATE", meta:"WEB DESIGN / 2026", tag:"WEB TEMPLATE", cats:["Web Design","Art & 3D"],
      img:"assets/img/work-08.jpg", live:"", repo:"https://github.com/moheith/Mascot-Website",
      desc:"A reusable website template where people can learn about a mascot and download it.",
      tech:["HTML","CSS","JavaScript"] },
    { slug:"unity-blender", n:"09", title:"UNITY & BLENDER EXPERIMENTS", meta:"GAMES / 2022 – 2026", tag:"3D & GAME DEV", cats:["Games","Art & 3D"],   // EDIT: add real project names
      img:"assets/img/work-09.jpg", live:"", repo:"",
      desc:"Gameplay prototypes built in Unity and 3D models, props and scenes made in Blender. A growing sandbox for ideas that later become full games.",
      tech:["Unity","C#","Blender"] },
    { slug:"yulya-space", n:"10", title:"YULYA — LIVE DEMO SPACE", meta:"AI & ML / 2026", tag:"LIVE DEMO", cats:["AI & ML"],
      img:"assets/img/work-10.jpg", live:"https://huggingface.co/moheith/spaces", repo:"",
      desc:"A running Hugging Face Space where anyone can try Yulya in the browser without installing anything.",
      tech:["Hugging Face Spaces","Python"] },
    { slug:"college-project", n:"11", title:"COLLEGE PROJECT", meta:"FULL STACK / 2025", tag:"FULL STACK", cats:["Full Stack"],   // EDIT: confirm the year and add a better description
      img:"assets/img/work-11.jpg", live:"", repo:"https://github.com/moheith/College-Project",
      desc:"A JavaScript project built during my BCA at SFGC.",
      tech:["JavaScript"] }
  ],

  highlights: [
    { t:"Yulya Studio, a game maker in the browser", s:"Monaco IDE, Gemini AI, live hosting and an online arcade", m:"LIVE", url:"https://studio.yulya.me" },
    { t:"Yulya Discord bot", s:"Voice AI, neural memory and a live simulated crypto market. 100% free", m:"LIVE", url:"https://discord.yulya.me" },
    { t:"Yulya model family on Hugging Face", s:"Fine-tuned local models, from tiny 135M to an 8B model", m:"8B", url:"https://huggingface.co/moheith" },
    { t:"Desktop AI Companion", s:"Live2D mascot with local AI and persistent memory, open source", m:"OSS", url:"https://github.com/moheith/desktop-ai-companion" },
    { t:"13 public repositories", s:"AI, bots, games, desktop apps and websites on GitHub", m:"13", url:"https://github.com/moheith?tab=repositories" },
    { t:"Developer, artist and 3D in one", s:"Code, Unity, Blender, Krita and Live2D, all by one person", m:"4+ YRS", url:"#about" }
  ],

  education: [
    ["SFGC","Bachelor of Computer Applications (BCA)","ONGOING"],
    ["Self-driven learning","LLM fine-tuning, game development, 3D and digital art","2022 — NOW"],   // EDIT
    ["Languages","English · Kannada · Hindi",""]
  ],
  toolkit: ["Full Stack Development","AI & LLM Fine-Tuning","Discord Bots","Game Development","3D Modelling","Digital Art","Live2D Rigging","UI & Web Design","Desktop Apps","Python","JavaScript"],
  software: [["Un","Unity","#ffffff"],["Bl","Blender","#ea7600"],["Kr","Krita","#3bbecf"],["L2","Live2D","#7b61ff"],
             ["Py","Python","#ffd43b"],["JS","JavaScript","#f7df1e"],["Ol","Ollama","#f5f5f7"],["Gi","Git","#f05133"]],
  tools: ["Unity","Blender","Krita","Live2D","Python","JavaScript","Electron","Ollama","Hugging Face","Discord API","Gemini","Monaco","Git & GitHub","whisper.cpp"],

  process: [["01","THE IDEA","Understand the problem and who it is for. Define the goal, the features and the feel."],
            ["02","THE PLAN","Pick the stack, sketch the architecture and wireframe the screens before writing code."],
            ["03","THE BUILD","Code, draw and model together, one working piece at a time."],
            ["04","THE POLISH","Speed, motion, accessibility and the small details that make it feel premium."],
            ["05","THE LAUNCH","Ship it, watch real usage, and keep improving it."]],

  timeline: [   // EDIT: dates and wording are polished placeholders; check each one
    ["2026 · NOW","Founder & Lead Developer","Yulya, the AI ecosystem","Building the whole Yulya world solo: a multimodal Discord bot with voice, memory and a simulated crypto economy, Yulya Studio (a browser game maker with Gemini AI), a family of locally runnable fine-tuned models, and the web dashboards around them."],
    ["2025 · NOW","BCA Student","SFGC, Bengaluru","Studying Computer Applications while shipping real products alongside the coursework."],
    ["2024 · 2026","Full Stack & AI Developer","Independent projects","Designing and building apps, bots, APIs and fine-tuned models, from database to interface."],
    ["2022 · NOW","Digital Artist & Designer","Krita · Live2D · Blender","Mascot art, Live2D models, 3D assets and interface visuals, drawn in Krita, rigged in Live2D and built in Blender."],
    ["2022","Where It Began","First scripts, first games, first designs","Started with small websites, game experiments and drawings. Never stopped."]
  ],
  milestones: [["Yulya Studio goes live","2026"],["Yulya Discord bot launched, free","2026"],["Fine-tuned models on Hugging Face","2026"],["13 public repositories","NOW"]],

  social: [["GitHub","https://github.com/moheith"],["LinkedIn","https://linkedin.com/in/mohieth"],["X","https://x.com/mohiethh"],
           ["Hugging Face","https://huggingface.co/moheith"],["Ollama","https://ollama.com/moheith"],["Instagram","https://instagram.com/moheith_mayura"]]
};
