# game.js split (no behaviour change)

## New layout
| file | lines | owner | contents |
|---|---|---|---|
| game.js | 378 (was 675) | core / team b | imports, RAPIER init, renderer/scene/lights, env, physics world + horses, LANES/STAGGER/NAMES_AI/KEYS/LEGNAME, AI, assignRoles, dust, state `S`, shared context `G`, resetRace, onPlant (race half), physStep, footDust, frontOrder, updateRace, frame/tick, syncViews, resize, start, `window.__game` |
| controls.js | 75 | team b | normKey, act, setMode, key/blur listeners, #b1/#b2/#br, `buildControlsHud` (keys panel, b1/b2 `on`, tips), `updateControlsHud` ("YOU n m" indicators, key-cap `dn`), 3D markers + `updateMarkers`, owns `held` |
| replay.js | 78 | team a | ring buffer (record/applyFrame/subjectAt), setReplayUi, startFinishReplay, startPlantReplay, endReplay, `advanceReplay` (replay branch of tick), `blendReplayShader` (uReplay/uGlitch lines), live `ringN` getter/setter |
| camera.js | 74 | team a | camPos/camLook/tp/tl, followTarget, CUT, cutTo, updateCamera |
| replay.css | 21 | team a | the `/* replay */` CSS block; index.html now has `</style><link rel="stylesheet" href="./replay.css"><style>` at the same spot, so the cascade is unchanged |
| broadcast.js | unchanged | team a | |
| commentary.js | 58 | team c | ANNOUNCERS, LINES, COMM, GV, gram, say, crng, line, COMMENT, pick, `commentOnPlant(h, kind)`, directorCommentary |
| hud.js | 89 | team c | buildHud (tote rows, progress markers, S.odds), updateHud (chips, progress, timer/clock, flash), updateOdds, clockText, popup, `updatePopups`, showResults |
| audio.js | 21 | team c | the `sfx.define`s, `cue(name, ...args)` (plant, rise, countdown, go, finish, tangle, replayFinish; same sounds/volumes/delays), empty `updateAudio(dt)` called last in each tick |

## Pattern
game.js builds one `G` (THREE, S, horses, roles, views, env, bc, camera, scene, sun, KEYS, LEGNAME, FINISH_X, DT, rng, rr, clamp, `$`, hexs, live `mode` getter/setter, resetRace, frontOrder) and merges each factory's result into it with `Object.defineProperties(G, Object.getOwnPropertyDescriptors(...))`. This is used instead of `Object.assign` so live accessors (replay's `ringN`) stay live. Modules call each other only through `G.*` at call time. Order inside `tick()` and every RNG call order are unchanged. The only reorder is that `updateControlsHud` runs just after `updateHud`, so the flash update now runs before the indicators/key-caps. Those are independent DOM writes.

## Evidence (baseline = original code, after = split code)
Method: `open` of index.html on the paused seeded clock. Baseline pictures are in `paprika3d/split-baseline/pics/`, split pictures in `paprika3d/split-after/pics/`. Baseline JSONs are in `paprika3d/split-baseline/`, split JSONs in `paprika3d/split-after/`. Both folders are git-ignored. A–E were run as `interact` + `look` calls. F–H were driven by an `eval` that dispatches real `KeyboardEvent`s on the page's own keydown/keyup listeners, one rAF at a time, with the same script on the original code (a `git worktree` of HEAD, later removed) and on the split code.

| pt | what | result | numbers (identical in both) |
|---|---|---|---|
| A | solo, countdown title card | MATCHED (JSON byte-identical, picture byte-identical `pics/1.png`) | phase countdown, countdown 3.93, cam p [-5.41,3.43,16.85], YOU x 2.08 |
| B | solo, no input, raceT 10 | MATCHED (JSON + picture byte-identical `pics/2.png`) | raceT 10, horses x 16.12 / 15.49 / 2.03 / 21.33, tangles 1, plants 1/1/0/0, lower-third "Look at that stride!" |
| C | first instant replay (plant) | MATCHED (JSON + picture byte-identical `pics/3.png`) | phase replay, kind plant pos 1081 of 1156, raceT 19.3, Hoof Hearted x 26.91 pitch 3.12 plants 4 |
| D | finish replay midway (sepia + PHOTO FINISH) | MATCHED (JSON + picture byte-identical `pics/4.png`) | kind finish pos 1387 (t 32 of 1419), cam look [59.26,1,0], fov 32.02, results [Sir Trips-a-Lot, Dusty Rhodes, Hoof Hearted, YOU], finishT 23.01 / 23.2 |
| E | Space, results card | MATCHED (JSON + picture byte-identical `pics/5.png`) | phase results, cam p [56.75,2.3,13.59], horses x 60.3 / 57.2 / 2.02 / 60.23 |
| F | R, then Q+P / W+O alternating every 21 frames (0.35 s) for 57 half-cycles (about 20 s), real key events | MATCHED (JSON byte-identical: `split-*/F.json`) | phase replay (plant), raceT 9.45, replay pos 503.75, horses x 22.86 / 23.44 / 24.17 / 23.8, YOU y 1.52 pitch -0.07 plants 1, cam look [21.73,1,-0.03] |
| G | Digit2, hold Q and U for 2 s, raceT 5 | MATCHED (JSON byte-identical `G.json`) | mode 2, phase race, raceT 5, horses x 4.19 / 2.5 / 5.29 / 6.25, P1 y 0.68 pitch -0.64, plants 1/1/1/1 |
| H | 2P, finish replay, Space, Enter | MATCHED (JSON byte-identical `H.json`) | phase before Enter: results; after Enter: phase countdown, mode 2, countdown 4.57 |

Caveats:
- My first F, G and H runs were typed as long `interact` key lists by hand. The two copies of those lists were not identical and chaotic physics amplified the difference. I discarded that comparison and redid F–H with the single `eval` script above, which is exactly the same text on both builds.
- `pics/H.png` (a plain look after H) differs from the baseline in the PNG header, but the two screenshots look the same and report identical hue and brightness stats.
- Console: no errors on any run (observe `errors: []`); the page loads every module with no `Failed to load:` lines. After the first reload I had a `CUT is not defined` error from a dropped destructure line. I fixed it and all evidence above is from the fixed build.
