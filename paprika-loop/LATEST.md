The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

### Judge 59

**Judge 59: scores**

1. **Plays as DESIGN.md says: 8.** The `Digit1` start runs the countdown, then the race starts with `raceT` 3.73 and the state "run". `div#keys` shows Q FL, W FR, O BL and P BR, and `div#tips` shows "ALTERNATE LEGS: Q+P THEN W+O". I didn't play a full human finish. The YOU horse is at x 2.0 while the AI horses are at 5.9 to 8.8.
2. **Real Rapier ragdolls, face-plant and auto-right: 8, carried over.** All four horses are jointed and animated, and the `legs` strings change. I saw no face-plant this session.
3. **Replay and photo-finish look: 8, carried over, not viewed.**
4. **Photo finish and tangled AI collapse within a minute, no input: 8, carried over, not run.**
5. **Results with most face-plants award: 8, carried over, not viewed.** The `div#tote` face-plant counts are live.
6. **Looks as LOOK.md says: 7.5.** The toon steps, outlines, warm orange and yellow tones, scanlines and `postpass-quad` all show. At look-at height 3.4 there is now a visible sky gradient above the stand. The `grandstand` roof slab and the "GRAND STAND" sign show clearly, so the picture is less cramped. `hills` is still only 0.82% of the frame, a 7 px band at y 408. The ground is still a flat orange.
7. **`__game` convention, static, no network: 9.** `window.__game` returns its keys and units, assets are 0.32 MB, the fonts are vendored and I saw no console errors.
8. **Horses match CHARACTERS.md: 8.** The blue-dot, brown with diamonds, grey with stripes and orange with a chevron horses all have white socks, dark hooves, blinkers and numbered saddle cloths. The legs are still short and stocky rather than "long wobbly", and the belly-to-ground gap is small.
9. **Broadcast overlay: 9.** `div#tote` has silks chips, odds and face-plant counts. The LIVE bug, the 3:58 PM clock, RACE TIME, the `div#lower` caption from Hank "Hoofbeat" Pruitt and the progress bar are all there. `div#top-r` also holds the 1 PLAYER / 2 PLAYERS (2) / RESTART buttons. The commentary text reads well.
10. **Camera: 7.5.** The side-tracking telephoto is good, and the horses clear the `div#lower` caption at 3.4. I didn't see the head-on cut or the replay cams.
11. **Learnable controls: 7.5.** The key caps and the tip line teach the pattern. A full finish under 60 s is still unproven after several sessions.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button is in `div#top-r`, and the tip line mentions "2 = TWO PLAYERS".
13. **Style judged as hard as gameplay: 8.** The tote, the ZENITH, GOLDEN and CAT TIRES hoardings, the pencil-like crowd and the CRT pass all fit the 70s TV look. The hills and ground are still the weak part.

**Faults: 7.5.** I saw no console errors and no fault lines. `perf` read 115 ms a frame on SwiftShader, which is no signal. Host load was 2.4 on 8 cores, with 266 draw calls and 126k triangles, and the scene pass cost 88 ms of the frame. `dust` is listed as behind `postpass-quad`, which is expected with the post pass. `div#crt` covers the canvas on purpose.

**Next:**
1. **Play a full human finish (asked again, now four sessions running).** Call `interact` with alternating holds: `{key:"KeyQ",down:true},{key:"KeyP",down:true},{wait:40},{key:"KeyQ",down:false},{key:"KeyP",down:false},{key:"KeyW",down:true},{key:"KeyO",down:true},{wait:40}`, and so on, with `until` `{"horses.2.finished": true}` and `max` 3600. It is done when `horses.2.finishT` is under 60 and the replay or results appear. The same call checks that the head-on cut fires. If it fails, tune the leg motors in `physics.js` until it passes.
2. **Hills and ground.** `hills` is only 0.82% of the frame, a 7 px band. In `view.js`, raise the `hills` ridge and give it a second, darker treeline layer in front, so it fills about 6 to 8% of the frame. Replace the flat orange ground with a grass and dirt gradient plus stripes. A `look` at race start should list `hills` at 3% or more, with `sample` at [640, 410] showing green, not orange.
3. **Long legs (asked again).** CHARACTERS.md says "long wobbly". Lengthen `DIM.upper` and `DIM.lower` in `physics.js` by about 15% and retune the motors. A start `look` should show a belly-to-ground gap taller than the barrel depth, with the horses still running (`state` "run" in `interact`).

SCORE: 8.1

## Iteration 60
**Did**
- `view.js` hills: `far` ramp `smooth(0,45,-z)` and peak height 55 → 95, so the ridge is taller.
**Saw**
- Race look at 0.5 s: the race camera looks down at the ground and the grandstand stand fills the upper frame. `hills` is 0.13% of the frame, so the taller ridge is still off-screen above the stand. Ground is flat olive-yellow. Horses, tote and caption clear each other, no console errors. Not run: `perf`, human finish, long legs.
**Next**
- Hills need to be seen: either pitch the camera up a little, or put a nearer low ridge and treeline behind the stand (z ~ -30). Replace the flat ground colour with stripes.
- Play a full human finish with alternating `interact` holds. Lengthen `DIM.upper`/`DIM.lower` in `physics.js` ~15%.
**Open**
- Hills share, human finish and long legs are still undone.
