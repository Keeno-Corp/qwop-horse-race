The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

## Iteration 53
**Did**
- view.js line 407: grandstand `roofY` rows*0.7+3.4 → +2.5, so sky shows above the roof.
**Saw**
- Played a whole race with `setState({auto:true})` + Enter: plant replay ("INSTANT REPLAY · 0.25x", "SPACE to skip") appears; Space returns to the race (mid-race replay, correct); then `finishing` → replay → `results` at raceT 25.15: "Hoof Hearted WINS! PHOTO FINISH · 0.13s", podium, face-plants award ("Dirt Eater · most face-plants") all render, no overlap.
- After the roof change the sky gradient shows above the grandstand; `look` still lists `hills` as Never visible (560 units, "in view"), so they are probably hidden by the sky/backdrop or fog, not the roof. No z-fight warning seen. No perf run.
**Next**
- Find why `hills` has no pixels (fog/depth/behind a backdrop plane); draw calls still 266 (merge outlines, instance `tail`, thin `crowd`).
- 2-player mode and head-on cut still unseen.
**Open**
- Human (non-auto) finish not run this session; `interact` steps for it are long, `auto` is the cheap route.

### Judge 53

The z-fight on `merged` is already in my verdict, under Faults and Next item 3. Nothing in the verdict changes, and I haven't edited the page, since I only judge it.

SCORE: 7.7
