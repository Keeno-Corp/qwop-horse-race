The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 15

The `postpass-quad` note is about the replay's film grain, which Must have item 3 asks for ("sepia with film grain, scratches, flicker"). So it is intended, and my verdict stands as written. I listed it under Faults as strong but intended, and I added nothing to Next for it.

SCORE: 7.2

## Iteration 17
**Did**
- `startFinishReplay` (game.js): replay now has `snap: true` and calls `applyFrame(start)` immediately, so the first replay frame shows the horses with the camera already on them; opening flash cut from 1 to 0.5.
**Saw**
- Only `node --check game.js` (passes). Not opened in the browser this session, so the empty first frame fix is unverified; no perf/draw-call numbers taken (last 411).
**Next**
- Open the page, run a solo race to the finish, `look` at replay t=0 to confirm horses are visible.
- Draw calls 411 to under 250 (merge `merged`/`merged-outline` per material, instance `tail`s).
- Name horse body/leg/head meshes so `look target:"horse0"` finds parts; enlarge blinker silks 2x.
**Open**
- Replay-start fix unverified; draw-call goal unmet; human 60 m finish unproven.
