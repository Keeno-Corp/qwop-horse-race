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
