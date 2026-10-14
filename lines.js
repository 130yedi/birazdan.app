// A line as the app shows it beside its trips (October 2026): the icon of what runs it in a rounded
// square, on the line's own color for a rail line or a ferry (the brand gray for buses and the
// metrobüs), and its code in plain letters beside it, in that color where it reads. Drawn from the
// app's components/ModeIcon.tsx and lib/lineLook.ts; change them together.
(function () {
  const W = 'stroke-width="2.1875"';
  const C = 'stroke-width="1.859"';
  // Each shape on a 24-point grid: F the shape's color, B its cut-outs (the square's color).
  const GLYPHS = {
    bus:
      `<rect x="4" y="3" width="16" height="15" rx="3" fill="F" stroke="F" ${W}/><rect x="6.5" y="5.5" width="11" height="5.5" rx="1" fill="B"/>` +
      `<circle cx="8.5" cy="14.5" r="1" fill="B"/><circle cx="15.5" cy="14.5" r="1" fill="B"/>` +
      `<line x1="7.5" y1="18" x2="7.5" y2="21" stroke="F" ${W}/><line x1="16.5" y1="18" x2="16.5" y2="21" stroke="F" ${W}/>`,
    metrobus:
      `<rect x="2" y="5" width="20" height="10" rx="2.5" fill="F" stroke="F" ${W}/><rect x="4.5" y="7.5" width="5" height="3.5" rx="0.75" fill="B"/>` +
      `<rect x="14.5" y="7.5" width="5" height="3.5" rx="0.75" fill="B"/><line x1="12" y1="6.5" x2="12" y2="13.5" stroke="B" ${C}/>` +
      `<circle cx="6.5" cy="17.5" r="1.75" fill="F" stroke="F" ${W}/><circle cx="17.5" cy="17.5" r="1.75" fill="F" stroke="F" ${W}/>`,
    metro:
      `<rect x="5" y="2.5" width="14" height="15" rx="4" fill="F" stroke="F" ${W}/><rect x="7.5" y="5" width="9" height="5" rx="1.5" fill="B"/>` +
      `<circle cx="9" cy="13.5" r="1" fill="B"/><circle cx="15" cy="13.5" r="1" fill="B"/>` +
      `<line x1="8" y1="17.5" x2="6" y2="21" stroke="F" ${W}/><line x1="16" y1="17.5" x2="18" y2="21" stroke="F" ${W}/>`,
    train:
      `<path d="M3 21 V11 A9 9 0 0 1 21 11 V21" fill="none" stroke="F" ${W}/><rect x="7.5" y="8" width="9" height="10" rx="2.5" fill="F" stroke="F" ${W}/>` +
      `<rect x="9" y="10" width="6" height="3.5" rx="0.8" fill="B"/><circle cx="10" cy="15.5" r="0.75" fill="B"/><circle cx="14" cy="15.5" r="0.75" fill="B"/>` +
      `<line x1="9.5" y1="18" x2="8.5" y2="21" stroke="F" ${W}/><line x1="14.5" y1="18" x2="15.5" y2="21" stroke="F" ${W}/>`,
    tram:
      `<line x1="8" y1="2.5" x2="16" y2="2.5" stroke="F" ${W}/><path d="M9.5 6 L12 2.5 L14.5 6" fill="none" stroke="F" ${W}/>` +
      `<rect x="5" y="6" width="14" height="12" rx="3" fill="F" stroke="F" ${W}/><rect x="7.5" y="8.5" width="9" height="4.5" rx="1" fill="B"/>` +
      `<circle cx="9" cy="15" r="0.9" fill="B"/><circle cx="15" cy="15" r="0.9" fill="B"/>` +
      `<line x1="8.5" y1="18" x2="7" y2="21" stroke="F" ${W}/><line x1="15.5" y1="18" x2="17" y2="21" stroke="F" ${W}/>`,
    nostalgicTram:
      `<line x1="13" y1="5" x2="16.5" y2="2" stroke="F" ${W}/><rect x="4" y="5" width="16" height="2" rx="1" fill="F" stroke="F" ${W}/>` +
      `<rect x="3" y="7" width="18" height="9" rx="1.5" fill="F" stroke="F" ${W}/><rect x="5" y="9" width="3.5" height="3.5" rx="0.6" fill="B"/>` +
      `<rect x="10.25" y="9" width="3.5" height="3.5" rx="0.6" fill="B"/><rect x="15.5" y="9" width="3.5" height="3.5" rx="0.6" fill="B"/>` +
      `<circle cx="7.5" cy="18" r="1.6" fill="F" stroke="F" ${W}/><circle cx="16.5" cy="18" r="1.6" fill="F" stroke="F" ${W}/>` +
      `<line x1="2" y1="21" x2="22" y2="21" stroke="F" ${W}/>`,
    funicular:
      `<line x1="2" y1="21.5" x2="22" y2="9.5" stroke="F" ${W}/>` +
      `<rect x="6" y="7" width="12" height="7" rx="1.5" transform="rotate(-31 12 10.5)" fill="F" stroke="F" ${W}/>` +
      `<rect x="8" y="8.75" width="3.5" height="3" rx="0.5" transform="rotate(-31 12 10.5)" fill="B"/>` +
      `<rect x="12.5" y="8.75" width="3.5" height="3" rx="0.5" transform="rotate(-31 12 10.5)" fill="B"/>`,
    cablecar:
      `<line x1="2" y1="6" x2="22" y2="3" stroke="F" ${W}/><line x1="12" y1="4.5" x2="12" y2="9" stroke="F" ${W}/>` +
      `<rect x="6" y="9" width="12" height="11" rx="3" fill="F" stroke="F" ${W}/><rect x="8" y="11.5" width="8" height="4.5" rx="1" fill="B"/>` +
      `<line x1="9" y1="17.5" x2="15" y2="17.5" stroke="B" ${C}/>`,
    ferry:
      `<rect x="10" y="4.5" width="3" height="4.5" rx="0.6" fill="F" stroke="F" ${W}/><line x1="10.6" y1="6.4" x2="12.4" y2="6.4" stroke="B" ${C}/>` +
      `<rect x="6" y="9" width="11" height="4" rx="0.8" fill="F" stroke="F" ${W}/><path d="M2 13 H22 L19.5 18 H4.5 Z" fill="F" stroke="F" ${W}/>` +
      `<circle cx="8.75" cy="11" r="0.7" fill="B"/><circle cx="11.5" cy="11" r="0.7" fill="B"/><circle cx="14.25" cy="11" r="0.7" fill="B"/>` +
      `<path d="M2 21 q2.5 -1.6 5 0 t5 0 t5 0 t5 0" fill="none" stroke="F" ${W}/>`,
  };
  const NOSTALGIC = ['rail-T2', 'rail-T3'];
  const OWN = ['metro', 'train', 'tram', 'funicular', 'cablecar', 'ferry'];

  // The icon of what runs the line; from its id and code where the server sends no mode.
  function glyphOf(a) {
    if (NOSTALGIC.includes(a.route_id)) return 'nostalgicTram';
    const mode = a.mode || modeFromId(a);
    return GLYPHS[mode] ? mode : 'bus';
  }

  function modeFromId(a) {
    const id = a.route_id || '';
    const code = a.route_code || '';
    if (id.startsWith('ferry-') || code === 'Vapur') return 'ferry';
    if (!id.startsWith('rail-')) return 'bus';
    if (code === 'Marmaray') return 'train';
    if (code.startsWith('TF')) return 'cablecar';
    if (code.startsWith('T')) return 'tram';
    if (code.startsWith('F')) return 'funicular';
    return 'metro';
  }

  function luminance(hex) {
    const f = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const [r, g, b] = [1, 3, 5].map((i) => f(parseInt(hex.slice(i, i + 2), 16) / 255));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }

  // A line's color as text on the page: as it is where it reads (4.5:1), else darkened (light page)
  // or lightened (dark page) only as much as it takes.
  function readableOn(color, background) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return color;
    const toward = luminance(background) > 0.5 ? '#000000' : '#ffffff';
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const mixed =
        '#' +
        [1, 3, 5]
          .map((i) => {
            const x = parseInt(color.slice(i, i + 2), 16);
            const y = parseInt(toward.slice(i, i + 2), 16);
            return Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
          })
          .join('');
      if (contrast(mixed, background) >= 4.5) return mixed;
    }
    return toward;
  }

  const dark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // The line's mark: icon and code. Marmaray goes by its number (B1); a ferry by its icon alone.
  window.lineMark = function (a) {
    const glyph = glyphOf(a);
    const own = a.color && OWN.includes(glyph === 'nostalgicTram' ? 'tram' : glyph);
    const square = own ? a.color : 'var(--brand)';
    const shape = own ? a.text_color || '#ffffff' : 'var(--on-brand)';
    const code = glyph === 'ferry' ? '' : a.route_code === 'Marmaray' ? 'B1' : a.route_code || '';
    const el = document.createElement('span');
    el.className = 'line';
    el.innerHTML =
      '<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true">' +
      `<rect width="24" height="24" rx="6" fill="${square}"/>` +
      '<g transform="translate(3.84 3.84) scale(0.68)" stroke-linecap="round" stroke-linejoin="round">' +
      GLYPHS[glyph].replace(/"F"/g, `"${shape}"`).replace(/"B"/g, `"${square}"`) +
      '</g></svg>';
    if (code) {
      const text = document.createElement('span');
      text.className = 'line-code';
      text.textContent = code;
      // Read on the board's card (the surface color), where the rows sit.
      if (own) text.style.color = readableOn(a.color, dark() ? '#1d232d' : '#f3f4f6');
      el.appendChild(text);
    }
    return el;
  };
})();
