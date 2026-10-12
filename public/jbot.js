(function () {
  function initJBot() {
    if (document.getElementById('jbot-widget')) return;
    const widget = document.createElement('div');
    widget.id = 'jbot-widget';
    widget.className = 'jbot-widget';
    widget.innerHTML =
      '<button class="jbot-toggle" id="jbot-toggle" aria-label="Open J Bot">JB</button>' +
      '<div class="jbot-chat" id="jbot-chat">' +
        '<div class="jbot-header">' +
          '<div class="jbot-title">J Bot</div>' +
          '<button class="jbot-theme-toggle" id="jbot-theme">&#127775;</button>' +
        '</div>' +
        '<div class="jbot-welcome">Hey! I\'m J Bot, Jeyaseelan\'s AI assistant. Ask me about his skills, projects, achievements, or anything else!</div>' +
        '<div class="jbot-suggestions">' +
          '<button class="jbot-suggest">Tell me about Jeyaseelan</button>' +
          '<button class="jbot-suggest">What are his technical skills?</button>' +
          '<button class="jbot-suggest">Explain his best projects</button>' +
          '<button class="jbot-suggest">How can I contact him?</button>' +
        '</div>' +
        '<div class="jbot-messages" id="jbot-messages"></div>' +
        '<div class="jbot-input-row">' +
          '<input type="text" class="jbot-input" id="jbot-input" placeholder="Type your question..." />' +
          '<button class="jbot-send" id="jbot-send">Send</button>' +
        '</div>' +
        '<div class="jbot-footer">Powered by AI</div>' +
      '</div>';
    document.body.appendChild(widget);

    const toggle = document.getElementById('jbot-toggle');
    const chat = document.getElementById('jbot-chat');
    const themeBtn = document.getElementById('jbot-theme');
    const input = document.getElementById('jbot-input');
    const send = document.getElementById('jbot-send');
    const messages = document.getElementById('jbot-messages');
    const suggests = document.querySelectorAll('.jbot-suggest');

    let theme = localStorage.getItem('jbot_theme') || 'light';
    applyTheme(theme);

    toggle.addEventListener('click', function () {
      chat.classList.toggle('active');
    });

    themeBtn.addEventListener('click', function () {
      theme = theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('jbot_theme', theme);
      applyTheme(theme);
    });

    function applyTheme(t) {
      themeBtn.textContent = t === 'light' ? '\u{1F319}' : '\u{2600}';
    }

    suggests.forEach(function (btn) {
      btn.addEventListener('click', function () {
        input.value = btn.textContent;
        sendMessage();
      });
    });

    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      addMsg(text, 'user');
      input.value = '';
      setTyping(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        setTyping(false);
        addMsg(data.answer || 'Something went wrong.', 'bot');
      } catch (e) {
        setTyping(false);
        addMsg('Unable to reach assistant right now.', 'bot');
      }
    }

    function addMsg(text, type) {
      const div = document.createElement('div');
      div.className = 'jbot-msg ' + (type === 'user' ? 'jbot-user' : 'jbot-bot');
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function setTyping(show) {
      let t = document.getElementById('jbot-typing');
      if (show && !t) {
        t = document.createElement('div');
        t.id = 'jbot-typing';
        t.className = 'jbot-typing';
        t.textContent = 'J Bot is typing...';
        messages.appendChild(t);
        messages.scrollTop = messages.scrollHeight;
      } else if (!show && t) {
        t.remove();
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJBot);
  } else {
    initJBot();
  }
})();