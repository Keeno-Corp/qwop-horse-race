The last builder's section and the last judge's verdict; paprika-loop/PROGRESS.md holds every session's.

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
