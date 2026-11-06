**Judge 82: scores**

1. **Plays as DESIGN.md says: 8.** The countdown picture is fixed. Before the start, the `cam` sat at about (2, 3.8, 15) and showed the four horses, the rail and the ads. At raceT 0.4 the "GO!" and `countdown` 0 show, with the `tote`, `keys` strip and `tips` footer. Pairing Q+P then W+O in 10-frame holds moved `YOU` from x 2.06 to 6.34 in 60 frames, about 4 m/s. The 2-player and R paths were not re-run. I did not play a human to `finished`, so `finishT` under 60 is still unseen.
2. **Rapier ragdolls, face-plant, auto-right: 8.** At raceT 7.65 `YOU` was `state` "down" with `pitch` 1.79 and `plants` 2. The `tote` FACE-PLANTS column counts them. The legs now swing and bend, and the hooves are dark.
3. **Replay: 8.** The "INSTANT REPLAY · 0.25x" `tag`, the "SPACE to skip" `sk` and letterbox bars show on the face-plant replay (`replay.kind` "plant"). It is correctly not sepia. I did not re-look at the photo-finish sepia this session. Judge 81 saw it with `cap2`, `pfc` and the scratch line.
4. **Photo finish and tangled AI collapse with no input: 7.** I did not run a full no-input race. The last two were clean photo finishes. A face-plant happened here by 7 s, and `YOU` fell with no AI tangle.
5. **Results with most face-plants award: 6.** The per-horse FACE-PLANTS column in the `tote` shows. I have still not seen the results card.
6. **Looks as LOOK.md says: 8.** With the ground back, the picture reads as a 70s toon race. The orange dirt, the `track`, the grandstand with its crowd, the ad boards, the white rail and the green hills all show. The warm grade, the outlines and the CRT pass are all there. `track` is still only 0.22% of the frame in `look`. `look` also still lists `hills` as "Never visible" although it is plainly drawn.
7. **`__game` convention, static, no network: 9.** `observe` now returns `cam` and the page has no console errors. Assets are 0.32 MB.
8. **Horses match CHARACTERS.md: 8.** The polka-dot `YOU`, the chevron and diamond cloths, the number blinkers, the big eyes, the white socks, the dark hooves, the bristly mane and the bridle all read. The legs are still a little shorter than `refs/sheets/horse.png`.
9. **Broadcast overlay: 9.** The `tote` with silks and moving odds (5-1 → 6-1), the `top-r` LIVE bug with the 3:58 PM clock, the `lower` third ("HANK "HOOFBEAT" PRUITT"), the `tips` footer, the `keys` strip and the progress bar all show.
10. **Camera: 7.** The side-tracking telephoto works at countdown, race and replay. I did not see the head-on cut.
11. **Learnable controls: 7.** Pair alternation gives about 4 m/s, so 60 m takes about 15 s. A mistimed run produced a face-plant by 7 s. I did not run a full human finish.
12. **Local 2-player, discoverable: 8.** The "2 PLAYERS (2)" button and the footer line show. I did not play it.
13. **Style judged as hard as gameplay: 8.** The frames read as a 70s broadcast, with the toon shading, the outlines and the VHS tint.

**Faults: 7.**
- **`perf`:** 145 ms on SwiftShader (266 draw calls, 126k triangles). Host load was 2.9 on 8 cores, so the time is noise, not a signal.
- **`hills`:** it is drawn but `look` lists it as "Never visible". The ID image cannot find it.
- **Console:** no errors this session. I did not check for the render-target warning, and the last Open also left it unchecked.

**Next:**
1. **Show a human finish and the results card (asked again).**
   - Loop the alternation steps (Q+P 10 frames, W+O 10 frames) with `{"until":{"horses.2.finished":true},"max":3600}`.
   - Then `look`. Done when `finishT` is under 60 and the results card shows "MOST FACE-PLANTS".
   - Fix the card first if it is missing or clipped.
2. **Add visual variation to `track` and the foreground (new).**
   - `track` covers 0.22% of the frame and the dirt is flat orange.
   - Add rake stripes or hoof-print decals on the dirt, and a darker rail-side strip.
   - `look` with `sample` at (640, 450) and (640, 560) should then differ. Judge 81 asked for this too.
3. **Re-check the photo finish and the head-on cut, and the render-target warning (asked again).**
   - Run a no-input solo race to `replay.kind` "finish" and `look`. The sepia grain, the "PHOTO FINISH" `cap2` and the `pfc` text should show.
   - Add a `cameras` look for the head-on cut.
   - Call `setRenderTarget(null)` after the last pass. Done when `look` no longer reports "every render call drew into a render target".

SCORE: 7.8
