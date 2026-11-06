// Presentation team (c): the play-by-play lower-third and the commentary half of a face-plant.
// Every line text is used at most once per race (COMM.used, cleared while phase is 'countdown').
export function createCommentary(G) {
  const { S, $, rng } = G;
  const ANNOUNCERS = ['WALT DUNMORE', 'HANK "HOOFBEAT" PRUITT'];
  const LINES = {
    off: ["AND THEY'RE OFF! Four riderless thoroughbreds and absolutely no plan.", "AND THEY'RE OFF, folks! Hold onto your hats and your lunch.", 'The gate is open and so, I suspect, are the stewards\' eyes!'],
    lead: ['{n} takes the lead! Well, takes a lead. It is not a good one.', '{n} moves to the front! Legs flailing, spirits high!', 'And it is {n} out in front now!', '{n} pokes a nose in front, folks!', 'New leader! {n} has found a leg or two!', '{n} hits the front and the crowd is delighted!', 'Here comes {n}, and I do mean sideways!'],
    fill: ['The dust is flying out there at the Fiasco Stakes.', 'Nobody has told these horses how legs work.', 'What a crowd today at the track, over six dozen!', 'Look at that stride! I use the word loosely.', 'Sponsored by Ranch-O Cola, the taste of victory.', 'Folks, the infield lake is looking lovely today.', 'Zenith TV: if you can see this, you own a Zenith.', 'Top-Cat Tires, the tires that grip like a face-plant.', 'Pronto Pizza is on its way to the winner\'s circle!', 'A fine afternoon for it. Sun out, hooves everywhere.', 'Somebody check on the hot dog vendor. He has gone quiet.', 'Golden Hoof Oats: breakfast of champions and these horses.', 'You can feel the tension up here in the booth.', 'Remember, folks, the little horse in your life loves you.'],
    far: ['{n} is miles back. Somebody send a search party.', '{n} is out of the picture, folks.', '{n} is taking the scenic route today.', 'Is {n} still in this race? Check the program!'],
    stretch: ["Into the stretch! It's going to be close!", 'Down to the wire, folks, down to the wire!', 'Here they come into the stretch! Hold on to something!'],
    first: ['{n} is first across the line!', 'And {n} hits the wire first!', '{n} crosses the line! Somebody call the photographer!', 'The flag falls on {n}!'],
    margin: ['{n} by {g}!', 'It is {n} by {g}!', 'The board says {n} by {g}!'],
    win: ['{n} wins it by {g}! What a finish!', "That's the ballgame! {n} takes the Fiasco Stakes by {g}!", 'Official! {n} on top by {g}!'],
    tangle: ['OH NO! A tangle of legs at the {m} mark! Nobody knows whose hoof is whose!', 'A pile-up! {n} and company have become a single large horse!', 'Down they go at the {m} mark! That is a lot of horse on the floor!'],
    tied: ['PHOTO FINISH! {n} gets it by {g}!', 'Too close to call... the photo says {n} by {g}!', 'Hold all tickets! {n} by {g}!'],
  };
  const LOG = { lines: [], stretchX: null };
  const COMM = { q: [], cur: 0, until: 0, pri: 0, lastLead: -1, leadT: -99, fillAt: 6, last: '', shownAt: -99, used: new Set(), finCalled: false, marginSaid: false };
  const GV = { takes: 'take', wins: 'win', moves: 'move', eats: 'eat', kisses: 'kiss', does: 'do', flips: 'flip', goes: 'go', thinks: 'think', sits: 'sit', has: 'have', is: 'are', crosses: 'cross', hits: 'hit', gets: 'get', pokes: 'poke', finds: 'find', lands: 'land', loses: 'lose', plays: 'play', tries: 'try', runs: 'run', looks: 'look', takes: 'take', checks: 'check' };
  const gramRe = new RegExp('\\bYOU (' + Object.keys(GV).join('|') + ')\\b', 'gi');
  const gram = (t) => t.replace(gramRe, (m, v) => { const g = GV[v.toLowerCase()]; return 'YOU ' + (v === v.toUpperCase() ? g.toUpperCase() : g); });
  // 2P: the humans are P1 / P2 internally, on air they are PLAYER ONE / PLAYER TWO
  const dn = (t) => String(t).replace(/\bP1\b/g, 'PLAYER ONE').replace(/\bP2\b/g, 'PLAYER TWO');
  function say(text, pri = 1, hold = 3.6) {
    if (!text) return;
    text = gram(dn(text));
    if (COMM.used.has(text)) return;                                              // never the same line twice in a race
    if (S.time < COMM.until && pri <= COMM.pri) return;
    if (pri < 3 && S.time - COMM.shownAt < 1.5) return;                           // a line gets 1.5 s on screen unless it is plant/tangle/stretch/finish
    const age = S.time - COMM.shownAt;
    COMM.pri = pri; COMM.until = S.time + hold;
    const el = $('ltxt'); if (el.textContent === text) return; el.textContent = text; COMM.last = text; COMM.used.add(text); COMM.shownAt = S.time;
    LOG.lines.push({ t: +S.time.toFixed(2), raceT: +S.raceT.toFixed(2), pri, age: +age.toFixed(2), text }); if (pri === 4 && /stretch|wire/i.test(text)) LOG.stretchX = +Math.max(...G.horses.map((h) => h.pos().x)).toFixed(1);
    const lo = $('lower'); lo.classList.remove('flash'); void lo.offsetWidth; lo.classList.add('flash');
    const a = COMM.cur++ % 2; lo.classList.toggle('alt', a === 1);
    $('cname').textContent = ANNOUNCERS[a] + (pri >= 5 ? ' · PHOTO DESK' : pri >= 3 ? ' · FLASH' : '');
  }
  let cseed = 4242; const crng = () => { cseed = (cseed * 1664525 + 1013904223) >>> 0; return cseed / 4294967296; };
  const unused = (a, f = (x) => x) => { const u = a.filter((t) => !COMM.used.has(gram(dn(f(t))))); return u.length ? u : a; };
  const margin = () => {
    const o = G.frontOrder(), w = o[0], s = o[1], gap = s && s.finished && w.finished ? s.finishT - w.finishT : null;
    const g = gap === null ? 'a mile' : gap < 0.3 ? `a nose, ${gap.toFixed(2)} s` : gap < 0.8 ? `a head, ${gap.toFixed(2)} s` : gap < 3 ? `a length, ${gap.toFixed(2)} s` : `${gap.toFixed(1)} s`;
    return { w: G.roles[w.idx].name, g, gap };
  };
  const line = (k, n = '', m = '') => {
    let g = '';
    if (k === 'tied' || k === 'win' || k === 'margin') { const mg = margin(); n = mg.w; g = mg.g; }
    const f = (t) => t.replace('{n}', n).replace('{m}', m).replace('{g}', g);
    const pool = unused(LINES[k], f);
    return f(pool[Math.floor(crng() * pool.length)]);
  };

  const COMMENT = {
    'FACE-PLANT!': ['{n} eats dirt!', '{n} kisses the track!', 'Nose-first for {n}!', '{n} lost control of that face'],
    'CARTWHEEL!': ['{n} is doing gymnastics!', '10/10 from the judges, {n}!'],
    'DOG SIT!': ['{n} is sitting like a dog!', '{n} thinks this is a picnic'],
    'SPLITS!': ['{n} does the splits!', 'Ouch! {n} is not a gymnast'],
    'BACKFLIP!': ['{n} flips over backwards!', 'Look at {n} go! Upside down!'],
  };
  // the play-by-play pool: many more variants per family, picked with crng so the game RNG stays untouched
  const PBP = {
    'FACE-PLANT!': ['{n} eats dirt! Face-first into the track!', '{n} kisses the track! That one is going to hurt in the morning.', 'Nose-first for {n}! And the crowd gasps!', '{n} lost control of that face!', '{n} takes a mouthful of Fiasco Stakes dirt!', 'Timber! {n} is down and the dust is up!', '{n} has gone to ground, folks!', 'Oof! {n} just met the track head-on!', 'Chin first for {n}, and you could hear it up here!', '{n} is taking a little lie-down!', 'The track claims another one: {n}!', '{n} plants it! Textbook, if the book is about falling!', '{n} tries the face-first method!', 'Down goes {n}! Down goes {n}!'],
    'CARTWHEEL!': ['{n} is doing gymnastics!', '10/10 from the judges, {n}!', 'Over she goes! {n} sticks the landing, sort of!', '{n} is a wheel now, folks!', 'Somebody sign {n} for the circus!', 'Heels over head for {n}!'],
    'DOG SIT!': ['{n} is sitting like a dog!', '{n} thinks this is a picnic.', 'Good boy! {n} is sitting pretty!', '{n} has stopped for a breather!', 'Sit, {n}! Stay! Oh, you did!'],
    'SPLITS!': ['{n} does the splits!', 'Ouch! {n} is not a gymnast.', '{n} goes full splits, and the crowd winces!', 'Legs in two directions for {n}!', 'That is not how legs bend, {n}!'],
    'BACKFLIP!': ['{n} flips over backwards!', 'Look at {n} go! Upside down!', '{n} lands a backflip! Nobody asked for it!', 'Backwards and airborne, that is {n}!', 'Flipping heck, {n}!'],
  };
  const pick = (a) => a[Math.floor(rng() * a.length)];

  // the popup + play-by-play half of a plant (game.js onPlant calls this first)
  function commentOnPlant(h, kind) {
    const r = G.roles[h.idx], nm = dn(r.name);
    // game RNG draws exactly as before: one for the popup sub-line, one more for a face-plant tail
    if (COMMENT[kind]) pick(COMMENT[kind]); if (kind === 'FACE-PLANT!') pick(['', '', '']);
    const f = (t) => t.replace('{n}', nm), pool = unused(PBP[kind] || ['{n}'], f);
    const txt = f(pool[Math.floor(crng() * pool.length)]);
    if (r.human >= 0 || S.popups.length < 1) G.popup(kind, txt, G.hexs(r.color));
    say(txt, 3, 3.2);
  }

  function directorCommentary(dt) {
    const { horses, roles, FINISH_X } = G; wrapObserve();
    if (S.phase === 'countdown') { COMM.used.clear(); LOG.lines.length = 0; LOG.stretchX = null; COMM.finCalled = false; COMM.marginSaid = false; COMM.shownAt = -99; COMM.farT = -99; return; }
    if (S.phase !== 'race' && S.phase !== 'finishing') return;
    // finish call: names the winner now, then the margin once the runner-up is in
    if (S.phase === 'finishing' && S.order.length) {
      const w = roles[S.order[0]].name;
      if (!COMM.finCalled) { COMM.finCalled = true; say(line('first', w), 5, 3.2); }
      else if (!COMM.marginSaid && S.order.length >= 2 && S.time - COMM.shownAt > 1.2) { COMM.marginSaid = true; say(line('margin'), 6, 3.4); }
    }
    S.cmT = (S.cmT || 0) - dt; if (S.cmT > 0) return; S.cmT = 0.3;
    const xs = horses.map((h) => h.pos().x), lead = xs.indexOf(Math.max(...xs)), hum = roles.findIndex((r) => r.human >= 0), L = Math.max(...xs);
    if (S.phase === 'race' && S.raceT > 2 && lead !== COMM.lastLead) { if (COMM.lastLead >= 0 && S.time - COMM.leadT > 4 && Math.abs(xs[lead] - xs[COMM.lastLead]) > 0.5) { G.say(line('lead', roles[lead].name), 2, 3.2); COMM.leadT = S.time; } COMM.lastLead = lead; }
    if (S.phase === 'race' && L > FINISH_X - 14 && !S.stretchSaid) { S.stretchSaid = true; G.say(line('stretch'), 4, 3.5); }
    if (S.phase === 'race' && hum >= 0 && L - xs[hum] > 22 && S.time - (COMM.farT || -99) > 14) { COMM.farT = S.time; G.say(line('far', roles[hum].name), 2, 3.2); }
    if (S.phase === 'race' && S.time > COMM.until + 0.5 && S.time - (COMM.fillT || 0) > 6) { COMM.fillT = S.time; G.say(line('fill'), 1, 3.5); }
  }

  // evidence for tests: window.__game.observe() gains a `comm` block
  let wrapped = false;
  function wrapObserve() {
    const gm = window.__game; if (wrapped || !gm || !gm.observe) return; wrapped = true;
    const ob = gm.observe;
    gm.observe = () => {
      const L = LOG.lines, texts = L.map((l) => l.text), prio = (l) => l.pri >= 3;
      const first = L.find((l) => /across the line|hits the wire|crosses the line|flag falls/.test(l.text));
      const win = S.order && S.order.length ? G.roles[S.order[0]].name : null, wn = win && dn(win);
      return { ...ob(), comm: { n: L.length, distinct: new Set(texts).size, repeats: texts.length - new Set(texts).size, fastOverwrites: L.filter((l, i) => i && !prio(l) && l.age < 1.5).length, stretchX: LOG.stretchX, finishCall: first ? first.text : null, finishNamesWinner: !!(first && wn && first.text.includes(wn)), marginCall: (L.find((l) => l.pri === 6) || {}).text || null, lines: L.map((l) => l.raceT + ' ' + l.text) } };
    };
  }

  return { ANNOUNCERS, LINES, wrapObserve, COMM, GV, gram, dn, say, crng, line, COMMENT, pick, commentOnPlant, directorCommentary };
}
