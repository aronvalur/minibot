(function () {
  const API_URL = new URL(document.currentScript.src).origin + '/api/chat';

  const style = document.createElement('style');
  style.textContent = `
    #mnml-bubble { position: fixed; bottom: 22px; right: 22px; width: 58px; height: 58px; border-radius: 50%;
      background: linear-gradient(100deg, #FF6B3D, #8B5CF6); border: none; cursor: pointer; z-index: 999998;
      box-shadow: 0 10px 30px -8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; }
    #mnml-bubble svg { width: 26px; height: 26px; stroke: #fff; }
    #mnml-window { position: fixed; bottom: 92px; right: 22px; width: 360px; max-width: calc(100vw - 32px);
      height: 500px; max-height: calc(100vh - 140px); background: #0A0A0D; border: 1px solid #26262C; border-radius: 16px;
      display: none; flex-direction: column; overflow: hidden; z-index: 999999; box-shadow: 0 30px 80px -20px rgba(0,0,0,0.6);
      font-family: -apple-system, 'Inter', sans-serif; }
    #mnml-window.open { display: flex; }
    #mnml-head { padding: 16px 18px; background: #131316; border-bottom: 1px solid #26262C; display: flex;
      align-items: center; justify-content: space-between; }
    #mnml-head .title { color: #F3F2EF; font-weight: 700; font-size: 14.5px; }
    #mnml-head .sub { color: #9D9BA4; font-size: 11.5px; margin-top: 2px; }
    #mnml-close { background: none; border: none; color: #9D9BA4; cursor: pointer; font-size: 18px; padding: 4px; }
    #mnml-msgs { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .mnml-msg { max-width: 82%; padding: 9px 13px; border-radius: 12px; font-size: 13.5px; line-height: 1.5; }
    .mnml-msg.bot { background: #1B1B20; color: #F3F2EF; align-self: flex-start; border-bottom-left-radius: 3px; }
    .mnml-msg.user { background: linear-gradient(100deg, #FF6B3D, #8B5CF6); color: #fff; align-self: flex-end; border-bottom-right-radius: 3px; }
    #mnml-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #26262C; background: #131316; }
    #mnml-input { flex: 1; background: #0A0A0D; border: 1px solid #26262C; color: #F3F2EF; border-radius: 8px;
      padding: 10px 12px; font-size: 13.5px; font-family: inherit; resize: none; }
    #mnml-send { background: linear-gradient(100deg, #FF6B3D, #8B5CF6); border: none; color: #fff; border-radius: 8px;
      padding: 0 16px; cursor: pointer; font-weight: 600; font-size: 13px; }
    #mnml-send:disabled { opacity: 0.5; cursor: default; }
  `;
  document.head.appendChild(style);

  const bubble = document.createElement('button');
  bubble.id = 'mnml-bubble';
  bubble.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  document.body.appendChild(bubble);

  const win = document.createElement('div');
  win.id = 'mnml-window';
  win.innerHTML = `
    <div id="mnml-head">
      <div><div class="title">Minimalískt</div><div class="sub">Spyrðu okkur hvað sem er</div></div>
      <button id="mnml-close">✕</button>
    </div>
    <div id="mnml-msgs"></div>
    <div id="mnml-input-row">
      <textarea id="mnml-input" rows="1" placeholder="Skrifaðu skilaboð..."></textarea>
      <button id="mnml-send">Senda</button>
    </div>
  `;
  document.body.appendChild(win);

  const msgsEl = win.querySelector('#mnml-msgs');
  const inputEl = win.querySelector('#mnml-input');
  const sendBtn = win.querySelector('#mnml-send');
  let history = [];
  let greeted = false;

  function addMsg(role, text) {
    const el = document.createElement('div');
    el.className = 'mnml-msg ' + (role === 'user' ? 'user' : 'bot');
    el.textContent = text;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  bubble.addEventListener('click', () => {
    win.classList.toggle('open');
    if (win.classList.contains('open') && !greeted) {
      greeted = true;
      addMsg('bot', 'Halló! Ég er spjallmennið hjá Minimalískt. Spurðu mig um mælaborð, spjallmenni, sjálfvirkni, eða hvernig ferlið gengur fyrir sig.');
    }
  });
  win.querySelector('#mnml-close').addEventListener('click', () => win.classList.remove('open'));

  async function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    inputEl.value = '';
    sendBtn.disabled = true;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (data.reply) {
        addMsg('bot', data.reply);
        history.push({ role: 'assistant', content: data.reply });
      } else {
        addMsg('bot', 'Því miður kom upp villa. Reyndu aftur, eða sendu okkur línu á Aron@minimaliskt.is.');
      }
    } catch (e) {
      addMsg('bot', 'Því miður kom upp villa. Reyndu aftur, eða sendu okkur línu á Aron@minimaliskt.is.');
    }
    sendBtn.disabled = false;
  }

  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
})();
