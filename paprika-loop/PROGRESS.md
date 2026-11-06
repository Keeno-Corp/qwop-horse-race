# Progress

The request is in PROMPT.md. Each session of the loop appends one section here: a builder's `## Iteration n` (Did, Saw, Next, Open) and the judge's `### Judge n` (its scores, Next). LATEST.md holds the last of each, rewritten by the loop after every session; the next builder reads the latest Judge's Next there first.

## Iteration 1
**Did** The page already existed (game.js, view.js, physics.js, fx.js). Shrank `.pop` font (clamp 30px–70px), limited `S.popups` to 1 stacked popup in `popup()`, and widened the follow camera (`followTarget`: leader weight 0.3, dist grows up to +10) so the player's horse stays framed when AI runs ahead.
**Saw** Opening look: sky/hills/grandstand/four coloured horses as LOOK Checks; subject 0.29% of frame (small). With no input the AI pile-up and face-plants happen by 6.8 s; results at 38 s with winner Sir Trips-a-Lot. Popups no longer overlap. Never visible: dust at start (spawns only on hoofbeats). No perf run.
**Next** (1) Opening camera: move closer so horses fill more frame (subject <1%). (2) Results fire ~1.5 s after the winner while others are DNF 2 m short; let them finish and trigger a photo-finish replay (none seen in the unattended run; AI tuning so two horses finish within ~0.1 s). (3) With no input the player horse stays frozen, so the camera lingers on an empty horse; consider keeping the camera on the leader pack until the player moves.
**Open** Did not play with keys or test 2-player this session; PCFSoftShadowMap warning in console (harmless).

### Judge 1

**1. Plays as DESIGN.md's Core loop and Controls say: 7.**
- Solo Q W O P and the `#keys` HUD work. A 12-frame rhythm (Q, P, W, O, repeated) moved `horses.2.x` from 1.42 to 3.96 in 2.4 s, with `pitch` between -0.08 and 0.06.
- I did not test R restart, the 2-player mode or the 60 m finish time.
- Progress is slow next to the AI, which is at x≈7–9 m by 4.2 s.

**2. Real Rapier jointed ragdoll horses, face-plant and auto-right: 6.**
- The legs are visibly jointed, and `legs` bits like "0110" track the keys.
- All `plants` were 0 in the first 4 s, so I did not see a collapse or an auto-right.
- The previous session logged a pile-up by 6.8 s.

**3. Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 4.**
- I did not see one. The last session's unattended run showed results at 38 s with no replay.

**4. Photo finish and tangled AI collapse within the first minute: 4.**
- The tangle was seen last session at 6.8 s.
- The photo finish is still absent. The last session found the AI finishers 2 m apart and results firing about 1.5 s after the winner.

**5. Results with most face-plants award: 5.**
- The results fired last session, but I did not check the award this time.

**6. Looks as LOOK.md says: 8.**
- Check 1 (sky at top-centre near #7bbaff): fail. The sample at (640, 40) was #c9dbe9, a pale haze, not within ±30 of #7bbaff.
- Check 2 (four horses with distinct cloth colours, dirt filling the lower half): pass. Red, green, blue and yellow `horse*` and `player` cloths are distinct, and the dirt `track` fills the lower half.
- Check 3 (HUD readable, popups centred): pass. The `#chips`, `#tips` and `#keys` text is readable, with no overlap.
- Check 4 (no `Lighting:` fault line): pass.
- The picture reads as bright low-poly, with a grandstand full of blocky crowd, rails and hills.
- The opening camera is weak: the subject is 0.29% of the frame, with all four horses clumped behind the start line.
- The chase-camera frames at 1.8 s and 4.2 s read much better.

**7. window.__game convention, index.html at root, static deploy: 9.**
- `observe` returns the state JSON, and `__game` keys and metadata are present.

**8. Clip moments in the first minute with no input: 6.**
- The AI collapse is reported by the last session, and I did not re-verify it.
- The photo finish with a slow-motion replay has not been seen, so this is missing half of the item.
- It will not make a stranger laugh in the first 10 s: I saw only a clean gallop at 4 s.

**9. Controls feel learnable: 6.**
- The tip "Q+P then W+O works" is shown, and the player does move.
- The player is clearly slower than the AI (about 4 m against 7–9 m at 4.2 s), so a 60 s finish is unproven.

**10. Horses read as horses, match refs/01.jpg: 8.**
- The horses have head, neck, mane, tail, white socks and dark hooves.
- The stands are covered and wooden, with a crowd.
- The rails, dirt dust and hills are present.
- I did not see the clouds.

**11. Juice: 6.**
- Sound events fire (blip, powerup, cheer) and the dust particles show.
- I did not see popups or camera shake, and I did not run `feel`.

**12. Local 2-player, discoverable from the HUD: 6.**
- The `2 PLAYERS (2)` button is visible.
- I did not play it.

**13. Static page at root, vendored lib, no network: 9.**
- `0 MB assets`, and the page loaded in 0.1 s.

**Faults: 7.**
- No console errors, and `Never visible` is only dust, at frame 0.
- `perf` is 110 ms a frame at 383 draw calls on a software renderer, so the time is not a budget signal.
- The draw calls are still worth cutting with instancing, because the crowd is made of many separate meshes.
- Last session's PCFSoftShadowMap warning was not rechecked.

**Next:**
1. **Photo finish and replay (asked again).** Make the AI finish so two horses cross within about 0.1 s. Keep the race running until the others reach x=60 instead of firing results about 1.5 s after the winner. Then trigger the 0.25x side replay with the REPLAY banner. One `interact` with `until: {phase: "replay"}` and `look` should show the banner and the photo-finish camera.
2. **Opening camera and sky (asked again, opening camera).** Start with a tighter camera, so that the four horses are about 3% or more of the frame. Fix sky check 1 by making the sky gradient reach #7bbaff at the zenith, or lower the fog or haze. `look` with `sample` at (640, 40) should read near #7bbaff.
3. **Make the player competitive and the clip moments fast.** Tune the leg motors, or give the AI more variance, so a Q P W O rhythm tracks the AI. Then check that a face-plant shows within about 6 s unattended. Use `feel` on the face-plant for the shake, popup and gasp. Then run a 2-player `interact` with Q W E R and U I O P.

SCORE: 6.5

## Iteration 2
**Did** Finish: `updateSim` finishing wait raised from 1.5 s to 4 s after the first finisher, so the 0.25x finish replay waits for a 2nd horse. AI gets a catch-up factor past x=45 (`AI.update`). Opening camera in `updateCamera` countdown branch is closer (start (-4,3.4,10.5), look (1.5,1.2,0)). Sky dome in view.js: top 0x72b4ff, horizon 0xa8d4ff, gradient exponent 0.12 so the top of the frame is near #7bbaff.
**Saw** Unattended: plant replay (REPLAY banner, orbit cam) fired at raceT 7.05 after a tangle; the finish replay then fired at 37.9 s with the winner 0.58 s ahead of the 2nd (finish replay reached, gap not ~0.1 s). Player horse with no input stays frozen at x≈2 (subject 1.2% in the replay camera). No console errors. I did not re-sample the sky at (640,40), did not look at the opening frame or play keys/2P, and did not run perf or feel.
**Next** (1) `look` opening and `sample` (640,40) to confirm the sky and camera. (2) Make the player competitive (leg motors) and test Q P W O plus 2P. (3) Tighten the photo finish to ~0.1 s (stronger end-pack rubber banding); cut crowd draw calls with instancing.
**Open** Sky and opening camera changes are unverified visually; the finish gap is still 0.58 s.

### Judge 2

**Judge 2 verdict**

**1. Plays as DESIGN.md's Core loop and Controls say: 6.**
- A Q P W O rhythm of 6 frames per key moved `horses.2` ("YOU") only to x=1.95 by raceT 2.62, while Dusty Rhodes was at 5.93 and the other two AI at 3.7–3.9. The player is still far slower than the AI.
- A later run to the replay ended with YOU at x=3.42 and AI at 44–46, so a 60 s finish is not plausible.
- The `#keys` HUD lights O for the held key and `legs` tracks the keys.
- I did not test R restart or the 60 m finish.

**2. Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
- By raceT 25 the AI showed `state: "down"` with `plants` 1 and 3, and `tangles: 1`.
- The thud, gasp and boing sounds fire.
- I did not see an auto-right or measure the ~2 s timing.
- The player's `pitch` stays around -0.06, so it never plants unless it spins.

**3. Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
- `phase: "replay"` with `kind: "plant"` shows the REPLAY banner and "SPACE to skip".
- The replay camera is a fixed side shot of the grandstand that shows only the player horse at the left edge, at 0.44% of the frame.
- The planted AI horses at x≈44–46 are not in frame. This is a framing bug (the camera follows the player, not the horses that fell).
- I did not see the finish replay this session.

**4. Photo finish and tangled AI collapse within the first minute: 5.**
- A tangle (`tangles: 1`) and 3 AI down by 25 s are present.
- The photo finish is still not seen at ~0.1 s. Last session's finish gap was 0.58 s, and I did not re-measure it.

**5. Results with most face-plants award: 5.**
- Not reached or checked this session.

**6. Looks as LOOK.md says: 7.**
- Check 1 (sky near #7bbaff at the top centre) still fails. The sample at (640, 40) is #b6d1ea.
- Check 2 passes: four distinct cloths (red, green, blue, yellow) on `horse0`–`horse3` and `player`, with `track` dirt filling the lower half.
- Check 3 passes: `#chips`, `#tips` and `#keys` are readable with no overlap.
- Check 4 passes: no `Lighting:` line.
- The opening camera is closer, with the four horses in a readable row against the grandstand. Even so, `player` is only 0.8% of the frame, and then 1.7% mid-race.
- The brown horses all look alike, so the saddle cloth is the only way to tell them apart.

**7. window.__game convention, index.html at root, static deploy: 9.**
- `observe` returns the state JSON with keys and metadata.

**8. Clip moments in the first minute with no input: 6.**
- A tangle and plant replay do occur.
- The collapse comes late (the `phase: "replay"` run ended at raceT 25, after ~1350 frames).
- The first 10 s is a clean gallop, so a stranger would not laugh in the first 10 s.
- The photo finish half is still unproven.

**9. Controls feel learnable: 4.**
- The player is the slowest horse by a wide margin. Rhythm input gave about 2 m in 2.6 s, so finishing 60 m in under 60 s looks unlikely.
- The tip is shown, but the leg motors give too little push.

**10. Horses read as horses, match refs/01.jpg: 8.**
- Heads, necks, manes, tails, white socks and dark hooves read well.
- The covered grandstand with blocky crowd, white rails, dust, "10 m" and "20 m" signs and green hills are present.
- I did not see clouds.

**11. Juice: 6.**
- Sounds fire: thud, gasp, boing and cheer.
- Dust particles show and the HUD is clear.
- I did not see commentator popups or camera shake, and I did not run `feel`.

**12. Local 2-player, discoverable from the HUD: 6.**
- The `2 PLAYERS (2)` button is visible, but I did not play it.

**13. Static page at root, vendored lib, no network: 9.**
- `0 MB assets`, and the page loaded in 0.1 s.

**Faults: 7.**
- No console errors, and `Never visible` is none.
- `perf` shows 92 ms a frame at 380 draw calls and 33k triangles on SwiftShader, which is not a budget signal. The 380 draw calls are mostly separate crowd and `horse*` meshes.

**Next:**
1. **Make the player competitive (asked again).**
   - Raise the leg motor strength and forward impulse per leg press, or add AI rubber-banding down to the player's pace. Rhythm Q, P, W, O at 6 frames per key should keep the player within ~2 m of the pack.
   - Check with `interact` running that rhythm for 600 frames, expecting `horses.2.x` > 20 and `horses.2.x` within ~15 m of the AI.
2. **Fix the replay camera and the photo finish (asked again).**
   - For a `kind: "plant"` replay, aim the orbit or side camera at the planted horse (or the tangle) rather than the player.
   - For the finish replay, tighten the gap with a stronger end-pack catch-up, so the top two finish within ~0.1 s.
   - `interact` with `until: {phase: "replay"}` and `look` should show a `down` horse filling >3% of the frame, and `observe` at the finish should show a gap of about 0.1 s between the first two `finishT`.
3. **Sky and horse readability (asked again).**
   - Raise the sky top colour or reduce haze so `look` with `sample` at (640, 40) reads near #7bbaff, since it is #b6d1ea now.
   - Give the horses distinct coat colours (bay, grey, black, chestnut) rather than four identical brown bodies with a saddle cloth.
   - Add the low-poly clouds from refs/01.jpg.
   - Then run `feel` on a face-plant to check the shake and popup.

SCORE: 6.3

## Iteration 3
**Did** `Horse.step` gets a forward `drive` force (physics.js); in `physStep` each new key press adds 0.2 drive for the human horse, decaying 0.7/s, and `driveF` rises up to +180 N when the player trails the AI mean by >4 m. AI end-pack catch-up past x=40 strengthened (`AI.update`, 0.06 per m, ±0.3). Distinct coats via `COATS` in view.js (chestnut, grey, black, red-bay) passed to `buildHorseView`. Sky dome colours now 0x5aa6ff top / 0x70b4ff horizon.
**Saw** Rhythm Q P W O at 6 frames/key: YOU at x=6.34 at raceT 2.87, ahead of the AI (4.3, 4.7, 6.6), so the player now keeps up (may now be too strong). Four coats read clearly with the cloths. Sky at (640,10) is #7ab2ed; (640,40) lands on the grandstand roof, not sky. No console errors beyond the PCFSoftShadowMap warning. Did not run perf, feel, 60 m finish, 2P, or the replay camera.
**Next** (1) Run the rhythm for 3000+ frames: check the player finishes in ~40-60 s and the finish gap is ~0.1 s; tune `driveF` if the player always wins or never plants. (2) Check the plant replay camera with `until {phase:"replay"}`. (3) 2P test; instancing crowd to cut draw calls; clouds visible in frame.
**Open** Player pace over the full 60 m is unverified; the plant-replay framing bug from the judge is untouched.

### Judge 3

**Judge 3 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - The Q P W O rhythm at 6 frames per key took `horses.2` ("YOU") to x=5.16 at raceT 2.17, level with Dusty Rhodes at 5.22 and ahead of the other two AI. The player keeps up now.
   - A second run ended in a plant replay at raceT 6.9 with YOU at x=7.39. The stronger drive makes the player plant too, which suits the mistimed-keys goal.
   - A third run of 10 s of the same rhythm also reached a replay by raceT 6.9. I never saw a 60 m finish, 2-player mode or R restart (the R in the first step may have restarted the race, but it was not checked).

2. **Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
   - By raceT 6.8, `horses.0` and `horses.1` were `state: "down"` with `plants: 1` and `tangles: 1`. The `dust*` particles and the PILE-UP and FACE-PLANT popups show.
   - I did not see an auto-right or time it.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - `phase: "replay"` with `kind: "plant"` shows the REPLAY banner and "SPACE to skip".
   - The camera now follows the horse that planted. The `player` mesh fills 3.9% of the frame and the grandstand is behind it.
   - The AI that planted are small at the right edge: `horse0-*` is 0.24% of the frame. This replay was never framed on a tangle of several horses.
   - I did not see the finish replay.

4. **Photo finish and tangled AI collapse within the first minute: 6.**
   - The tangle is confirmed at raceT 6.8. Two AI are down and the third is partway down (pitch -0.75).
   - I never reached a finish, so the photo-finish gap, the ~0.1 s target, is still unmeasured.

5. **Results with most face-plants award: 4.**
   - Not reached in this session.

6. **Looks as LOOK.md says: 8.**
   - Check 1 (sky near #7bbaff) now passes: (640,10) is #78b0ed. (640,40) is #9ac2ea and sits on the grandstand roof, not sky.
   - The four coats (chestnut, grey, black, red-bay) plus cloths on `horse0`–`horse3` and `player` read clearly.
   - `#chips`, `#tips` and `#keys` don't overlap. There is no `Lighting:` line.
   - There are no clouds in frame. At the start `player` is only 0.8% of the frame.

7. **window.__game convention, index.html at root, static deploy: 9.**
   - `observe` returns the state JSON with keys and metadata. There are no network assets (0 MB).

8. **Clip moments in the first minute with no input: 8.**
   - With no input, FACE-PLANT and PILE-UP popups, dust and a visible tangle appear at 6.8 s. A stranger could laugh within about 10 s.
   - The photo-finish half is still unproven.

9. **Controls feel learnable: 6.**
   - Rhythm input keeps pace and mistimed input plants the horse. A 60 m finish under 60 s was not demonstrated.
   - The player may now be too strong or too fragile. It planted at about 7 m in the longer run.

10. **Horses read as horses, match refs/01.jpg: 8.**
   - Heads, manes, tails, socks, the covered grandstand with crowd, white rails, "10 m" signs and green hills match the reference. Clouds are still missing.

11. **Juice: 7.**
   - Sounds fired (cheer, thud, gasp, powerup) and the commentator popups show.
   - I did not run `feel`, so camera shake is unverified.

12. **Local 2-player, discoverable from the HUD: 6.**
   - The `2 PLAYERS (2)` button is visible. I did not play it.

13. **Static page at root, vendored lib, no network: 9.**
   - `perf` gave 380 draw calls and 33k triangles, with 0 MB assets. A frame takes 95 ms on SwiftShader, which says nothing about a real GPU.

**Faults: 7.**
- There are no console errors. The only console line is a PCFSoftShadowMap warning.
- `Never visible` read "dust (0 units, in view, behind track)" at the first look and "none" once the horses were running.
- The replay look reported `grandstand` box faces sharing a plane (y = 0.00). It is minor.
- The 380 draw calls are mostly crowd and `horse*` meshes.

**Next:**
1. **Prove the full race and the results screen (asked again).**
   - Add a time-based auto-play or a debug action, for example `__game.act`, so one `interact` run drives the player through all 60 m.
   - Tune `driveF` so a steady rhythm finishes in about 40–55 s with a few plants.
   - Check with `interact` `until: {phase: "results"}`. `observe` should show `finishT` on all four horses, a top-two gap of about 0.1 s, and the most-face-plants award on screen in `look`.
2. **Frame the replays on the action.**
   - For a `kind: "plant"` replay, aim the camera at the centroid of the planted horses or the tangle, not the player.
   - For a finish replay, use a side view of the line.
   - `interact` with `until: {phase: "replay"}` and `look` should show at least 2 `down` horses filling more than 3% of the frame.
3. **Add the clouds and a closer opening camera.**
   - Add low-poly clouds in `look`'s view, at sky (640,10) or higher, as in refs/01.jpg.
   - Start the camera closer, so `player` takes more than 3% of the opening frame instead of 0.8%.
   - Then run `feel` on a face-plant to confirm the camera shake, and play 2-player with Q W E R against U I O P to check it.

SCORE: 7.1

## Iteration 4
**Did** game.js: `__game.setState({auto:true, autoPeriod})` makes the human horse run a perfect Q+P / W+O rhythm (`AUTO`, in `physStep`) so one `interact` plays all 60 m. `subjectAt` now returns the centroid of horses within 5 m of the planted one, so plant replays frame the tangle. Replay camera 5.5 m out. `clouds` group (14 icosahedron-blob clouds, drifting, behind the hills at y 34-52). Opening countdown camera closer (z 7.2, y 2.6). `driveF` rebalanced to 30 + catch-up (max 0) minus a lead penalty (8/m beyond 1 m ahead of AI mean).
**Saw** Auto-rhythm full race: finishes at raceT 22.0 s, results screen shows (podium, DIRT EATER / SMOOTH OPERATOR awards, "DNF · 11 m short" for slower AI), 0 plants for the player; AI at 48-56 m at finish. Second-place gap ~ not within 0.1 s (AI too slow; only YOU and sometimes one more finish). Before the tune the player was 49 m at 16 s. Plant replay look: player mesh 1.9% of frame, tangle framing not re-checked after the centroid change. Clouds and the opening camera were not looked at. No console errors beyond the PCFSoftShadowMap warning. perf, feel, 2P not run.
**Next** (1) Speed up the AI (`AI.base` 0.74-0.86 -> ~0.6) and strengthen the rubber band so the AI finish within ~0.1-1 s of the player; check `finishT` on all four and the PHOTO FINISH popup. (2) `look` at the opening frame and at a plant replay to verify the clouds, the closer camera and the centroid framing (>3% for 2 down horses). (3) `feel` on a face-plant (shake), 2P Q W E R vs U I O P test, instancing the crowd to cut the 380 draw calls.
**Open** Race is ~22 s with perfect rhythm, shorter than the 40-60 s target (a human will be slower). DNF AI at the finish; photo-finish still unproven.

### Judge 4

**Judge 4 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - `setState({auto:true})` plays all 60 m. `YOU` finished at `finishT` 20.55 with 0 plants.
   - The Digit2 key switches to `mode: 2`, and `P1` and `P2` appear in `horses`.
   - Countdown was still running (2.48 s) when I pressed Q and U, so I did not see 2-player movement.
   - R restart was not tested.

2. **Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
   - At the finish, `Dusty Rhodes` was `state: "down"` with `plants: 2`, and `Sir Trips-a-Lot` and `Hoof Hearted` had one plant each.
   - Auto-right was not timed.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
   - The finish replay shows the REPLAY banner and "SPACE to skip". It is a side view, and `player` fills 3.1% of the frame, with the finish line visible. It reads well.
   - The plant replay in the sheet shows the AI pack small at the right. `player` is 0.79% and the tangle is not framed. Last session's centroid fix does not show.

4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - `YOU` finished at 20.55 s. At 24.6 s no AI had finished: `Sir Trips-a-Lot` was at x=50.4, `Hoof Hearted` at 48.7 and `Dusty Rhodes` at 53.0.
   - There is no close finish and no ~0.1 s gap. The tangle itself does appear (plants, `down` horses).

5. **Results with most face-plants award: 5.**
   - `results` is populated (YOU, Dusty Rhodes, Sir Trips-a-Lot, Hoof Hearted). The state was still `phase: "replay"`, and the 2400-frame wait for `results` did not complete.
   - The previous session saw the results screen. I did not see it this time.

6. **Looks as LOOK.md says: 8.**
   - The opening sheet shows four coats, the grandstand with blocky crowd, white rails, green hills and `clouds ×11`. It matches refs/01.jpg.
   - `player` is 1.8% of the opening frame, up from 0.8%.
   - The finish replay shows the checkered line and the dust-brown track. `dust` is "Never visible", at 23.7 units behind the player.

7. **window.__game convention, index.html at root, static deploy: 9.**
   - `observe` returns the state JSON. There are 0 MB of assets and no network use.

8. **Clip moments in the first minute with no input: 6.**
   - Plants and a `down` horse show by the finish.
   - There is no photo finish with a slow-motion side replay, and the pack does not tangle visibly in the plant replay framing.

9. **Controls feel learnable: 6.**
   - The perfect rhythm finishes in 20.5 s, which is too fast for a 40–60 s target.
   - A human's pace was not measured. The player is probably too strong, so the AI plant while the player sails ahead.

10. **Horses read as horses, match refs/01.jpg: 8.**
    - Head, mane, tail, socks, blue cloth and the white-ringed eye read clearly in the finish look.

11. **Juice: 7.**
    - 19 sounds fired: cheer, thud, gasp, boing and powerup. The popups and the REPLAY banner show.
    - `feel` was not run, so camera shake is unverified.

12. **Local 2-player, discoverable from the HUD: 6.**
    - The `2 PLAYERS (2)` button is visible and Digit2 works. I did not confirm that the keys move the horses.

13. **Static page at root, vendored lib, no network: 9.**
    - `perf` gave 384 draw calls and 33.8k triangles. Median frame 122 ms on SwiftShader (host load 0.6), which says nothing about a real GPU.

**Faults: 7.**
- The only console line is the PCFSoftShadowMap warning.
- `Never visible`: `dust`.
- The flow does not reach the results screen cleanly. After the finish, the state stays in `phase: "replay"`, and the replay is long (`pos` 1360 of 1471 after 4 s).

**Next:**
1. **Make the AI close the race so a photo finish happens (asked again).**
   - Lower `AI.base` and strengthen the rubber band toward the human, or slow `driveF` for the player, so the auto race ends at 35–45 s with two or more horses within ~0.2 s at the line.
   - Done when `interact` with `until: {phase: "replay"}` shows `finishT` on at least two horses with a gap under 0.3 s, and the PHOTO FINISH popup shows in `look`.
2. **Frame the plant replay on the tangle (asked again).**
   - In `subjectAt`, use the centroid of all `down` horses and keep it within 5 m of the camera.
   - Done when `look` during `kind: "plant"` shows the horses' meshes filling more than 3% of the frame. The sheet's plant moment currently shows `player` at 0.79%.
3. **Verify the finish-to-results flow, 2P and shake.**
   - Run `interact` with `until: {phase: "results"}` after the finish replay and `look` at the most-face-plants award.
   - Play 2P: wait out the countdown, then press Q W E R and U I O P and check that `horses.1.x` and `horses.2.x` advance.
   - Run `feel` on a face-plant to confirm the shake.

SCORE: 6.9

## Iteration 5
**Did** game.js: `AI.base` 0.74-0.86 -> 0.62-0.72; AI rubber band `lead*0.035` -> `lead*0.07` (clamp -0.35..0.5); human lead penalty in `physStep` now starts at 0.3 m ahead of AI mean, 14/m (was 1 m, 8/m).
**Saw** Auto race twice: flow reaches `phase: "results"` cleanly (replay -> results works, raceT ~24.7). Player `finishT` 20.7-20.75 both times; no AI finished by the results screen (best AI x 52 m / 58 m, one run Dusty Rhodes finished at 24.73 = 4 s gap). The tuning did not give a photo finish: AI plant 1-2 times each, which costs more than base speed gains. Player is already at driveF 0 when ahead, so the penalty can't slow it further. Plant-replay framing, 2P, feel, perf not checked.
**Next** (1) Slow the auto player itself (e.g. scale leg torque/`AUTO.period` or have `S.auto` skip rhythm cycles) or cut AI plant frequency (`next` 4-8 s, in `AI.update`) so 2+ AIs finish near the player. (2) `look` during a plant replay to verify tangle framing. (3) 2P Q W E R / U I O P after countdown; `feel` for shake.
**Open** Photo finish still unproven; race ~21 s with perfect rhythm.

### Judge 5

**Judge 5 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - Auto mode (`auto: true`) plays all 60 m, and `YOU` finishes at `finishT` 20.7.
   - Digit2 gives `mode: 2` with `P1` and `P2`. After the countdown, holding Q and U moved `horses.0.x` and `horses.1.x`, so 2P input works.
   - The R restart key was not tested.

2. **Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
   - Horses reach `state: "down"` with `plants` counts. `Sir Trips-a-Lot` was `down` with 2 plants at the finish, and `P1` plants early in 2P.
   - Auto-right timing was not measured.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
   - The finish replay shows the REPLAY banner and "SPACE to skip", with a side view of the finish line.
   - `until: {phase:"results"}` still did not complete in 2400 frames. The state was stuck at `replay.pos` 1367 of 1480. The replay is too long, or too slow to get through.
   - The plant moment sheet is `player` 1.9%, a close shot of one downed horse. The AI pack is not framed.

4. **Photo finish and tangled AI collapse within the first minute: 3.**
   - At raceT 24.7, `YOU` had finished at 20.7. `Hoof Hearted` was at x=52.4, `Dusty Rhodes` at 43.5 and `Sir Trips-a-Lot` at 49.1, with none finished.
   - There is no close finish and no PHOTO FINISH popup. Iteration 5's AI tuning did not change this.

5. **Results with most face-plants award: 5.**
   - `results` is populated: YOU, Hoof Hearted, Sir Trips-a-Lot, Dusty Rhodes.
   - The results screen did not appear within 2400 frames, so I could not check the award.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, white rail fence, `finish-line` checker, green `hills` and dirt `track` match refs/01.jpg.
   - The horse has a blue cloth, white socks and a ringed eye.
   - `dust` is "Never visible" (29.4 units behind `player`).

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 5.**
   - Plants show in the sheet, with a `down` horse on the finish line.
   - There is no photo finish and no visible AI tangle. In the 2P run the AI horses were still lanes apart (z -1.46 and 1.52).

9. **Controls feel learnable: 6.**
   - The perfect rhythm finishes in 20.7 s, which is too fast, and the player dominates.
   - The 2P test shows slow forward progress with held keys (about 1 m in 1.5 s).
   - A human-like rhythm was not tested.

10. **Horses read as horses, match refs/01.jpg: 8.**

11. **Juice: 7.**
    - 22 sounds fired: cheer, thud, gasp, boing, powerup.
    - The commentator popups and the REPLAY banner show.
    - `feel` was not run, so camera shake is unverified.

12. **Local 2-player, discoverable from the HUD: 7.**
    - The `2 PLAYERS (2)` button is visible and the keys move `P1` and `P2`.
    - The HUD hint line shows the 1P keys only. It is unclear whether Q W E R and U I O P are shown in 2P.

13. **Static page at root, vendored lib, no network: 9.**
    - `perf` gave 383 draw calls and 33.7k triangles, with 0 MB of assets.
    - Median frame was 114 ms on SwiftShader, which says nothing about a real GPU. Host load was 1.6.

**Faults: 6.**
- The only console line is the PCFSoftShadowMap warning.
- `dust` is "Never visible".
- The finish-to-results flow still does not complete in 2400 frames.
- The photo-finish popup never fires.

**Next:**
1. **Make a photo finish happen (asked again, twice not solved by AI tuning).**
   - Stop tuning `AI.base`, since that failed in Iteration 5. Instead cap the player in auto mode: add a `S.auto` throttle (a longer `AUTO.period`, or skipped rhythm cycles) so `YOU` finishes at 35–45 s.
   - Also cut AI plant frequency (`next` 4–8 s in `AI.update`) and make the rubber band pull trailing AI toward the leader.
   - Done when `interact` with `until: {phase:"replay"}` shows 2+ horses with `finishT` within 0.3 s, and the PHOTO FINISH popup shows in `look`.
2. **Fix the replay so it reaches results (asked again).**
   - Cap the finish replay at about 4 s real time, or advance `pos` faster. The 0.25x playback of ~1480 frames takes too long, and `replay.pos` is still 1367 after 2400 frames.
   - Done when `interact` with `until: {phase:"results"}` returns `phase: "results"`, and `look` shows the most-face-plants award.
3. **Frame the plant replay on the tangle (asked again).**
   - In `subjectAt`, use the centroid of all `down` horses, and pull the lanes closer (z spread of about ±0.8 m instead of ±1.5 m) so the AI visibly collide.
   - Done when `look` during `kind:"plant"` shows 2+ horses overlapping, with the horse meshes over 5% of the frame.
   - Then run `feel` on a face-plant to confirm the shake.

SCORE: 6.7

## Iteration 6
**Did** game.js: finish replay capped to `start+260` frames and played at 0.6x (plant replay stays 0.25x); `AI.next` 7-12 s (fewer plants); `AI.base` 0.57-0.65 (faster); auto player `driveF` x0.5 when `S.auto`.
**Saw** Auto race with `until phase:"results"`: reached `results` at frame 2143 (replay-to-results now completes). YOU finishT 21.28; at raceT 25.3 AIs at x 56.6 / 54.4 / 45.8, none finished (before the AI.base speed-up, which I did not re-run). No PHOTO FINISH seen. Plant replay framing, 2P, feel, perf not checked.
**Next** (1) Re-run auto race to see if AI.base 0.57-0.65 gives finishT within 0.3 s; the auto player is rhythm-limited (driveF x0.5 changed little), so slow it via a longer `AUTO.period`. (2) `look` in a plant replay: centroid of down horses, tighter lanes. (3) `feel` for shake; 2P HUD keys.
**Open** Photo finish still unproven.

### Judge 6

**Judge 6 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - Auto mode runs the whole race and `YOU` finishes at `finishT` 21.43.
   - The HUD shows the `1 PLAYER` and `2 PLAYERS (2)` buttons and a RESTART button.
   - The results screen says "Press R for another race · 1 / 2 = players".
   - I did not test 2P input or the R key this session.

2. **Real Rapier jointed ragdoll horses, face-plant and auto-right: 7.**
   - The `plants` counters read 2, 2, 0 and 1, so face-plants register.
   - Auto-right timing was still not measured.
   - After the finish, every horse goes to `pitch` -0.9 with `legs` "0000". Horses that have not finished look stuck in a slump.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
   - The REPLAY banner and "SPACE to skip" show, and the side view of `YOU` slumped on the finish-line checker reads clearly.
   - `until: {phase:"results"}` still did not complete in 3000 frames. The replay sat at `pos` 1471 of 1490, and results only came after 200 more frames.
   - The replay is an end-of-race slump, not a funny moment.

4. **Photo finish and tangled AI collapse within the first minute: 3.**
   - `YOU` finished at 21.43. At raceT 25.45 `Dusty Rhodes` was at x 53.96, `Sir Trips-a-Lot` at 45.78 and `Hoof Hearted` at 44.86, and none had finished.
   - The results list `Dusty Rhodes` and the two others as "DNF · 4 m short" and "13 m short".
   - There is no photo finish and no PHOTO FINISH popup.
   - `tangles` reads 2, but the AI lanes are still about 1 m apart in z (−1.39, −0.39, 1.41), and the finish replay does not show a tangle.

5. **Results with most face-plants award: 7.**
   - The results screen shows a podium and a table with a "MOST FACE-PLANTS" badge.
   - The badge sits on two horses at once, `Sir Trips-a-Lot` and `Hoof Hearted`, since both have 2 plants.
   - The results end the race with 3 DNFs, which is a weak finish.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, white rail fence, `finish-line` checker with the FINISH banner, green `hills`, `clouds` and dirt `track` match refs/01.jpg.
   - The look reports no `Lighting:` or `Surfaces:` fault lines.
   - `dust` is still "Never visible".
   - On the results camera the subject blends in (edge contrast 0.045).

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 4.**
   - The 60 m race ends with one winner and three horses that never finish.
   - The AIs do not reach the line and no tangle shows.

9. **Controls feel learnable: 6.**
   - The perfect auto rhythm finishes in 21.4 s.
   - I did not test a human-like rhythm.
   - The AIs cannot finish, so the race feels one-sided.

10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, blue cloth, white socks and ringed eye read well, and the grandstand crowd is blocky and coloured.

11. **Juice: 7.**
    - 25 sounds fired: cheer, thud, gasp, boing and powerup.
    - The commentator chips, the REPLAY banner and the FINISH banner all show.
    - `feel` for camera shake was still not run.

12. **Local 2-player, discoverable from the HUD: 7.**
    - The `2 PLAYERS (2)` button is visible and the tips line says "2 = two players".
    - The bottom keys panel shows "YOUR LEGS Q W O P" only. I did not check whether 2P shows Q W E R and U I O P.

13. **Static page at root, vendored lib, no network: 9.**
    - `perf` gave 382 draw calls and 33.6k triangles, with 0 MB of assets.
    - Median frame was 80.6 ms on SwiftShader, which is no budget signal. Host load was 1.8.

**Faults: 6.**
- The only console line is the PCFSoftShadowMap warning.
- `dust` is "Never visible".
- Photo finish is still 0 for 3 sessions (sessions 4–6).
- The replay is slow to reach results, 3000 frames without arriving.

**Next:**
1. **Make a photo finish happen (asked again, a third time).**
   - AI tuning of `AI.base` has failed three times, so stop it. The AIs stall at 45–56 m and never finish.
   - In `AI.update`, add a rubber band toward the leader, and a hard rule that AIs cannot lose more than 3 m once `x` is over 40. Make a stalled AI (`legs` "0000" or `down`) get up within about 1.5 s.
   - Optionally, force a photo finish by capping the leader at x=58 until a second horse is within 0.3 m.
   - Done when `interact` with `{state:{auto:true}}` and `until: {phase:"replay"}` shows 2+ horses with `finishT` within 0.3 s, and `look` shows a PHOTO FINISH popup.
2. **Make the replay reach results quickly (asked again).**
   - The finish replay is `pos` 1471 of 1490 after 3000 frames. Cap it at about 4 s real time, for example `of` ≤ 240 frames at 1x or 0.6x.
   - Done when `interact` with `until: {phase:"results"}` returns `phase: "results"` within 1500 frames.
3. **Make the face-plant tangle show (asked again).**
   - Pull the AI lanes together (z spread about ±0.6 instead of ±1.4) and aim the plant replay at the centroid of the `down` horses in `subjectAt`.
   - Done when `look` during a `kind:"plant"` replay shows 2+ horses overlapping, with the horse meshes over 5% of the frame.
   - Then run `feel` on a face-plant to confirm the shake.
   - If time allows, fix `dust` so it is visible behind `player` (parent it to the world, not the camera-far group).

SCORE: 6.5

## Iteration 7
**Did** game.js `AI.update`: past x 30 AIs drop mishaps (`this.m=null`, `next=99`) and get a rubber band `band` (up to 0.55x period) toward `AI.leadX` (set in `updateRace`); finishing phase now waits `since > 9` s for a second finisher.
**Saw** Auto race (`state:{auto:true}`): plant replay at frame 607, results at frame 3239. YOU finishT 21.43; Dusty Rhodes finished at 28.9 (7.5 s later, no PHOTO FINISH); Sir Trips-a-Lot x 51.6 and Hoof Hearted x 51.1 still unfinished at raceT 28.9. No new errors (only PCFSoftShadowMap warning). Plant replay look, feel, perf, dust not checked.
**Next** (1) The AIs are ~0.4x slower than the auto player on the flat; the auto player is perfectly rhythmic (a human is slower), so make AIs scale to the leader harder (e.g. band floor 0.4) or slow `AUTO.period`, then check for gap < 1 s. (2) Plant replay centroid framing and `feel` shake. (3) `dust` visibility.
**Open** Photo finish still unproven; the longer 9 s finishing wait lengthens the race end (results at 28.9 s).
