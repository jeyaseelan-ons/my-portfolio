(function () {
  'use strict';

  var AVATAR_SRC = 'assets/image2.png';
  var CHAT_ENDPOINT = '/api/chat';
  var SEND_TIMEOUT_MS = 18000;

  function initJBot() {
    if (document.getElementById('jbot-widget')) return;

    var widget = document.createElement('div');
    widget.id = 'jbot-widget';
    widget.className = 'jbot-widget jbot-fade-in';
    widget.setAttribute('aria-hidden', 'true');
    widget.innerHTML =
          '<button class="jbot-toggle" id="jbot-toggle" aria-label="Open J Bot" aria-haspopup="dialog" aria-expanded="false">' +
        '<img class="jbot-avatar" src="' + AVATAR_SRC + '" alt="" aria-hidden="true" loading="eager" onerror="this.style.display=\'none\';if(this.nextElementSibling){this.nextElementSibling.style.display=\'inline-flex\';}">' +
        '<span class="jbot-avatar-fallback" aria-hidden="true">JB</span>' +
      '</button>' +
      '<div class="jbot-chat" id="jbot-chat" role="dialog" aria-modal="false" aria-label="J Bot chat">' +
        '<div class="jbot-header">' +
          '<div class="jbot-header-left">' +
            '<img class="jbot-avatar jbot-avatar--header" src="' + AVATAR_SRC + '" alt="" aria-hidden="true" loading="lazy" onerror="this.style.display=\'none\';if(this.nextElementSibling){this.nextElementSibling.style.display=\'inline-flex\';}">' +
            '<span class="jbot-avatar-fallback jbot-avatar-fallback--header" aria-hidden="true">JB</span>' +
            '<span class="jbot-title">J Bot</span>' +
          '</div>' +
          '<div class="jbot-header-actions">' +
            '<button class="jbot-control jbot-clear" id="jbot-clear" aria-label="Clear conversation" title="Clear chat">' +
              '<span class="jbot-control-icon">Clear</span>' +
            '</button>' +
            '<button class="jbot-control jbot-theme-toggle" id="jbot-theme" aria-label="Toggle dark / light" title="Toggle theme">' +
              '<span class="jbot-theme-icon">🌓</span>' +
            '</button>' +
            '<button class="jbot-control jbot-close" id="jbot-close" aria-label="Close chat" title="Close">' +
              '<span class="jbot-control-icon">✕</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="jbot-welcome" id="jbot-welcome">Hey! I&#39;m J Bot, Jeyaseelan&#39;s personal AI assistant. What would you like to know?</div>' +
        '<div class="jbot-suggestions" id="jbot-suggestions">' +
          '<button class="jbot-suggest">Tell me about your skills</button>' +
          '<button class="jbot-suggest">What projects have you built?</button>' +
          '<button class="jbot-suggest">Your achievements and hackathons</button>' +
          '<button class="jbot-suggest">What&#39;s in your resume?</button>' +
        '</div>' +
        '<div class="jbot-messages" id="jbot-messages" role="log" aria-live="polite" aria-relevant="additions"></div>' +
        '<div class="jbot-input-row">' +
          '<input type="text" class="jbot-input" id="jbot-input" placeholder="Ask about Jeyaseelan…" autocomplete="off" />' +
          '<button class="jbot-send" id="jbot-send" disabled>Send</button>' +
          '<button class="jbot-control jbot-retry" id="jbot-retry" aria-label="Retry last message">Retry</button>' +
        '</div>' +
        '<div class="jbot-footer">Powered by AI</div>' +
      '</div>';
    document.body.appendChild(widget);

    var $ = function (id) { return document.getElementById(id); };
    var toggle = $('jbot-toggle');
    var chat = $('jbot-chat');
    var themeBtn = $('jbot-theme');
    var themeIcon = themeBtn.querySelector('.jbot-theme-icon');
    var clearBtn = $('jbot-clear');
    var closeBtn = $('jbot-close');
    var input = $('jbot-input');
    var send = $('jbot-send');
    var retryBtn = $('jbot-retry');
    var messages = $('jbot-messages');
    var suggests = widget.querySelectorAll('.jbot-suggest');
    var toggleAvatar = toggle.querySelector('.jbot-avatar');
    var headerAvatar = $('jbot-chat').querySelector('.jbot-avatar--header');

    var STATE = {
      sending: false,
      lastMessage: '',
      canRetry: false
    };

    // -----------------------------------------------------------------------
    // Theme: sync with the site's toggle (data-theme on <html> + sj_portfolio_theme)
    // -----------------------------------------------------------------------
    function pageTheme() {
      var t = document.documentElement.getAttribute('data-theme') ||
              localStorage.getItem('sj_portfolio_theme') || 'light';
      return t === 'dark' ? 'dark' : 'light';
    }

    function applyThemeIcon(t) {
      // 🌓 = currently light (click to go dark) ; ☀︎ = currently dark (click to go light)
      themeIcon.textContent = t === 'light' ? '🌙' : '☀';
    }

    function setTheme(t) {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('sj_portfolio_theme', t);
      applyThemeIcon(t);
    }

    var startTheme = pageTheme();
    applyThemeIcon(startTheme);

    // Keep J Bot's toggle icon in sync if the site header toggle changes the theme.
    var themeObserver = new MutationObserver(function () {
      applyThemeIcon(pageTheme());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    themeBtn.addEventListener('click', function () {
      setTheme(pageTheme() === 'light' ? 'dark' : 'light');
    });

    // -----------------------------------------------------------------------
    // Avatar state helpers
    // -----------------------------------------------------------------------
    function avatarState(cls) {
      if (toggleAvatar) toggleAvatar.className = 'jbot-avatar' + (cls ? ' ' + cls : '');
      if (headerAvatar) headerAvatar.className = 'jbot-avatar jbot-avatar--header' + (cls ? ' ' + cls : '');
    }

    function setAvatarState(state) {
      if (state === 'thinking') {
        avatarState('jbot-avatar--thinking');
      } else if (state === 'responding') {
        avatarState('jbot-avatar--responding');
        setTimeout(function () { if (!STATE.sending) avatarState(''); }, 1200);
      } else {
        avatarState('');
      }
    }

    // -----------------------------------------------------------------------
    // Chat open / close
    // -----------------------------------------------------------------------
    function openChat() {
      chat.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      widget.setAttribute('aria-hidden', 'false');
      setTimeout(function () { input.focus(); }, 120);
    }

    function closeChat() {
      chat.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      widget.setAttribute('aria-hidden', 'true');
      setAvatarState('');
    }

    toggle.addEventListener('click', function () {
      if (chat.classList.contains('active')) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeChat();
    });

    // Close on Escape while open
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && chat.classList.contains('active')) {
        closeChat();
      }
    });

    // -----------------------------------------------------------------------
    // Suggestions
    // -----------------------------------------------------------------------
    suggests.forEach(function (btn) {
      btn.addEventListener('click', function () {
        input.value = btn.textContent;
        sendMessage();
      });
    });

    // -----------------------------------------------------------------------
    // Clear chat
    // -----------------------------------------------------------------------
    function clearChat() {
      messages.innerHTML = '';
      STATE.lastMessage = '';
      STATE.canRetry = false;
      retryBtn.classList.remove('jbot-retry--active');
      input.value = '';
      if (chat.classList.contains('active')) openChat();
    }

    clearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      clearChat();
    });

    // -----------------------------------------------------------------------
    // Send / retry
    // -----------------------------------------------------------------------
    function setSending(busy) {
      STATE.sending = busy;
      send.disabled = busy;
      send.textContent = busy ? 'Sending…' : 'Send';
    }

    retryBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (STATE.canRetry && STATE.lastMessage && !STATE.sending) {
        input.value = STATE.lastMessage;
        sendMessage();
      }
    });

    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!STATE.sending) sendMessage();
      }
    });
    input.addEventListener('input', function () {
      // hide retry preview when user starts typing a new message
      if (STATE.canRetry) {
        STATE.canRetry = false;
        retryBtn.classList.remove('jbot-retry--active');
      }
    });

    async function sendMessage() {
      var text = input.value.trim();
      if (!text || STATE.sending) return;

      STATE.lastMessage = text;
      STATE.canRetry = false;
      retryBtn.classList.remove('jbot-retry--active');

      addMsg(text, 'user');
      input.value = '';
      setSending(true);
      setTyping(true);
      setAvatarState('thinking');

      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, SEND_TIMEOUT_MS);

      try {
        var res = await fetch(CHAT_ENDPOINT, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });

        clearTimeout(timeout);

        if (!res.ok) {
          var fallbackText;
          if (res.status === 429) {
            fallbackText = 'I\'m being rate-limited right now. Please wait a minute and hit Retry.';
          } else if (res.status === 401 || res.status === 403) {
            fallbackText = 'The assistant isn\'t authorized right now. Try again in a moment.';
          } else {
            fallbackText = 'Something went wrong on my side. Your message was noted — hit Retry.';
          }
          addMsg(fallbackText, 'bot', 'error');
          setAvatarState('');
          return;
        }

        var data = await res.json();
        var answer = data && (data.answer || data.reply || data.text);
        if (!answer) {
          addMsg('I didn\'t get a clear answer. Please try rephrasing.', 'bot', 'error');
          setAvatarState('');
          return;
        }
        addMsg(answer, 'bot');
        setAvatarState('responding');
      } catch (e) {
        clearTimeout(timeout);
        var msg = (e && e.name === 'AbortError')
          ? 'I took too long to respond. Please hit Retry.'
          : 'Unable to reach J Bot right now. Your message is saved — hit Retry.';
        addMsg(msg, 'bot', 'error');
        setAvatarState('');
      } finally {
        setTyping(false);
        setSending(false);
      }
    }

    // -----------------------------------------------------------------------
    // Messages + typing
    // -----------------------------------------------------------------------
    function addMsg(text, type, flag) {
      var div = document.createElement('div');
      div.className = 'jbot-msg ' + (type === 'user' ? 'jbot-user' : 'jbot-bot');
      if (flag === 'error') div.classList.add('jbot-msg--error');
      div.textContent = text;
      messages.appendChild(div);
      scrollToBottom();
      if (flag === 'error' && type === 'bot') {
        STATE.canRetry = true;
        retryBtn.classList.add('jbot-retry--active');
      }
    }

    function setTyping(show) {
      if (show) {
        if (!document.getElementById('jbot-typing')) {
          var t = document.createElement('div');
          t.id = 'jbot-typing';
          t.className = 'jbot-typing';
          t.setAttribute('aria-hidden', 'true');
          t.innerHTML = '<span class="jbot-typing-dot"></span><span class="jbot-typing-dot"></span><span class="jbot-typing-dot"></span>';
          messages.appendChild(t);
          scrollToBottom();
        }
      } else {
        var t = document.getElementById('jbot-typing');
        if (t) t.remove();
      }
    }

    function scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJBot);
  } else {
    initJBot();
  }
})();
