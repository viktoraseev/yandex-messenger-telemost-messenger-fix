// Runs at document_start, before any page script.
//
// A chat link (https://messenger.360.yandex.ru/#/chats/<chatId>[/<timestamp>]) is handed to
// Better Messenger as better-messenger://messenger.360.yandex.ru/#/chats/..., the same scheme swap
// the web app used to do with ychat://. Better Messenger starts Messenger with its injection if
// needed and forwards the link as ychat://. The page is stopped first, so the web app never
// loads and cannot redirect to Telemost.
(() => {
  'use strict';

  const DESKTOP_SCHEME = 'better-messenger:';
  const CHAT_ROUTE = /^#\/chats\/[^/]+/;

  const isChatLink = () => CHAT_ROUTE.test(location.hash);

  function openInDesktop() {
    location.href = location.href.replace(/^https:/, DESKTOP_SCHEME);
  }

  function renderStub() {
    const root = document.documentElement ?? document.appendChild(document.createElement('html'));
    root.replaceChildren();

    const head = document.createElement('head');
    const title = document.createElement('title');
    title.textContent = 'Открываю в Мессенджере';
    head.append(title);

    const body = document.createElement('body');
    body.style.cssText =
      'font: 15px/1.5 -apple-system, BlinkMacSystemFont, sans-serif; margin: 20vh auto; max-width: 420px; text-align: center; color: #333;';

    const text = document.createElement('p');
    text.textContent = 'Чат открывается в десктопном Мессенджере. Вкладку можно закрыть.';

    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Открыть ещё раз';
    retry.style.cssText = 'font: inherit; padding: 6px 16px; cursor: pointer;';
    retry.addEventListener('click', openInDesktop);

    body.append(text, retry);
    root.append(head, body);
  }

  if (!isChatLink()) return;

  window.stop();
  renderStub();
  openInDesktop();
  // Pasting another chat link into this tab changes only the hash, without a reload.
  window.addEventListener('hashchange', () => {
    if (isChatLink()) openInDesktop();
  });
})();
