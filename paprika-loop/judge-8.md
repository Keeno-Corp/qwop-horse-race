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
