/* js/content.js — ALL data for Mohieth Mayura S Y's portfolio. English only.
   Static copy (headings, paragraphs, labels) lives inline in index.html.
   This file holds: meta, project data, tech stack, highlights, education, toolkit, software tiles, process, journey, milestones.
   Snapshot numbers are from November 2026 (GitHub 13 repos, Hugging Face 8 models, Ollama 259 pulls, Yulya Studio 109 commits). */
const CONTENT = {
  meta: {
    name: "MOHIETH MAYURA S Y", short: "MOHIETH", initial: "MAYURA",
    city: "Bengaluru, India", cityShort: "BENGALURU, INDIA", tz: "Asia/Kolkata", tzLabel: "IST",
    email: "moheithmayura@gmail.com", phoneDisplay: "+91 86602 27877", whatsapp: "918660227877",
    instagram: "@moheith_mayura",
    cv: "assets/Mayura-CV.pdf",              /* placeholder: the file does not exist yet */
    showreel: "",                             /* empty on purpose: no showreel video yet */
    liveProject: "https://discord.yulya.me",
    domain: "https://moheith.tech",
    links: {
      github: "https://github.com/moheith",
      linkedin: "https://linkedin.com/in/mohieth",
      huggingface: "https://huggingface.co/moheith",
      ollama: "https://ollama.com/moheith",
      x: "https://x.com/mohiethh",
      instagram: "https://instagram.com/moheith_mayura"
    },
    waMessage: "Hi Mayura, I saw your portfolio and I'd like to talk about a project: "
  },

  /* ---------- Selected work (11 cards). cats use these exact English names: "Full-Stack","AI / ML","Discord","Web Apps","Design","Open Source" ---------- */
  projects: [
    { slug: "yulya", n: "01", title: "YULYA — DISCORD AI COMPANION", meta: "AI / WEB · 2026", tag: "LIVE · AI / DISCORD",
      cats: ["AI / ML", "Discord", "Full-Stack"], stack: "Python · Gemini Live · WebRTC · MongoDB",
      desc: "A living AI companion for Discord: voice chat with custom personas, persistent memory, image and video understanding, and a simulated server economy with crypto markets and heists.",
      preview: "assets/img/work/yulya/preview.webp",
      img: "assets/img/work/yulya/card.webp",
      shots: [
        { src: "assets/img/work/yulya/chat.webp", thumb: "assets/img/work/yulya/chat-t.webp", w: 636, h: 720, cap: "Natural conversation: Yulya remembers who you are and answers in her own voice." },
        { src: "assets/img/work/yulya/live.webp", thumb: "assets/img/work/yulya/live-t.webp", w: 800, h: 904, cap: "Yulya Live: talk to Yulya by voice from any browser, with screen sharing." },
        { src: "assets/img/work/yulya/commands.webp", thumb: "assets/img/work/yulya/commands-t.webp", w: 890, h: 485, cap: "Slash commands: analyse, bank, bounty, crypto, daily, divorce, edit… 40+ of them." },
        { src: "assets/img/work/yulya/profile.webp", thumb: "assets/img/work/yulya/profile-t.webp", w: 695, h: 385, cap: "/profile — an interactive card with wealth, career and loadout." },
        { src: "assets/img/work/yulya/server.webp", thumb: "assets/img/work/yulya/server-t.webp", w: 780, h: 1262, cap: "Server profile, crypto market and the central bank — all live, all refreshable in Discord." },
        { src: "assets/img/work/yulya/bot.webp", thumb: "assets/img/work/yulya/bot-t.webp", w: 597, h: 762, cap: "Yulya on Discord: verified app, slash commands, 8 mutual servers." }
      ],
      url: "https://discord.yulya.me", repo: "https://github.com/moheith/Yulya", video: "" },
    { slug: "yulya-studio", n: "02", title: "YULYA STUDIO", meta: "WEB APP · 2026", tag: "WEB APP · AI",
      cats: ["Full-Stack", "Web Apps", "AI / ML"], stack: "React · TypeScript · Vite · FastAPI · MongoDB · Gemini",
      desc: "An AI-assisted browser game studio: write, preview and remix static games in the browser with a sandboxed assistant, a public gallery and one-click remixing.",
      preview: "assets/img/work/yulya-studio/preview.webp",
      img: "assets/img/work/yulya-studio/card.webp",
      shots: [
        { src: "assets/img/work/yulya-studio/spaceship.webp", thumb: "assets/img/work/yulya-studio/spaceship-t.webp", w: 656, h: 734, cap: "Spaceship Shooter — a full game made inside Studio with the AI co-pilot." },
        { src: "assets/img/work/yulya-studio/editor.webp", thumb: "assets/img/work/yulya-studio/editor-t.webp", w: 1535, h: 698, cap: "The Studio editor: file explorer, live preview, console and the AI co-pilot side by side." },
        { src: "assets/img/work/yulya-studio/arcade.webp", thumb: "assets/img/work/yulya-studio/arcade-t.webp", w: 1535, h: 656, cap: "Yulya Arcade — every game made in Studio can be published and played by anyone." },
        { src: "assets/img/work/yulya-studio/profile.webp", thumb: "assets/img/work/yulya-studio/profile-t.webp", w: 1142, h: 594, cap: "Creator profile: projects, plays and AI usage." }
      ],
      url: "https://studio.yulya.me", repo: "https://github.com/moheith/Studio", video: "" },
    { slug: "learnexa", n: "03", title: "LEARNEXA 2.0", meta: "FULL-STACK · 2026", tag: "FULL-STACK",
      cats: ["Full-Stack", "Web Apps"], stack: "Flask · Next.js · TypeScript · SQLite / MySQL",
      desc: "A skill-exchange platform for students: list what you can teach and want to learn, get matched with TF-IDF recommendations, schedule sessions, give feedback and earn reward points.",
      img: "", url: "", repo: "https://github.com/moheith/LEARNEXA-2.0", video: "" },
    { slug: "yulya-models", n: "04", title: "YULYA MODELS", meta: "AI / ML · 2026", tag: "AI / ML",
      cats: ["AI / ML", "Open Source"], stack: "Qwen2.5 · Llama 3.x · SmolLM2 · Ollama",
      desc: "A family of 8 fine-tuned conversational models published on Hugging Face, plus a local-run build on Ollama.",
      preview: "assets/img/work/yulya-models/preview.webp",
      img: "assets/img/work/yulya-models/card.webp",
      shots: [
        { src: "assets/img/work/yulya-models/hf.webp", thumb: "assets/img/work/yulya-models/hf-t.webp", w: 698, h: 727, cap: "Hugging Face collection: Llama 3.1 8B, Qwen2.5 7B and Qwen2.5 1.5B fine-tunes." }
      ],
      url: "https://huggingface.co/moheith", repo: "https://ollama.com/moheith", video: "" },
    { slug: "desktop-ai-companion", n: "05", title: "DESKTOP AI COMPANION", meta: "AI / DESKTOP", tag: "AI · JAVASCRIPT",
      cats: ["AI / ML", "Full-Stack"], stack: "JavaScript", desc: "A desktop mate with AI memory.",
      preview: "assets/img/work/desktop-ai-companion/preview.webp",
      img: "assets/img/work/desktop-ai-companion/card.webp",
      shots: [
        { src: "assets/img/work/desktop-ai-companion/mic.webp", thumb: "assets/img/work/desktop-ai-companion/mic-t.webp", w: 1219, h: 744, cap: "Voice: wake word, hold-to-talk, auto-stop on silence and auto-send." },
        { src: "assets/img/work/desktop-ai-companion/mascot.webp", thumb: "assets/img/work/desktop-ai-companion/mascot-t.webp", w: 1219, h: 744, cap: "Pick any Live2D mascot — Haru, Mao, Natori, Ren, Rice and more." }
      ],
      url: "", repo: "https://github.com/moheith/desktop-ai-companion", video: "" },
    { slug: "yulya-landing", n: "06", title: "YULYA LANDING PAGE", meta: "WEB / DESIGN", tag: "DESIGN · WEB",
      cats: ["Design", "Web Apps"], stack: "HTML · CSS · JavaScript", desc: "The landing page for the Yulya organisation.",
      preview: "assets/img/work/yulya-landing/preview.webp",
      img: "assets/img/work/yulya-landing/card.webp",
      shots: [
        { src: "assets/img/work/yulya-landing/hero.webp", thumb: "assets/img/work/yulya-landing/hero-t.webp", w: 1533, h: 725, cap: "discord.yulya.me — the living neural network landing page." },
        { src: "assets/img/work/yulya-landing/add.webp", thumb: "assets/img/work/yulya-landing/add-t.webp", w: 1535, h: 728, cap: "Add Yulya to your server: one click, secured by Discord OAuth2." },
        { src: "assets/img/work/yulya-landing/command.webp", thumb: "assets/img/work/yulya-landing/command-t.webp", w: 1535, h: 734, cap: "The Neural Deck command center: tokens, XP, economy and companions." },
        { src: "assets/img/work/yulya-landing/economy.webp", thumb: "assets/img/work/yulya-landing/economy-t.webp", w: 1535, h: 724, cap: "Economy portfolio: live market activity and price history per server." },
        { src: "assets/img/work/yulya-landing/analytics.webp", thumb: "assets/img/work/yulya-landing/analytics-t.webp", w: 1531, h: 720, cap: "Server analytics: wealth, share price, population and AI usage." },
        { src: "assets/img/work/yulya-landing/network.webp", thumb: "assets/img/work/yulya-landing/network-t.webp", w: 1533, h: 727, cap: "Global network leaderboards across every server Yulya is in." },
        { src: "assets/img/work/yulya-landing/topup.webp", thumb: "assets/img/work/yulya-landing/topup-t.webp", w: 1180, h: 727, cap: "Top-up page: three tiers, instant delivery, secure checkout." }
      ],
      url: "", repo: "https://github.com/moheith/yulya-landing-page", video: "" },
    { slug: "mascot-website", n: "07", title: "MASCOT WEBSITE", meta: "WEB / DESIGN", tag: "DESIGN · WEB",
      cats: ["Design", "Web Apps"], stack: "HTML", desc: "A website where people get to know a mascot and download it.",
      img: "", url: "", repo: "https://github.com/moheith/Mascot-Website", video: "" },
    { slug: "textlink", n: "08", title: "TEXTLINK", meta: "WEB APP · TOOL", tag: "WEB APP",
      cats: ["Web Apps", "Open Source"], stack: "HTML · CSS · JavaScript",
      desc: "Turns any text into a unique shareable link. Single file, no backend, no database.",
      img: "", url: "", repo: "https://github.com/moheith/Treasure", video: "" },
    { slug: "yulya-api", n: "09", title: "YULYA API", meta: "AI / BACKEND", tag: "AI · PYTHON",
      cats: ["AI / ML", "Open Source"], stack: "Python", desc: "Generates unlimited embedding files.",
      img: "", url: "", repo: "https://github.com/moheith/Yulya-API", video: "" },
    { slug: "graphic-design", n: "10", title: "GRAPHIC DESIGN — SELECTED WORKS", meta: "DESIGN", tag: "DESIGN",
      cats: ["Design"], stack: "Posters · Logos · Social · Krita", placeholder: true,
      desc: "Posters, logos and social media creatives. Placeholder card: replace with your best pieces.",
      img: "", url: "https://instagram.com/moheith_mayura", repo: "", video: "" },
    { slug: "brand-identity", n: "11", title: "BRAND IDENTITY — YOUR PROJECT", meta: "DESIGN", tag: "DESIGN",
      cats: ["Design"], stack: "Branding · UI · Blender", placeholder: true,
      desc: "A brand identity case study. Placeholder card: replace with a real project.",
      img: "", url: "", repo: "", video: "" }
  ],

  /* ---------- Tech marquee: [label, simple-icons slug ("" = no icon exists, use a text wordmark), hex colour] ---------- */
  stack: [
    ["Python", "python", "FFD343"], ["TypeScript", "typescript", "5AA0FF"], ["JavaScript", "javascript", "F7DF1E"],
    ["React", "react", "61DAFB"], ["Next.js", "nextdotjs", "FFFFFF"], ["FastAPI", "fastapi", "2DD4BF"],
    ["Flask", "flask", "FFFFFF"], ["MongoDB", "mongodb", "5FD068"], ["Hugging Face", "huggingface", "FFD21E"],
    ["Ollama", "ollama", "FFFFFF"], ["Discord", "discord", "8B95FF"], ["Gemini", "googlegemini", "B39DDB"],
    ["Unity", "unity", "FFFFFF"], ["Blender", "blender", "F5792A"], ["Krita", "krita", "3BABFF"], ["Live2D", "", "7DD3FC"]
  ],

  /* ---------- Proof of work rows: [title, sub, metric, unit, link] ---------- */
  highlights: [
    ["Yulya — Discord AI companion", "Live bot with voice chat, memory and an in-server economy", "LIVE", "online", "https://discord.yulya.me"],
    ["Hugging Face models", "Yulya family fine-tuned on Qwen2.5, Llama 3.x and SmolLM2", "8", "models", "https://huggingface.co/moheith"],
    ["Yulya on Ollama", "Run the persona locally on your own PC", "259+", "pulls", "https://ollama.com/moheith"],
    ["Yulya Studio", "AI-assisted browser game studio — React, FastAPI, MongoDB", "109", "commits", "https://github.com/moheith/Studio"],
    ["LEARNEXA 2.0", "Skill-exchange platform for students — Flask + Next.js", "2.0", "version", "https://github.com/moheith/LEARNEXA-2.0"],
    ["GitHub", "Public repositories, from AI to web apps", "13", "repos", "https://github.com/moheith"]
  ],

  /* ---------- About → education column: [title, sub, tag] ---------- */
  education: [
    ["SFGC", "Bachelor of Computer Applications (BCA)", ""],
    ["Self-directed learning", "Full stack, AI/ML, graphic design and game art — learned by shipping real projects", "4+ yrs"]
  ],

  toolkit: ["Full Stack Development", "UI / UX Design", "Graphic Design", "Python", "TypeScript", "React & Next.js",
            "FastAPI & Flask", "MongoDB & SQL", "LLM Fine-tuning", "Discord Bots",
            "Unity", "Blender", "Krita", "Live2D"],

  /* tiles under the toolkit chips (same format as stack) */
  software: [["Python", "python", "FFD343"], ["TypeScript", "typescript", "5AA0FF"], ["React", "react", "61DAFB"],
             ["Next.js", "nextdotjs", "FFFFFF"], ["MongoDB", "mongodb", "5FD068"], ["Hugging Face", "huggingface", "FFD21E"],
             ["Unity", "unity", "FFFFFF"], ["Blender", "blender", "F5792A"], ["Krita", "krita", "3BABFF"], ["Live2D", "", "7DD3FC"]],

  /* ---------- About → "FROM IDEA TO LAUNCH": [number, title, description] ---------- */
  process: [
    ["01", "THE IDEA", "Understand the problem, the users and the feeling the product should have."],
    ["02", "THE DESIGN", "Wireframes, visual direction and a design system that scales."],
    ["03", "THE BUILD", "Frontend, backend and data, written clean and tested."],
    ["04", "THE POLISH", "Motion, speed, accessibility and the details people feel."],
    ["05", "THE LAUNCH", "Ship it live, watch it run, and keep improving."]
  ],

  /* ---------- Journey accordion: [date, role, sub, description]. The FIRST item is open by default. ---------- */
  timeline: [
    ["2026 · NOW", "Independent Full Stack Developer & Designer", "Yulya · AI products & web apps",
     "Building Yulya end to end: a live Discord AI companion with voice, memory and an in-server economy, plus Yulya Studio and LEARNEXA 2.0. Design, frontend, backend, data and deployment, all in one pair of hands."],
    ["2026", "AI / ML Builder", "Hugging Face · Ollama",
     "Fine-tuned and published a family of 8 conversational models across Qwen2.5, Llama 3.x and SmolLM2, then shipped the persona to Ollama so anyone can run it locally."],
    ["2026", "BCA — SFGC", "Bachelor of Computer Applications",
     "Formal computer-science foundations, studied alongside hands-on product work and a growing list of shipped projects."],
    ["2024", "Game & Character Art", "Unity · Blender · Krita · Live2D",
     "Explored the creative side of tech: modelling in Blender, painting in Krita, rigging expressive Live2D characters and building interactive scenes in Unity. It shaped the visual taste behind everything I build."],
    ["2022 · 2025", "Designer & Developer — the self-taught years", "Graphics, websites & first products",
     "It started with graphic design (posters, logos, social creatives), grew into websites, then full stack code and AI. Four years of learning in public and shipping small things until they stopped being small."]
  ],

  /* ---------- Journey → milestones: [title, year, link] ---------- */
  milestones: [
    ["Yulya goes live on Discord", "2026", "https://discord.yulya.me"],
    ["8 models on Hugging Face", "2026", "https://huggingface.co/moheith"],
    ["Yulya Studio opens to the public", "2026", "https://studio.yulya.me"],
    ["Yulya on Ollama", "2026", "https://ollama.com/moheith"]
  ]
};
if (typeof module !== 'undefined') module.exports = CONTENT;
