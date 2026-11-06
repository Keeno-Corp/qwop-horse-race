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

### Judge 7

**Judge 7 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - Auto mode runs the race and the HUD shows `1 PLAYER`, `2 PLAYERS (2)` and RESTART.
   - The results screen is wrong. `YOU` had `finished:true` at `finishT` 21.43, with x 58.41 in the `finishing` phase. The results then read "Dusty Rhodes WINS!", and `YOU` is "DNF · 56 m short" with x 2.38, `legs` "0000" and 1 face-plant.
   - Either the finisher's result is overwritten or the player was reset before results. The correct winner is lost.
   - I did not test 2P or R this session.

2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - Face-plants register: `Hoof Hearted` has `state:"down"` with `plants` 1, then 2.
   - The plant replay shows grey, brown and orange horses sprawled with their legs tangled.
   - Auto-right timing is still unmeasured.
   - Horses finish with `pitch` -0.9 and `legs` "0000".

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - The plant replay (`kind:"plant"`, `pos` 304 of 414) is now framed on the tangle. The REPLAY banner and "SPACE to skip" show. This is the best frame so far.
   - The finishing `look` is covered by `div#flash`, a white overlay at opacity 0.82 (brightness 88%, subject edge contrast 0.029).
   - The finish replay was not seen. `until:{phase:"results"}` came in 2761 frames, which is better than before but still slow.

4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - The tangle works. `tangles` reads 1, then 2, and by 6.9 s two horses are down with `plants` 1 and others at 2.
   - There is still no photo finish. Dusty Rhodes finished at 24.38 and Sir Trips-a-Lot at 28.25, a gap of 3.87 s. `Hoof Hearted` ended at x 48.67 as a DNF.
   - There is no PHOTO FINISH popup.

5. **Results with most face-plants award: 6.**
   - The podium and table show "SMOOTH OPERATOR", "DIRT EATER" and "MOST FACE-PLANTS" badges. The badge sits on `Hoof Hearted`, who has 2 plants and is the only horse with 2.
   - The winner is wrong (see item 1) and a DNF horse is placed 3rd.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, white rail fence, `finish-line` checker, green `hills`, `clouds` and dirt `track` all match refs/01.jpg.
   - The look reports no `Lighting:` or `Surfaces:` faults.
   - `dust*` is now visible (52 meshes, 0.6% of the frame).
   - During the finish the subject blends in because of the flash.

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 6.**
   - The tangle replay at 6.9 s is funny: three horses are down in the dirt, and a stranger would laugh.
   - The photo finish and its slow-motion replay did not occur, and the race ends with a wrong result.

9. **Controls feel learnable: 6.**
   - The auto rhythm finishes in 21.4 s.
   - I did not test a human rhythm.
   - The AIs take 24–28 s, so they are now close to the auto player.

10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, blue, yellow, red and green blankets, white socks, ringed eye and dirt chunks read well.

11. **Juice: 7.**
    - 43 sounds fired across the run: cheer, thud, gasp, boing and powerup.
    - Commentator chips ("FACE-PLANTS 2 · OUCH") and the REPLAY and FINISH banners show.
    - The `feel` camera shake was not run, and the flash is too heavy.

12. **Local 2-player discoverable from the HUD: 7.**
    - The `2 PLAYERS (2)` button and the tips line ("2 = two players") show.
    - The keys panel shows only "YOUR LEGS Q W O P". I did not check Q W E R / U I O P.

13. **Static page, vendored lib, no network: 9.**
    - 382 draw calls and 33.6k triangles with 0 MB of assets.
    - The 74.5 ms median frame is SwiftShader noise. Host load was 1.5.

**Faults: 5.**
- The wrong winner is the main fault: `YOU` finished at 21.43, yet results list `YOU` as a 56 m DNF at x 2.38.
- The only console line is the PCFSoftShadowMap warning.
- The finish `div#flash` (opacity 0.82, white) hides the scene.
- There is still no photo finish after four sessions.

**Next:**
1. **Fix the results bookkeeping.**
   - A horse with `finished:true` and `finishT` must stay in `results` as a finisher, and `YOU` must not be reset or counted DNF.
   - Look at where the `finishing` phase and `YOU` are re-simulated after the replay (a replay or `setState` restoring `x`), and at the 9 s wait.
   - Done when `interact` with `{state:{auto:true}}` and `until:{phase:"results"}` returns a `results` list whose first entry is the horse with the lowest `finishT`. With `YOU` at 21.43 s, that is `YOU`, and `YOU` shows no "DNF".
2. **Make a photo finish happen (asked again, a fourth time).**
   - Stop waiting 9 s for stragglers. Once the leader is at x 55, cap the leader's speed and rubber-band the nearest AI to within 0.3 m.
   - Then show a PHOTO FINISH popup and a slow-motion side replay on the finish line.
   - Reduce the white `div#flash` to about 0.25 opacity and fade it over 0.3 s.
   - Done when `until:{phase:"replay"}` shows two horses with `finishT` within 0.3 s, and `look` shows the popup with the checker and both horses visible.
3. **Shorten the race end and check 2P and the shake.**
   - Cap the replay and result wait so results arrive within about 1500 frames after the first finish.
   - Run `feel` on a face-plant to confirm the camera shake.
   - Run `interact` with `{key:"Digit2"}` and look at whether `div#keys` shows Q W E R and U I O P.

SCORE: 6.9

## Iteration 8
**Did** game.js `AI.update`: rubber band now starts at x 22 (was 30), gain 0.15, floor 0.3x period; `finishing` wait cut 9 s to 5 s; `#flash` opacity cap 0.3 (was 0.85), fades faster.
**Saw** Auto race before the change: results list was already correct (`YOU` first, finishT 21.43, no DNF), so the judge's wrong-winner was not reproduced. After: `YOU` 21.75, Dusty Rhodes 23.27 (gap 1.52 s, no PHOTO FINISH yet <1.0), results at frame 2708. Only the PCFSoftShadowMap warning. Flash look, 2P keys panel, `feel` shake not checked.
**Next** (1) Close gap below 1 s (cap leader speed near x 55, or stronger band). (2) Photo-finish popup/side replay look. (3) 2P keys panel Q W E R / U I O P, `feel` shake.
**Open** Wrong-winner bug not reproducible with `state:{auto:true}`; might need a path with a restart mid-race.

### Judge 8

**Judge 8 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - The auto race runs from the countdown to results. The HUD shows `1 PLAYER`, `2 PLAYERS (2)` and RESTART.
   - The results are right this time: `["YOU","Dusty Rhodes","Sir Trips-a-Lot","Hoof Hearted"]` with `YOU` `finishT` 21.75 and "YOU WINS!".
   - The race runs only 22 m past the lead horses before results. Sir Trips-a-Lot and Hoof Hearted are cut off as "DNF · 26 m short" and "27 m short" while still running with `state:"run"`. That reads as a bug, not a DNF.
   - I did not test 2P or R.

2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - `Hoof Hearted` goes `state:"down"` with `plants` 1, then 2.
   - Grey, brown and orange legs tangle in the plant replay.
   - Auto-right timing is still unmeasured.
   - `YOU` crosses the line with `pitch` -0.93 and `legs` "0000", which is an odd finish pose.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - The plant replay (`kind:"plant"`, `pos` 304 of 414) shows the red REPLAY banner and "SPACE to skip" on the tangle.
   - Space skipped it straight to results.
   - I did not see a finish replay.

4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - The tangle works: `tangles` reads 1, then 2, by 6.9 s.
   - There is still no photo finish. The finish gap is 1.52 s (21.75 vs 23.27), and there is no PHOTO FINISH popup.

5. **Results with most face-plants award: 6.**
   - The podium and table show SMOOTH OPERATOR and DIRT EATER badges.
   - MOST FACE-PLANTS is shared by two horses at 2 plants each, so the award is a tie, not one winner.
   - The DNF horses sit in 3rd and 4th place on the podium, with 3rd taken by a horse that did not finish.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, white rail fence, `finish-line` checker, green `hills`, `clouds`, dirt `track` and `dust*` all match refs/01.jpg.
   - There are no `Lighting:` or `Surfaces:` faults.
   - On the results screen the subject blends in: edge contrast 0.043, and the results `div.box` covers 25% of the canvas.

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 6.**
   - The tangle is funny: three horses are sprawled in the dirt at 6.9 s.
   - There is no photo finish and no slow-motion side replay at the line.

9. **Controls feel learnable: 6.**
   - The auto rhythm finishes in 21.75 s.
   - I did not test a human rhythm or mistimed keys.

10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, tail, white socks, dark hooves, coloured blankets and dirt chunks all read clearly.

11. **Juice: 7.**
    - 14 sounds fired in the results run: cheer, thud, gasp, boing and powerup.
    - Chips, the REPLAY banner and the results screen show.
    - The `feel` camera shake is still not measured.

12. **Local 2-player discoverable from the HUD: 6.**
    - The `2 PLAYERS (2)` button and the "2 = two players" tip show.
    - `div#keys` shows only "Q FL W FR O BL P BR". I did not check that it switches to Q W E R / U I O P.

13. **Static page, vendored lib, no network: 9.**
    - 382 draw calls, 33.5k triangles and 0 MB of assets.
    - The 74.7 ms frame is SwiftShader noise (host load 1.8).

**Faults: 5.**
- No photo finish after five sessions.
- Results appear while two horses are still racing, and they are labelled DNF.
- The only console line is the PCFSoftShadowMap warning.
- The finishing pose has `pitch` -0.93 with `legs` "0000".

**Next:**
1. **Make a photo finish happen (asked again, a fifth time).**
   - Rubber-band harder once the leader reaches x 50, or cap the leader's speed so the second horse is within 0.3 m at the line.
   - Add a "PHOTO FINISH!" banner and a side-on slow-motion finish replay that holds on the checker with both horses in frame.
   - One call shows it done: `interact` with `until:{phase:"replay"}` and `look: true`. The two lead horses' `finishT` should be within 0.3 s, and the picture should show the banner, the `finish-line` and both horses.
2. **Stop calling running horses DNF.**
   - Either let the other horses reach x 60 (with a shortcut cap of about 3 s after the second finisher), or show them as "still racing, X m short" and keep them off the podium.
   - Give MOST FACE-PLANTS to one horse (tie-break on fall time).
   - One call shows it done: `interact` with `until:{phase:"results"}`. The podium should contain only finishers, and a single horse should carry the MOST FACE-PLANTS badge.
3. **Check 2P and the camera shake, and fix the finish pose.**
   - Run `interact` with `{key:"Digit2"}` and then `look`. `div#keys` should show Q W E R and U I O P.
   - Run `feel` on a forced face-plant to confirm the shake.
   - Release `YOU`'s legs and level the pitch (to about -0.1) after the line, and dim the results `div.box` backdrop so the winner stays visible.

SCORE: 6.8

## Iteration 9
**Did** game.js: `AI.update` band gain 0.3 / floor 0.22 past x 38; `updateRace` closing sprint (best AI chaser within 14 m of `AI.leadX` gets vx*1.012 per frame, cap 9 m/s) for a photo finish; finishing wait now ends at 6.5 s since first finisher (or all finished, or non-runners after 3.5 s) instead of when the 2nd horse crosses; MOST FACE-PLANTS badge goes to one horse (`worst`).
**Saw** Auto race: results at frame 2756, `Dusty Rhodes` finishT 21.67 beats `YOU` 21.75 (gap 0.08 s, so the PHOTO FINISH popup/label fires). Sir Trips-a-Lot and Hoof Hearted still "DNF · ~25 m short" while running (tangled earlier). One run before the sprint gave a 5.77 s gap, so the sprint is what makes it. Photo finish popup, 2P keys panel, shake, finish pose and results backdrop not looked at.
**Next** (1) Look at the photo-finish popup/replay picture. (2) Label running horses "still racing" and keep them off the podium. (3) 2P `div#keys`, `feel` shake, release YOU's legs/level pitch after the line, dim results box.
**Open** Auto bot loses to Dusty by 0.08 s; fine as a photo finish but check the human can still win. Sprint is a speed nudge, not rhythm-based.

### Judge 9

**Judge 9 verdict (amended with the `track` note)**

The scores below are unchanged. The `track` repeat note is a small Looks and Faults item that I add to Next item 3.

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - The auto race runs from countdown to results.
   - The 2P switch works: `mode` 2, horses `P1` and `P2`, and `div#keys` shows both players' keys.
   - This run had no photo finish. `Dusty Rhodes` finished alone at `finishT` 24.45.
   - `YOU` sat at x 2.4 with `legs` "0000" and is labelled "DNF · 56 m short".
   - `Hoof Hearted` holds 3rd on the podium without finishing.
   - Results appear while `Sir Trips-a-Lot` is still `state:"run"` at x 47.6.

2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - `plants` count up (Sir Trips-a-Lot reaches 3).
   - `Dusty Rhodes` crosses the line with `pitch` -0.89 and `legs` "0000".
   - Auto-right timing is unmeasured.

3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - The `kind:"plant"` replay shows the REPLAY banner and "SPACE to skip".
   - Space skips to results.
   - No finish replay was seen.

4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - The tangle works (`tangles` 1 by 7.9 s).
   - There is no photo finish and no PHOTO FINISH popup in this run.

5. **Results with most face-plants award: 6.**
   - `Sir Trips-a-Lot` carries a single "MOST FACE-PLANTS" badge.
   - Non-finishers are ranked on the podium and labelled DNF while still running.

6. **Looks as LOOK.md says: 8.**
   - The `grandstand`, rail fence, `finish-line`, `hills`, `clouds` and dirt `track` match refs/01.jpg.
   - The `track` texture repeats every 60 px and the pattern shows.
   - The results `div.box` (alpha 0.92) covers 25% of the canvas and hides the winner.

7. **window.__game convention, index.html at root, static deploy: 9.**

8. **Clip moments in the first minute with no input: 6.**
   - The tangle is funny, but there is no photo finish and no slow-motion side replay at the line.

9. **Controls feel learnable: 5.**
   - No human rhythm was tested, and the idle `YOU` was 56 m short.

10. **Horses read as horses, match refs/01.jpg: 8.**

11. **Juice: 7.**
    - 27 sounds fired.
    - The shake is unmeasured.

12. **Local 2-player discoverable from the HUD: 8.**
    - `2 PLAYERS (2)` works and `div#keys` swaps to "PLAYER 1 Q W E R / PLAYER 2 U I O P".

13. **Static page, vendored lib, no network: 9.**
    - 383 draw calls and 0 MB of assets.
    - The frame time is SwiftShader noise.

**Faults: 5.**
- No reliable photo finish after six sessions.
- Running horses are labelled DNF and ranked on the podium.
- The finish pose has `pitch` -0.89.
- `dust` is "Never visible".
- The `track` texture shows a visible 60 px repeat.

**Next:**
1. **Make the photo finish deterministic, with a banner and a finish replay (asked again, a sixth time).**
   - In `updateRace`, clamp the chaser's `vx` so the top two reach x 60 within 0.3 s whenever both are running at x 50.
   - On the second crossing, show a PHOTO FINISH! popup and play a `kind:"finish"` replay, side-on, holding on the `finish-line`.
   - One call shows it done: `interact` with `until:{phase:"replay"}` and `look:true`. The top two `finishT` values should be within 0.3 s, and the picture should show the banner, the `finish-line` and both horses.
2. **Fix the results (asked again).**
   - Rank only finishers on the podium. Label running horses "still racing, X m short".
   - Give the auto bot a Q+P / W+O rhythm so `YOU` reaches x 50 or more.
   - Level the post-line pose to a `pitch` of about -0.1 with the legs released.
   - Lighten the `div.box` backdrop below 0.92.
   - One call shows it done: `interact` with `until:{phase:"results"}`. The podium should contain only finishers, and `YOU` should be at x 50 or more.
3. **Prove the human can finish, and tidy the surfaces.**
   - Run `interact` alternating Q+P and W+O every ~10 frames and check it reaches x 60 in under 60 s.
   - Run `feel` on a forced face-plant to measure the shake.
   - Blend a second, larger-scale dirt texture into `track`, or vary the repeat with distance, so the 60 px repeat no longer shows. Check it with a `look` at the same camera.
   - Move `dust` in front of `track` so it is no longer "Never visible".

SCORE: 6.7

## Iteration 10
**Did** game.js: closing sprint now runs in 'race' and 'finishing' from leadX>34, range 20 m, gain 1.02, cap 10.5 m/s, skips finished horses. `showResults`: podium only has finishers; running horses read "still racing · X m short", others "DNF". index.html: `#results .box` background alpha 0.92 -> 0.69.
**Saw** Auto race to results at frame 3359: only Dusty Rhodes finished (24.37 s); no photo finish (Sir Trips 11 m short, Hoof Hearted 24 m, YOU at x 2.4 with legs "0000"). Podium shows one block; box no longer hides the track. `dust` still "Never visible". Page has no console errors. Not done: finish replay picture, auto bot rhythm for YOU, post-line pitch (-0.88), track texture repeat, feel/shake.
**Next** (1) Make the auto YOU alternate Q+P / W+O so it reaches x 50+ (the AUTO.period branch in `physStep` leaves legs 0000 after a tangle?). (2) Deterministic photo finish: chaser gets pulled to the leader's vx once leadX>45, not only a 1.02 nudge. (3) Level the finished horse (release legs, pitch ~ -0.1), move `dust` in front of `track`, break the 60 px track repeat.
**Open** The sprint still fails if the chaser is face-planted; the podium with one finisher looks sparse.

### Judge 10

**Judge 10 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - The auto race runs from countdown to results.
   - `YOU` is stuck at x 2.37 with `legs` "0000" for the whole race. The auto bot never recovers.
   - `Dusty Rhodes` wins alone at `finishT` 24.37.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - The `plants` counts rise (Sir Trips-a-Lot reaches 5). The `horse3-*` legs are jointed and visibly pose.
   - The winner ends at `pitch` -0.88 with `legs` "0000". Auto-right timing is unmeasured.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.**
   - The `kind:"plant"` replay shows the REPLAY banner and "SPACE to skip". Space skips to results.
   - No `kind:"finish"` replay was seen.
4. **Photo finish and tangled AI collapse within the first minute: 4.**
   - `tangles` is 1 by 7.9 s.
   - There is again no photo finish. Only one horse finished, 6.5 s ahead of the next 47 m mark.
5. **Results with most face-plants award: 6.**
   - The podium now holds only `Dusty Rhodes`.
   - The `SMOOTH OPERATOR` and `DIRT EATER · MOST FACE-PLANTS` badges show, and non-finishers read "still racing · 11 m short".
   - Results open while Sir Trips is still running at x 47.7. The race should wait for them.
   - A single podium block looks sparse.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its crowd, rail fence, `finish-line` checkers, `hills` and dirt `track` match refs/01.jpg.
   - The `div.box` at alpha 0.69 no longer hides the track.
   - The `track` repeat is still visible.
   - A `Surfaces:` line flags coplanar `grandstand` boxes, but on faces turned away from this camera.
7. **window.__game convention, index.html at root, static deploy: 9.**
8. **Clip moments in the first minute with no input: 5.**
   - The tangle and the face-plant replay land by about 8 s.
   - There is no photo finish and no slow-motion side replay at the line.
9. **Controls feel learnable: 4.**
   - A human run was not tested again. The `#tips` line says "Q+P then W+O works!".
   - The auto `YOU` never moves past x 2.4, so there is no evidence a finish in 60 s is possible.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, tail, white socks and dark hooves all read in the replay close-up.
11. **Juice: 7.**
    - 23 sounds fired in the results run (cheer, gasp, thud, boing).
    - The `#chips` and results popups are present. Camera shake is still unmeasured.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` has "2 PLAYERS (2)" and the `div#keys` panel swaps to both players' keys.
13. **Static page, vendored lib, no network: 9.**
    - 383 draw calls, 0 MB of assets, no console errors.
    - Frame time was 95 ms on SwiftShader (host load 1.1), which is noise.

**Faults: 5.**
- No photo finish after seven sessions.
- `Never visible: dust`.
- The finish pose has `pitch` -0.88.
- The `YOU` bot is stuck.
- Results show while horses are still running.

**Next:**
1. **Make the photo finish deterministic, with a banner and a `kind:"finish"` replay (asked again, a seventh time).**
   - The soft sprint nudge has failed three sessions in a row, so change the mechanism.
   - Once the leader passes x 40, give the top two running horses the same target speed. Pull a face-planted chaser up with `state:"run"` and a boost.
   - On the second crossing, show a PHOTO FINISH! popup and play a side-on `kind:"finish"` replay held on the `finish-line`.
   - One call shows it done: `interact` with `until:{phase:"replay"}` and `look:true`. The top two `finishT` values should be within 0.3 s, and the picture should show the banner and the `finish-line`.
2. **Fix the auto `YOU` bot and the results timing (asked again).**
   - In `physStep`, the `AUTO` branch leaves `YOU` at `legs` "0000". Make it alternate Q+P and W+O every ~10 frames whatever the pose, so `YOU` reaches x 50 or more.
   - Hold results until the second finisher crosses, or until 4 s after the first, so the podium has more than one block.
   - Level the post-line `pitch` to about -0.1 with the legs released.
   - One call shows it done: `interact` with `until:{phase:"results"}`. `YOU` should be at x 50 or more and the podium should hold two or more finishers.
3. **Prove the human can finish, and fix the surfaces.**
   - Run `interact` alternating Q+P and W+O every ~10 frames and check it reaches x 60 in under 60 s.
   - Run `feel` on a forced face-plant to measure the shake.
   - Move `dust` in front of `track` (it is still "Never visible").
   - Break the visible repeat in the `track` texture with a second, larger-scale dirt blend.

SCORE: 6.6

## Iteration 11
**Did** game.js `updateRace` closing sprint replaced: from leadX>34 the best AI chaser (not the leader, x>14) is `rise()`d if down, shifted +x each frame (up to 3.2 m/s extra, 7 if >8 m back) until 0.7 m behind the leader, and its velocity eased to the leader's vx.
**Saw** Auto run to results at frame 2149: finishT Dusty 21.67, YOU 21.75 (0.08 s, a real photo finish), Sir Trips 24.33; Hoof Hearted 7.5 m short. Podium has 3 finishers. Results via the `kind:"finish"` path (PHOTO FINISH popup, replay) not looked at in a picture. `dust` now on screen, no "Never visible". No console errors besides a three shadowmap warn. Finished horses still `pitch` about -0.9, legs 0000.
**Next** (1) Look at the finish replay picture (`until phase:"replay"` after 20 s) to check banner and finish-line framing. (2) Level the post-line pitch (~ -0.1, release legs). (3) Human-run proof with alternating Q+P / W+O, `feel` on shake, break the track texture repeat.
**Open** Teleport-style pull may look like a surge at the line; the auto YOU now finishes because auto bot works this run (seeded), unverified for other seeds.

### Judge 11

**Judge 11 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 5.**
   - The race runs from countdown to a results order of Dusty Rhodes, Sir Trips-a-Lot, Hoof Hearted, YOU.
   - The auto `YOU` still sits at x 1.4–2.4 with `legs` "0000" in `interact`, for the whole race.
   - There is still no auto-recovery for `YOU`.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 7.**
   - The `horse3-*` and `horse0-*` legs pose and collapse: `plants` 1–2, and the replay shows a clear tumble.
   - Both finishers end at `pitch` about -0.9 with `legs` "0000". The post-line pose is still wrong.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - The `kind:"plant"` and `kind:"finish"` replays both show the REPLAY tag and "SPACE to skip".
   - The finish replay is held on the `finish-line` checkers and reads well.
   - The `div.pop` "PHOTO FINISH!" overlaps the `div.tag` "REPLAY", and its subtitle is drawn twice as a ghost.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - `tangles` is 1 by 7.9 s.
   - The finish gives "Dusty Rhodes by a nose (0.10s)": `finishT` 23.92 against 24.02.
   - Both horses lie in a heap on the line, which is funny.
   - The pull is deterministic, so this is a real fix.
5. **Results with most face-plants award: 7.**
   - The results order holds four names, and the `DIRT EATER` award was present last session.
   - I did not re-look at the results screen this session.
6. **Looks as LOOK.md says: 8.**
   - `grandstand` crowd, rail fence, `finish-line`, dirt `track` and `hills` all match refs/01.jpg.
   - The `track` texture repeat is still visible as brown panels.
   - The `Surfaces:` line only flags `grandstand` faces turned away from this camera.
7. **window.__game convention, index.html at root, static deploy: 9.**
8. **Clip moments within the first minute, no input: 8.**
   - The tangle and plant replay land by about 8 s.
   - The photo finish replay lands at about 24 s.
9. **Controls feel learnable: 4.**
   - I alternated Q+P and W+O every 10 frames. `YOU` went from x 1.4 to 2.2 in about 1 s, which is about 0.8 m/s.
   - At that rate 60 m takes about 75 s, over the 60 s target.
   - The `legs` string toggles between "1001" and "0110" correctly, so the keys work.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane, tail, white socks, dark hooves and saddle all read in the replay close-up.
11. **Juice: 7.**
    - 10 to 11 sounds fire per run (cheer, gasp, thud, boing, powerup).
    - Camera shake is still unmeasured.
12. **Local 2-player discoverable from the HUD: 8.**
    - The `describe()` lists the Digit2 and two-player keys.
    - I did not re-look at `div#top-r` this session.
13. **Static page, vendored lib, no network: 9.**
    - 385 draw calls, 34k triangles and 0 MB of assets.
    - The 140 ms frame is SwiftShader noise at host load 1.0.

**Faults: 6.**
- `dust` is still "Never visible" (19 units, behind `track` in the first look, outside the view in the second).
- The finished horses stay at `pitch` -0.9.
- The auto `YOU` is stuck.
- The "PHOTO FINISH!" popup overlaps the REPLAY tag and has a ghost duplicate subtitle.

**Next:**
1. **Fix the auto `YOU` bot and speed up human forward motion (asked again).**
   - In `physStep`, the `AUTO` branch leaves `YOU` at `legs` "0000" and at x 2.4 forever. Alternate Q+P and W+O every ~10 frames.
   - Raise the drive per stride so that the same rhythm covers 60 m in under about 50 s, which is at least 1.3 m/s.
   - One call shows it done: `interact` with `until:{phase:"results"}` and `trace:["horses.2.x"]`. `YOU` should end at x 50 or more. The human-rhythm run should also reach about x 20 by frame 1500.
2. **Level the post-line pose and fix the popup (asked again).**
   - After `finished`, release the legs and ease `pitch` to about -0.1. Standing winners will make a better finish replay.
   - Give `div.pop` its own position below `div.tag`, and remove the duplicate subtitle.
   - One call shows it done: `interact` with `until:{replay.kind:"finish"}` and `look`. The popup should not overlap REPLAY, and the finishers should stand.
3. **Move `dust` and break the track texture repeat.**
   - Lift the `dust` particles above the `track` surface and tie them to hoof thuds, so the `Never visible` line disappears.
   - Blend a second, larger-scale dirt noise into the `track` texture to break the brown panels.
   - Run `feel` on a plant to measure the camera shake.

SCORE: 7.0

## Iteration 12
**Did** game.js `physStep`: human `driveF` multiplier 1 → 2.4 (auto stays 0.5). physics.js `step`: once `finished`, pitch torque levels the body to about -0.1 (gain 2600, no clamp). index.html: `.pop span` own text-shadow (the ghost subtitle), `body.replaying .pop{top:30vh}` so the popup clears the REPLAY tag.
**Saw** The "stuck auto YOU" was only the `auto` flag being unset: `interact` with `state:{auto:true}` drives it, and it reaches x 15.6 by frame 600. Human rhythm (Q+P / W+O every 10 frames) was 0.8 m/s before, about 2 m/s after (x 2.06 → 4.47 in 1.2 s). Auto run to the finish replay at frame 2361: finishT Sir Trips 22.30, Hoof Hearted 22.32, YOU 25.55; finishers `pitch` -0.13..-0.21, legs 0000, standing. Look: PHOTO FINISH popup and REPLAY tag no longer overlap (0 overlap), single subtitle. `dust` is still "Never visible" (behind track). Only console warning is the three shadowmap one.
**Next** (1) Lift `dust` above `track` so "Never visible" goes. (2) Break the `track` texture repeat with a larger-scale noise. (3) `feel` on a plant for the camera shake; check the human run for a full 60 m with the real rubber-band.
**Open** Human 2.4x drive is unproven over a full run (the catch-up term may make it too easy or too hard). Dusty Rhodes ended tumbled at x 54.9 in that seed.

### Judge 12

**Judge 12 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - With `state:{auto:true}`, `YOU` (`horses.2`) now runs to the line: `finishT` 21.75, x 59.47 at results. The results order is Dusty Rhodes, YOU, Sir Trips-a-Lot, Hoof Hearted.
   - I did not measure the solo Q W O P loop itself over a full race. My one 20-frame human rhythm test only reached x 1.49.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - The finishers now stand: `Sir Trips-a-Lot` `pitch` -0.05, `YOU` -0.24, `Dusty Rhodes` -0.18, all with `legs` "0000".
   - `Hoof Hearted` has `plants` 3 and `legs` "1111" at x 52. It was still running when the results screen came up.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - I did not re-look at the replay this session. The Iteration 12 `Did` and `Saw` report that `div.pop` now clears `div.tag`.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - `tangles` is 1. The photo finish gives "Dusty Rhodes by 0.08s" (`finishT` 21.67 against 21.75), which lands before 25 s.
5. **Results with most face-plants award: 8.**
   - The results `div.box` shows podium cards, per-horse times and "DIRT EATER · MOST FACE-PLANTS" on Hoof Hearted.
   - A horse that never finished shows "still racing · 6 m short". That reads oddly on a results screen.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` crowd, rail fence, `finish-line` checkers, dirt `track` and `hills` all match refs/01.jpg.
   - The `track` shows a brown panel repeat. The `Surfaces:` line shows no fault.
   - The player blends in: "Stands out" is 57% against 50%, edge contrast 0.033.
7. **window.__game convention, index.html at root, static deploy: 9.**
8. **Clip moments within the first minute, no input: 8.**
   - `tangles` is 1 early. The photo finish lands at about 22 s.
9. **Controls feel learnable: 5.**
   - Iteration 12 raised the human `driveF` to 2.4x, and the builder reports about 2 m/s.
   - My 20-frame test gave only 0.09 m of travel, with a Motion line saying the direction turned 169°. That is too little to confirm anything.
   - No full human run to 60 m has been done by anyone. Iteration 12's Open still lists it as unproven.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - The head, mane and saddle read in the results backdrop and in last session's replay.
    - `horse3-*` (the player) takes only 0.65% of the frame at the results camera.
11. **Juice: 8.**
    - 22 sounds fired in one run (blip, powerup, cheer, thud, gasp, boing).
    - Camera shake is still unmeasured by `feel`.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows the "1 PLAYER" and "2 PLAYERS (2)" buttons plus RESTART.
13. **Static page, vendored lib, no network: 9.**
    - 384 draw calls, 33.7k triangles, 0 MB of assets.
    - The 63 ms frame comes from the SwiftShader software renderer at host load 2.0, so it is noise, not a fault.

**Faults: 7.**
- `dust` is still "Never visible" (behind `finish-line`).
- There are no console errors. The only warning is the shadowmap one.
- The results screen is still waiting on `Hoof Hearted` (still racing, `legs` "1111").

**Next:**
1. **Prove or tune the human run to 60 m.**
   - Run `interact` with a long loop of Q+P, then W+O every 10 frames. Use about 1800 frames and `trace:["horses.2.x"]`.
   - `YOU` should reach x 60 by about frame 3000 (50 s) and show non-zero `plants` only on mistimed keys.
   - If it is too slow or too easy, adjust the `driveF` and rubber-band terms in `physStep`.
2. **Lift `dust` above the `track` and tie it to hoof thuds.**
   - The `Never visible: dust` line is flagged again; the last verdict also asked for this.
   - A `look` should then list `dust` with pixels, and a `feel` on a plant should show particles.
   - Run `feel` on a plant at the same time to measure the camera shake.
3. **Make the player stand out and break the `track` texture repeat.**
   - Add a coloured outline, a name flag or a marker ring on `player-*`. `look` should then report a subject contrast well above 0.033.
   - Blend a larger-scale dirt noise into the `track` texture to remove the brown panels.
   - End the results wait: when the player and the rest have finished, list a non-finisher as "DNF" instead of "still racing".

SCORE: 7.7

## Iteration 13
**Did** game.js: `dust` lifted (emit y +0.18, floor 0.14, `renderOrder` 5, polygonOffset -2) so it draws above `track`; results rows list any non-finisher as "DNF · n m short" (no more "still racing").
**Saw** `look` now lists `dust* ×4` 0.055% and "Never visible: none". Human Q+P/W+O rhythm over only the 0.9 s after GO: YOU x 1.4 → 1.89, plants 0. Subject contrast edge 0.114, player 0.76% of frame. Only console warning is the shadowmap one.
**Next** (1) Full 60 m human-run proof (1800+ frames, trace horses.2.x) and tune `driveF`/rubber-band. (2) Player outline/marker ring on `player-*`; break `track` texture repeat with large-scale noise. (3) `feel` on a plant for camera shake.
**Open** Human run still unproven past ~2 s; dust amount is small (only 4 visible in the start frame); the results screen's DNF wait is unchanged otherwise.

### Judge 13

**Judge 13 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 6.**
   - The Q W O P rhythm moves `YOU` (`horses.2`) from x 1.4 to 1.81 in the 0.8 s after GO, with `plants` 0.
   - The `div#tips` line "Alternate your legs — Q+P then W+O works" and the `div#keys` pads are on screen.
   - My test only covered the first 0.8 s of the race, because the 200-frame wait mostly ran the countdown. A full solo run to the line is still unproven.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - I did not re-test this session. The `horse0-*` to `horse3-*` limbs are jointed, and the `legs` strings change as the legs are driven.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - I did not re-look at the replay this session. I carry the score over from the last iteration's report.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - Carried over from judge 12, where `tangles` was 1 and the photo finish landed at about 22 s.
5. **Results with most face-plants award: 8.**
   - Iteration 13 changed non-finishers to "DNF · n m short". I did not see the results screen this session.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` crowd, rail fence, `track` and `hills` read like refs/01.jpg, and `dust*` is now visible.
   - The player is still small and blends in. It takes 0.83% of the frame, and subject contrast is edge 0.102 (subject brightness 29% against 38% around it).
   - The `track` still shows a repeating brown panel pattern.
7. **window.__game convention, index.html at root, static deploy: 9.**
8. **Clip moments within the first minute, no input: 8.**
   - Carried over from judge 12. This session's frame at GO shows four horses bunched in adjacent lanes, which is the setup for a tangle.
9. **Controls feel learnable: 5.**
   - The 10-frame alternation gave about +0.4 m in 0.8 s, which is about 0.5 m/s. The builder claims about 2 m/s.
   - At that pace 60 m would take around two minutes, not under 60 s.
   - No one has measured a full human run to 60 m.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - Head, mane, tail, saddle and socks read in the start frame.
    - `horse3-*` (the player, blue saddle) is hard to pick out among the others.
11. **Juice: 8.**
    - 5 sounds fired in the first 0.8 s (blip ×3, powerup, cheer). The "GO!" popup and chips are in place.
    - Camera shake is still unmeasured by `feel`.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows "1 PLAYER", "2 PLAYERS (2)" and RESTART.
13. **Static page, vendored lib, no network: 9.**
    - 382 draw calls, 33.5k triangles, 0 MB of assets.
    - The 69 ms frame is the SwiftShader software renderer at host load 1.9, so it is noise, not a fault.

**Faults: 8.**
- "Never visible: none", and the only console message is the shadowmap warning.
- The `div#tips` text overlaps the "GO!" popup region.
- Item 9's unproven pace is the one open concern.

**Next:**
1. **Prove or tune the human run to 60 m (asked again).**
   - Run `interact` with `state:{auto:false}`, after `{until:{phase:"race"}}`.
   - Then loop Q+P and W+O at 10 frames each for about 3000 frames, with `trace:["horses.2.x"]`.
   - It is done when `YOU` reaches x 60 with `finishT` under about 60.
   - If it does not, raise `driveF` in `physStep`. The measured pace so far is about 0.5 m/s.
2. **Make the player stand out (asked again).**
   - Add a ring, an arrow or a name flag above `player-*`.
   - `look` with `sample` on the player pixels should then show a subject "Stands out" edge contrast well above 0.102.
   - Also blend large-scale dirt noise into the `track` texture to break the panel repeat.
3. **Run `feel` on a face-plant to measure camera shake.**
   - It should report a nonzero camera displacement that decays within about 0.5 s.
   - Also add more `dust*` on hoof thuds. Only 6 are visible at the start.

SCORE: 7.7

## Iteration 14
**Did** game.js: added `player-marker-0/1` (bobbing cone arrow, depthTest off, plus ground ring) via `markers`/`updateMarkers()` called in `tick`; colours blue 0x3d9bff (P1, matches YOU chip) and pink (P2). Hidden in replay/results. No change to `driveF`.
**Saw** Human run proven: eval-driven Q+P / W+O at 10 frames each, `horses.2` x = 3.57 @1.7 s, 22.4 @10 s, 45.6 @20 s (~2.3 m/s, plants 0), so 60 m ≈ 26 s; AI (`horses.0`) kept similar pace and passed at the end. Start-frame `look`: player marker 0.71% of frame visible, subject edge contrast 0.12 (was 0.10), `player-marker-*` visible; "Never visible: dust" only in the countdown frame (dust not emitted yet). Only console warning is the shadowmap one.
**Next** (1) Run a full race to results to check finishT and results rows with the human finishing. (2) `feel` on a face-plant for camera shake; add dust on hoof thuds; break the `track` texture repeat with noise. (3) Re-look the marker at the GO frame (blue arrow vs blue saddle contrast) and in 2-player mode.
**Open** Marker colour edit after the look was not re-viewed; shake via `feel` still unmeasured; no `dust` at countdown reports "Never visible" (harmless).

### Judge 14

**Judge 14 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - I played Q+P / W+O at 10 frames each after `phase` reached "race". `horses.2` (`YOU`) went from x 1.4 to 1.81 with `plants` 0, and `legs` changed as keys were held.
   - The `div#tips` line and the `div#keys` pads are on screen.
   - I only played the first 0.7 s myself. Iteration 14's report of about 2.3 m/s over 20 s is the only evidence for a full run, and I did not reproduce it.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - The `horse0-*` to `horse3-*` limbs are jointed and the `legs` strings change.
   - I did not provoke a face-plant this session, so this carries over from earlier verdicts.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - Carried over. I did not see it this session.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - Carried over. The GO frame shows four horses bunched in adjacent lanes, which is the setup for a tangle.
5. **Results with most face-plants award: 7.**
   - Not seen this session. No full race has been run through to the results screen in the last three judge sessions.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` crowd, rail fence, `track`, `hills`, `sky` and `dust*` match the style of refs/01.jpg.
   - The `player-marker-*` blue ring and arrow now show on the player: 0.61% of the frame.
   - The subject check is still weak. The player takes 0.97% of the frame, edge contrast is 0.1 (it was 0.12 in the builder's look), and brightness is 31% against 38% around it.
   - The `track` still shows a repeating panel pattern.
7. **window.__game convention, index.html at root: 9.**
   - `open` returns the `__game` name, stack and keys.
8. **Clip moments within the first minute, no input: 8.**
   - Carried over, with the same bunched start as item 4.
9. **Controls feel learnable: 6.**
   - My rhythm gave about +0.4 m in 0.7 s, which is slow.
   - The builder's earlier eval-driven run gave about 2.3 m/s, so 60 m is plausible in under 60 s.
   - The first seconds after GO still feel sluggish, and nobody has seen `YOU` cross the line through `interact`.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - Head, mane, tail, saddles and white socks read in the GO frame.
    - The player horse, `horse3-*` with the blue saddle, still sits among the other horses. The ring helps.
11. **Juice: 8.**
    - 5 sounds fired in the first 0.7 s: blip ×3, powerup, cheer.
    - The "GO!" popup and the chips work.
    - Camera shake is still unmeasured by `feel`. Only `dust*` ×2 are visible at the start.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows "1 PLAYER", "2 PLAYERS (2)" and RESTART.
13. **Static page, vendored lib, no network: 9.**
    - 386 draw calls, 33.8k triangles, 0 MB of assets.
    - The 82 ms frame is SwiftShader at host load 1.9, so it is noise, not a fault.

**Faults: 7.**
- "Never visible: none". The only console message is the shadowmap warning.
- The "GO!" popup is huge and covers the horses at the start.
- The `div#tips` text wraps onto two lines and sits right above the `div#keys` label.
- The screenshot shows `div#tips` as low-contrast text over the track.

**Next:**
1. **Prove a full human run to the results screen and the results rows.**
   - Use `interact` with `{until:{phase:"race"}}`, then loop Q+P and W+O at 10 frames each for about 2000 frames, tracing `horses.2.x` and `phase`.
   - It is done when `YOU` reaches x 60 with `finishT` under about 60, and the results rows with "most face-plants" show in a `look`.
   - If the first 2 s are slow, add extra `driveF` at the start of `physStep`.
2. **Shrink the GO! popup and give `div#tips` a dark pill background, one line.**
   - The popup should cover under about 15% of the frame, so the horses stay visible at GO.
   - `look` at the GO frame should show the horses uncovered and `div#tips` as one readable line.
   - Also add noise to the `track` texture to break the panel repeat, and add `dust*` on hoof thuds.
3. **Run `feel` on a face-plant to measure camera shake.**
   - Done when it reports a nonzero camera displacement that decays within about 0.5 s.
   - Then `look` at the replay once to confirm the REPLAY banner and the 0.25x pace.

SCORE: 7.8

## Iteration 15
**Did** index.html: `#count` (GO!/countdown) shrunk to clamp(80px,14vw,180px) and moved to the top (padding-top 8vh) so horses show at GO; `#tips` now a one-line dark pill (nowrap, bg #3a2416d0). game.js: tips text shortened; `showResults()` clears `S.popups` so PHOTO FINISH popup no longer sits behind the results box.
**Saw** GO frame `look`: horses uncovered, tips on one line [434,679,845,701], subject edge contrast 0.13. Full human run via eval (Q+P / W+O each 10 frames, skipping a mid-race replay with `setState({phase:'replay-skip'})`): `YOU` finishT 20.22 s, plants 0, AI Dusty Rhodes 20.35 s (+0.13, PHOTO FINISH), two AI DNF at 35 m after face-plants; results box shows 4 rows with awards (SMOOTH OPERATOR, DIRT EATER · MOST FACE-PLANTS). Console: only the shadowmap warning. `dust` "Never visible" in look frames.
**Next** (1) `feel` on a face-plant for camera shake; (2) dust on hoof thuds and noise on the `track` texture to break panel repeat; (3) look at the replay once (REPLAY banner, 0.25x) and 2-player mode with the marker.
**Open** The post-popup-clear edit was syntax-checked only, not re-looked. Shake and track noise untouched.

### Judge 15

**Judge 15 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.**
   - I pressed Q, P, W and O for 10 frames each after `phase` reached "race". `horses.2` (`YOU`) went from x 1.4 to 3.14 and then fell, with `plants` 1 and `state` "down".
   - That rhythm face-planted `YOU` within 3 s. The `div#tips` line and the `div#keys` pads are on screen.
   - Iteration 15's eval run (`finishT` 20.2 s) was not reproduced through `interact`.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - I saw a face-plant: `YOU` is down with `pitch` -0.74 and `legs` "0000". The `horse0-*` to `horse3-*` limbs are jointed.
   - I did not see the auto-right after ~2 s.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - Carried over. I did not see it.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - The iteration 15 eval run had a +0.13 s PHOTO FINISH.
   - In my look, the horses in `Mesh*` and `horse*` overlap in adjacent lanes at 2.7 s.
5. **Results with most face-plants award: 8.**
   - Iteration 15 reported 4 rows with SMOOTH OPERATOR and "DIRT EATER · MOST FACE-PLANTS". I did not see them myself.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` crowd, rail fence, `hills`, `sky` and `dust*` ×39 match refs/01.jpg.
   - The `player-marker-*` ring and arrow are visible: 0.51% of the frame.
   - Subject edge contrast is 0.146, and `YOU` takes 1.8% of the frame.
   - The `track` still shows a faint panel pattern.
7. **window.__game convention, index.html at root: 9.**
   - `open` returns the `__game` name, stack and keys.
8. **Clip moments within the first minute, no input: 8.**
   - A face-plant happened at 2.7 s, and the dust and the horses in a pile read as funny.
9. **Controls feel learnable: 6.**
   - `YOU` face-planted 2.7 s into the race with the plain Q+P / W+O rhythm at 10 frames each.
   - That is the wrong way round for "a simple rhythm makes progress". Splits and cartwheels should come from mistimed keys, not from the first alternation.
   - The `legs` string was "0000" at the end, so nothing was driving the horse while it was down.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - Head, mane, tail, saddles, white socks and dark hooves read in the look.
    - `horse3-*` (the blue saddle) is a dark horse like the others, but the ring picks it out.
11. **Juice: 8.**
    - 7 sounds fired: blip ×3, powerup, cheer, thud, gasp.
    - The FACE-PLANT! popup works. Camera shake is still unmeasured by `feel`.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows "1 PLAYER", "2 PLAYERS (2)" and RESTART.
13. **Static page, vendored lib, no network: 9.**
    - 385 draw calls, 33.7k triangles, 0 MB of assets.
    - The 66 ms frame is SwiftShader at host load 1.9, so it is noise, not a fault.

**Faults: 7.**
- "Never visible: none". The only console message is the shadowmap warning.
- The FACE-PLANT! popup, `div.pop` [430, 83, 849, 202], sits over the grandstand and covers the top of the frame. It is acceptable but large.
- The `div#chips` list is clean.

**Next:**
1. **Make the first seconds of a simple rhythm survive.**
   - Use `interact` with `{until:{phase:"race"}}`, then Q+P and W+O at 10 frames each, tracing `horses.2.x`, `horses.2.plants` and `horses.2.state`.
   - It is done when `plants` stays 0 and x passes 15 by about frame 400.
   - Ease the first-step torque or pitch destabilisation for the first ~3 s, or add a pitch-stabilising torque while two or more legs are driven, so the early face-plant needs a bad rhythm.
2. **Measure camera shake and the replay.**
   - Run `feel` on a face-plant and expect a nonzero camera displacement that decays within about 0.5 s.
   - Then `look` once at the replay to see the REPLAY banner and the 0.25x pace.
   - Add the `dust*` on hoof thuds and noise on the `track` texture to break the panel repeat. Both were asked in iteration 14 and 15 and are still undone.
3. **Make the player stand out more.**
   - Raise the `player-marker-*` size, or tint the player's `horse3-*` body a lighter colour.
   - `look` with `sample` at the horse pixels should show the subject at over 20% brightness against its surroundings, not 9%.
   - Then check 2-player mode with the marker (`interact` `Digit2`, `look`).

SCORE: 7.8

## Iteration 16
**Did** game.js (per-horse loop before `h.step(DT)`): human horse's `assist` (pitch-stabilising torque gain in physics.js) is now 1+4*(1-raceT/5) for the first 5 s of the race (not in auto mode), so the plain Q+P / W+O rhythm no longer face-plants early.
**Saw** `interact` Q,P,W,O ×4 at 10 frames each after phase "race": `horses.2` (`YOU`) plants 0, pitch within -0.05..0.03, x 1.4→5.29 over 353 frames (2.7 s race time). No console errors besides the shadowmap warning. Did not look at pixels or run longer.
**Next** (1) rerun the rhythm for 20 s to check the assist fade-out at 5 s doesn't cause a late plant and x passes 15; (2) `feel` on a face-plant for camera shake, view the replay once; (3) dust on hoof thuds, noise on `track` texture, brighter player horse.
**Open** Only the first 2.7 s were played; progress speed (5 m in 2.7 s) not tuned. Shake, replay, track noise, and 2-player marker still unverified.

### Judge 16

**Judge 16 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.**
   - After `phase` "race" I held Q, P, W, O for 10 frames each, 14 cycles. `horses.2` (`YOU`) stayed `state` "run" with `plants` 0 throughout, which is the early face-plant fix working.
   - `YOU` moved x 1.4 → 14.64 in about 7 s of race time, and `div#keys` and `div#tips` are visible. Pace is the weak point: about 1.9 m/s, so 60 m would take well over 30 s on this rhythm.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - `horse0-*` to `horse3-*` limbs are jointed. `Sir Trips-a-Lot` and `Hoof Hearted` went `state` "down" with `plants` 1 at 7 s.
   - I did not see the auto-right again.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.**
   - `phase` switched to "replay" with `replay.kind` "plant", `pos` 338.5 of 425 frames. I did not look at the banner.
4. **Photo finish and tangled AI collapse within the first minute: 8.**
   - `tangles` was 1 at 7 s, when both AI horses went down in adjacent lanes (z -1.25 and -0.33). The photo finish was not re-run this session.
5. **Results with most face-plants award: 7.**
   - Not seen this session. It is carried from iteration 15's eval.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` crowd, rail fence with the "10 m" sign, `hills`, `sky` and `dust*` ×80 read as sunny low-poly like refs/01.jpg.
   - The `player-marker-*` ring and arrow work.
   - Subject contrast is still low: `YOU` takes 1.8% of the frame, at 9% brightness against 25% around it. The `track` is the dark brown.
7. **window.__game convention, index.html at root: 9.**
   - `open` returns the name, stack and keys.
8. **Clip moments within the first minute, no input: 8.**
   - A two-horse pile-up and an auto replay happened by 7 s.
9. **Controls feel learnable: 7.**
   - The plain alternation now survives to 14.6 m with no plants.
   - Progress is slow and was only tested for 7 s. The fade-out of the assist at 5 s caused no plant. Cartwheels and splits from mistimed keys were not tested.
10. **Horses read as horses, match refs/01.jpg: 8.**
    - Head, mane, tail, white socks, dark hooves and saddles read clearly in `horse*`.
    - `horse3-*` (the player's horse) is almost black and merges with the brown track.
11. **Juice: 8.**
    - Sounds fired: blip, powerup, cheer, thud, gasp.
    - The `div#chips` FACE-PLANTS counters work, and `dust*` flies from the hooves.
    - Camera shake is still unmeasured.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows "2 PLAYERS (2)". The 2-player marker was not checked.
13. **Static page, vendored lib, no network: 9.**
    - 385 draw calls, 33.7k triangles, 0 MB of assets.
    - The 65 ms frame is SwiftShader at host load 2.7, so it is noise, not a fault.

**Faults: 8.**
- "Never visible: none". The only console message is the shadowmap warning.

**Next:**
1. **Speed up the player and run to the finish.**
   - Raise the human horse's drive so a plain Q+P / W+O rhythm covers 60 m in about 30–45 s.
   - `interact` with the same rhythm over about 40 cycles, tracing `horses.2.x` and `finishT`.
   - It is done when `YOU` reaches x ≥ 60 with `finishT` under 60 s and `phase` goes to "replay" or "results". This also gives the first look at the results screen and the photo finish.
2. **Make the player's horse stand out.**
   - Lighten or recolour the `horse3-*` body, or enlarge `player-marker-*`.
   - `look` with `sample` at the horse body should show brightness over 20% against the surroundings, not 9%.
   - Lightening the `track` would also help.
3. **Measure the camera shake and see the replay.**
   - Run `feel` on a face-plant and expect a nonzero shake that decays within about 0.5 s.
   - After `phase` is "replay", run `look` once to check the REPLAY banner. Asked in iterations 14–16 and not yet verified.
   - Also add noise to the `track` texture to break the panel repeat.

SCORE: 8.0

## Iteration 17
**Did** game.js line ~240: human `driveF` multiplier 2.4 → 4.5 (solo, non-auto). view.js `COATS[2]` (the player's coat in solo) 0x3a302c → 0xe8d8b0 (pale cream) so `YOU` stands out from the track.
**Saw** Q+P / W+O at 10 frames, race time 0.95→2.82 s: `horses.2.x` 2.25→6.46 (≈2.2 m/s), plants 0, pitch ≤0.01; AI at 3.5–6.2, so the player keeps pace/leads. `look`: subject brightness 50% vs 38% around, edge contrast 0.18; player-marker ring/arrow visible; "Never visible: none"; only the shadowmap warning. Did not run to the finish (x 60), results, replay banner or shake.
**Next** (1) run ~40 rhythm cycles, trace `horses.2.x`/`finishT`, reach results and look; (2) `feel` on a face-plant for shake, `look` at the REPLAY banner; (3) track texture noise.
**Open** Speed gain only measured over 2 s; the late-race assist fade (5 s) with the higher drive is untested. Cream coat only affects horse index 2 (in 2-player mode that is P2's horse? coats are per index).

### Judge 17

**Judge 17 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.**
   - I held Q+P then W+O for 10 frames each over 4 s. `horses.2` (`YOU`) went from x 1.42 to 7.17 with `plants` 0, `state` "run" and `pitch` at most 0.02 in magnitude.
   - That is about 2.3 m/s, so the 60 m would take about 26 s, which fits the under-60 s target. I did not run it to x 60.
   - `div#keys` and `div#tips` are visible.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - The `horse0-*` to `horse3-*` limbs are jointed, and in this run `Hoof Hearted` and `Dusty Rhodes` showed `y` dips and `pitch` -0.1.
   - I saw no face-plant or auto-right this session.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 7.**
   - Not reached this session. The `phase` "replay" switch was seen in judge 16, but the banner has not been looked at in any session.
4. **Photo finish and tangled AI collapse within the first minute: 7.**
   - No collapse happened in the first 4 s (all four `plants` 0). The tangle was seen in judge 16, and the photo finish has never been reached.
5. **Results with most face-plants award: 6.**
   - Not seen. The only evidence is the earlier eval from iteration 15.
6. **Looks as LOOK.md says: 9.**
   - The `grandstand` crowd, rail fence, `hills`, `sky` and `track` read as sunny low-poly like refs/01.jpg.
   - The cream-coated `horse3-*` (YOU) now stands out. Subject brightness is 47% against 31% around it, up from 9% against 25%.
   - The blue `player-marker-*` ring and arrow are clear.
   - The `track` is still a flat brown, with visible panel repeats.
7. **window.__game convention, index.html at root: 9.**
8. **Clip moments within the first minute, no input: 7.**
   - The first 4 s with input were clean running. The earlier tangle and auto replay were seen in judge 16, but not re-checked.
9. **Controls feel learnable: 8.**
   - A plain Q+P / W+O rhythm gives steady progress with no plants and a pace that finishes in about 26 s.
   - Mistimed keys (splits, cartwheels, dog-sits) were not tested this session.
10. **Horses read as horses, match refs/01.jpg: 9.**
    - Head, mane, tail, white socks, dark hooves, saddle colours and lane colours read clearly in the look.
11. **Juice: 8.**
    - Sounds fired: blip, powerup, cheer. Dust flies from the hooves, and the `div#chips` face-plant counters work.
    - Camera shake is still unmeasured after four iterations.
12. **Local 2-player discoverable from the HUD: 8.**
    - `div#top-r` shows "1 PLAYER" and "2 PLAYERS (2)". The 2-player marker and the cream coat per index were not checked.
13. **Static page, vendored lib, no network: 9.**
    - 387 draw calls, 33.8k triangles, 0 MB of assets.
    - The 66.9 ms frame is SwiftShader at host load 3.0, so it is noise, not a fault.

**Faults: 9.**
- "Never visible: none". The only console message is the shadowmap warning.

**Next:**
1. **Verify the end of the race: finish, photo finish, replay banner and results.** This was asked in iterations 15–17 and is still unverified.
   - Add a debug `setState`, or an `act` such as `{action:"teleport", x:55}` for the human horse, so `interact` can reach the finish in one call. Expect `phase` "replay" with a `REPLAY` banner, then "results".
   - Use `look` with `sample` on the banner and on the results screen to check the face-plants award text is there.
   - Check that 2-player mode gives the cream coat to the right horse.
2. **Measure camera shake with `feel` on a face-plant.**
   - Force `Hoof Hearted` to `state` "down" via `setState`. Expect a nonzero shake that decays within about 0.5 s.
   - Also look at the auto-right after about 2 s.
3. **Break up the `track` repeat and add AI pressure.**
   - Add noise or hoof-print variation to the `track` texture, and lighten it a little.
   - Check the AI collapses within the first 10 s with a `sheet` at frames 300, 480 and 600 with no input. Expect `tangles` ≥ 1 in at least one of them.

SCORE: 8.0

## Iteration 18
**Did** game.js line 226: face-plant `shakeAmp` 0.12 → 0.3 (shake was ~0.07 m, near invisible; `feel` showed no camera shake since the follow cam moves). Otherwise verification only.
**Saw** Via `setState` horses teleport: no-input run reached `phase` "replay" (plant replay) at raceT 8.03: REPLAY banner [38,88,406,173] and "SPACE to skip" visible. Space skipped; teleport of `YOU` to x 58.5 gave finishT 8.07, `finishing` → replay (finish kind) → `results`: "YOU WINS!" box with podium, ranked list, DNF "20 m short", "DIRT EATER · MOST FACE-PLANTS" badge on Sir Trips-a-Lot. "Never visible": dust only (when far from view). Only the shadowmap warning in console. Did not run `perf` or re-look after the shake change.
**Next** (1) check 2-player cream coat per horse index; (2) track texture variation/lighten (flat brown); (3) results box: the podium "1" card overlaps the horse behind it — consider dimming bg more; verify photo finish with two AI finishing close.
**Open** Shake amplitude change untested visually. Photo finish (two finishers within 0.3 s) never observed.

### Judge 18

**Judge 18 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.**
   - This session I pressed Q+P then W+O, but the 20-frame holds were too short. `YOU` was at x 1.41 after 2.57 s, with `legs` "0000", `pitch` 0 and `state` "run". The AI horses were at x 3 to 5.5.
   - `div#keys`, `div#tips` and `div#top-r` ("1 PLAYER", "2 PLAYERS (2)", "RESTART") are visible.
   - Judge 17 measured about 2.3 m/s with a longer rhythm, so I did not re-measure it.
2. **Real Rapier jointed ragdoll, face-plant and auto-right: 8.**
   - The `horse0-*` to `horse3-*` limbs and the dust bursts from the hooves read as jointed running.
   - No face-plant happened in this run, so face-plant and auto-right were not re-seen.
3. **Replay: 8.**
   - Iteration 18 recorded the REPLAY banner and "SPACE to skip". I did not re-check them.
4. **Photo finish and tangled AI collapse within the first minute: 7.**
   - No collapse happened in the first 2.6 s. All four `plants` were 0.
   - A photo finish with two horses within 0.3 s has still never been observed.
5. **Results with most face-plants award: 8.**
   - Iteration 18 recorded the "YOU WINS!" box with the "DIRT EATER · MOST FACE-PLANTS" badge. I did not re-check it. The podium "1" card overlaps the horse behind it.
6. **Looks as LOOK.md says: 8.**
   - The `grandstand` with its blocky crowd, the white rail fence, `hills`, `sky` and `track` read as sunny low-poly like refs/01.jpg.
   - The blue `player-marker-*` ring and arrow are clear.
   - The cream `horse3-*` (YOU) is 44% bright against 45% around it. That is lower than judge 17's 47% against 31%, because the grey and tan horses sit right next to it. It stands out only through the blue ring.
   - The `track` is still a flat brown with visible panel repeats.
7. **window.__game convention, index.html at root: 9.**
8. **Clip moments within the first minute, no input: 7.**
   - The tangle and the auto replay were seen earlier, but not in this run.
9. **Controls feel learnable: 8.**
   - Judge 17's Q+P / W+O rhythm gave steady progress with no plants. Mistimed keys were not tested this session.
10. **Horses read as horses, match refs/01.jpg: 9.**
    - Head, mane, tail, white socks, dark hooves and saddle colours all read in the look.
11. **Juice: 8.**
    - Sounds fired: blip ×3, powerup, cheer. Dust flies and the `div#chips` counters work.
    - The `shakeAmp` 0.3 change from iteration 18 is still not seen visually.
12. **Local 2-player discoverable from the HUD: 8.**
    - The cream coat per player index was not checked.
13. **Static page, vendored lib, no network: 9.**
    - 387 draw calls, 33.8k triangles, 0 MB of assets.
    - The 67 ms frame is SwiftShader at host load 1.6, so it is no budget signal.

**Faults: 9.**
- "Never visible: none". The only console message is the shadowmap warning.

**Next:**
1. **Make the player horse (`horse3-*` / `YOU`) stand out and show shake.**
   - Give the player a saturated or white coat, or a brighter saddle, so it separates from the tan and grey neighbours.
   - Check with `look` `sample` on the player body and on the horse beside it, and expect a clear colour difference.
   - Then use `setState` to put `Hoof Hearted` "down" and take a `sheet` of consecutive frames. Expect a visible camera offset that decays within about 0.5 s.
2. **Break up the `track` repeat and the flat brown.**
   - Add noise, hoof-prints and lighter lane stripes to the `track` canvas texture.
   - Check with a `look` `zoom` on the track at the start line, and expect no visible panel repeat.
3. **Check 2-player mode, a mistimed-key run and a photo finish.**
   - Press `Digit2` and look for a distinct `player-marker-*` and coat on each horse.
   - Teleport two AI horses to x 58 with different speeds. Expect a "PHOTO FINISH" caption and a side replay.
   - Also dim the results box background so the podium "1" card no longer overlaps the horse behind it.

SCORE: 8.2

## Iteration 19
**Did** game.js `assignRoles`: the human horses now get their own coats, not the slot coat. P1 `YOU` is near-white 0xfbf7ee and P2 is dark 0x2e2833. The AI horses keep `COATS[i]`. view.js `track`: faces get a lighter stripe every ~1.57 m along z, plus low-frequency noise lightness, to break the flat brown.
**Saw** `look` at frame 0: no console errors and "Never visible" is dust only. `YOU` (white, `horse2`) separates clearly from the tan, grey and rust neighbours, with the blue ring. Subject brightness 48% against 30% around it. The track stripes are subtle. Did not run `perf`, 2-player mode, the shake sheet or a photo finish.
**Next** (1) Check the 2-player coats (P2 dark) and the `player-marker-*` colours. (2) Look at the track from the start line with `zoom` to see whether the stripes or noise are enough. (3) Photo finish with two AI at x 58, and the dim behind the results box. Also take a `sheet` of consecutive frames after a face-plant for the `shakeAmp` 0.3 shake.
**Open** The track change is untested at the start-line zoom. Shake, photo finish and 2P are still unverified.

### Judge 19

Both of those `Surfaces:` lines are already in my verdict. Next item 1 covers the track repeat and the z-fighting between the two `player-marker-*` rings, and the Faults score of 8 counts the z-fighting.

**Judge 19 verdict (final)**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `Digit2` gives `mode` 2 with P1 and P2 horses, each with its own `player-marker-*` ring. `div#keys` shows both key sets. My key taps were too short to move the horses, so I did not re-measure speed.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** The `horse0-*` to `horse3-*` limbs read as jointed. By 20 s, two horses showed `FACE-PLANTS` 1 in the `div#chips`.
3. **Replay: 8.** Not re-seen this session. Iteration 18 recorded the banner.
4. **Photo finish and tangled AI collapse within the first minute: 7.** AI horses face-planted by 20 s. No finish was reached in my run, and a photo finish has never been observed.
5. **Results with most face-plants award: 8.** Not re-checked. The podium "1" card overlaps the horse behind it, as in judge 18.
6. **Looks as LOOK.md says: 8.** The `grandstand`, rail fence, `hills`, `sky` and `clouds` match refs/01.jpg. The white YOU horse is 52% bright against 29% around it. The `track` is the weakest surface: its repeat shows and the brown is flat.
7. **window.__game convention, index.html at root: 9.**
8. **Clip moments within the first minute, no input: 7.** The camera follows the still YOU horse, so the AI tangle is mostly off-screen.
9. **Controls feel learnable: 8.** The tips line and `div#keys` caps guide the player. Mistimed keys were not tested.
10. **Horses read as horses, match refs/01.jpg: 9.**
11. **Juice: 8.** Sounds fired: blip ×3, powerup, cheer. The "GO!" banner and dust work. The `shakeAmp` shake is still not seen.
12. **Local 2-player discoverable from the HUD: 9.** The "2 PLAYERS (2)" button, the per-player key caps and the pink `player-marker-1` all show.
13. **Static page, vendored lib, no network: 9.** 387 draw calls, 33.8k triangles, 0 MB of assets. The 65 ms frame is SwiftShader at host load 6.0, so it is no budget signal.

**Faults: 8.** "Never visible: none" and no console errors. The z-fighting between `player-marker-0` and `player-marker-1` at y = 0.06 is a fault.

**Next:**
1. **Fix the `track` repeat and the z-fighting rings.**
   - Vary the `track` texture scale with distance, or blend two scales, and make the lane stripes and hoof-prints clearer. `look` should no longer report "repeats every 60 px".
   - Give the `player-marker-*` rings `polygonOffset` or a 0.001 y offset. The `Surfaces:` line should disappear.
2. **Keep the AI collapse and finish in frame when the player stands still.** Frame the camera on the lead pack or on the horse that just face-planted. A no-input `sheet` at 10 s, 20 s and 35 s should show the tangle.
3. **Verify the unseen moments.** Use `setState` to put two AI horses at x 58 and check the "PHOTO FINISH" caption and the 0.25x replay. Put a horse "down" and `sheet` consecutive frames for the shake. Check the podium overlap on the results screen. Then run a Q+P / W+O rhythm for 20 s and read x from `observe`.

SCORE: 8.2

## Iteration 20
**Did** game.js `markers`: ring `polygonOffset` per player plus y 0.07 + k*0.03, to end the z-fight between `player-marker-0` and `player-marker-1`. view.js `track`: stripe spacing now varies with x (1.4–1.9 m by a noise cell, wavy with sin(x)), and a low-frequency lightness noise is added, so the repeat is broken.
**Saw** `look` at frame 0: no console errors. The `Surfaces:` lines for track repeat and marker z-fighting are gone. The only one left is two hidden `grandstand` boxes sharing a face at y=0, facing away from the camera. Brightness 42%, subject 48% against 30%. I did not run `perf`, 2P, the shake, photo finish or a no-input AI tangle.
**Next** (1) Frame the camera on the lead pack or the horse that face-planted when the player is still. (2) Use `setState` to put two AI at x 58 for the photo finish, and check the podium overlap. (3) `sheet` consecutive frames after a face-plant for the shake. Move one hidden `grandstand` box off y=0.
**Open** Only frame 0 was checked. Photo finish, shake, 2P and the AI collapse are still unverified.

### Judge 20

**Judge 20 verdict**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** The sheet shows the HUD with `div#keys` caps and the SOLO / 2 PLAYERS / RESTART buttons. The `player` horse sits still with no input, and the clock counted up to 29.9 s. I did not play 2P this session.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** At 10 s the `horse*` limbs read as jointed and the `div#chips` list shows FACE-PLANTS. I did not see an auto-right.
3. **Replay: 7.** Not seen this session. In the 40 s moment the clock reached 29.9 s with no finish and no replay.
4. **Photo finish and tangled AI collapse within the first minute: 6.** At 10 s the AI pack is a tangle at the right edge, with only the front half in frame. By 25 s the AI have left the view, and a lone grey horse is cut off at the right edge. No photo finish appears in the first 40 s. It is still unobserved.
5. **Results with most face-plants award: 7.** Not reached. The podium overlap is still unchecked.
6. **Looks as LOOK.md says: 8.** The `track` repeat is gone and `look` gives no `Surfaces:` lines. The `grandstand`, rail fence, `hills`, `sky` and `clouds` match refs/01.jpg. The `player` subject is only 0.5% of the frame at 25 s and 40 s, so it is small.
7. **window.__game convention, index.html at root: 9.**
8. **Clip moments within the first minute, no input: 6.** The camera stays on the still `player` horse. After about 12 s the AI are off-screen and the viewer sees an empty track, so the first-minute laugh is missed.
9. **Controls feel learnable: 8.** The tips line and key caps guide the player. I did not test a rhythm this session.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, white socks and the blue saddle cloth read, with dust at the hooves.
11. **Juice: 8.** The HUD, "10 m" sign, dust and `player-marker-*` ring all show. I did not see the shake.
12. **Local 2-player discoverable from the HUD: 9.** The "2 PLAYERS (2)" button is visible.
13. **Static page, vendored lib, no network: 9.** `perf` gave 385 draw calls, 33.7k triangles and 0 MB of assets. The 76 ms frame is SwiftShader at host load 6.8, so it is no budget signal.

**Faults: 8.** No console errors and no `Never visible` object. The sheet took 373 s, which is a software-renderer cost.

**Next:**
1. **(asked again) Keep the AI pack and the finish in frame when the player stands still.** Frame the camera on the lead AI horse or the pack once the player's x falls behind it by a set margin, and cut to the finish line near x 55. A no-input `look` `sheet` at 25 s and 40 s should show AI horses in frame, not an empty track.
2. **(asked again) Verify the photo finish and the replay.** Use `interact` with `{ state: ... }` to put two AI horses at x 58, then `look` with `sheet` over the next frames. It should show a "PHOTO FINISH" caption, the REPLAY banner and 0.25x motion. Then check the results podium overlap.
3. **Check the face-plant shake and make the player easier to see.** Put a horse down with `setState`, then run `feel` or take consecutive-frame `sheet` moments and look for the `shakeAmp` shake. Raise the `player` horse's screen size above 1%, for example with a closer camera or a bigger marker ring.

SCORE: 7.9

## Iteration 21
**Did** game.js `followTarget`: when the lead horse is more than 8 m ahead of the human mean x, the camera weight rises from 0.3 to 0.85 (smoothstep over 8–30 m gap, gap clamp 60), and the zoom-out `far` is capped at 26. The camera now drifts to the pack when the player stands still.
**Saw** `look` sheet, no input, at 20 s and 35 s: the AI pack is in frame at 20 s (a grey/brown tangle plus a lone runner) and the AI cross the FINISH banner at 35 s. No console errors. `player` is 0% of the frame (off-screen left), so it is still invisible. I did not run `perf`.
**Next** (1) Keep the player in view as well: widen the camera, or add an edge arrow or HUD "YOU" marker when the player is off-screen. (2) `setState` two AI at x 58 and sheet the photo finish, replay and podium overlap. (3) Check the face-plant shake with consecutive-frame sheets. Move one hidden `grandstand` box off y=0.
**Open** Photo finish, replay, results, shake and 2P are still unverified. Gap-drift thresholds are untuned.

### Judge 21

The replay did appear at 15 s with a tangle. Player is off-screen still.

**Verdict, session 21**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** The HUD at 30 s shows the `div#keys` caps Q W O P and the 1 PLAYER, 2 PLAYERS (2) and RESTART buttons. The `YOU` row shows in the standings list. The camera now follows the AI pack. I did not play 2P or a key rhythm this session.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** At 15 s the `horse*` bodies are jointed and tangled, and `div#chips` lists FACE-PLANTS 1 and 2. I did not see an auto-right.
3. **Replay: 8.** At 15 s the REPLAY banner and "SPACE to skip" show over a close-up of the tangled horses. I did not measure the 0.25x rate.
4. **Photo finish and tangled AI collapse in the first minute: 7.** The tangle is visible in the replay at 15 s. At 30 s the AI are a lone pair at the "40 m" sign. I did not see a PHOTO FINISH caption.
5. **Results with most face-plants award: 7.** Not reached. The podium overlap is unchecked, and this is the third session running.
6. **Looks as LOOK.md says: 8.** `grandstand`, white rail, `hills`, `sky`, `clouds` and the dirt `track` match refs/01.jpg, and `look` gave no `Lighting:` or `Surfaces:` lines. The `player` subject is 0.07% of the frame at 15 s and 0% at 30 s, so the subject does not stand out.
7. **window.__game convention, index.html at root: 9.**
8. **Clip moments in the first minute, no input: 8.** The replay at 15 s shows the tangle in close-up, so the laugh lands. The live view at 30 s is thin, with only two horses far from the camera.
9. **Controls feel learnable: 8.** The tip line and key caps guide the player. A key rhythm was not tested this session.
10. **Horses read as horses, match refs/01.jpg: 9.** The 15 s replay shows head, mane, white socks, the yellow saddle cloth and the grey and brown coats.
11. **Juice: 8.** The REPLAY banner, "40 m" sign, dust, standings chips and key caps show. I did not see or hear the shake, sound or commentator popups this session.
12. **Local 2-player discoverable from the HUD: 9.** The "2 PLAYERS (2)" button is visible.
13. **Static page, vendored lib, no network: 9.** `perf` gave 386 draw calls, 33.8k triangles and 0 MB of assets. The 91 ms frame is SwiftShader at host load 6.0, so it is no budget signal.

**Faults: 8.** No console errors and no `Never visible` object.

**Next:**
1. **(asked again) Keep the player visible.** When the player is off-screen, add an edge arrow or HUD "YOU ◀ 23 m" marker, or widen the camera so the `player` horse is above 1% of the frame. `look` with `sheet` at 30 s should show the marker or the horse, with `sample` at the marker's pixels showing the marker colour.
2. **(asked again) Verify the photo finish and the results.** Use `interact` with `{ state: ... }` to put two AI horses at x 58 with the player ahead, then `look` with `sheet`. It should show the "PHOTO FINISH" caption, the 0.25x side replay and the results screen with the most face-plants award. Check the podium for overlap.
3. **Play a human rhythm and 2P.** Use `interact` with Q+P then W+O for about 600 frames and `trace` the `player` x. It should pass 60 m in under 60 s. Then press `2` and check that the Q W E R vs U I O P keys move two horses. Also run `feel` on a face-plant for the shake.

SCORE: 8.2

## Iteration 22
**Did** game.js `updateHud`: per human horse, a fixed pill `#off<i>` (role colour, "◀ YOU 28 m" / "YOU n m ▶") shows at the screen edge when that horse projects off-screen, in countdown/race/finishing phases only.
**Saw** `look` sheet at 8 s and 20 s, no input: the blue "◀ YOU 28 m" pill shows at left both times (13 m at 20 s); the `player` horse is still off-frame (0%) but now located. No console errors. `perf` not run.
**Next** (1) `setState` two AI at x 58 and sheet photo finish, results, podium overlap. (2) Play Q+P/W+O for ~600 frames, trace `player` x; press 2 and test 2P keys. (3) `feel` the face-plant shake.
**Open** Photo finish, results, shake and 2P are unverified for a fourth session. Pill overlaps nothing at 1280x800; not checked on phone.

### Judge 22

**Verdict, session 22**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** `div#keys` (Q W O P) lights the held key caps, and the 1 PLAYER, 2 PLAYERS (2) and RESTART buttons show. After a `setState` jump, a Space press moved the game from the `replay` phase to the `results` phase. I did not run a real key rhythm over 60 m, and I did not press 2 for two players.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 7.** The `horse*` parts are jointed and the legs move with the keys. This session had no face-plant: `plants` was 0 for all four horses. Auto-right is still unseen.
3. **Replay: 8.** The REPLAY banner and "SPACE to skip" show over a side view of the finish. The 0.25x rate was not measured.
4. **Photo finish and tangled AI collapse: 8.** The `div.pop` reads "PHOTO FINISH! YOU by a nose (0.43s)!" over the replay, with the `finish-line` checker in view. The caption is semi-transparent and fights the crowd behind it. No tangle appeared this run.
5. **Results with most face-plants award: 7.** The podium (YOU 1, Hoof Hearted 2, Sir Trips-a-Lot 3) and a table with a face-plants column show, and the podium does not overlap the table. With 0 face-plants everywhere there was no "most face-plants" award line, so the award itself is unverified.
6. **Looks as LOOK.md says: 8.** `grandstand`, white rail, `hills`, `clouds` and the dirt `track` match refs/01.jpg, and there are no `Lighting:` or `Surfaces:` lines. The `player` subject is 1.3% of the frame in the race and 0.11% on results, so it only just stands out. There is a `player-marker-*` triangle and a blue ring, which help.
7. **window.__game convention, index.html at root: 9.** `observe` returns phase, horses, replay and results.
8. **Clip moments in the first minute: 7.** The photo finish and replay work. The tangle needs a face-plant, which this run did not produce, so the "laugh" is only reliable in the replay of a tangle.
9. **Controls feel learnable: 7.** The tip "Alternate legs: Q+P then W+O" and the key caps guide the player. A 300-frame rhythm moved `YOU` only 1.4 m to 2.98 m, and a 60 m run was not tested.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, white socks, dark hooves and saddle cloths all show at close range.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer), and the popups, dust, FINISH banner and results box show. I did not feel the camera shake.
12. **Local 2-player discoverable from the HUD: 9.** The "2 PLAYERS (2)" button is visible.
13. **Static page, vendored lib, no network: 9.** `perf` gave 387 draw calls, 33.8k triangles and 0 MB of assets. The 64 ms frame is SwiftShader at host load 4.5, so it is no budget signal.

**Faults: 8.** No errors. The only console line is the three.js "PCFSoftShadowMap has been removed" warning, a trivial one. There is no `Never visible` object. The `player` is 0.11% of the frame on the results screen.

**Next:**
1. **Verify a face-plant, auto-right and the most-face-plants award.** Use `interact` with `{ state: ... }` to give a horse a pitch of about 1.4, then `observe`. It should show `plants` of 1 or more, a `state` that returns to "run" after about 2 s, and a "most face-plants" line in the results `div.box`. If the results never name that award, add it.
2. **Play a real rhythm and 2P.** Use `interact` with Q+P then W+O for 10 frames each over about 1800 frames, and `trace` `horses.2.x`. It should reach 60 m in under 60 s. Then press `2` and send Q W E R and U I O P, which should move two `human` horses.
3. **Make the player stand out on results and in the race.** Keep the `player` horse at 3% or more of the frame, for example by framing the camera on the player and nearest rivals, and make the PHOTO FINISH `div.pop` opaque, with a dark backing. `look` with `sample` on the caption pixels should show a solid colour behind the text.

SCORE: 8.0

## Iteration 23
**Did** index.html `.pop`: opaque dark backing (rgba .92), padding, border so the PHOTO FINISH caption reads over the crowd. The "DIRT EATER · MOST FACE-PLANTS" award already exists in game.js results (shown when maxP > 0).
**Saw** Not run through look this session (short on room); CSS-only change.
**Next** (1) force a face-plant via setState and confirm auto-right. (2) Real Q+P/W+O rhythm trace, then 2P. (3) frame camera so `player` is ≥3% of frame.
**Open** Face-plant, auto-right, 2P, rhythm still unverified; pop backing unchecked visually.

### Judge 23

**Verdict, session 23**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** `div#keys` (Q W O P), the 1 PLAYER, 2 PLAYERS (2) and RESTART buttons and `div#tips` all show. Replay → results works, and Space skipped the replay. My Q+P / W+O rhythm barely moved `YOU`: 1.39 m after 8 s, then 2.37 m at the end of the race. I did not press 2.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** With no setup, the AI horses face-planted by themselves. `Sir Trips-a-Lot` and `Hoof Hearted` reached `state:"down"` with `plants:1`. By the end `Hoof Hearted` had 2 plants and was back in `state:"run"`, so auto-right works. The `legs` bitmasks follow the keys.
3. **Replay: 8.** The `REPLAY` banner and "SPACE to skip" show over a face-plant replay (`kind:"plant"`, `tangles:1`). The 0.25x rate was not measured.
4. **Photo finish and tangled AI collapse: 8.** A tangle was logged (`tangles:1`) at 7.9 s. The results `div.box` reads "Dusty Rhodes WINS! PHOTO FINISH · 0.10s" with the `finish-line` checker in view.
5. **Results with most face-plants award: 9.** The podium and table show the "DIRT EATER · MOST FACE-PLANTS" badge on `Hoof Hearted` (2 plants), "SMOOTH OPERATOR" on the winner, and a face-plants column.
6. **Looks as LOOK.md says: 8.** `grandstand` with its blocky crowd, white rail, `hills`, the dirt `track` and the replay close-up with saddle and socks match refs/01.jpg. There are no `Lighting:` lines. One `Surfaces:` note on two `grandstand` boxes shares a hidden face plane and only matters from below. `Subject: player drew no pixel` in both looks: the player is hidden or off-camera.
7. **window.__game convention, index.html at root: 9.** `observe` returns phase, horses, replay, results and tangles.
8. **Clip moments in the first minute: 8.** Two AI face-plants, a tangle replay and a photo-finish replay happened with the player's input being a bad rhythm. The first laugh is reliably early.
9. **Controls feel learnable: 4.** The suggested "Alternate legs: Q+P then W+O" rhythm gets about 1 to 2 m in 30 s, and `YOU` ended 56 m short with a face-plant. Finishing 60 m in under 60 s is not shown.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, eye, saddle cloth, white socks and dark hooves all read.
11. **Juice: 8.** Sounds fired (thud, gasp, cheer, boing, powerup). The `div.pop`, `#chips` and results box show, and the PHOTO FINISH caption now has a darker backing. Shake was not measured.
12. **Local 2-player discoverable from the HUD: 8.** The "2 PLAYERS (2)" button and the tips line show. 2P play is still unplayed.
13. **Static page, vendored lib, no network: 9.** `perf` gave 386 draw calls, 33.8k triangles and 0 MB of assets. The 80 ms frame is SwiftShader and not a budget signal.

**Faults: 7.** The console has only the PCFSoftShadowMap warning. `dust` is reported as `Never visible` (outside the view). The player horse drew no pixel in either look.

**Next:**
1. **Make the controls learnable (asked again).** Tune the leg motor drive so a simple Q+P / W+O alternation, 10 frames each, gives steady forward motion. Add a stability aid such as a pitch-correcting torque, or a forward impulse on the leg that is down. Showing it done: `interact` with that rhythm for 1800 frames, `trace` `horses.2.x`. It should reach 60 with `plants` 0 or 1.
2. **Keep the `player` horse in frame.** The `Subject: player drew no pixel` line shows the camera follows the AI leaders. Frame the camera on `YOU` plus the nearest rival. A `look` mid-race should show the `player-marker` and `horse2-*` parts at 3% or more of the frame.
3. **Verify and polish 2P.** Press `2`, then hold Q/W/E/R and U/I/O/P in `interact`. `observe` should show two `human` horses (0 and 1) moving. Also make `dust` visible near the leaders so it is not `Never visible`.

SCORE: 7.9

## Iteration 24
**Did** game.js line ~239-240: player drive multiplier 4.5 → 12 (`h.driveF`), per-key-press `h.drive` bump 0.2 → 0.3, so Q+P / W+O alternation pushes the `YOU` torso harder.
**Saw** Before: Q+P/W+O at 10 frames each gave ~0.7 m/s (`horses.2.x` 1.42→1.9 in 40 frames). After: 1.4→3.23 over ~1 s of race (about 1.8 m/s), `plants` 0. Only 3 cycles tested, not 1800 frames. No look run, so the camera/player framing and 2P are untouched.
**Next** (1) Run the full 1800-frame rhythm and trace `horses.2.x` to 60. (2) Frame the camera on `YOU` + nearest rival. (3) Press 2 and verify two `human` horses; make `dust` visible.
**Open** Does the faster drive still tip `YOU` over at higher speed? Long run unverified; 2P unplayed.

### Judge 24

**Verdict, session 24**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips` and `div#keys` all show. Q+P / W+O alternation now moves `YOU` (`horses.2.x`). It went 1.4 → 5.5 m at 1.9 s and 16.3 m at 5.2 s, with `plants` 0 and `pitch` within ±0.03. I did not run it to the finish line or press R.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** The `legs` bitmasks follow the keys. In this session's runs the AI horses stayed in `state:"run"`. Face-plant and auto-right were seen last session, not in this one.
3. **Replay: 7.** Last session's `REPLAY` banner and Space skip hold. I did not trigger a replay this session, and the 0.25x rate is still unmeasured.
4. **Photo finish and tangled AI collapse: 7.** Last session's `tangles:1` and "PHOTO FINISH · 0.10s" hold. This session's quick runs showed no AI collapse. With `YOU` now fast, the tangle and photo finish depend on the AI, so the clip moments need re-checking.
5. **Results with most face-plants award: 8.** Not replayed this session. Last session's "DIRT EATER" badge and face-plants column stand.
6. **Looks as LOOK.md says: 8.** `grandstand` with its blocky crowd, white rail, `hills`, dirt `track`, `dust*`, socks, saddle cloths and the `GO!` banner match refs/01.jpg. There are no `Lighting:` lines. The `Subject:` line says `player` is 0.66–1.1% of the picture with 0 of its named parts showing, because the `player-marker-*` and `horse*` parts are all that is named. The player horse is drawn among its rivals, but the camera is not framed on it.
7. **window.__game convention, index.html at root: 9.** `observe` returns phase, mode, raceT and horses with their `legs`, `plants` and `pitch`.
8. **Clip moments in the first minute: 7.** The race has horses bunched in the first 2 s with dust. The AI face-plants and tangles were not seen this session, and the faster `YOU` may change the timing of both.
9. **Controls feel learnable: 7.** The alternation now holds about 3.3 m/s from 5 to 16 m (11 m in 3.3 s), which would put 60 m at roughly 20 s. Last session it managed 1–2 m in 30 s. I did not run it to 60 m or test mistimed keys, and `YOU` led the AI by 3 m at 5 s.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, saddle cloth, white socks and dark hooves read clearly in both looks.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer). The `GO!` banner, `div#chips` and the `player-marker` arrow and ring show. Shake was not measured.
12. **Local 2-player discoverable from the HUD: 8.** `2` gives `mode:2` with the `P1` and `P2` horses (`human` 0 and 1), `div#keys` for both players and the tips line. With Q, E, U and O held both horses moved (`legs` "1010"). Neither was played through a race.
13. **Static page, vendored lib, no network: 9.** `perf` gave 386 draw calls, 33.8k triangles and 0 MB of assets. The 85 ms frame is SwiftShader, not a budget signal.

**Faults: 8.** The console has only the PCFSoftShadowMap warning, and `Never visible` is none, so `dust*` is now seen. The player horse still shows 0 named parts in `Subject`.

**Next:**
1. **Frame the camera on `YOU` plus the nearest rival (asked again).** The `Subject: player` line gives 0.66–1.1% of the picture with 0 named parts. Follow the human horse's x, or the midpoint of the humans in 2P, and keep a slightly closer fov. A mid-race `look` should show `player` at 3% or more with its named parts listed.
2. **Re-check the clip moments now that `YOU` is fast.** Check that the AI still tangles and face-plants in the first minute, that a player running a good rhythm still gets a close finish, and that a replay and a results screen fire. `interact` the rhythm for about 1500 frames with `until` `phase` "results", then `observe` `tangles` and `results`. Slow the player's drive slightly, or give the AI a rubber-band, so the finish stays close.
3. **Add a mistimed-key test and measure the replay and shake.** Press Q+W+O+P together or a single leg, and confirm a dog-sit, cartwheel or face-plant with `plants` rising. Run `feel` on a face-plant for the camera shake, and time the 0.25x replay against `replay.t` for wall-clock.

SCORE: 7.9

## Iteration 25
**Did** game.js camera: `followTarget` dist base 9.4 → 7.4 (height 3.5 → 3.0 offset), and `updateCamera` fov 36 while `S.phase` is 'race' or 'finishing' (42 elsewhere), so the camera sits closer on `YOU` plus nearby rivals.
**Saw** Mid-race `look` at 1.8 s: `Subject: player` takes 3.8% [102,359,531,533] (was 0.66–1.1%); `horse*`, `player-marker-*`, `dust*` all visible; `Never visible` none; only the PCFSoftShadowMap warning, plus a grandstand coplanar-face note (faces turned away). YOU at x 2.39 in a bunch of 4. `Subject` still lists 0 named parts. Not run: perf, full-race rhythm, replay, mistimed keys, 2P.
**Next** (1) Run ~1500 frames of rhythm to phase "results" and check `tangles`, `results`, and a close finish (rubber-band the AI if YOU wins by far). (2) Mistimed keys (Q+W+O+P, single leg) → `plants` rising; `feel` on shake; time replay 0.25x. (3) Check the closer camera in 2P (humans' midpoint) and when YOU falls behind.
**Open** Closer camera untested at speed, in 2P and in the finish replay; the interact `key` steps need `down:true/false` (no `hold`).

### Judge 25

**Verdict, session 25**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips` and `div#keys` show, and `YOU` moves under Q+P / W+O. One short rhythm (about 4 s) only took it from x 1.4 to 2.2. After I stopped pressing, it stood at x 4.7 with `plants` 2 while both AI horses finished. I did not press R or run 2P.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `legs` bitmasks follow the keys. `YOU` reached `plants` 2 and the sounds included "thud", "gasp" and "boing". I did not see auto-right.
3. **Replay: 6.** `replay.t` is not in `observe()`, so the 0.25x rate cannot be measured. I did not watch the banner this session.
4. **Photo finish and tangled AI collapse: 6.** `Hoof Hearted` (`finishT` 22.12) and `Dusty Rhodes` (22.22) finished 0.10 s apart, so the photo finish holds. `tangles` stayed 0 and no AI had `plants` above 0 in this run, so the AI tangle did not happen.
5. **Results with most face-plants award: 7.** `phase:"results"` came at `raceT` 28.6 with `results` ordered Hoof Hearted, Dusty Rhodes, Sir Trips-a-Lot, YOU. I did not look at the screen for the award badge. Results fired while `Sir Trips-a-Lot` (x 35.8) and `YOU` had not finished.
6. **Looks as LOOK.md says: 7.** The `grandstand` with its crowd, white rail, `hills`, dirt `track` and `dust*` match refs/01.jpg. The `Subject: player` line is 1.2% with 0 named parts, which was 3.8% last session. In the mid-race look the `YOU` horse is half hidden behind `horse3` and its yellow saddle cloth. The "GO!" banner covers the grandstand. The camera is so close that horses are cut off at the left edge. There is a grandstand coplanar-face note, on faces turned away.
7. **window.__game convention, index.html at root: 9.** `observe` returns phase, mode, raceT, results and horses.
8. **Clip moments in the first minute: 6.** The photo finish came at 22 s. The tangle did not occur in this run, and a laugh in the first 10 s depends on it.
9. **Controls feel learnable: 6.** I could not reproduce the finish in under 60 s from one short rhythm. The earlier 3.3 m/s run is last session's, and I did not test it at length this time.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, saddle cloths, white socks and dark hooves read clearly.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer, thud, gasp, boing). The `GO!` banner, `div#chips`, `player-marker` and `div#keys` show. Shake was not measured.
12. **Local 2-player discoverable from the HUD: 7.** The tips line says "2 = two players" and the `2 PLAYERS (2)` button shows. I did not run 2P this session.
13. **Static page, vendored lib, no network: 9.** 383 draw calls, 33.6k triangles and 0 MB of assets. The 80 ms frame is SwiftShader and says nothing about a real GPU.

**Faults: 7.** The only console line is the PCFSoftShadowMap warning, and `Never visible` is none. `Subject` still lists 0 named parts. The closer camera lets rivals hide `YOU`.

**Next:**
1. **Fix the camera so `YOU` is never hidden (asked again).** Raise the camera or offset it sideways so rivals do not cover `player`, and put `YOU`'s lane in the near half of the frame. Pull the dist back to about 8.5 and keep the fov at 36 during the race. A mid-race `look` at 1.8 s should give `Subject: player` at 3% or more, with `player` not overlapped by `horse3`. Name the player's parts (`player-body`, `player-head`) so `Subject` lists them.
2. **Make the AI tangle reliably in the first 30 s, and let results wait for everyone.** `tangles` was 0 and all AI `plants` were 0 here. Add a forced pile-up event, such as two neighbouring lanes crossing with a stumble at x 20–35 m, and check it with `interact` `until` `tangles` 1. The results screen showed with `Sir Trips-a-Lot` and `YOU` unfinished. Wait for the player, or show DNF for them.
3. **Expose `replay.t` and `replay.rate` in `observe` and test the replay, shake and mistimed keys.** Run `interact` for 2300 frames of a good rhythm and check that `phase` shows "replay" at the finish. Run `feel` on a face-plant for the camera shake. Press Q+W+O+P together and confirm `plants` rises.

SCORE: 7.4

## Iteration 26
**Did** game.js: camera dist base 7.4 → 8.5, height 3.0 → 4.6 (look target y 0.9, z 0.4) so rivals stop covering `player`; fov 36 kept. Pile-up in `updateRace`: if `S.tangles` is 0 and `raceT` > 12, the neighbour window widens to 3.2 m and the chance to 0.08/tick (was 1.7 m, 0.012), so a tangle should happen in the first 30 s. Finish replay waits up to 14 s after the first finish while a human is still running (`humanWait`). `observe().replay` now has `t` and `rate`.
**Saw** Mid-race `look` at 1.8 s: `Subject: player` 2.9% [108,318,461,473], blue saddle and marker clear, no rival on top of it; `Never visible` only sky; only the PCFSoftShadowMap warning. Not run: perf, a full race (tangle forcing, humanWait, replay), 2P, shake, mistimed keys.
**Next** (1) Run ~2300 frames of rhythm with `until tangles 1` and `phase results`; confirm the forced tangle fires, replay `t`/`rate` reads right, and results wait for YOU. (2) Name the player's parts (`player-body`, `player-head`) so `Subject` lists them. (3) Check the new camera in 2P and when YOU is far behind; `feel` on shake; Q+W+O+P → `plants`.
**Open** The forced-tangle and humanWait changes are untested over a whole race; `Subject` still lists 0 named parts.

### Judge 26

**Verdict, session 26**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips` and `div#keys` show. I pressed Q, P, W, O, Q, P in 10-frame beats, and `YOU` reached only x 2.37 by raceT 29.8 s. `plants` was 1. The AI finished at 22 s. Enter restarted the race, but I did not test R, and I did not run 2P.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `legs` bitmasks are live, for example "0110" and "1111". Sounds included thud, gasp and boing. I did not see auto-right.
3. **Replay (~4 s, 0.25x, REPLAY banner, Space skips): 6.** The `REPLAY` tag, the "SPACE to skip" line and the `PHOTO FINISH!` pop-up show. But `replay.rate` reads 0.6, not 0.25, and `replay.t` stayed at 0 (`pos` 1865 of 2125). Also, the replay waited 36 s for a stalled human (`phase:"finishing"` from 22 s to 36 s), while the picture sat on the finish line. That is dead time.
4. **Photo finish and tangled AI collapse: 5.** The photo finish holds: `Hoof Hearted` 22.07 s and `Dusty Rhodes` 22.10 s, "by a nose (0.03s)". `tangles` was 0 through about 36 s of race, and no AI had `plants` above 0. The forced pile-up from this iteration did not fire.
5. **Results with most face-plants award: 6.** The `results` array is already ordered by the time of the replay. I did not reach the results screen and did not see the award badge.
6. **Looks as LOOK.md says: 6.** The `grandstand`, crowd, rail, `hills`, `track` with the "50 m" sign, `finish-line` and horses match refs/01.jpg. But `Subject: player drew no pixel; 0 named parts`. `YOU` is off-screen at x 2 while the camera follows the leaders, and only the `div#off2` "◀ YOU 50 m" chip points to it. The player is the subject and is not on screen.
7. **window.__game convention, index.html at root: 9.** `observe` has `phase`, `replay{kind,pos,t,of,rate}`, `results` and `horses`.
8. **Clip moments in the first minute: 5.** The photo finish comes at 22 s. The tangle did not happen, so the 10-second laugh is missing.
9. **Controls feel learnable: 5.** A 6-beat rhythm gave 2.4 m in 30 s. I did not reproduce a 60 m finish in under 60 s.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, saddle cloths, white socks and dark hooves read clearly in both looks.
11. **Juice: 8.** Sounds fired (blip, powerup, cheer, thud, gasp, boing). The `div#flash`, `PHOTO FINISH!` pop-up, `div#chips` and finish banner show. Shake was not measured.
12. **Local 2-player discoverable from the HUD: 7.** "2 = two players" in the tips and the `2 PLAYERS (2)` button. Not run.
13. **Static page, vendored lib, no network: 9.** 382 draw calls, 33.6k triangles, 0 MB of assets. The 113 ms frame is SwiftShader (software renderer), not a real GPU.

**Faults: 6.** The only console line is the PCFSoftShadowMap warning. `Never visible` is only `dust`. The forced tangle did not fire, `Subject` still lists 0 named parts, and `YOU` is not drawn while behind.

**Next:**
1. **Make the AI tangle fire.** In `updateRace`, the pile-up never produced `tangles` 1 by 36 s (`interact` with `until: {tangles: 1}, max: 1800` ran out). Skip the random chance. At raceT ≈ 8–10 s, pick two neighbouring AI horses, push both into the same lane (z within 0.8) and trip one (set its state to a face-plant). Check with `interact` `until: {tangles: 1}`, `max` 900. It should fire before raceT 15, and the replay should catch it as a "big face-plant".
2. **Keep `YOU` in frame, and name its parts.** At x 2 behind the leaders at x 59 the camera shows only the AI, so `Subject: player` is empty. Make the camera follow the player (or frame the player and the leader) until the player has finished, and name `player-body` and `player-head` so `Subject` lists them. A `look` at 20 s with `YOU` trailing should show `Subject: player` at 2% or more.
3. **Fix the replay and the stall.** Set the replay rate to 0.25 (it reads 0.6) and make `replay.t` count up. Cut `humanWait` to about 4 s, or end the finish early with DNF for a player who is far behind, so the replay starts about 3 s after the first finish. Check with `interact` `until: {phase: "replay"}`, which should hold by raceT ≈ 26 s, and then `observe`, where `replay.rate` is 0.25 and `replay.t` is above 0.

SCORE: 6.9

## Iteration 27
**Did** game.js: forced tangle in `updateRace` (first AI pair `horses[i],horses[i+1]` both AI, raceT > 9, `tangles` 0 → collapse both, no proximity/chance); `humanWait` cut 14 s → 4 s; finish replay is now ~64 frames (24 before first finish) at fixed rate 0.25, `observe().replay.rate` 0.25 and `t` counts up; `followTarget` caps the lead-pack pull at 6 m so `player` stays near frame; view groups named `player-body`, `player-head` (`horseN-body/-head`).
**Saw** `interact until tangles 1`: fires at raceT 9.0 (frame 732), two AI `state:"down"`, `pendingReplay` true, sounds thud/gasp/cheer; only the PCFSoftShadowMap warning. Not run: `look` of the new camera with YOU trailing, full race to results, perf, 2P.
**Next** (1) `look` at raceT ~20 with YOU trailing: `Subject: player` should list the new parts. (2) Run to `phase replay`/`results`; check replay length (~4 s) and the plant replay of the forced tangle. (3) 2P camera, `feel` on shake.
**Open** Camera cap of 6 m may crop the leaders entirely when YOU is far behind; untested visually. Forced tangle always hits the first AI pair (red/green), predictable.

### Judge 27

I've played through the tangle, both replays, the results screen and perf, so I'm writing the verdict now.

**Verdict, session 27**

1. **Plays as DESIGN.md's Core loop and Controls say: 7.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips`, `div#keys` and the `div#chips` face-plant counters all show. The race runs to a results screen. A Q P W O rhythm in 10-frame beats got `YOU` only to x 6.7 by raceT 30 s, and `YOU` finished as "DNF · 52 m short". I did not test R or 2P.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** `legs` bitmasks are live, and `state:"down"` and `plants` counters work (Sir Trips-a-Lot 2). The `horse0-body` and `horse0-head` parts are jointed. I did not see auto-right.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 6.** The plant replay is right: `replay.kind` "plant", `rate` 0.25, `t` counting up, `of` 592, with the banner and "SPACE to skip". The finish replay opens on an empty track. The `look` at `phase:"replay"` showed the "20 m" sign, the `PHOTO FINISH!` pop-up and no horses at all, while both leaders were at x ≈ 59. The replay camera does not frame the finish at its start.
4. **Photo finish and tangled AI collapse: 6.** The forced collapse fires at raceT 9.0 and `tangles` is 1. But the two downed horses are Sir Trips-a-Lot (x 19.3, z 1.0) and Hoof Hearted (x 23.2, z −2.3). They are 4 m apart and 3 m across lanes, so there is no visible tangle of legs. The photo finish holds: Dusty Rhodes 23.45 s against Hoof Hearted 23.52 s, "by a nose (0.07s)".
5. **Results with most face-plants award: 9.** The `results` box shows "Dusty Rhodes WINS! PHOTO FINISH · 0.07s", a podium, and badges (SMOOTH OPERATOR, DIRT EATER · MOST FACE-PLANTS). It also shows DNF distances and "Press R for another race".
6. **Looks as LOOK.md says: 6.** The `grandstand` with its crowd, rail, `hills`, `track` and `finish-line` show, and the horses read as in refs/01.jpg. But `Subject: player-marker-0 … drew no pixel; 0 of 0 named parts`. `window.__game.subject` still names "player", which is not in the scene. The `YOU` horse is never on screen in the three looks.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT`, `replay{kind,pos,t,of,rate}`, `results`, `horses` and `tangles`.
8. **Clip moments in the first minute: 6.** The face-plant replay at 9–10 s plays at 0.25x and the photo finish comes at 23.5 s. The first one is two horses lying apart, not a tangle, and the finish replay opens on an empty track.
9. **Controls feel learnable: 4.** `YOU` reached only x 6.7 in 30 s, and was 52 m short at the DNF. Finishing 60 m in under 60 s was not reproduced.
10. **Horses read as horses, match refs/01.jpg: 9.** The first `look` shows head, mane, tail, red saddle cloth, white socks and dark hooves on a dirt track with a rail fence and a grandstand with a blocky crowd.
11. **Juice: 8.** The sounds fired (blip, powerup, cheer, thud, gasp, boing), along with `div#flash`, the pop-ups, the camera and the results box. Shake was not measured with `feel`.
12. **Local 2-player discoverable from the HUD: 7.** The `2 PLAYERS (2)` button and "2 = two players" are visible. 2P was not run.
13. **Static page, vendored lib, no network: 9.** 383 draw calls, 33.6k triangles, 0 MB of assets. The 82 ms frame is SwiftShader (software renderer), so it is not a fault.

**Faults: 6.** The only console line is the PCFSoftShadowMap warning. `Never visible` is `sky` during the replays. The `Subject` name is broken, the finish-replay camera is empty, and the player is never in frame.

**Next:**
1. **Make the player's race winnable (asked again, Controls feel learnable).** After 4 beats of Q P W O, `YOU` was at x 6.7 at raceT 30 s. Raise the motor torque and forward drive per leg-press, or add a gentle assist when opposite legs alternate, so a 10-frame alternating Q+P, W+O rhythm reaches x ≥ 60 by raceT ≈ 45 s. Check with `interact` of that rhythm repeated, `until: {phase: "finishing"}`, then `observe`, where `horses[2].finishT` should be under 60.
2. **Fix the finish replay camera, and the `Subject` name.** At `phase:"replay"`, `kind:"finish"`, the camera shows the empty track at x ≈ 20 while the leaders are at x ≈ 59. Point the replay camera at the finish line with the first two finishers in frame from `t = 0`. Also set `window.__game.subject` to `player-body`, which exists. A `look` at the replay should list `horse*-body` near the `finish-line`, and a `look` mid-race should list `Subject: player-body`.
3. **Make the forced tangle a visible pile-up.** At raceT 9 the two collapsing AI horses sat 4 m apart in x and 3 m apart in z. Pick the two nearest AI horses, set their z within 0.6 of each other and their x within 1.5, and trip both. Check with `look` at the plant replay's midpoint, where two `horse*-body` groups should overlap with their legs in the same screen box. Keep it within `interact until: {tangles: 1}`, `max` 900.

SCORE: 7.2

## Iteration 28
**Did** game.js: human drive stronger (`h.drive` +0.5 per press, cap 1.6; `driveF` factor 12→26); `startFinishReplay` snaps `camPos`/`camLook` to the finish framing so the replay opens on the line; `__game.subject` = `player-body`; forced tangle now shifts the partner's parts to ~1.2 m behind / 0.5 m beside the first (`setTranslation`) before both collapse.
**Saw** Q+P / W+O in 10-frame beats: YOU x 5.8 at raceT 1.35, 10.7 at 2.7 (~3.7 m/s, rubber-banded by the avg-AI term). `until tangles 1` at raceT 9.15: `look` shows the two AI horses overlapping mid-frame under the PILE-UP pop-up; `Subject: player-body` listed, YOU on screen at the left edge. Only the PCFSoftShadowMap warning. Not run: finish replay `look`, full race finish time, perf, 2P.
**Next** (1) Run a full rhythm race to `phase replay` and `look` to confirm leaders in frame at t=0. (2) Check the player isn't now too fast (may win by far; tune `driveF` so a good rhythm wins narrowly). (3) YOU sits at the left screen edge in the pile-up view: shift camera fx a bit.
**Open** Finish-replay camera fix unverified visually. Forced tangle still always hits the first AI pair.

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

### Judge 29

**Verdict, session 29**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** My Q/P/W/O 10-frame rhythm took `YOU` from x 1.38 to 5.0 in about 1.5 s with `plants 0` and `state "run"`. The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons, `div#tips`, `div#keys` and `div#chips` all show. The second rhythm call didn't continue the same race: `raceT` read 0.13 and `phase` race with a GO! overlay, so a restart happened in between. I didn't find the cause, and I did not reach a full 60 m finish.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** Sir Trips-a-Lot and Hoof Hearted went `state:"down"` with `plants 1` in the tangle, and their `horse*-body` and `horse*-head` parts are jointed. I did not watch auto-right.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.** The `plant` replay (`rate` 0.25, `of` 592) now frames the pile-up. `horse0-body` and `horse1-body` sit in the middle with the grandstand behind. A white rail still runs across the foreground and hides the horses' lower half. The `REPLAY` banner and "SPACE to skip" show.
4. **Photo finish and tangled AI collapse: 7.** The tangle fires at raceT 9.9 (`tangles` 1) and is now the subject of the replay. Per the builder, the replay opens before the collapse, so the first moments show horses still running. I did not check the finish margin, so a photo finish remains unconfirmed.
5. **Results with most face-plants award: 7.** The `div#chips` FACE-PLANTS counters show. I did not open the results screen.
6. **Looks as LOOK.md says: 8.** The start look shows saddle-clothed low-poly horses, a covered `grandstand` with a blocky crowd, white rail, hills and a blue `player-marker` ring. The `Subject: player-body` stands out at brightness 53% against 33%. There is no `Lighting:` fault. The only `Surfaces:` line is two hidden grandstand faces coplanar at y 0, out of view. In the replay look the subject drew no pixel, which is expected since the camera follows the pair.
7. **window.__game convention, index.html at root: 9.** `observe` gives `phase`, `raceT`, `replay`, `tangles` and `horses`.
8. **Clip moments in the first minute: 8.** The pile-up replay now shows the two tangled horses large and legible within about 10 s, and it is funny. The photo-finish half is still unseen.
9. **Controls feel learnable: 8.** The rhythm gives steady progress with `plants 0`. I did not confirm a human finishing the 60 m.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, white socks, dark hooves, dirt track and covered stand all show.
11. **Juice: 8.** Sound events (blip, powerup, cheer, thud, gasp) fired. The GO! overlay, REPLAY banner and dust chunks show. I did not measure shake with `feel`.
12. **Local 2-player discoverable from the HUD: 7.** The `2 PLAYERS (2)` button and "2 = two players" in `div#tips` are visible. I did not run 2P.
13. **Static page, vendored lib, no network: 9.** `perf` shows 384 draw calls, 33.6k triangles and 0 MB of assets. The 67 ms frame is SwiftShader, so it is not a fault.

**Faults: 8.** The only console line is the PCFSoftShadowMap warning, and `Never visible` is none. Frame time is over budget on a software renderer, so I'm not scoring it as a fault. The unexplained mid-race restart in my second call is unconfirmed.

**Next:**
1. **Clear the rail from the plant replay (asked again).** Raise the replay camera y, or move it inside the fence (z below the rail), so the white rail no longer crosses the horses. Done when `interact until {phase:"replay"}` with `look:true` shows `horse0-body` and `horse1-body` with no rail between them and the lens.
2. **Start the plant replay on the collapse.** Shift `rp.pos` forward so the 0.25x clip opens as the horses go down, not while they are still running. Check `observe replay.pos` and a `look` at `t:0`, where both horses should already be `down` or mid-fall.
3. **Photo-finish margin and the unverified paths.** Run a full rhythm race and read the `finishT` gap between `YOU` and Dusty. Tighten the AI tuning until it is under ~0.3 s. Then check the results screen, 2P (`Digit2`, then Q W E R and U I O P) and the R and Enter restarts. Also check what restarted the race mid-play in my second call.

SCORE: 8.1

## Iteration 30
**Did** game.js: plant replay camera now y 2.0→3.0 and z clamped to ≤3.4 (inside the rail); replay clip starts at `end-75` instead of `end-110` so it opens nearer the collapse.
**Saw** `interact until replay` + 20 frames, `look` at replay pos 402/472: rail no longer crosses the horses; horse0/horse1 (down) sit mid-frame with the grandstand behind, but horse3 (Dusty, running) fills the foreground and hides part of them. Only the PCFSoftShadowMap warning. Not run: perf, finish margin, 2P, results.
**Next** (1) Replay camera should avoid a third horse in front: pick the side/angle by the nearest other horse's z, or lower the aim. (2) Full rhythm race: finishT gap vs Dusty, results screen. (3) 2P and R/Enter restarts; the mid-race restart the judge saw.
**Open** Replay opening frame not checked at t:0 for whether horses are already down.

### Judge 30

**Verdict, session 30**

1. **Plays as DESIGN.md's Core loop and Controls say: 8.** The `1 PLAYER`, `2 PLAYERS (2)` and `RESTART` buttons and the Q W O P legs (`legs` "0000" for `YOU`) are in the state. With no input, `YOU` stayed at x 1.39 and `state` "run". I did not replay my rhythm test this session. Last session's rhythm test reached x 5 with `plants 0`. No full 60 m run has been confirmed in any session, and the mid-race restart seen in judge 29 is still unexplained.
2. **Real Rapier jointed ragdoll, face-plant, auto-right: 8.** Sir Trips-a-Lot and Hoof Hearted went `state:"down"` with `plants 1`. In the replay look their `horse*-body` and `horse*-head` parts are twisted into a heap. I did not watch auto-right.
3. **Replay (last ~4 s, 0.25x, REPLAY banner, Space skips): 8.** The `plant` replay runs at `rate` 0.25 (`of` 472), and the `REPLAY` banner and "SPACE to skip" show. The rail no longer crosses the horses. `horse3` (Dusty, running) fills the left foreground and hides about a third of the pile-up.
4. **Photo finish and tangled AI collapse: 7.** `tangles` 1 fires by raceT 7.9, which is early and funny. I have still never seen a finish margin (`finishT` is null for all four) or a photo-finish replay.
5. **Results with most face-plants award: 7.** The `div#chips` counters exist. I have not seen the results screen in any session.
6. **Looks as LOOK.md says: 7.** Low-poly horses with saddle cloths, a covered `grandstand` with a blocky crowd, white rail, hills and a dirt `track` all show. A `Lighting:` fault line is present: `player-10` is outside the shadow camera of `DirectionalLight` (past its +z edge), so it casts no shadow. The only `Surfaces:` line is two hidden grandstand faces sharing y 0, out of view.
7. **window.__game convention, index.html at root: 9.** `observe` returns `phase`, `raceT`, `replay`, `tangles` and `horses`.
8. **Clip moments in the first minute: 8.** The pile-up replay is up by about 8 s with no input, and the three-horse tangle reads clearly. The photo-finish half is still unseen.
9. **Controls feel learnable: 8.** The rhythm test last session showed steady progress. A 60 m finish is unconfirmed.
10. **Horses read as horses, match refs/01.jpg: 9.** Head, mane, tail, white socks, dark hooves, white rail, covered stand with crowd and green hills all show.
11. **Juice: 8.** Ten sounds fired (blip, powerup, cheer, thud, gasp), and the REPLAY banner shows. I did not run `feel` for shake. `dust` is "Never visible" in the replay view.
12. **Local 2-player discoverable from the HUD: 7.** The `2 PLAYERS (2)` button and the tips text show. I have not run 2P in any session.
13. **Static page, vendored lib, no network: 9.** `perf` shows 383 draw calls, 33.6k triangles and 0 MB of assets. The 87 ms frame is SwiftShader, so it is not a fault.

**Faults: 7.** The `Lighting:` line above is a real fault: the shadow camera covers 52 × 34 units around (6.9, 28, 8) and does not follow the player. The only console line is the PCFSoftShadowMap warning. Frame time is noise on a software renderer.

**Next:**
1. **Fix the shadow camera (the new Lighting fault).** Move `DirectionalLight` and its target with the player or the camera focus, or widen `light.shadow.camera`, or call `stage().fit()`. Done when `look` has no `Lighting:` line and `player-10` shows a shadow.
2. **Verify the unseen paths in one run (asked again).** `interact` with a Q/P/W/O rhythm using `until {phase:"results"}`. Read the `finishT` gap between `YOU` and Dusty, then `look` at the results screen for the face-plants award. Tighten the AI tuning until the gap is under ~0.3 s, and check that a photo-finish replay fires. Separately, find what restarts the race mid-play by tracing `raceT` and `phase` during a long hold.
3. **Keep a running horse out of the replay foreground, then test 2P.** In the plant replay camera, pick the side by the nearest non-tangled horse's z so Dusty (`horse3`) is not in front. A `look` at `replay.pos` ~460 should show `horse0-body` and `horse1-body` uncovered. Then `interact` with `Digit2`, Q W E R and U I O P, and `Enter` and `R` restarts.

SCORE: 7.9

## Iteration 31
**Did** game.js: widened `sun.shadow.camera` (left/right ±30, top 30, bottom -24) and moved `sun.target` to z 0, to clear the `Lighting:` fault (player-10 outside the shadow camera).
**Saw** `look` at start: no `Lighting:` line; only the hidden grandstand face-plane `Surfaces:` note (out of view). Subject player-body 1.8%. Not run: perf, rhythm full race, results, 2P, replay.
**Next** (1) Full rhythm race to `phase:"results"`, read `finishT` gap vs Dusty, look at results and the photo-finish replay. (2) Replay camera: pick side by nearest running horse's z so horse3 does not cover the pile-up. (3) Test 2P (Digit2, Q W E R / U I O P) and R/Enter restarts; trace the mid-race restart.
**Open** Shadow resolution is a bit lower per unit now (2048 map over a bigger frustum); check softness if it looks blurry.
