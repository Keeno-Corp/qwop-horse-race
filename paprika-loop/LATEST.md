The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
