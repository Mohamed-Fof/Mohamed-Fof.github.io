const BACKEND_URL = 'https://adia-backend.vercel.app';
const chatHistory = [];

function openChat() {
  const modal = document.getElementById('chat-modal');
  modal.style.display = 'flex';
  document.getElementById('chat-input').focus();
}

function closeChat() {
  document.getElementById('chat-modal').style.display = 'none';
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildTable(lines) {
  const rows = lines.filter(l => !/^\s*\|[\s\-|:]+\|\s*$/.test(l));
  let html = '<table style="border-collapse:collapse;width:100%;font-size:0.82rem;margin:0.6rem 0;">';
  rows.forEach((row, i) => {
    const cells = row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
    html += '<tr>';
    cells.forEach(cell => {
      const tag = i === 0 ? 'th' : 'td';
      const style = i === 0
        ? 'padding:0.4rem 0.7rem;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;text-align:left;font-weight:600;'
        : `padding:0.35rem 0.7rem;border-bottom:1px solid #e2e8f0;background:${i%2===0?'#f8faff':'#fff'};text-align:left;`;
      html += `<${tag} style="${style}">${escapeHtml(cell.trim())}</${tag}>`;
    });
    html += '</tr>';
  });
  return html + '</table>';
}

function formatText(raw) {
  const lines = raw.split('\n');
  const parts = [];
  let tableLines = [], textBuf = [];

  for (const line of lines) {
    const isSep = /^\s*\|[\s\-|:]+\|\s*$/.test(line);
    const isRow = line.trim().startsWith('|');
    if (isSep) { continue; }
    else if (isRow) {
      if (textBuf.length) { parts.push({ t: 'text', c: textBuf.join('\n') }); textBuf = []; }
      tableLines.push(line);
    } else {
      if (tableLines.length) { parts.push({ t: 'table', c: tableLines }); tableLines = []; }
      textBuf.push(line);
    }
  }
  if (tableLines.length) parts.push({ t: 'table', c: tableLines });
  if (textBuf.length) parts.push({ t: 'text', c: textBuf.join('\n') });

  return parts.map(p => {
    if (p.t === 'table') return buildTable(p.c);
    let s = escapeHtml(p.c);
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\n/g, '<br/>');
    s = s.replace(/(<br\/>)*(\d+\.\s)/g, '<br/><br/><span style="font-weight:600">$2</span>');
    s = s.replace(/^(<br\/>)+/, '');
    s = s.replace(/---/g, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:0.5rem 0"/>');
    return s;
  }).join('');
}

function appendMessage(role, text) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.style.cssText = role === 'user'
    ? 'background:#2563eb; color:#fff; padding:0.8rem 1rem; border-radius:12px 0 12px 12px; max-width:85%; align-self:flex-end; font-size:0.88rem; line-height:1.6;'
    : 'background:#eff6ff; padding:0.8rem 1rem; border-radius:0 12px 12px 12px; max-width:85%; font-size:0.88rem; line-height:1.6;';
  div.innerHTML = formatText(text);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function appendTyping() {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.id = 'typing-indicator';
  div.style.cssText = 'background:#eff6ff; padding:0.8rem 1rem; border-radius:0 12px 12px 12px; max-width:60px; font-size:0.88rem; color:#64748b;';
  div.textContent = '...';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });
  appendTyping();

  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });
    const data = await res.json();
    removeTyping();
    if (res.status === 429) {
      appendMessage('assistant', "⏳ Tu envoies beaucoup de messages. Patiente un instant avant de réessayer.");
      return;
    }
    if (data.error) {
      appendMessage('assistant', "⚠️ Service temporairement indisponible. Contacte Mohamed directement : fofana12ad@gmail.com");
      return;
    }
    const reply = data.reply || "Désolé, une erreur est survenue.";
    appendMessage('assistant', reply);
    chatHistory.push({ role: 'assistant', content: reply });

    // Dossier complet : désactiver la saisie
    if (data.completed) {
      document.getElementById('chat-input').disabled = true;
      document.getElementById('chat-input').placeholder = "Dossier envoyé — Mohamed vous contactera sur WhatsApp";
    }
  } catch {
    removeTyping();
    appendMessage('assistant', "Impossible de contacter le serveur. Contacte Mohamed : fofana12ad@gmail.com");
  }
}

// Fermer la modal en cliquant en dehors
document.getElementById('chat-modal').addEventListener('click', function(e) {
  if (e.target === this) closeChat();
});

// Événements liés ici (et non en attributs onclick) : la CSP interdit les scripts inline.
document.getElementById('chat-open-btn').addEventListener('click', openChat);
document.getElementById('chat-close-btn').addEventListener('click', closeChat);
document.getElementById('chat-send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});
