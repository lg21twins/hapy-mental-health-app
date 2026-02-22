/* ═══════════════════════════════════════════════
   HAPY App — JavaScript (Redesigned)
═══════════════════════════════════════════════ */

/* ── STATE ── */
const S = {
  currentScreen: 'screen-splash',
  currentPage: 'page-home',
  phq9Answers: [],
  phq9Q: 0,
  user: JSON.parse(localStorage.getItem('hapy_user') || 'null'),
  posts: JSON.parse(localStorage.getItem('hapy_posts') || '[]'),
  chatMessages: JSON.parse(localStorage.getItem('hapy_chat') || '[]'),
  moodLog: JSON.parse(localStorage.getItem('hapy_mood') || '[]'),
  currentBoard: null,
  currentPost: null,
  callTimer: null,
  callSeconds: 0,
  muted: false,
};

/* ── DATA ── */
const PHQ9 = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way"
];

const PHQ9_OPTS = [
  { label: "Not at all",            value: 0 },
  { label: "Several days",          value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day",      value: 3 }
];

const DEP_LEVELS = [
  { min:0,  max:4,  label:"Minimal Depression",           badge:"🌤️", scale:"dawn",   color:"#C4B5FD", desc:"Your score indicates minimal or no depression. Keep nurturing yourself and stay connected with your emotions." },
  { min:5,  max:9,  label:"Mild Depression",              badge:"🌅", scale:"dawn",   color:"#C4B5FD", desc:"You're experiencing mild depression. It's a good time to reach out, talk to someone you trust, and explore HAPY's daily activities." },
  { min:10, max:14, label:"Moderate Depression",          badge:"🌇", scale:"sunset", color:"#7C3AED", desc:"Moderate depression detected. HAPY's AI companion and community can provide meaningful support for you right now." },
  { min:15, max:19, label:"Moderately Severe Depression", badge:"🌆", scale:"sunset", color:"#7C3AED", desc:"You're dealing with moderately severe depression. Consider reaching out to a professional alongside using HAPY." },
  { min:20, max:27, label:"Severe Depression",            badge:"🌑", scale:"night",  color:"#3B0764", desc:"Severe depression detected. Please seek professional help. HAPY is here to support you every step of the way. You are not alone." }
];

const DEP_TYPES = [
  { name:"Unipolar",         emoji:"🌟" },
  { name:"Bipolar",          emoji:"⏳" },
  { name:"Physical Illness", emoji:"⭐" },
  { name:"Age-related",      emoji:"🔢" },
  { name:"Psychological",    emoji:"✨" },
  { name:"Maskoid",          emoji:"🔵" }
];

const BOARDS = [
  { id:"challenge",   name:"Challenge Board",               icon:"🏆", count:128 },
  { id:"popular",     name:"Popular Articles",              icon:"🔥", count:84  },
  { id:"expert",      name:"Expert Opinion",                icon:"🎓", count:42  },
  { id:"daily",       name:"Daily Challenge",               icon:"📅", count:67  },
  { id:"free",        name:"Free Board",                    icon:"💬", count:203 },
  { id:"together",    name:"Together Board",                icon:"🤝", count:55  },
  { id:"overcoming",  name:"Overcoming Depression",         icon:"💪", count:91  }
];

const MOCK_POSTS = {
  challenge: [
    { id:1, board:"challenge", title:"Day 13 of the Daily Walking Challenge!", body:"I feel so proud. I encourage all of you to take a stroll in the nearby park at least once.\n\nIt has been 13 days since I started the daily walking challenge. At first I thought 30 minutes of walking would feel like nothing, but now I genuinely look forward to it.\n\nThe fresh air and gentle movement have done wonders for my mood. I've started noticing things I normally walk past — the way light hits the leaves, a neighbour's garden in full bloom.\n\nIf you're thinking about starting, just take the first step. Literally.", author:"happywalker", time:"January 9, 2024", likes:24, comments:[] },
    { id:2, board:"challenge", title:"30-Day Gratitude Challenge — Update", body:"Writing three things I'm grateful for every night has genuinely changed how I process my day. I started small — a good coffee, a text from a friend — but now I find myself noticing tiny moments of beauty throughout the day.\n\nTried this for two weeks now and the difference is noticeable. Anyone else on this challenge?", author:"thankful_days", time:"January 10, 2024", likes:18, comments:[] },
    { id:3, board:"challenge", title:"5-min morning meditation streak — Day 7", body:"Seven days straight! I use the HAPY notification to remind me every morning at 7am.\n\nI was sceptical at first. Five minutes felt both too short and somehow impossible to find. But now it's become the anchor to my morning.\n\nKey tip: don't try to 'clear your mind' — just observe your thoughts like clouds passing.", author:"morningmind", time:"January 11, 2024", likes:31, comments:[] }
  ],
  popular: [
    { id:4, board:"popular", title:"How I stopped comparing myself to others on social media", body:"I deleted Instagram for 30 days. Here's what happened.\n\nWeek 1 was hard. I kept reaching for my phone, expecting the usual dopamine hit. The absence felt loud.\n\nBy week 2 I noticed I was actually present in conversations again. I wasn't half-thinking about what photo I'd post.\n\nWeek 3: I started sleeping better. No late-night scroll sessions meant my brain actually had time to wind down.\n\nWeek 4: I felt lighter. Not happier necessarily, but quieter inside.\n\nI came back to Instagram eventually, but with a curated feed and time limits. The silence taught me what I actually enjoy versus what I was conditioned to consume.", author:"digital_detox", time:"January 8, 2024", likes:156, comments:[] },
    { id:5, board:"popular", title:"The unexpected thing that helped my anxiety more than therapy", body:"I want to be clear — therapy helped enormously. But what surprised me was this: running.\n\nNot because it's 'good for you'. Because it forced me to exist in my body instead of my head.\n\nWhen I run, the anxiety still comes. But it has nowhere to attach. My body is busy. My breath demands attention. The anxiety becomes noise behind the rhythm of footsteps.\n\nI run slowly. I run badly. I still run.", author:"running_through", time:"January 7, 2024", likes:89, comments:[] }
  ],
  expert: [
    { id:6, board:"expert", title:"Understanding Masked Depression — Expert Column", body:"Masked depression, sometimes called smiling depression, is a form of depression where individuals appear outwardly normal or even cheerful while internally experiencing significant depressive symptoms.\n\nKey signs to watch for:\n• Maintaining normal or above-normal performance at work/school\n• Appearing happy and sociable in public\n• Extreme fatigue after social interactions\n• Feeling empty when alone\n\nIf you recognize these patterns in yourself or a loved one, please reach out. Early intervention makes a profound difference.\n\n— Dr. Kim, Clinical Psychologist", author:"Dr. Kim, PhD", time:"January 5, 2024", likes:203, comments:[] }
  ],
  free: [
    { id:7, board:"free", title:"Anyone else feel worse in winter?", body:"I've noticed my mood drops significantly every November through February. Shorter days, less sunlight, and I just want to hibernate.\n\nDoes anyone else experience this? I've read about Seasonal Affective Disorder but I'm not sure if what I have is that serious.\n\nThings that have helped me: a SAD lamp in the morning, vitamin D supplements, and forcing myself outside at lunch even for 10 minutes.", author:"seasonal_blues", time:"January 10, 2024", likes:45, comments:[] },
    { id:8, board:"free", title:"Small wins today 🌱", body:"I want to share some small wins because I think we don't celebrate these enough:\n\n✓ I showered and got dressed\n✓ I replied to a text I'd been avoiding for a week\n✓ I ate a proper meal\n✓ I went outside for 5 minutes\n\nOn hard days, these are victories. Be kind to yourself.", author:"smallstepsbig", time:"January 11, 2024", likes:312, comments:[] }
  ],
  daily: [
    { id:9, board:"daily", title:"Today's challenge: Write down one thing you're proud of", body:"It can be anything. A thought you had. A conversation you started. The fact that you're here reading this.\n\nShare it below if you feel comfortable. This community celebrates every step forward, no matter how small.\n\nI'll go first: Today I'm proud that I reached out to HAPY when I was feeling overwhelmed instead of bottling it up.", author:"hapy_team", time:"January 11, 2024", likes:78, comments:[] }
  ],
  together: [
    { id:10, board:"together", title:"Looking for a walking buddy in Seoul 🚶", body:"I find it much easier to stick to exercise when I have company. If anyone is in the Seoul area and wants to do a casual walk once a week, please comment!\n\nNo pressure, no judgement — just two people choosing to move forward together (literally).", author:"walkwithme_seoul", time:"January 9, 2024", likes:22, comments:[] }
  ],
  overcoming: [
    { id:11, board:"overcoming", title:"Six months medication-free — my journey", body:"I want to share this carefully because everyone's path is different, and medication is sometimes absolutely the right choice. This is just my story.\n\nSix months ago I worked with my psychiatrist to gradually taper off antidepressants after two years. It was not easy. There were difficult weeks.\n\nBut I learned: I am not the darkness. The darkness visits sometimes. I have tools now — HAPY, therapy, running, honest friendships — and they're enough.\n\nIf you're struggling, you are not alone. The work is worth it.", author:"through_the_night", time:"January 6, 2024", likes:267, comments:[] }
  ]
};

const MAGAZINE_ARTICLES = [
  {
    id:1,
    category:"Wellness",
    title:"Botanical Interior: How Your Surroundings Shape Your Mind",
    author:"Interior Designer Kim Soo-yeon · January 10, 2024",
    emoji:"🌿",
    colorClass:"",
    gradient:"linear-gradient(135deg,#065F46,#10B981)",
    body:`In the hustle and bustle of modern life, where stress and anxiety often take centre stage, a new trend in interior design has emerged as a breath of fresh air — Botanical Interior Design.

This design philosophy focuses on creating spaces that not only captivate the eye but also nurture the soul.

"When your heart feels down, how about changing your surroundings first?"

The science is clear: exposure to natural elements — plants, natural light, organic textures — measurably reduces cortisol levels and promotes a sense of calm.

Here are three easy ways to bring botanical design into your space:

1. Start with one plant
You don't need a jungle. A single pothos on your desk can shift your mood during a difficult workday.

2. Let in natural light
Rearrange your space to maximise morning light. Even 10 minutes of sunlight through a window can help regulate your circadian rhythm.

3. Natural textures matter
Swap synthetic fabrics for cotton and linen. Place a wooden bowl on your table. These small changes create subconscious signals of safety and warmth.

Your environment is a conversation with your nervous system. Make it a kind one.`
  },
  {
    id:2,
    category:"Exercise & Mental Health",
    title:"Depression and Exercise: What the Science Actually Says",
    author:"Dr. Park, Sports Psychology · January 8, 2024",
    emoji:"🏃",
    colorClass:"second",
    gradient:"linear-gradient(135deg,#1E40AF,#3B82F6)",
    body:`Exercise is frequently recommended for depression — but the messaging around it often does more harm than good.

"Just go for a run" ignores the crushing fatigue that makes getting out of bed feel like climbing a mountain.

What the research shows:
Multiple meta-analyses confirm that regular exercise has antidepressant effects comparable to medication for mild to moderate depression. The mechanism involves increased BDNF (brain-derived neurotrophic factor), which promotes neural growth.

The crucial caveat:
"Regular exercise" in these studies often means three sessions per week of moderate-intensity activity. Not a marathon. A 30-minute walk counts.

What actually works:
• Start impossibly small (5 minutes)
• Attach exercise to something you already do (walk after lunch)
• Treat relapse as data, not failure

You don't need to be well to start. You start to get well.`
  },
  {
    id:3,
    category:"Mindfulness",
    title:"The 5-4-3-2-1 Grounding Technique for Anxiety",
    author:"Mindfulness Practitioner Lee Ji-yeon · January 6, 2024",
    emoji:"🧘",
    colorClass:"third",
    gradient:"linear-gradient(135deg,#7C3AED,#A78BFA)",
    body:`When anxiety spikes, your nervous system believes you're in danger. The 5-4-3-2-1 technique interrupts that pattern by anchoring you in the present moment through your senses.

How to use it:

5 — Name 5 things you can see
Look around and identify five specific objects. Specificity matters — it pulls your attention fully into the present.

4 — Name 4 things you can physically feel
The weight of your feet on the floor. The texture of your clothing. The temperature of the air.

3 — Name 3 things you can hear
Listen carefully. You might notice the hum of a refrigerator, distant traffic, your own breathing.

2 — Name 2 things you can smell
This one is harder in everyday environments, which is exactly why it works.

1 — Name 1 thing you can taste
The lingering taste of your last drink, or simply the air.

By the time you finish, your nervous system has received consistent signals that you are, right now, safe.`
  },
  {
    id:4,
    category:"Connection",
    title:"Why Loneliness Hurts — And What Actually Helps",
    author:"Social Psychologist Prof. Choi · January 4, 2024",
    emoji:"🤝",
    colorClass:"fourth",
    gradient:"linear-gradient(135deg,#B45309,#F59E0B)",
    body:`Loneliness is not the absence of people. It's the absence of genuine connection — and this distinction matters enormously.

You can be surrounded by hundreds of people and still feel profoundly alone. Conversely, a single authentic conversation can dissolve isolation that has lasted years.

The biology of loneliness:
Chronic loneliness activates the body's threat response in ways remarkably similar to physical pain. The same neural circuits light up.

Social media's complicated role:
Passive scrolling through others' lives tends to increase loneliness. Active connection — messaging someone directly, commenting meaningfully — can help.

What actually helps:

1. Lower the bar for connection
Small, consistent interactions — a check-in text, a comment that shows you noticed — build the foundation of real relationships.

2. Be the one to reach out
Loneliness creates a waiting posture. Someone has to go first. It might as well be you.

3. Find communities of shared experience
The relief of talking to someone who understands is profound. This is exactly why the HAPY community exists.

You deserve connection. It starts with one small step toward another person.`
  }
];

const HAPY_RESPONSES = {
  greeting:   ["Hello! I'm HAPY, your mental health companion. How are you feeling today? 💜", "Hi there! I'm so glad you reached out. How's your day going? 💜", "Hey! It's good to hear from you. What's on your mind today? 💜"],
  sad:        ["I hear you. Your feelings are valid, and I'm here with you. Would you like to tell me more about what's been weighing on your heart? 💜", "Thank you for sharing that with me. Sadness is a signal worth listening to. What's been happening lately? 💜", "I'm sorry you're feeling this way. You don't have to carry this alone. I'm right here — talk to me. 💜"],
  work:       ["Work stress can be really draining. Your feelings make complete sense. Have you been able to take any breaks for yourself lately? 💜", "That sounds exhausting. It's important to remember that your worth isn't defined by your productivity. How long has work been feeling this heavy? 💜", "It sounds like you're carrying a lot. Would it help to talk through what's been happening at work? Sometimes just saying it out loud helps. 💜"],
  sleep:      ["Sleep difficulties are so hard — and they affect everything else. Have you noticed any patterns in when the sleep problems are worst? 💜", "Poor sleep can amplify every difficult feeling. Have you tried a wind-down routine? Even 10 quiet minutes before bed can help signal safety to your nervous system. 💜", "I hear you on the sleep struggles. That cycle of exhaustion and racing thoughts is genuinely painful. What does your evening usually look like before bed? 💜"],
  lonely:     ["Loneliness is one of the most painful human experiences, and I want you to know — reaching out here is a real act of courage. I'm with you. 💜", "You reached out, and that matters. You're not as alone as loneliness makes you feel. Would you like to talk about what's been making you feel disconnected? 💜", "I'm here, and I'm genuinely glad you're talking to me. Loneliness lies to us — it tells us no one cares. But you reaching out proves you haven't given up. 💜"],
  anxiety:    ["Anxiety is your nervous system trying to protect you — even when there's no real danger. Let's slow down together. Can you take one slow breath with me? Inhale for 4... hold for 4... exhale for 6. 💜", "I hear the worry in what you're sharing. Anxiety can feel very loud and very urgent. What's the main thing your mind keeps circling back to? 💜", "That anxious spiral sounds so tiring. You're not weak for feeling this — anxiety is exhausting. What would feel most helpful right now — talking it through, or some grounding exercises? 💜"],
  positive:   ["That's genuinely wonderful to hear! 🌟 What's been helping you feel this way? I'd love to hear about it. 💜", "I love hearing this! Good days are worth celebrating. What was the highlight? 💜", "That makes me happy for you! 💜 Keep holding onto that feeling — and remember, even on harder days, moments like this one are proof that things can feel good again."],
  thanks:     ["You're so welcome. I'm always here for you. 💜", "It's truly my pleasure. That's what I'm here for — any time, any day. 💜", "Thank you for trusting me with your feelings. Come back whenever you need. 💜"],
  help:       ["Of course! Here's what HAPY offers:\n\n💬 Chat with me anytime, day or night\n🏆 Daily challenges to build positive habits\n👥 Community boards to connect with others\n📖 Expert articles in the Magazine\n📊 Track your mood and progress in Profile\n\nWhat would you like to explore? 💜"],
  crisis:     ["I'm really glad you reached out right now. What you're feeling matters deeply.\n\nIf you're in immediate danger, please contact:\n🇰🇷 Korea: 1393 (Mental Health Crisis Line)\n📞 International: findahelpline.com\n\nI'm here with you. Can you tell me a little more about how you're feeling right now? 💜"],
  default:    ["Thank you for sharing that with me. I'm listening. Could you tell me a little more about how you're feeling? 💜", "I appreciate you opening up. What's been on your mind the most lately? 💜", "I hear you. Your experience matters, and I want to understand it better. Can you say more? 💜", "That sounds meaningful. I want to make sure I understand — how has this been affecting your day-to-day life? 💜"]
};

/* ── UTILS ── */
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function save() {
  localStorage.setItem('hapy_user', JSON.stringify(S.user));
  localStorage.setItem('hapy_posts', JSON.stringify(S.posts));
  localStorage.setItem('hapy_chat', JSON.stringify(S.chatMessages));
  localStorage.setItem('hapy_mood', JSON.stringify(S.moodLog));
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
function now() {
  return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
}
function updateStatusTime() {
  const t = new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:false});
  document.querySelectorAll('.status-time').forEach(el => el.textContent = t);
}
function getGreetingTime() {
  const h = new Date().getHours();
  if (h < 12) return { label:'Good morning', time:'Morning' };
  if (h < 17) return { label:'Good afternoon', time:'Afternoon' };
  if (h < 21) return { label:'Good evening', time:'Evening' };
  return { label:'Good night', time:'Night' };
}

/* ── SCREEN NAV ── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active', 'slide-in');
  S.currentScreen = id;
  setTimeout(() => el.classList.remove('slide-in'), 380);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  updateStatusTime();
  setInterval(updateStatusTime, 30000);

  document.querySelectorAll('.terms-check').forEach(cb => {
    cb.addEventListener('change', checkTerms);
  });

  if (S.user) {
    enterApp();
  } else {
    setTimeout(() => showScreen('screen-terms'), 2400);
  }
});

function checkTerms() {
  const allChecked = [...document.querySelectorAll('.terms-check')].every(c => c.checked);
  const btn = document.getElementById('terms-next-btn');
  btn.disabled = !allChecked;
  btn.classList.toggle('btn-disabled', !allChecked);
}

/* ── NAME SCREEN ── */
function goToName() {
  showScreen('screen-name');
  setTimeout(() => document.getElementById('name-input-screen').focus(), 400);
}

/* ── PHQ-9 ── */
function goToPHQ9() {
  const nameInput = document.getElementById('name-input-screen');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!S.user) S.user = {};
  S.user.name = name || 'HAPY User';
  S.phq9Answers = [];
  S.phq9Q = 0;
  showScreen('screen-phq9');
  renderPHQ9Question();
}

function renderPHQ9Question() {
  const q = S.phq9Q;
  document.getElementById('phq9-question-text').textContent = PHQ9[q];
  document.getElementById('phq9-step-label').textContent = `${q+1} / 9`;
  document.getElementById('phq9-progress-fill').style.width = `${((q+1)/9)*100}%`;
  const opts = document.getElementById('phq9-options');
  opts.innerHTML = PHQ9_OPTS.map(o => `
    <button class="phq9-option" onclick="answerPHQ9(${o.value})">
      <span class="option-dot"></span>
      <span class="option-label">${o.label}</span>
      <span class="option-value">${o.value}</span>
    </button>`).join('');
}

function answerPHQ9(val) {
  S.phq9Answers.push(val);
  const btns = document.querySelectorAll('.phq9-option');
  btns.forEach(b => {
    if (parseInt(b.querySelector('.option-value').textContent) === val) b.classList.add('selected');
  });
  setTimeout(() => {
    S.phq9Q++;
    if (S.phq9Q < 9) renderPHQ9Question();
    else showResult();
  }, 350);
}

function showResult() {
  const score = S.phq9Answers.reduce((a,b) => a+b, 0);
  const level = DEP_LEVELS.find(l => score >= l.min && score <= l.max);
  const type  = rand(DEP_TYPES);

  if (!S.user) S.user = {};
  S.user.phq9Score = score;
  S.user.level = level;
  S.user.type  = type;
  S.user.name  = S.user.name || 'HAPY User';
  S.user.avatar = S.user.avatar || '😊';
  S.user.subscription = S.user.subscription || 'basic';
  S.user.streak = S.user.streak || 1;
  S.user.joinDate = S.user.joinDate || new Date().toISOString();
  save();

  document.getElementById('result-badge').textContent = level.badge;
  document.getElementById('result-badge').style.background = level.color + '30';
  document.getElementById('result-badge').style.border = `2px solid ${level.color}40`;
  document.getElementById('result-title').textContent = level.label;
  document.getElementById('result-desc').textContent  = level.desc;
  const chipsEl = document.getElementById('result-chips');
  if (chipsEl) chipsEl.innerHTML = `<span class="result-chip">${type.emoji} ${type.name} Type</span><span class="result-chip">Score: ${score}</span>`;

  document.querySelectorAll('.scale-pill').forEach(s => s.classList.remove('active'));
  const scaleEl = document.getElementById('scale-' + level.scale);
  if (scaleEl) scaleEl.classList.add('active');

  showScreen('screen-result');
}

/* ── ENTER APP ── */
function enterApp() {
  if (!S.user) return;
  // Update streak
  const today = new Date().toDateString();
  if (S.user.lastVisit !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (S.user.lastVisit === yesterday.toDateString()) {
      S.user.streak = (S.user.streak || 0) + 1;
    } else if (!S.user.lastVisit) {
      S.user.streak = 1;
    } else {
      S.user.streak = 1;
    }
    S.user.lastVisit = today;
    save();
  }

  showScreen('screen-app');
  renderHome();
  renderCommunity();
  renderMagazine();
  renderProfile();
  initChat();
}

/* ── PAGE SWITCH ── */
function switchPage(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  el.classList.add('active');
  S.currentPage = 'page-'+page;
  updateHeader(page);
  if (page === 'hapy') setTimeout(scrollChatBottom, 80);
}

function updateHeader(page) {
  const titles = { home:'HAPY', community:'Community', hapy:'', magazine:'Magazine', profile:'Profile' };
  const headerEl   = document.getElementById('app-header');
  const statusBar  = document.getElementById('app-status-bar');
  const logoEl     = document.getElementById('app-header-logo');
  const titleEl    = document.getElementById('app-header-title');
  const actions    = document.getElementById('app-header-actions');

  // Hide shared header & status bar for chat page (has its own chat-header)
  if (page === 'hapy') {
    headerEl.style.display = 'none';
    if (statusBar) statusBar.style.display = 'none';
    return;
  }
  headerEl.style.display = 'flex';
  if (statusBar) statusBar.style.display = 'flex';

  // Show logo on home
  if (page === 'home') {
    logoEl.style.display = 'flex';
    titleEl.style.display = 'none';
  } else {
    logoEl.style.display = 'none';
    titleEl.style.display = 'block';
    titleEl.textContent = titles[page] || 'HAPY';
  }

  if (page === 'profile') {
    actions.innerHTML = `<button class="header-icon-btn" onclick="editName()" title="Edit name">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
    </button>`;
  } else {
    actions.innerHTML = '';
  }
}

const TIPS = [
  "Take 5 slow, deep breaths. Your nervous system will thank you.",
  "Step outside for 10 minutes. Sunlight can shift your mood.",
  "Text one person you care about today — just to say hi.",
  "Drink a glass of water. Hydration affects how you feel.",
  "Write down one thing you're grateful for, however small.",
  "A 20-minute walk has the same antidepressant effect as medication for mild depression.",
  "You don't have to feel 100% to start. You start to feel better.",
  "Rest is productive. Your body and mind need recovery time."
];

/* ── HOME ── */
function renderHome() {
  // Greeting
  const { label, time } = getGreetingTime();
  const name = S.user?.name || 'Friend';
  const streak = S.user?.streak || 1;
  document.getElementById('greeting-time-label').textContent = time;
  document.getElementById('greeting-name').textContent = `${label}, ${name}!`;
  document.getElementById('hero-streak').textContent = `${streak} day${streak !== 1 ? 's' : ''}`;

  // Tip of the day
  const tipEl = document.getElementById('tip-text');
  if (tipEl) tipEl.textContent = TIPS[new Date().getDay() % TIPS.length];

  // Restore today's mood if logged
  const today = new Date().toDateString();
  const todayMood = S.moodLog.find(m => m.date === today);
  if (todayMood) {
    document.querySelectorAll('.hero-mood-btn').forEach(btn => {
      if (btn.getAttribute('onclick').includes(todayMood.mood)) btn.classList.add('selected');
    });
  }

  // Banner
  const banners = [
    { tag:'What\'s New', title:'HAPY Update 2.01', sub:'Community challenges now available!', bg:'linear-gradient(135deg,#6D28D9,#8B5CF6)', emoji:'🚀' },
    { tag:'Feature', title:'Daily Mood Tracking', sub:'Track how you feel every day', bg:'linear-gradient(135deg,#0E7490,#0891B2)', emoji:'📊' },
    { tag:'Event', title:'January Walking Challenge', sub:'30 days · Join 2,400+ members', bg:'linear-gradient(135deg,#059669,#10B981)', emoji:'🚶' }
  ];
  const b = rand(banners);
  document.getElementById('home-whats-new').innerHTML = `
    <div class="banner-inner" style="background:${b.bg}">
      <div class="banner-tag">${b.tag}</div>
      <div class="banner-title">${b.title}</div>
      <div class="banner-sub">${b.sub}</div>
      <div class="banner-emoji">${b.emoji}</div>
    </div>`;

  // Recs
  const recs = [
    { label:'Depression &amp; Exercise', cls:'rec-chip-1' },
    { label:'Daily Challenge', cls:'rec-chip-2' },
    { label:'Grounding Techniques', cls:'rec-chip-3' },
    { label:'Botanical Interior', cls:'rec-chip-4' }
  ];
  document.getElementById('home-recs').innerHTML = recs.map(r =>
    `<div class="rec-chip ${r.cls}" onclick="switchPage('magazine',document.querySelector('[data-page=magazine]'))">${r.label}</div>`
  ).join('');

  // Highlights
  const highs = [
    { icon:'🏆', title:'Best Challenge of December 2023', meta:'Challenge Board · 128 posts' },
    { icon:'🔥', title:'Day 13 of the Daily Walking Challenge!', meta:'Community · 2 min read' },
    { icon:'🌿', title:'Botanical Interior by Kim Soo-yeon', meta:'Magazine · Wellness' }
  ];
  document.getElementById('home-highlights').innerHTML = highs.map(h => `
    <div class="highlight-card" onclick="switchPage('community',document.querySelector('[data-page=community]'))">
      <div class="hl-icon-wrap">${h.icon}</div>
      <div class="hl-body">
        <div class="hl-title">${h.title}</div>
        <div class="hl-meta">${h.meta}</div>
      </div>
      <span class="hl-arrow">›</span>
    </div>`).join('');
}

function selectMood(btn, mood) {
  document.querySelectorAll('.hero-mood-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const today = new Date().toDateString();
  S.moodLog = S.moodLog.filter(m => m.date !== today);
  S.moodLog.push({ date: today, mood, time: now() });
  save();
  const moodEmojis = { awful:'😔', bad:'😟', okay:'😐', good:'😊', great:'😄' };
  showToast(`Mood logged! ${moodEmojis[mood]}`);
}

/* ── COMMUNITY ── */
function renderCommunity() {
  document.getElementById('community-challenge-banner').innerHTML = `
    <h3>🏅 Best Challenge of December 2023</h3>
    <p>See the top challengers and join the current challenge →</p>`;
  document.getElementById('community-challenge-banner').onclick = () => openBoard('challenge');

  document.getElementById('board-list').innerHTML = BOARDS.map(b => `
    <div class="board-card" onclick="openBoard('${b.id}')">
      <div class="board-icon">${b.icon}</div>
      <div class="board-name">${b.name}</div>
      <div class="board-count">${b.count} posts</div>
    </div>`).join('');
}

function showCommunityMain() {
  document.getElementById('community-main').style.display = '';
  document.getElementById('community-postlist').style.display = 'none';
  document.getElementById('community-post-detail').style.display = 'none';
  document.getElementById('app-header-title').textContent = 'Community';
}

function openBoard(boardId) {
  S.currentBoard = boardId;
  const board = BOARDS.find(b => b.id === boardId);
  document.getElementById('postlist-title').textContent = board.name;

  const allPosts = [
    ...(MOCK_POSTS[boardId] || []),
    ...S.posts.filter(p => p.board === boardId)
  ].reverse();

  document.getElementById('post-list').innerHTML = allPosts.length
    ? allPosts.map(p => `
      <div class="post-item" onclick='openPost(${p.id || p.localId || 0}, "${boardId}", ${JSON.stringify(JSON.stringify(p))})'>
        <div class="post-title">${p.title}</div>
        <div class="post-meta">
          <span>✍️ ${p.author}</span>
          <span>❤️ ${p.likes || 0}</span>
          <span>💬 ${(p.comments||[]).length}</span>
        </div>
      </div>`).join('')
    : `<div class="empty-state"><div class="empty-state-icon">✏️</div><div class="empty-state-text">No posts yet. Be the first!</div></div>`;

  document.getElementById('community-main').style.display = 'none';
  document.getElementById('community-postlist').style.display = 'flex';
  document.getElementById('community-post-detail').style.display = 'none';
  document.getElementById('app-header-title').textContent = board.name;
}

function openPost(id, boardId, postDataStr) {
  let post;
  try {
    post = JSON.parse(postDataStr);
  } catch(e) {
    post = (MOCK_POSTS[boardId]||[]).find(p => p.id === id) || S.posts.find(p => p.id === id);
  }
  if (!post) return;
  S.currentPost = post;

  document.getElementById('post-detail-content').innerHTML = `
    <div class="post-detail-title">${post.title}</div>
    <div class="post-detail-meta">
      <span>✍️ ${post.author}</span>
      <span>🕐 ${post.time}</span>
    </div>
    <div class="post-detail-body">${post.body}</div>
    <div class="post-reactions">
      <button class="reaction-btn" onclick="likePost(this)">❤️ ${post.likes || 0}</button>
      <button class="reaction-btn" onclick="scrapPost()">🔖 Save</button>
    </div>
    <div class="comments-title">Comments (${(post.comments||[]).length})</div>
    <div id="comments-list">
      ${(post.comments||[]).map(c => `
        <div class="comment-item">
          <div class="comment-author">${c.author}</div>
          <div class="comment-body">${c.text}</div>
          <div class="comment-time">${c.time}</div>
        </div>`).join('')}
    </div>`;

  document.getElementById('community-postlist').style.display = 'none';
  document.getElementById('community-post-detail').style.display = 'flex';
  document.getElementById('app-header-title').textContent = 'Post';
}

function showPostList() {
  if (S.currentBoard) openBoard(S.currentBoard);
}

function likePost(btn) {
  if (btn.classList.contains('liked')) { showToast("Already liked 💜"); return; }
  btn.classList.add('liked');
  const n = parseInt(btn.textContent.replace(/\D/g,'')) + 1;
  btn.textContent = `❤️ ${n}`;
  if (S.currentPost) S.currentPost.likes = n;
  showToast("Liked! 💜");
}

function scrapPost() { showToast("Saved to Bookmarks 🔖"); }

function submitComment() {
  const input = document.getElementById('comment-input');
  const text = input.value.trim();
  if (!text) return;
  const comment = { author: S.user.name || 'HAPY User', text, time: now() };
  if (!S.currentPost.comments) S.currentPost.comments = [];
  S.currentPost.comments.push(comment);
  const list = document.getElementById('comments-list');
  list.innerHTML += `<div class="comment-item">
    <div class="comment-author">${comment.author}</div>
    <div class="comment-body">${comment.text}</div>
    <div class="comment-time">${comment.time}</div>
  </div>`;
  input.value = '';
  list.lastElementChild.scrollIntoView({ behavior:'smooth' });
  showToast("Comment posted! 💬");
}

function openMyContent(type) {
  const labels = { articles:'My Articles', comments:'My Comments', saved:'Saved Posts', liked:'Liked Posts' };
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">${labels[type]}</div>
    <div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">No ${labels[type].toLowerCase()} yet.<br>Start engaging with the community!</div></div>`);
}

function openWritePost() {
  document.getElementById('write-post-overlay').style.display = 'flex';
}
function closeWritePost() {
  document.getElementById('write-post-overlay').style.display = 'none';
  document.getElementById('write-title').value = '';
  document.getElementById('write-body').value = '';
}
function submitPost() {
  const title = document.getElementById('write-title').value.trim();
  const body  = document.getElementById('write-body').value.trim();
  if (!title || !body) { showToast("Please fill in both title and content"); return; }
  const post = {
    localId: Date.now(), id: Date.now(),
    board: S.currentBoard || 'free',
    title, body,
    author: S.user.name || 'HAPY User',
    time: new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
    likes: 0, comments: []
  };
  S.posts.push(post);
  save();
  closeWritePost();
  showToast("Post shared! 🎉");
  if (S.currentBoard) openBoard(S.currentBoard);
}

/* ── CHAT ── */
const HAPY_AVATAR_SVG = `<svg viewBox="0 0 60 26" fill="none">
  <rect x="0" y="1" width="5" height="24" rx="1.2" fill="white"/>
  <rect x="7.5" y="1" width="5" height="24" rx="1.2" fill="white"/>
  <rect x="0" y="10" width="12.5" height="4.5" rx="1.2" fill="white"/>
  <path d="M16 25 L22.5 1 L29 25" stroke="white" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="18" y1="17.5" x2="27" y2="17.5" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <rect x="34" y="1" width="5" height="24" rx="1.2" fill="white"/>
  <path d="M39 1 Q51 1 51 10 Q51 19 39 19" stroke="white" stroke-width="4.8" fill="none"/>
</svg>`;

const CHAT_SUGGESTIONS = [
  "I'm feeling anxious today",
  "I can't sleep well lately",
  "I feel lonely",
  "Help me calm down",
  "I'm feeling good today! 😊"
];

function initChat() {
  const container = document.getElementById('chat-messages');
  container.innerHTML = `<div class="chat-date-pill">Today</div>`;
  if (S.chatMessages.length === 0) {
    const name = S.user?.name || '';
    const greeting = `Hello${name ? ', '+name : ''}! 😊 I'm HAPY, your personal mental health companion.\n\nI'm here to listen, support, and help you through whatever you're facing. How are you feeling today? 💜`;
    addHapyMsg(greeting, false);
  } else {
    S.chatMessages.forEach(m => renderMessage(m));
    scrollChatBottom();
  }

  // Populate suggestion chips
  const sugEl = document.getElementById('chat-suggestions');
  if (sugEl) {
    sugEl.innerHTML = CHAT_SUGGESTIONS.map(s =>
      `<button class="suggestion-chip" onclick="useSuggestion(this,'${s.replace(/'/g,"&#39;")}')">${s}</button>`
    ).join('');
  }
}

function useSuggestion(btn, text) {
  btn.remove();
  document.getElementById('chat-input').value = text;
  sendChatMessage();
}

function renderMessage(msg) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-msg ${msg.role}`;
  div.innerHTML = msg.role === 'hapy'
    ? `<div class="chat-avatar">${HAPY_AVATAR_SVG}</div>
       <div>
         <div class="chat-bubble">${msg.text.replace(/\n/g,'<br>')}</div>
         <div class="chat-msg-time">${msg.time}</div>
       </div>`
    : `<div>
         <div class="chat-bubble">${msg.text.replace(/\n/g,'<br>')}</div>
         <div class="chat-msg-time">${msg.time}</div>
       </div>`;
  container.appendChild(div);
}

function addHapyMsg(text, saveIt = true) {
  const msg = { role:'hapy', text, time: now() };
  if (saveIt) { S.chatMessages.push(msg); save(); }
  renderMessage(msg);
  scrollChatBottom();
}

function addUserMsg(text) {
  const msg = { role:'user', text, time: now() };
  S.chatMessages.push(msg);
  save();
  renderMessage(msg);
  scrollChatBottom();
}

function scrollChatBottom() {
  const c = document.getElementById('chat-messages');
  c.scrollTop = c.scrollHeight;
}

function showTyping() {
  const c = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg hapy';
  div.id = 'typing-indicator';
  div.innerHTML = `<div class="chat-avatar">${HAPY_AVATAR_SVG}</div>
    <div class="chat-typing">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  c.appendChild(div);
  scrollChatBottom();
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

function generateHapyResponse(text) {
  const t = text.toLowerCase();
  if (/^(hi|hello|hey|안녕|하이)/.test(t)) return rand(HAPY_RESPONSES.greeting);
  if (/die|kill|suicid|end it|hurt myself|죽고|자살|자해/.test(t)) return rand(HAPY_RESPONSES.crisis);
  if (/sad|depress|down|unhappy|cry|awful|terrible|힘들|슬프|우울/.test(t)) return rand(HAPY_RESPONSES.sad);
  if (/work|job|boss|office|tired|exhausted|overwork|직장|회사|야근/.test(t)) return rand(HAPY_RESPONSES.work);
  if (/sleep|insomnia|awake|night|nightmare|잠|수면|불면/.test(t)) return rand(HAPY_RESPONSES.sleep);
  if (/lone|alone|isolated|nobody|friends|외로|혼자/.test(t)) return rand(HAPY_RESPONSES.lonely);
  if (/anxious|anxiety|worry|worried|scared|panic|불안|걱정/.test(t)) return rand(HAPY_RESPONSES.anxiety);
  if (/happy|good|great|better|wonderful|행복|좋아/.test(t)) return rand(HAPY_RESPONSES.positive);
  if (/thank|thanks|감사|고마/.test(t)) return rand(HAPY_RESPONSES.thanks);
  if (/help|what can|feature|기능|도움/.test(t)) return rand(HAPY_RESPONSES.help);
  return rand(HAPY_RESPONSES.default);
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addUserMsg(text);
  showTyping();
  setTimeout(() => {
    removeTyping();
    addHapyMsg(generateHapyResponse(text));
  }, 900 + Math.random() * 600);
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
}

/* ── CALL ── */
function startCall() {
  const overlay = document.getElementById('call-overlay');
  overlay.style.display = 'flex';
  document.getElementById('call-status').textContent = 'Connecting...';
  document.getElementById('call-timer').style.display = 'none';
  S.callSeconds = 0;
  setTimeout(() => {
    document.getElementById('call-status').textContent = 'Connected';
    document.getElementById('call-timer').style.display = 'block';
    S.callTimer = setInterval(() => {
      S.callSeconds++;
      const m = String(Math.floor(S.callSeconds/60)).padStart(2,'0');
      const s = String(S.callSeconds%60).padStart(2,'0');
      document.getElementById('call-timer').textContent = `${m}:${s}`;
    }, 1000);
  }, 1500);
}

function endCall() {
  clearInterval(S.callTimer);
  document.getElementById('call-overlay').style.display = 'none';
  if (S.callSeconds > 3) {
    setTimeout(() => addHapyMsg("It was so good talking with you! Remember, I'm always here whenever you need to chat. 💜"), 500);
  }
}

function toggleMute() {
  S.muted = !S.muted;
  document.getElementById('mute-icon').textContent = S.muted ? '🔇' : '🔊';
  showToast(S.muted ? 'Muted 🔇' : 'Unmuted 🔊');
}

/* ── BREATHING ── */
function openBreathing() {
  let phase = 0; // 0=inhale,1=hold,2=exhale
  let count = 0;
  const phases = [
    { label:'Inhale', duration:4, color:'#6D28D9' },
    { label:'Hold',   duration:4, color:'#7C3AED' },
    { label:'Exhale', duration:6, color:'#A78BFA' }
  ];
  let interval = null;

  function renderBreathing(secondsLeft) {
    const p = phases[phase];
    const bodyEl = document.getElementById('modal-body');
    if (!bodyEl) return;
    bodyEl.querySelector('#breath-phase').textContent = p.label;
    bodyEl.querySelector('#breath-count').textContent = secondsLeft;
    bodyEl.querySelector('#breath-circle').style.transform =
      phase === 0 ? `scale(${1 + (p.duration - secondsLeft) * 0.08})` :
      phase === 2 ? `scale(${1.64 - (p.duration - secondsLeft) * 0.08})` : 'scale(1.64)';
  }

  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">Box Breathing</div>
    <p style="font-size:.85rem;color:#6B7280;text-align:center;margin-bottom:24px">4-4-6 breathing to calm your nervous system</p>
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:16px 0">
      <div id="breath-circle" style="width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,#6D28D9,#A78BFA);display:flex;align-items:center;justify-content:center;transition:transform 1s ease-in-out;box-shadow:0 0 40px #6D28D940">
        <span id="breath-count" style="font-size:2.5rem;font-weight:700;color:white">4</span>
      </div>
      <div id="breath-phase" style="font-size:1.1rem;font-weight:600;color:#6D28D9">Inhale</div>
    </div>
    <button class="btn-primary" onclick="closeModal()" style="margin-top:8px">Done</button>`);

  let secondsLeft = phases[0].duration;
  interval = setInterval(() => {
    if (!document.getElementById('modal-body')) { clearInterval(interval); return; }
    secondsLeft--;
    if (secondsLeft <= 0) {
      phase = (phase + 1) % 3;
      secondsLeft = phases[phase].duration;
    }
    renderBreathing(secondsLeft);
  }, 1000);
  renderBreathing(secondsLeft);
}

/* ── MAGAZINE ── */
function renderMagazine() {
  // Featured (first article)
  const featured = MAGAZINE_ARTICLES[0];
  document.getElementById('magazine-featured-wrap').innerHTML = `
    <div class="mag-featured" onclick="openArticle(${featured.id})">
      <div class="mag-feat-img" style="background:${featured.gradient}">${featured.emoji}</div>
      <div class="mag-feat-body">
        <div class="mag-feat-cat">${featured.category}</div>
        <div class="mag-feat-title">${featured.title}</div>
        <div class="mag-feat-author">${featured.author}</div>
      </div>
    </div>`;

  // Grid (remaining articles)
  document.getElementById('magazine-list').innerHTML = MAGAZINE_ARTICLES.slice(1).map(a => `
    <div class="mag-card" onclick="openArticle(${a.id})">
      <div class="mag-card-img" style="background:${a.gradient}">${a.emoji}</div>
      <div class="mag-card-body">
        <div class="mag-card-cat">${a.category}</div>
        <div class="mag-card-title">${a.title}</div>
        <div class="mag-card-author">${a.author}</div>
      </div>
    </div>`).join('');
}

function openArticle(id) {
  const a = MAGAZINE_ARTICLES.find(x => x.id === id);
  if (!a) return;
  document.getElementById('magazine-article-content').innerHTML = `
    <div class="article-wrap">
      <div class="article-hero" style="background:${a.gradient}">${a.emoji}</div>
      <div class="article-category">${a.category}</div>
      <div class="article-title">${a.title}</div>
      <div class="article-author">${a.author}</div>
      <div class="article-body">${a.body.replace(/\n/g,'<br>')}</div>
    </div>`;
  document.getElementById('magazine-main').style.display = 'none';
  document.getElementById('magazine-detail').style.display = 'flex';
  document.getElementById('magazine-detail').style.flexDirection = 'column';
}

function showMagazineMain() {
  document.getElementById('magazine-main').style.display = '';
  document.getElementById('magazine-detail').style.display = 'none';
}

/* ── PROFILE ── */
function renderProfile() {
  if (!S.user) return;
  document.getElementById('profile-username').textContent = S.user.name || 'HAPY User';
  document.getElementById('profile-avatar').textContent = S.user.avatar || '😊';
  document.getElementById('sub-badge').textContent = capitalize(S.user.subscription || 'Basic');

  // Stats
  document.getElementById('stat-streak').textContent = S.user.streak || 1;
  document.getElementById('stat-score').textContent = S.user.phq9Score != null ? S.user.phq9Score : '—';
  document.getElementById('stat-plan').textContent = capitalize(S.user.subscription || 'Free');

  if (S.user.level && S.user.type) {
    const scaleEmoji = S.user.level.scale === 'dawn' ? '🌅' : S.user.level.scale === 'sunset' ? '🌇' : '🌑';
    document.getElementById('profile-stickers').innerHTML = `
      <span class="sticker-chip">${scaleEmoji} ${S.user.level.scale}</span>
      <span class="sticker-chip">${S.user.type.emoji} ${S.user.type.name}</span>`;
  }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function editName() {
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">Edit Name</div>
    <input id="name-input" type="text" value="${S.user.name || ''}" placeholder="Your name or nickname" maxlength="20"
      style="width:100%;padding:14px 16px;border:2px solid #E5E7EB;border-radius:14px;font-size:1rem;outline:none;margin-bottom:16px;"
      onfocus="this.style.borderColor='#7C3AED'; this.style.boxShadow='0 0 0 3px #EDE9FE';"
      onblur="this.style.borderColor='#E5E7EB'; this.style.boxShadow='none';"/>
    <button class="btn-primary" onclick="saveName()">Save Changes</button>`);
  setTimeout(() => document.getElementById('name-input')?.focus(), 300);
}

function saveName() {
  const val = document.getElementById('name-input').value.trim();
  if (!val) return;
  S.user.name = val;
  save();
  renderProfile();
  renderHome();
  closeModal();
  showToast('Name updated! 💜');
}

function changeAvatar() {
  const avatars = ['😊','😄','🙂','😌','🤗','😎','🌟','💜','🦋','🌸','🌈','✨','🐱','🦊','🐼','🌙'];
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">Choose Avatar</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
      ${avatars.map(a => `
        <button onclick="setAvatar('${a}')"
          style="font-size:2rem;background:${S.user.avatar===a?'#EDE9FE':'#F8F7FC'};border:2px solid ${S.user.avatar===a?'#7C3AED':'transparent'};border-radius:16px;padding:12px;cursor:pointer;transition:all .2s;aspect-ratio:1;"
          onmouseover="this.style.background='#EDE9FE'"
          onmouseout="this.style.background='${S.user.avatar===a?'#EDE9FE':'#F8F7FC}'">${a}</button>`).join('')}
    </div>`);
}

function setAvatar(a) {
  S.user.avatar = a;
  save();
  renderProfile();
  closeModal();
}

function openDepScale() {
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">About Depression Scale in HAPY</div>
    <div class="dep-scale-section">
      <h4>Types of Depression</h4>
      <div class="dep-types-grid">
        ${DEP_TYPES.map(t => `<span class="dep-type-chip">${t.emoji} ${t.name}</span>`).join('')}
      </div>
    </div>
    <div class="dep-scale-section" style="margin-top:20px">
      <h4>Scale of Depression</h4>
      <div class="dep-levels">
        <div class="dep-level-item"><div class="dep-level-dot" style="background:#C4B5FD"></div>Dawn (0–9)</div>
        <div class="dep-level-item"><div class="dep-level-dot" style="background:#7C3AED"></div>Sunset (10–19)</div>
        <div class="dep-level-item"><div class="dep-level-dot" style="background:#3B0764"></div>Night (20–27)</div>
      </div>
    </div>
    <p style="font-size:.82rem;color:#6B7280;line-height:1.7;margin-top:16px;padding:14px;background:#F8F7FC;border-radius:12px;">Your type and scale are shown as stickers on your profile. You can retake the PHQ-9 test at any time from your Profile page.</p>`);
}

function openSubscription() {
  const plans = [
    { id:'basic',    name:'HAPY Basic',    price:'Free',            feats:['Community access','PHQ-9 test','Magazine reading','App news & updates'] },
    { id:'standard', name:'HAPY Standard', price:'₩8,900 / month',  feats:['Everything in Basic','HAPY AI chatbot (24/7)','Voice call support','Priority community'] },
    { id:'premium',  name:'HAPY Premium',  price:'₩12,900 / month', feats:['Everything in Standard','Extended voice call hours','Advanced AI personalization','Early feature access'] }
  ];
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">Subscription Plan</div>
    <div class="sub-plans">
      ${plans.map(p => `
        <div class="sub-plan-card ${S.user.subscription === p.id ? 'active' : ''}" onclick="selectPlan('${p.id}')">
          <div class="sub-plan-name">${p.name}</div>
          <div class="sub-plan-price">${p.price}</div>
          <ul class="sub-plan-feats">${p.feats.map(f=>`<li>${f}</li>`).join('')}</ul>
        </div>`).join('')}
    </div>`);
}

function selectPlan(id) {
  S.user.subscription = id;
  save();
  renderProfile();
  closeModal();
  showToast(`Switched to ${capitalize(id)} plan! ⭐`);
}

function openChallenges() {
  const challenges = [
    { icon:'🚶', title:'30-Day Walking Challenge',  days:13, total:30, joined:true  },
    { icon:'📖', title:'Daily Reading 20 Minutes',  days:5,  total:21, joined:false },
    { icon:'🙏', title:'Gratitude Journal',          days:7,  total:14, joined:true  },
    { icon:'🧘', title:'5-Minute Meditation',        days:3,  total:30, joined:false },
  ];
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">My Challenges</div>
    <div class="challenges-list">
      ${challenges.map((c,i) => `
        <div class="challenge-item">
          <div class="challenge-icon-wrap">${c.icon}</div>
          <div class="challenge-info">
            <div class="challenge-title">${c.title}</div>
            <div class="challenge-prog-wrap"><div class="challenge-prog-fill" style="width:${Math.round(c.days/c.total*100)}%"></div></div>
            <div class="challenge-days">Day ${c.days} / ${c.total}</div>
          </div>
          <button class="challenge-join-btn ${c.joined?'joined':''}" onclick="joinChallenge(this,'${c.title}')">${c.joined?'Joined':'Join'}</button>
        </div>`).join('')}
    </div>`);
}

function joinChallenge(btn, title) {
  btn.classList.toggle('joined');
  btn.textContent = btn.classList.contains('joined') ? 'Joined' : 'Join';
  showToast(btn.classList.contains('joined') ? `Joined "${title}" 🎯` : `Left "${title}"`);
}

function openMoodHistory() {
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const log = S.moodLog.find(m => m.date === dateStr);
    last7.push({ date: d.toLocaleDateString('en-US',{weekday:'short'}), mood: log?.mood || null });
  }
  const moodEmoji = { awful:'😔', bad:'😟', okay:'😐', good:'😊', great:'😄' };
  const moodColor = { awful:'#EF4444', bad:'#F97316', okay:'#EAB308', good:'#22C55E', great:'#8B5CF6' };

  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">Mood History (Last 7 Days)</div>
    <div style="display:flex;justify-content:space-between;gap:6px;margin-bottom:20px;">
      ${last7.map(d => `
        <div style="flex:1;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="font-size:1.5rem">${d.mood ? moodEmoji[d.mood] : '○'}</div>
          <div style="font-size:.65rem;color:#9CA3AF;font-weight:600">${d.date}</div>
        </div>`).join('')}
    </div>
    <p style="font-size:.82rem;color:#6B7280;line-height:1.6;text-align:center;">Log your mood daily on the Home page to see your patterns here 💜</p>`);
}

function openCrisis() {
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title" style="color:#EF4444">🆘 Crisis Support</div>
    <p style="font-size:.9rem;color:#374151;line-height:1.7;margin-bottom:20px;">If you're in immediate danger or having thoughts of self-harm, please reach out to a crisis line right away. You are not alone.</p>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="padding:16px;background:#FEF2F2;border-radius:16px;border:1px solid #FECACA;">
        <div style="font-size:.8rem;font-weight:700;color:#B91C1C;margin-bottom:4px;">🇰🇷 Korea Crisis Line</div>
        <div style="font-size:1.1rem;font-weight:800;color:#EF4444">1393</div>
        <div style="font-size:.78rem;color:#9CA3AF;margin-top:2px">Available 24/7</div>
      </div>
      <div style="padding:16px;background:#EFF6FF;border-radius:16px;border:1px solid #BFDBFE;">
        <div style="font-size:.8rem;font-weight:700;color:#1D4ED8;margin-bottom:4px;">🌐 International</div>
        <div style="font-size:1rem;font-weight:700;color:#2563EB">findahelpline.com</div>
        <div style="font-size:.78rem;color:#9CA3AF;margin-top:2px">Find help in any country</div>
      </div>
      <div style="padding:16px;background:#F0FDF4;border-radius:16px;border:1px solid #BBF7D0;">
        <div style="font-size:.8rem;font-weight:700;color:#15803D;margin-bottom:4px;">💜 Talk to HAPY AI</div>
        <div style="font-size:.9rem;color:#374151">I'm here for you right now. Go to the HAPY tab and let's talk.</div>
      </div>
    </div>`);
}

function openSettings() {
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">Settings</div>
    <div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #F3F4F6">
      ${['Notification Settings','Language','Dark Mode (Coming Soon)','Account Settings','Logout'].map(item => `
        <div style="padding:16px;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;justify-content:space-between;cursor:pointer;font-size:.92rem;font-weight:500;transition:background .2s;"
          onclick="handleSetting('${item}')"
          onmouseover="this.style.background='#F5F3FF'"
          onmouseout="this.style.background='#fff'">
          <span>${item}</span>
          <span style="color:#D1D5DB">›</span>
        </div>`).join('')}
    </div>`);
}

function handleSetting(item) {
  if (item === 'Logout') {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      location.reload();
    }
  } else {
    showToast(`${item} — Coming soon ✨`);
  }
}

function openQA() {
  const faqs = [
    { q:'What is HAPY?', a:'HAPY is a digital mental health companion designed to help you manage depression and find happiness through AI support, community connection, and expert content.' },
    { q:'Is my data private?', a:'Yes. Your personal information and chat history are stored locally on your device. We never share your data without explicit consent.' },
    { q:'How does the PHQ-9 test work?', a:'The PHQ-9 is a validated clinical questionnaire with 9 questions about depression symptoms over the past 2 weeks. Your score helps HAPY personalize support for you.' },
    { q:'Can I retake the PHQ-9?', a:'Yes! You can retake the PHQ-9 test at any time from your Profile page. Your depression profile will be updated accordingly.' },
    { q:'Is HAPY a substitute for professional therapy?', a:'No. HAPY is a supportive tool, not a replacement for professional mental health treatment. If you\'re experiencing severe symptoms, please consult a qualified mental health professional.' }
  ];
  openModal(`<div class="modal-handle"></div>
    <div class="modal-title">Help & FAQ</div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${faqs.map(f => `
        <div style="background:#F8F7FC;border-radius:14px;padding:16px;">
          <div style="font-size:.9rem;font-weight:700;color:#111827;margin-bottom:7px;">Q: ${f.q}</div>
          <div style="font-size:.85rem;color:#6B7280;line-height:1.7;">A: ${f.a}</div>
        </div>`).join('')}
    </div>`);
}

function retakeTest() {
  if (confirm('Retake the PHQ-9 test? Your previous score will be replaced.')) {
    S.phq9Answers = []; S.phq9Q = 0;
    showScreen('screen-phq9');
    renderPHQ9Question();
  }
}

/* ── MODAL ── */
function openModal(html) {
  document.getElementById('modal-body').innerHTML = html;
  const overlay = document.getElementById('modal-overlay');
  overlay.style.display = 'flex';
  overlay.classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('modal-overlay').classList.remove('open');
  }
}
