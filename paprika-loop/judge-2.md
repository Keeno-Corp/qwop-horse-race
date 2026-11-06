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
