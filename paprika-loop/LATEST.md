The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 28

**Verdict, session 28**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** I played Q+P / W+O in 10-frame beats and `YOU` reached x 9.55 at raceT 2.5 s and x 28 at 7.5 s, leading all three AI. That is about 3.7 m/s, so 60 m is reachable in roughly 17 s. The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips`, `div#keys` and `div#chips` all show. I did not test R or 2P. My own rhythm gaps gave `YOU` 2 plants and it stalled at x 47.9 (`legs "0000"`), so the 60 m finish was not reached.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `state:"down"` and the `plants` counters work, and the `horse0-body` and `horse0-head` parts are jointed. I did not watch auto-right.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.** The `finish` replay (`rate` 0.25, `of` 1198) opens with `finish-line`, `horse3-body` and `horse0-body` in frame, so last session's empty-track fault is fixed. The `plant` replay follows `YOU` and does not show the tangle. Space skipped the plant replay in one frame.
4. **Photo finish and tangled AI collapse: 7.** `tangles` is 1 at raceT 9.9 and Sir Trips-a-Lot (x 17.8, z −0.84) and Hoof Hearted (x 16.2, z −1.18) are now close. The plant replay never shows them, though. This run's finish was Dusty Rhodes 17.38 s against Sir Trips-a-Lot 20.42 s, so it was a clear win and not a photo finish.
5. **Results with most face-plants award: 8.** `results` is ordered Dusty, Sir Trips-a-Lot, Hoof Hearted, YOU, and the `div#chips` counters show FACE-PLANTS. I did not open the results screen this session.
6. **Looks as LOOK.md says: 8.** The finish look reads as refs/01.jpg: `grandstand` with a blocky crowd, white rail, `finish-line` checker, hills, sunny sky. The `Subject: player-body` line now resolves and shows on screen in the mid-race look. There is no `Lighting:` or `Surfaces:` fault. In the plant replay the subject is brightness 50% against 38% around it.
7. **window.__game convention, index.html at root: 9.** `observe` gives `phase`, `raceT`, `replay`, `results`, `horses` and `tangles`.
8. **Clip moments in the first minute: 7.** The pile-up fires at about 9 s and the finish replay at about 23.9 s. The pile-up is only seen in the live race behind a pop-up and not in the replay.
9. **Controls feel learnable: 8.** The rhythm is learnable and fast. Mistimed beats gave plants (`YOU` plants 2) and a stall, which is what the brief wants. A full 60 m finish by `YOU` was not confirmed.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, saddle cloth, white socks and dark hooves show on a dirt track with a rail and a covered grandstand.
11. **Juice: 8.** Thud, gasp, boing and cheer fired, along with `div#flash`, the FACE-PLANT and WINNER pop-ups and the REPLAY banner. Shake was not measured with `feel`.
12. **Local 2-player discoverable from the HUD: 7.** The `2 PLAYERS (2)` button and "2 = two players" in `div#tips` show. 2P was not run.
13. **Static page, vendored lib, no network: 9.** 384 draw calls, 33.6k triangles and 0 MB of assets. The 66 ms frame is SwiftShader, so it is not a fault.

**Faults: 8.** The only console line is the PCFSoftShadowMap warning. `Never visible` is `sky` during the race and none at the finish. The `WINNER!` pop-up sits faintly over the finish-replay horses.

**Next:**
1. **Show the pile-up in the replay.** The plant replay at 0.25x follows `YOU` and the tangled AI horses are off screen. When the `plant` replay is triggered by an AI tangle, aim `camLook` at the midpoint of the two downed horses. Check with `interact until {phase:"replay"}` and `look`, which should list two `horse*-body` groups overlapping near the middle of the frame.
2. **Keep the player in frame during the pile-up and tune the finish.** `YOU` sits at the left edge, cut off (`player-body` [0,348,154,469]) in the live pile-up view. Shift the camera framing so both the AI pile-up and `YOU` fit. Also check that a good rhythm gives a close finish and not a 3 s gap (Dusty 17.38 s against Sir Trips-a-Lot 20.42 s). A narrow margin makes the photo-finish moment more likely, and a `look` at `phase:"replay"` should show the winners' noses level on `finish-line`.
3. **Auto-right and the 2P and R paths, beyond the brief.** Play a keys-held `interact` where `YOU` goes `state:"down"` and show `state:"run"` again after ~2 s. Also run a 2P session (`Digit2`, then Q W E R and U I O P) and the Enter and R restarts. Then add a visible stumble recovery (a `dust` burst or squash) when the horse auto-rights.

SCORE: 8.0

## Iteration 29
**Did** game.js: tangle sets `S.pair=[first,other]` and forces a pending plant replay (`S.pending`) if none; `startPlantReplay` stores `rp.pair` and `snap:true` (camera snaps to target on the first replay frame); plant-replay camera aims at the midpoint of the pair, distance 6.5+0.5·dx. Follow camera lead offset cap 6→4.5 so YOU stays further in frame.
**Saw** `interact until phase replay` (raceT 9.9, kind plant): `look` lists horse3-body, horse0-body, horse1-* in frame, two horses large in the middle with the grandstand; the white rail crosses the foreground. Only the PCFSoftShadowMap warning. Not run: finish tuning, 2P, R, auto-right, perf.
**Next** (1) Replay camera sits on the rail side at z 6+; raise y or pull the camera inside the fence so the rail doesn't cover the horses. (2) Full rhythm race: check margin vs Dusty (photo finish). (3) Auto-right dust burst and a 2P/R test.
**Open** Replay opens just before the tangle (horses still running); the collapse comes later in the 0.25x clip. YOU is not in the pile-up view of the live race beyond the 4.5 cap — unverified.
