The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 53

The z-fight on `merged` is already in my verdict, under Faults and Next item 3. Nothing in the verdict changes, and I haven't edited the page, since I only judge it.

SCORE: 7.7

## Iteration 54
**Did**
- No code changed. Investigated `hills` "Never visible".
**Saw**
- `look` at race start (intro card up): brightness 52%, orange 44% / yellow 38% / grey 11%, no console errors, overlay all in place. Hid `hills` with eval (`scene.getObjectByName('hills').visible=false`) and `look` reported "0% of the picture changed": `hills` contribute no pixels from the start camera at all. The grandstand, its backdrop and the fogged sky (fog 0xb4c6c4, 20..130) cover where they would be.
- No perf run; draw calls last seen 266.
**Next**
- To make `hills` show: raise the side-camera pitch a little or move `hills` nearer/higher (y scale 34 → ~60, position z -55 → -20) so a ridge shows above the grandstand roof at the far right; check with the hide/`look` diff trick.
- Draw calls (merge `merged-outline`, `mesh-outline`, `tail`), 2-player mode, head-on cut still unseen.
**Open**
- Human (non-auto) finish still not run.
