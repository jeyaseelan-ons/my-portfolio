(function () {
  'use strict';

  var AVATAR_SRC = 'assets/jb.png';

  var SUGGESTIONS = [
    'What are his technical skills?',
    'Tell me about his projects',
    'What are his achievements?',
    'How can I contact him?'
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  //  KNOWLEDGE BASE — Built from the portfolio content (no API key required)
  // ═══════════════════════════════════════════════════════════════════════════
  var KNOWLEDGE = {
    name: 'S Jeyaseelan',
    title: 'Computer Science Engineering Student & Creative Developer',
    location: 'Tirunelveli, Tamil Nadu, India',
    email: 'jeyaseelan26206@gmail.com',
    phone: '+91 9042201784',
    cgpa: '8.16',
    college: 'Anna University Affiliated Engineering College, Tirunelveli (2023–2027)',
    degree: 'B.E. Computer Science & Engineering',
    hsc: '86% — Higher Secondary Certificate (Computer Science Stream)',
    sslc: 'Secondary School Certificate (SSLC)',
    manifesto: "I don't just build websites. I build digital experiences people remember.",
    disciplines: [
      'Computer Science Engineering — Algorithms, Data Structures, DBMS, OS & System Architecture',
      'Creative Web Developer — High-performance Vanilla JS, React.js, WebGL Canvas, 60fps animations & SVG filters',
      'AI & Machine Learning Enthusiast — NLP document intelligence, generative pipelines, Python AI modeling & LLM integration',
      '3D Designer & Motion Artist — Blender 3D concepts, perspective transformations, spatial web layouts & camera choreography'
    ],
    skills: [
      'Python (AI / Data / Backend)',
      'Java (OOP / Algorithms)',
      'C Language (Systems / Memory)',
      'JavaScript ES6+ (Async / Vanilla / Canvas)',
      'HTML5 (Semantic / Standards)',
      'CSS3 (3D Transforms / Grid)',
      'React.js (Components / State)',
      'PHP (Backend / Server APIs)',
      'Node.js (Runtime / Services)',
      'MongoDB (NoSQL Database)',
      'AI / ML (NLP / Models / CRUX)',
      'Blender / 3D (Spatial Web / Assets)'
    ],
    projects: [
      {
        name: 'Retail Pro',
        tag: 'FEATURED LEAD',
        desc: 'A full-stack retail management platform designed to simplify product, inventory, sales, and customer management.',
        tech: 'Full Stack / Database / Web',
        year: '2025–2026'
      },
      {
        name: 'CRUX',
        tag: 'AI INNOVATION',
        desc: 'AI-powered document summarization and knowledge extraction platform designed to transform complex documents into concise, useful insights.',
        tech: 'AI / NLP / Python / Web',
        year: '2025'
      },
      {
        name: 'EcoBridge',
        tag: 'SUSTAINABILITY',
        desc: 'An SDG-focused platform connecting sustainable ideas, environmental data, green initiatives, and community-driven action.',
        tech: 'React / Node.js / IoT / Sustainability',
        year: '2026'
      },
      {
        name: 'Theatre',
        tag: 'SOFTWARE ENGINEERING',
        desc: 'A software system for managing theatre seats, reservations, customer details, and booking operations.',
        tech: 'Java / OOP / Database / Software Engineering',
        year: '2025'
      },
      {
        name: 'Virtual Resume',
        tag: 'PORTFOLIO',
        desc: 'A modern interactive portfolio that presents education, technical skills, projects, achievements, experience, and professional profile.',
        tech: 'HTML / CSS / JavaScript / Portfolio',
        year: '2026'
      }
    ],
    stats: {
      cgpa: '8.16',
      projects: '5+',
      yearsdev: '3+'
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  SMART RESPONSE ENGINE — keyword-matching with natural language output
  // ═══════════════════════════════════════════════════════════════════════════
  function generateResponse(question) {
    var q = question.toLowerCase().trim();

    // ── Skills / Technologies ──
    if (match(q, ['skill', 'tech', 'stack', 'language', 'tool', 'framework', 'programming', 'code'])) {
      return 'Jeyaseelan\'s technical arsenal includes:\n\n' +
        KNOWLEDGE.skills.map(function (s) { return '• ' + s; }).join('\n') +
        '\n\nHe specialises in high-performance Vanilla JS, React.js, WebGL Canvas, and 60 fps animations.';
    }

    // ── Projects / Achievements ──
    if (match(q, ['project', 'built', 'work', 'achieve', 'portfolio', 'thing', 'made', 'create'])) {
      var list = KNOWLEDGE.projects.map(function (p) {
        return '• ' + p.name + ' (' + p.tag + ') — ' + p.desc + ' [' + p.tech + ', ' + p.year + ']';
      }).join('\n\n');
      return 'Here are Jeyaseelan\'s key projects:\n\n' + list;
    }

    // ── Contact ──
    if (match(q, ['contact', 'email', 'phone', 'reach', 'connect', 'hire', 'mail', 'call', 'message'])) {
      return 'You can reach Jeyaseelan through:\n\n' +
        '• Email: ' + KNOWLEDGE.email + '\n' +
        '• Phone: ' + KNOWLEDGE.phone + '\n' +
        '• Location: ' + KNOWLEDGE.location + '\n\n' +
        'Feel free to scroll down to the Connect section on the site to send a direct message!';
    }

    // ── Education ──
    if (match(q, ['education', 'college', 'university', 'degree', 'study', 'school', 'cgpa', 'gpa', 'score', 'academic'])) {
      return 'Jeyaseelan\'s academic journey:\n\n' +
        '• ' + KNOWLEDGE.degree + '\n  ' + KNOWLEDGE.college + '\n  Current CGPA: ' + KNOWLEDGE.cgpa + '\n\n' +
        '• HSC (12th): ' + KNOWLEDGE.hsc + '\n\n' +
        '• SSLC (10th): ' + KNOWLEDGE.sslc + ', Tirunelveli\n\n' +
        'Core coursework includes Data Structures & Algorithms, OS, DBMS, AI/ML, Full Stack Web Engineering, and Computer Networks.';
    }

    // ── About / Who ──
    if (match(q, ['about', 'who', 'tell me', 'introduce', 'yourself', 'jeyaseelan', 'bio', 'summary', 'background'])) {
      return KNOWLEDGE.name + ' is a ' + KNOWLEDGE.title + ' from ' + KNOWLEDGE.location + '.\n\n' +
        '"' + KNOWLEDGE.manifesto + '"\n\n' +
        'His disciplines:\n' +
        KNOWLEDGE.disciplines.map(function (d) { return '• ' + d; }).join('\n') + '\n\n' +
        'Stats: CGPA ' + KNOWLEDGE.stats.cgpa + ' | ' + KNOWLEDGE.stats.projects + ' High-Impact Projects | ' + KNOWLEDGE.stats.yearsdev + ' Years in Development & 3D.';
    }

    // ── Specific projects ──
    if (match(q, ['crux'])) {
      return 'CRUX is Jeyaseelan\'s AI Innovation project — an AI-powered document summarization and knowledge extraction platform that transforms complex documents into concise, useful insights. Built with AI / NLP / Python / Web technologies (2025).';
    }
    if (match(q, ['ecobridge', 'eco bridge', 'sustainability'])) {
      return 'EcoBridge is an SDG-focused platform connecting sustainable ideas, environmental data, green initiatives, and community-driven action. Built with React / Node.js / IoT (2026).';
    }
    if (match(q, ['retail', 'retail pro'])) {
      return 'Retail Pro is Jeyaseelan\'s featured lead project — a full-stack retail management platform designed to simplify product, inventory, sales, and customer management. Built with Full Stack / Database / Web technologies (2025–2026).';
    }
    if (match(q, ['theatre'])) {
      return 'Theatre is a software system for managing theatre seats, reservations, customer details, and booking operations. Built with Java / OOP / Database / Software Engineering (2025).';
    }

    // ── AI / ML ──
    if (match(q, ['ai', 'machine learning', 'ml', 'nlp', 'artificial', 'model'])) {
      return 'Jeyaseelan is an AI & Machine Learning Enthusiast with expertise in:\n\n' +
        '• NLP document intelligence\n' +
        '• Generative pipelines\n' +
        '• Python AI modeling & LLM integration\n\n' +
        'His standout AI project is CRUX — an AI-powered document summarization and knowledge extraction platform.';
    }

    // ── Location ──
    if (match(q, ['where', 'location', 'city', 'country', 'based', 'live'])) {
      return 'Jeyaseelan is based in ' + KNOWLEDGE.location + '. He studies at an Anna University affiliated engineering college in Tirunelveli.';
    }

    // ── Experience / Years ──
    if (match(q, ['experience', 'year', 'how long', 'career'])) {
      return 'Jeyaseelan has ' + KNOWLEDGE.stats.yearsdev + ' years of experience in development and 3D design, with ' + KNOWLEDGE.stats.projects + ' high-impact projects built. He\'s currently pursuing his B.E. in Computer Science (2023–2027) with a CGPA of ' + KNOWLEDGE.stats.cgpa + '.';
    }

    // ── Greeting ──
    if (match(q, ['hi', 'hello', 'hey', 'sup', 'good morning', 'good evening', 'good afternoon'])) {
      return 'Hey there! 👋 I\'m J Bot, Jeyaseelan\'s AI assistant. I can tell you about his skills, projects, education, achievements, or how to contact him. What would you like to know?';
    }

    // ── Thanks ──
    if (match(q, ['thank', 'thanks', 'appreciate', 'helpful'])) {
      return 'You\'re welcome! 😊 If you have any more questions about Jeyaseelan, feel free to ask. You can also explore the portfolio sections above for more details!';
    }

    // ── Resume ──
    if (match(q, ['resume', 'cv', 'download'])) {
      return 'You can view Jeyaseelan\'s virtual resume in the Resume section of this portfolio. There\'s also a downloadable PDF version available — scroll to the Virtual Resume section and click "View Resume" to access it.';
    }

    // ── Fallback ──
    return 'Great question! I know a lot about Jeyaseelan — here\'s what I can help with:\n\n' +
      '• His technical skills & technologies\n' +
      '• Projects he\'s built (Retail Pro, CRUX, EcoBridge, Theatre, Virtual Resume)\n' +
      '• Education & academic background\n' +
      '• Contact information\n' +
      '• His background & specializations\n\n' +
      'Try asking something like "What are his skills?" or "Tell me about CRUX"!';
  }

  function match(text, keywords) {
    for (var i = 0; i < keywords.length; i++) {
      if (text.indexOf(keywords[i]) !== -1) return true;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  WIDGET INIT
  // ═══════════════════════════════════════════════════════════════════════════
  function initJBot() {
    if (document.getElementById('jbot-widget')) return;

    var widget = document.createElement('div');
    widget.id = 'jbot-widget';
    widget.className = 'jbot-widget';
    widget.innerHTML =
      '<button class="jbot-toggle" id="jbot-toggle" aria-label="Open J Bot" aria-haspopup="dialog" aria-expanded="false">' +
        '<img class="jbot-avatar" src="' + AVATAR_SRC + '" alt="" aria-hidden="true" loading="eager" onerror="this.style.display=\'none\';this.nextElementSibling&&this.nextElementSibling.style.display=\'inline-flex\';">' +
        '<span class="jbot-avatar-fallback" aria-hidden="true">JB</span>' +
      '</button>' +
      '<div class="jbot-label" id="jbot-label" role="tooltip" aria-hidden="true">' +
        '<div class="jbot-label-content">' +
          '<span class="jbot-label-title">J Bot Personal A</span>' +
          '<span class="jbot-label-desc">Premium AI Experience</span>' +
        '</div>' +
        '<div class="jbot-label-pointer" id="jbot-label-pointer"></div>' +
      '</div>' +
      '<div class="jbot-chat" id="jbot-chat" role="dialog" aria-modal="false" aria-label="J Bot chat">' +
        '<div class="jbot-header">' +
          '<div class="jbot-header-left">' +
            '<img class="jbot-avatar jbot-avatar--header" src="' + AVATAR_SRC + '" alt="" aria-hidden="true" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling&&this.nextElementSibling.style.display=\'inline-flex\';">' +
            '<span class="jbot-avatar-fallback jbot-avatar-fallback--header" aria-hidden="true">JB</span>' +
            '<div class="jbot-header-title">' +
              '<span class="jbot-name">J Bot</span>' +
              '<span class="jbot-subtitle">Jeyaseelan\'s AI Assistant</span>' +
            '</div>' +
          '</div>' +
          '<div class="jbot-header-actions">' +
            '<button class="jbot-control jbot-min" id="jbot-min" aria-label="Minimize chat">—</button>' +
            '<button class="jbot-control jbot-clear" id="jbot-clear" aria-label="Clear chat" title="Clear conversation">⟲</button>' +
            '<button class="jbot-control jbot-close" id="jbot-close" aria-label="Close chat">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="jbot-welcome">Hey! I\u2019m J Bot, Jeyaseelan\u2019s personal AI assistant. What would you like to know?</div>' +
        '<div class="jbot-suggestions" id="jbot-suggestions"></div>' +
        '<div class="jbot-messages" id="jbot-messages" role="log" aria-live="polite" aria-relevant="additions"></div>' +
        '<div class="jbot-input-row">' +
          '<input type="text" class="jbot-input" id="jbot-input" placeholder="Ask about Jeyaseelan\u2026" autocomplete="off" />' +
          '<button class="jbot-send" id="jbot-send" aria-label="Send message" disabled>Send</button>' +
        '</div>' +
        '<div class="jbot-footer">Powered by J Bot AI</div>' +
      '</div>';
    document.body.appendChild(widget);

    // ── Element refs ──
    var $ = function (id) { return document.getElementById(id); };
    var toggle     = $('jbot-toggle');
    var chat       = $('jbot-chat');
    var label      = $('jbot-label');
    var labelPointer = $('jbot-label-pointer');
    var closeBtn   = $('jbot-close');
    var minBtn     = $('jbot-min');
    var clearBtn   = $('jbot-clear');
    var input      = $('jbot-input');
    var send       = $('jbot-send');
    var messages   = $('jbot-messages');
    var suggestionsContainer = $('jbot-suggestions');
    var toggleAvatar = toggle.querySelector('.jbot-avatar');
    var headerAvatar = chat.querySelector('.jbot-avatar--header');

    // ── State ──
    var STATE = {
      open: false,
      sending: false,
      dragging: false,
      hasDragged: false,
      dragOffset: { x: 0, y: 0, startX: 0, startY: 0 },
      originalPosition: { bottom: 24, right: 24 },
      labelVisible: false,
      labelTimeout: null,
      labelAnimationFrame: null,
      isReturning: false
    };

    var labelTouchTimeout = null;
    var introLabelTimeout = null;
    var autoHideLabelTimeout = null;
    var DRAG_THRESHOLD = 5;

    // ── Helpers ──
    function isReducedMotion() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function supportsHover() {
      return window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }

    // ── Chat open / close / minimize ──
    function openChat() {
      chat.classList.remove('jbot-chat--minimized');
      chat.classList.add('jbot-chat--open');
      toggle.setAttribute('aria-expanded', 'true');
      STATE.open = true;
      hideLabel();
      if (!isReducedMotion()) {
        setTimeout(function () { input.focus(); }, 120);
      } else {
        input.focus();
      }
    }

    function closeChat() {
      chat.classList.remove('jbot-chat--open', 'jbot-chat--minimized');
      toggle.setAttribute('aria-expanded', 'false');
      STATE.open = false;
      setAvatarState('');
      showLabelAfterDelay();
    }

    function minimizeChat(suppressLabel) {
      chat.classList.add('jbot-chat--minimized');
      chat.classList.remove('jbot-chat--open');
      toggle.setAttribute('aria-expanded', 'false');
      STATE.open = false;
      if (!suppressLabel) showLabelAfterDelay();
    }

    // ── Label / tooltip ──
    function showLabel(autoHideAfter) {
      if (!autoHideAfter && autoHideLabelTimeout) {
        clearTimeout(autoHideLabelTimeout);
        autoHideLabelTimeout = null;
      }
      if (STATE.open) return;
      if (STATE.labelVisible) hideLabel();
      label.classList.toggle('jbot-label--typing', !!autoHideAfter);
      STATE.labelVisible = true;
      label.style.opacity = '1';
      label.style.visibility = 'visible';
      label.style.transform = 'translateX(-50%) translateY(0) scale(1)';
      startLabelPositionUpdate();
      if (autoHideAfter) {
        autoHideLabelTimeout = setTimeout(function () {
          autoHideLabelTimeout = null;
          hideLabel();
        }, autoHideAfter);
      }
    }

    function hideLabel() {
      STATE.labelVisible = false;
      label.classList.remove('jbot-label--typing');
      label.style.opacity = '0';
      label.style.visibility = 'hidden';
      label.style.transform = 'translateX(-50%) translateY(8px) scale(0.95)';
      stopLabelPositionUpdate();
      if (autoHideLabelTimeout) {
        clearTimeout(autoHideLabelTimeout);
        autoHideLabelTimeout = null;
      }
      if (STATE.labelTimeout) {
        clearTimeout(STATE.labelTimeout);
        STATE.labelTimeout = null;
      }
    }

    function cancelIntroLabel() {
      if (introLabelTimeout) {
        clearTimeout(introLabelTimeout);
        introLabelTimeout = null;
      }
    }

    function showLabelAfterDelay() {
      if (STATE.labelTimeout) clearTimeout(STATE.labelTimeout);
      STATE.labelTimeout = setTimeout(function () {
        if (!STATE.open) showLabel();
      }, 1500);
    }

    function startLabelPositionUpdate() {
      stopLabelPositionUpdate();
      function updateLoop() {
        updateLabelPosition();
        STATE.labelAnimationFrame = requestAnimationFrame(updateLoop);
      }
      updateLoop();
    }

    function stopLabelPositionUpdate() {
      if (STATE.labelAnimationFrame) {
        cancelAnimationFrame(STATE.labelAnimationFrame);
        STATE.labelAnimationFrame = null;
      }
    }

    function updateLabelPosition() {
      if (!STATE.labelVisible || STATE.open || STATE.isReturning) return;
      var toggleRect = toggle.getBoundingClientRect();
      var vw = window.innerWidth;
      var labelRect = label.getBoundingClientRect();
      var toggleCenterX = toggleRect.left + toggleRect.width / 2;
      var labelX = Math.max(8 + labelRect.width / 2, Math.min(vw - 8 - labelRect.width / 2, toggleCenterX));
      var labelY = Math.max(8, toggleRect.top - labelRect.height - 20);

      label.style.left = labelX + 'px';
      label.style.top  = labelY + 'px';
      label.style.transform = 'translateX(-50%) translateY(0) scale(1)';

      labelPointer.style.left = (toggleCenterX - labelX) + 'px';
      labelPointer.style.top = labelRect.height + 'px';
      labelPointer.style.transform = 'rotate(0deg)';
    }

    // ── Chat utilities ──
    function clearChatMessages() {
      messages.innerHTML = '';
      input.value = '';
      refreshSuggestions();
    }

    function renderSuggestions() {
      suggestionsContainer.innerHTML = '';
      SUGGESTIONS.forEach(function (text) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'jbot-suggest';
        btn.textContent = text;
        btn.addEventListener('click', function () {
          input.value = text;
          sendMessage();
        });
        suggestionsContainer.appendChild(btn);
      });
    }

    function refreshSuggestions() {
      if (suggestionsContainer.children.length) {
        Array.from(suggestionsContainer.children).forEach(function (b) {
          b.style.display = 'inline-flex';
        });
      }
    }

    function avatarState(cls) {
      if (toggleAvatar)  toggleAvatar.className  = 'jbot-avatar' + (cls ? ' ' + cls : '');
      if (headerAvatar)  headerAvatar.className  = 'jbot-avatar jbot-avatar--header' + (cls ? ' ' + cls : '');
    }

    function setAvatarState(state) {
      if (state === 'thinking') { avatarState('jbot-avatar--thinking'); }
      else if (state === 'responding') {
        avatarState('jbot-avatar--responding');
        setTimeout(function () { if (!STATE.sending) avatarState(''); }, 1200);
      } else { avatarState(''); }
    }

    function addMsg(text, type) {
      var div = document.createElement('div');
      div.className = 'jbot-msg ' + (type === 'user' ? 'jbot-user' : 'jbot-bot');
      // Support newlines in bot messages
      if (type === 'bot') {
        div.innerHTML = text.replace(/\n/g, '<br>');
      } else {
        div.textContent = text;
      }
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function setTyping(show) {
      if (show) {
        if (!document.getElementById('jbot-typing')) {
          var t = document.createElement('div');
          t.id = 'jbot-typing';
          t.className = 'jbot-typing';
          t.setAttribute('aria-hidden', 'true');
          t.innerHTML =
            '<span class="jbot-typing-dot"></span>' +
            '<span class="jbot-typing-dot"></span>' +
            '<span class="jbot-typing-dot"></span>';
          messages.appendChild(t);
          messages.scrollTop = messages.scrollHeight;
        }
      } else {
        var el = document.getElementById('jbot-typing');
        if (el) el.remove();
      }
    }

    // ── SEND MESSAGE (offline — uses built-in knowledge base) ──
    function sendMessage() {
      var text = input.value.trim();
      if (!text || STATE.sending) return;

      addMsg(text, 'user');
      input.value = '';
      send.disabled = true;
      STATE.sending = true;
      setTyping(true);
      setAvatarState('thinking');

      // Simulate brief thinking delay for natural feel
      var delay = 400 + Math.random() * 800;
      setTimeout(function () {
        setTyping(false);
        var answer = generateResponse(text);
        addMsg(answer, 'bot');
        setAvatarState('responding');
        STATE.sending = false;
        send.disabled = false;
      }, delay);
    }

    // ── Drag functionality (with threshold so clicks work) ──
    var pointerPressed = false;

    function startDrag(clientX, clientY) {
      STATE.dragOffset.x = clientX - widget.getBoundingClientRect().left;
      STATE.dragOffset.y = clientY - widget.getBoundingClientRect().top;
      STATE.dragOffset.startX = clientX;
      STATE.dragOffset.startY = clientY;
      STATE.hasDragged = false;
    }

    function doDrag(clientX, clientY) {
      if (!STATE.dragging) {
        if (Math.abs(clientX - STATE.dragOffset.startX) < DRAG_THRESHOLD &&
            Math.abs(clientY - STATE.dragOffset.startY) < DRAG_THRESHOLD) return;
        STATE.dragging = true;
        STATE.hasDragged = true;
        widget.classList.add('jbot-dragging', 'jbot-dragging-active');
        document.body.style.userSelect = 'none';
        hideLabel();
      }
      var x = clientX - STATE.dragOffset.x;
      var y = clientY - STATE.dragOffset.y;
      var vw = window.innerWidth, vh = window.innerHeight;
      var ww = widget.offsetWidth, wh = widget.offsetHeight;
      x = Math.max(0, Math.min(x, vw - ww));
      y = Math.max(0, Math.min(y, vh - wh));
      widget.style.bottom = (vh - y - wh) + 'px';
      widget.style.right  = (vw - x - ww) + 'px';
      widget.style.transform  = 'none';
      widget.style.transition = 'none';
      updateLabelPosition();
    }

    function endDrag() {
      STATE.dragging = false;
      widget.classList.remove('jbot-dragging', 'jbot-dragging-active');
      document.body.style.userSelect = '';
      widget.style.transition = '';
      widget.style.animation  = '';
      
      // Return to original position with smooth animation
      if (STATE.hasDragged) {
        STATE.isReturning = true;
        widget.style.transition = 'bottom 0.6s cubic-bezier(0.16, 1, 0.3, 1), right 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        widget.style.bottom = STATE.originalPosition.bottom + 'px';
        widget.style.right = STATE.originalPosition.right + 'px';
        
        setTimeout(function() {
          STATE.isReturning = false;
          widget.style.transition = '';
          showLabelAfterDelay();
        }, 600);
      } else {
        showLabelAfterDelay();
      }
    }

    // Mouse events
    toggle.addEventListener('mousedown', function (e) {
      if (e.button === 0) { e.preventDefault(); pointerPressed = true; startDrag(e.clientX, e.clientY); if (window.jbotCancelAutoMinimize) window.jbotCancelAutoMinimize(); }
    });
    document.addEventListener('mousemove', function (e) {
      if (pointerPressed) doDrag(e.clientX, e.clientY);
    });
    document.addEventListener('mouseup', function () {
      if (pointerPressed) { pointerPressed = false; if (STATE.dragging) endDrag(); }
    });

    // Touch events
    toggle.addEventListener('touchstart', function (e) {
      cancelIntroLabel();
      if (e.touches.length === 1) { 
        pointerPressed = true; 
        startDrag(e.touches[0].clientX, e.touches[0].clientY); 
        if (window.jbotCancelAutoMinimize) window.jbotCancelAutoMinimize(); 
      }
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (pointerPressed && e.touches.length === 1) doDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    document.addEventListener('touchend', function () {
      if (pointerPressed) { pointerPressed = false; if (STATE.dragging) endDrag(); }
    });
    document.addEventListener('touchcancel', function () {
      if (pointerPressed) { pointerPressed = false; if (STATE.dragging) endDrag(); }
    });

    // ── Click handler ──
    toggle.addEventListener('click', function (e) {
      cancelIntroLabel();
      if (STATE.hasDragged) { STATE.hasDragged = false; e.preventDefault(); e.stopPropagation(); return; }
      if (window.jbotCancelAutoMinimize) window.jbotCancelAutoMinimize();
      if (STATE.open) { closeChat(); } else { openChat(); }
    });

    // ── Hover tooltip (desktop) ──
    toggle.addEventListener('mouseenter', function () {
      if (!supportsHover()) return;
      cancelIntroLabel();
      if (!STATE.dragging && !STATE.open) {
        showLabel();
        if (window.jbotCancelAutoMinimize) window.jbotCancelAutoMinimize();
      }
    });
    toggle.addEventListener('mouseleave', function () {
      if (!supportsHover()) return;
      if (!STATE.dragging && !STATE.open) {
        hideLabel();
      }
    });

    // ── Touch tooltip ──
    toggle.addEventListener('touchstart', function () {
      labelTouchTimeout = setTimeout(function () {
        if (!STATE.dragging && !STATE.open) showLabel();
      }, 500);
    }, { passive: true });
    toggle.addEventListener('touchend', function () {
      if (labelTouchTimeout) { clearTimeout(labelTouchTimeout); labelTouchTimeout = null; }
      if (!STATE.dragging && !STATE.open) setTimeout(hideLabel, 2000);
    });

    // ── Header buttons ──
    closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeChat(); });
    minBtn.addEventListener('click', function (e) { e.stopPropagation(); minimizeChat(); });
    clearBtn.addEventListener('click', function (e) { e.stopPropagation(); clearChatMessages(); });
    chat.querySelector('.jbot-header').addEventListener('click', function () { if (!STATE.open) openChat(); });

    // ── Input handling ──
    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!STATE.sending) sendMessage(); }
    });
    input.addEventListener('input', function () {
      send.disabled = !input.value.trim();
    });

    // ── Show after page load ──
    function showAfterLoad() {
      var intro = document.getElementById('intro');
      var shown = false;
      var autoMinimizeTimer = null;
      var showWidget = function () {
        if (shown) return;
        shown = true;
        widget.classList.add('jbot-ready');
        
        // Briefly introduce the assistant after the page finishes loading.
        introLabelTimeout = setTimeout(function () {
          introLabelTimeout = null;
          showLabel(4000);
        }, 1500);
        
        // Auto-minimize after 10 seconds if user hasn't interacted
        autoMinimizeTimer = setTimeout(function () {
          if (!STATE.open && !STATE.dragging && !STATE.hasDragged) {
            minimizeChat(true);
          }
        }, 10000);
      };
      if (intro) {
        var checkLoad = setInterval(function () {
          var percent = document.getElementById('loaderPercent');
          var pv = percent ? parseInt(percent.textContent || '0', 10) : 100;
          var isDismissed = intro.classList.contains('dismissed') || intro.style.display === 'none' || !document.body.contains(intro);
          if (pv >= 100 || isDismissed) {
            clearInterval(checkLoad);
            showWidget();
          }
        }, 50);
        setTimeout(showWidget, 3000);
      } else {
        setTimeout(showWidget, 500);
      }
      
      // Expose function to cancel auto-minimize on user interaction
      window.jbotCancelAutoMinimize = function () {
        if (autoMinimizeTimer) {
          clearTimeout(autoMinimizeTimer);
          autoMinimizeTimer = null;
        }
      };
    }

    window.addEventListener('scroll',  updateLabelPosition, { passive: true });
    window.addEventListener('resize',  updateLabelPosition, { passive: true });

    renderSuggestions();
    label.style.opacity    = '0';
    label.style.visibility = 'hidden';
    label.style.transform  = 'translateX(-50%) translateY(8px) scale(0.95)';
    showAfterLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJBot);
  } else {
    initJBot();
  }
})();