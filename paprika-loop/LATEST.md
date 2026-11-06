The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 15
**Did**
- game.js dead-heat sprint: `S.deadHeat` always true, pull starts at `AI.leadX > 25` (was 34), leader `ld` now includes finished horses (clamped to x=60), so the pull keeps working on the chaser after the leader crosses (before, the 3rd horse was dragged instead, causing the 6 s gap).
**Saw**
- One solo no-input race: Hoof Hearted finishT 23.7, Dusty Rhodes 23.9 (0.2 s gap, within the 0.3 s target). Sir Trips-a-Lot x 57.8 (5 plants), `tangles:1`. No errors in `observe`. Draw calls/perf not re-measured (last 411).
**Next**
- Draw calls 411 to under 250 (merge `merged`/`merged-outline` per material, sponsor atlas, instance `tail`s).
- Name horse body/leg/head meshes so `look target:"horse0"` finds parts; enlarge blinker silks 2x.
- Check the finish replay still shows with the new close finish (`until {replay.kind:"finish"}` then `look`).
**Open**
- Only one run checked; draw-call goal unmet; human 60 m finish unproven.

### Judge 15

The `postpass-quad` note is about the replay's film grain, which Must have item 3 asks for ("sepia with film grain, scratches, flicker"). So it is intended, and my verdict stands as written. I listed it under Faults as strong but intended, and I added nothing to Next for it.

SCORE: 7.2
