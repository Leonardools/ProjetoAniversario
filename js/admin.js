// Painel administrativo. A proteção real é feita pelas regras do Firebase.
import { auth, database, messagesRef, ref, onValue, remove, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js';

// UID autorizado nas regras do Realtime Database.
const ADMIN_UID = 'PbsRAdPJPSd1OU4xSQ9cHd4OTC53';
const $ = selector => document.querySelector(selector);
let unsubscribe = null;

$('#loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  $('#loginStatus').textContent = 'Entrando...';
  try {
    const result = await signInWithEmailAndPassword(auth, $('#email').value.trim(), $('#password').value);
    if (result.user.uid !== ADMIN_UID) {
      await signOut(auth);
      $('#loginStatus').textContent = 'Esta conta não tem permissão de administrador.';
    } else { $('#loginStatus').textContent = ''; $('#password').value = ''; }
  } catch (error) {
    console.error('Falha de autenticação:', error.code);
    $('#loginStatus').textContent = 'Não foi possível entrar. Confira e-mail e senha.';
  }
});

$('#logoutButton').addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, user => {
  const allowed = Boolean(user && user.uid === ADMIN_UID);
  $('#loginSection').hidden = allowed;
  $('#dashboard').hidden = !allowed;
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  if (!allowed) { $('#adminMessages').replaceChildren(); return; }

  // Escuta mudanças no banco em tempo real.
  unsubscribe = onValue(messagesRef, snapshot => {
    const entries = Object.entries(snapshot.val() || {})
      .map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    $('#messageCount').textContent = entries.length;
    const container = $('#adminMessages'); container.replaceChildren();
    if (!entries.length) { const empty = document.createElement('p'); empty.textContent = 'Ainda não há recados.'; container.append(empty); }
    for (const item of entries) {
      const card = document.createElement('article'); card.className = 'message-card';
      const title = document.createElement('h3'); title.textContent = item.name || 'Convidado';
      const date = document.createElement('small'); date.textContent = Number.isFinite(item.createdAt) ? new Date(item.createdAt).toLocaleString('pt-BR') : '';
      const text = document.createElement('p'); text.textContent = item.text || '';
      const button = document.createElement('button'); button.type = 'button'; button.className = 'danger'; button.textContent = 'Excluir recado';
      button.addEventListener('click', async () => {
        if (!confirm(`Excluir o recado de ${item.name || 'Convidado'}? Esta ação não pode ser desfeita.`)) return;
        button.disabled = true;
        try { await remove(ref(database, `messages/${item.id}`)); $('#adminStatus').textContent = 'Recado excluído.'; }
        catch (error) { console.error(error); $('#adminStatus').textContent = 'Erro ao excluir. Confira as regras de segurança.'; button.disabled = false; }
      });
      card.append(title, date, text, button); container.append(card);
    }
  }, error => { console.error(error); $('#adminStatus').textContent = 'Não foi possível carregar os recados.'; });
});
