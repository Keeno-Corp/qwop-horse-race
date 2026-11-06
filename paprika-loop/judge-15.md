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
