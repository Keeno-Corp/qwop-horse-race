The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
