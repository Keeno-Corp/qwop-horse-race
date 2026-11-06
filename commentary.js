// Presentation team (c): the play-by-play lower-third and the commentary half of a face-plant.
export function createCommentary(G) {
  const { S, $, rng } = G;
  const ANNOUNCERS = ['WALT DUNMORE', 'HANK "HOOFBEAT" PRUITT'];
  const LINES = {
    off: ["AND THEY'RE OFF! Four riderless thoroughbreds and absolutely no plan.", "AND THEY'RE OFF, folks! Hold onto your hats and your lunch."],
    lead: ['{n} takes the lead! Well, takes a lead. It is not a good one.', '{n} moves to the front! Legs flailing, spirits high!', 'And it is {n} out in front now!'],
    fill: ['The dust is flying out there at the Fiasco Stakes.', 'Nobody has told these horses how legs work.', 'What a crowd today at the track, over six dozen!', 'Look at that stride! I use the word loosely.', 'Sponsored by Ranch-O Cola, the taste of victory.'],
    far: ['{n} is miles back. Somebody send a search party.', '{n} is out of the picture, folks.'],
    stretch: ["Into the stretch! It's going to be close!", 'Down to the wire, folks, down to the wire!'],
    win: ['{n} wins it! What a finish!', "That's the ballgame! {n} takes the Fiasco Stakes!"],
    tangle: ['OH NO! A tangle of legs at the {m} mark! Nobody knows whose hoof is whose!', 'A pile-up! {n} and company have become a single large horse!'],
    tied: ['This one is going to the photographers... too close to call!'],
  };
  const COMM = { q: [], cur: 0, until: 0, lastLead: -1, leadT: -99, fillAt: 6, last: '' };
  const GV = { takes: 'take', wins: 'win', moves: 'move', eats: 'eat', kisses: 'kiss', does: 'do', flips: 'flip', goes: 'go', thinks: 'think', sits: 'sit', has: 'have', is: 'are' };
  const gram = (t) => t.replace(/\bYOU (takes|wins|moves|eats|kisses|does|flips|goes|thinks|sits|has|is)\b/gi, (m, v) => { const g = GV[v.toLowerCase()]; return 'YOU ' + (v === v.toUpperCase() ? g.toUpperCase() : g); });
  function say(text, pri = 1, hold = 3.6) {
    if (!text) return;
    if (S.time < COMM.until && pri <= COMM.pri) return;
    COMM.pri = pri; COMM.until = S.time + hold;
    text = gram(text); const el = $('ltxt'); if (el.textContent === text) return; el.textContent = text; COMM.last = text;
    const lo = $('lower'); lo.classList.remove('flash'); void lo.offsetWidth; lo.classList.add('flash');
    $('cname').textContent = ANNOUNCERS[(COMM.cur++) % 2];
  }
  let cseed = 4242; const crng = () => { cseed = (cseed * 1664525 + 1013904223) >>> 0; return cseed / 4294967296; };
  const line = (k, n = '', m = '') => LINES[k][Math.floor(crng() * LINES[k].length)].replace('{n}', n).replace('{m}', m);

  const COMMENT = {
    'FACE-PLANT!': ['{n} eats dirt!', '{n} kisses the track!', 'Nose-first for {n}!', '{n} lost control of that face'],
    'CARTWHEEL!': ['{n} is doing gymnastics!', '10/10 from the judges, {n}!'],
    'DOG SIT!': ['{n} is sitting like a dog!', '{n} thinks this is a picnic'],
    'SPLITS!': ['{n} does the splits!', 'Ouch! {n} is not a gymnast'],
    'BACKFLIP!': ['{n} flips over backwards!', 'Look at {n} go! Upside down!'],
  };
  const pick = (a) => a[Math.floor(rng() * a.length)];

  // the popup + play-by-play half of a plant (game.js onPlant calls this first)
  function commentOnPlant(h, kind) {
    const r = G.roles[h.idx];
    const sub = (COMMENT[kind] ? pick(COMMENT[kind]) : '{n}').replace('{n}', r.name === 'YOU' ? 'YOU' : r.name);
    if (r.human >= 0 || S.popups.length < 1) G.popup(kind, sub, G.hexs(r.color));
    say(kind === 'FACE-PLANT!' ? `${r.name === 'YOU' ? 'YOU' : r.name} eats dirt! ` + pick(['Face-first into the track!', 'That one is going to hurt in the morning.', 'And the crowd gasps!']) : sub, 3, 3.2);
  }

  function directorCommentary(dt) {
    const { horses, roles, FINISH_X } = G;
    if (S.phase !== 'race' && S.phase !== 'finishing') return;
    S.cmT = (S.cmT || 0) - dt; if (S.cmT > 0) return; S.cmT = 0.3;
    const xs = horses.map((h) => h.pos().x), lead = xs.indexOf(Math.max(...xs)), hum = roles.findIndex((r) => r.human >= 0), L = Math.max(...xs);
    if (S.phase === 'race' && S.raceT > 2 && lead !== COMM.lastLead) { if (COMM.lastLead >= 0 && S.time - COMM.leadT > 4 && Math.abs(xs[lead] - xs[COMM.lastLead]) > 0.5) { G.say(line('lead', roles[lead].name), 2, 3.2); COMM.leadT = S.time; } COMM.lastLead = lead; }
    if (S.phase === 'race' && L > FINISH_X - 14 && !S.stretchSaid) { S.stretchSaid = true; G.say(line('stretch'), 3, 3.5); }
    if (S.phase === 'race' && hum >= 0 && L - xs[hum] > 22 && S.time - (COMM.farT || -99) > 14) { COMM.farT = S.time; G.say(line('far', roles[hum].name === 'YOU' ? 'YOU' : roles[hum].name), 2, 3.2); }
    if (S.time > COMM.until + 0.5 && S.time - (COMM.fillT || 0) > 6) { COMM.fillT = S.time; G.say(line('fill'), 1, 3.5); }
  }

  return { ANNOUNCERS, LINES, COMM, GV, gram, say, crng, line, COMMENT, pick, commentOnPlant, directorCommentary };
}
