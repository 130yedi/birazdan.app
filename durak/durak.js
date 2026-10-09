// A stop shared from the app (birazdan.app/durak/?id=…): its next departures, live from the app's
// own server, the way the home page's board shows them. The server allows birazdan.app to read
// (CORS) and caches each stop for 20 s.
(function () {
  const API = 'https://api.birazdan.app/v1/stops/';
  const REFRESH_MS = 20000;
  const ROWS = 8;
  const board = document.querySelector('[data-stop-board]');
  if (!board) return;
  const nameEl = board.querySelector('[data-name]');
  const sideEl = board.querySelector('[data-side]');
  const statusEl = board.querySelector('[data-status]');
  const rowsEl = board.querySelector('[data-rows]');
  const openApp = document.querySelector('[data-open-app]');
  const id = new URLSearchParams(location.search).get('id');
  let timer = null;

  if (!id) {
    statusEl.textContent = 'Bu bağlantıda bir durak yok. Uygulamada bir durağın "Paylaş" düğmesiyle paylaşılır.';
    return;
  }
  // Opens the stop in the app where it is installed (its birazdan:// links).
  openApp.href = 'birazdan://stop/' + encodeURIComponent(id);
  openApp.hidden = false;

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
      const key = (a.route_id || a.route_code) + '|' + a.headsign;
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

  function side(stop) {
    const parts = [];
    if (stop.mode === 'ferry') parts.push('Vapur iskelesi');
    else if (stop.mode && stop.mode !== 'bus' && stop.mode !== 'metrobus') parts.push('İstasyon');
    if (stop.towards) parts.push(stop.towards + ' yönü');
    else if (stop.platform) parts.push(stop.platform);
    if (stop.district) parts.push(stop.district);
    return parts.join(' · ');
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

  async function loadStop() {
    try {
      const res = await fetch(API + encodeURIComponent(id));
      if (res.status === 404) {
        statusEl.textContent = 'Bu durak bulunamadı. Durak kodu değişmiş olabilir.';
        openApp.hidden = true;
        clearInterval(timer);
        return false;
      }
      if (!res.ok) return true;
      const stop = await res.json();
      nameEl.textContent = stop.name;
      sideEl.textContent = side(stop);
      document.title = stop.name + ' · Birazdan';
    } catch (e) {
      // The name stays as it is; the times say what is wrong.
    }
    return true;
  }

  async function load() {
    try {
      const res = await fetch(API + encodeURIComponent(id) + '/arrivals');
      if (!res.ok) throw new Error(String(res.status));
      show(await res.json());
    } catch (e) {
      rowsEl.replaceChildren();
      statusEl.textContent = 'Süreler şu an alınamadı. Birazdan tekrar denenecek.';
    }
  }

  loadStop().then((found) => {
    if (!found) return;
    load();
    timer = setInterval(() => {
      if (!document.hidden) load();
    }, REFRESH_MS);
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && timer) load();
  });
})();
