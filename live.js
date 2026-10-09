// The home page's stop board: a real stop's next buses, from the app's own server. Shown the way
// the app shows them: line, where it heads, minutes, and whether the time is live or from the
// timetable. The server allows birazdan.app to read (CORS) and caches each stop for 20 s.
(function () {
  const API = 'https://api.birazdan.app/v1/stops/';
  const REFRESH_MS = 20000;
  const ROWS = 5;
  const board = document.querySelector('[data-board]');
  if (!board) return;
  const rowsEl = board.querySelector('[data-rows]');
  const statusEl = board.querySelector('[data-status]');
  const nameEl = board.querySelector('[data-board-name]');
  const sideEl = board.querySelector('[data-board-side]');
  const tabs = Array.from(board.querySelectorAll('[data-stop]'));
  let stop = tabs[0].dataset.stop;
  let timer = null;
  let request = 0;

  function ago(iso) {
    const s = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000));
    if (s < 5) return 'az önce';
    if (s < 60) return s + ' sn önce';
    return Math.floor(s / 60) + ' dk önce';
  }

  // One row per line and direction, the soonest first, as the app's stop screen.
  function pick(arrivals) {
    const seen = new Set();
    const rows = [];
    for (const a of arrivals) {
      const key = a.route_code + '|' + a.headsign;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push(a);
      if (rows.length === ROWS) break;
    }
    return rows;
  }

  function row(a) {
    const li = document.createElement('li');
    const live = a.status === 'live';
    li.innerHTML =
      '<span class="badge"></span><span class="headsign"></span>' +
      '<span class="time"><span class="dot ' + (live ? 'dot-live' : 'dot-scheduled') + '" aria-hidden="true"></span>' +
      '<span class="min"></span><span class="unit">dk</span></span>';
    const badge = li.querySelector('.badge');
    badge.textContent = a.route_code;
    // Rail lines and ferries come in their own colors, as in the app.
    if (a.color) {
      badge.style.background = a.color;
      badge.style.color = a.text_color || '#ffffff';
    }
    li.querySelector('.headsign').textContent = a.headsign || '';
    li.querySelector('.min').textContent = String(a.minutes);
    li.setAttribute(
      'aria-label',
      a.route_code + ', ' + (a.headsign || '') + ', ' + a.minutes + ' dakika' + (live ? ', canlı' : ', tarifeden'),
    );
    return li;
  }

  function show(data) {
    const rows = pick(data.arrivals || []);
    rowsEl.replaceChildren(...rows.map(row));
    if (rows.length === 0) {
      statusEl.textContent = 'Yakında sefer yok.';
    } else if (data.last_live_at && rows.some((a) => a.status === 'live')) {
      statusEl.innerHTML = '<span class="dot dot-live" aria-hidden="true"></span> Canlı, ' + ago(data.last_live_at) + ' güncellendi';
    } else {
      statusEl.innerHTML =
        '<span class="dot dot-scheduled" aria-hidden="true"></span> ' +
        (data.source === 'schedule' ? 'Süreler tarifeden' : 'Canlı veri yok, süreler tarifeden');
    }
  }

  async function load() {
    const mine = ++request;
    try {
      const res = await fetch(API + encodeURIComponent(stop) + '/arrivals');
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (mine === request) show(data);
    } catch (e) {
      if (mine !== request) return;
      rowsEl.replaceChildren();
      statusEl.textContent = 'Süreler şu an alınamadı. Birazdan tekrar denenecek.';
    }
  }

  function start() {
    clearInterval(timer);
    load();
    timer = setInterval(() => {
      if (!document.hidden) load();
    }, REFRESH_MS);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      stop = tab.dataset.stop;
      nameEl.textContent = tab.dataset.name;
      sideEl.textContent = tab.dataset.side;
      rowsEl.replaceChildren();
      statusEl.textContent = 'Süreler yükleniyor…';
      start();
    });
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) load();
  });

  start();
})();
