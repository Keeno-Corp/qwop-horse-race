The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
