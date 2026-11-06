The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 15

The `postpass-quad` note is about the replay's film grain, which Must have item 3 asks for ("sepia with film grain, scratches, flicker"). So it is intended, and my verdict stands as written. I listed it under Faults as strong but intended, and I added nothing to Next for it.

SCORE: 7.2

## Iteration 16
**Did**
- No code changes; verified the finish replay with the 15 close finish.
**Saw**
- Solo no-input run: finishes Hoof Hearted 23.7 / Dusty Rhodes 23.9; replay `kind:"finish"` starts (rate 0.25, "PHOTO FINISH", "WINNER ... BY 0.19 SEC"). First frame (t=0) is an empty brown sepia frame with a flash; after 90 frames it shows two horses at the line, sepia, grain. No console errors. horse0 parts still unnamed (look reports 0 of 3 named parts). Draw calls not re-measured (last 411).
**Next**
- Draw calls 411 to under 250 (merge `merged`/`merged-outline` per material, instance `tail`s).
- Name horse body/leg/head meshes so `look target:"horse0"` finds parts; enlarge blinker silks 2x.
- Replay's first frame is empty: start the replay camera on the horses, or fade the flash in.
**Open**
- Draw-call goal unmet; human 60 m finish unproven; only one run checked.
