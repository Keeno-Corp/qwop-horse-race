# Photo Finish Fiasco
## What it is
A browser QWOP-style horse race: riderless toon-shaded Rapier ragdoll horses, one key per leg, presented as a 1970s TV horse-race broadcast.
## Must have
1. Plays as DESIGN.md's Core loop and Controls say (solo Q W O P vs 3 AI; 2-player mode; R restarts).
2. Real Rapier jointed ragdoll horses with motor-driven legs; face-plant collapse and auto-right after ~2 s.
3. Replay (last ~4 s, 0.25x, Space skips) on finish and big face-plants; the photo-finish replay is sepia with film grain, scratches, flicker, gate weave and a "PHOTO FINISH" frame.
4. Photo finish and tangled AI collapse within the first minute of solo play with no input.
5. Results with most face-plants award.
6. Looks as LOOK.md says: its Checks hold (toon 3-step shading + outlines, 70s palette, warm golden light, full-screen CRT/VHS pass).
7. window.__game convention; index.html at root, static deploy, no build step, no network at runtime (font vendored in lib/fonts).
8. Horses match CHARACTERS.md and refs/sheets/horse.png: chunky barrel body, long wobbly legs, oversized dark hooves, white socks, big round eyes, bristly mane, tufted tail, blinkers and bridle, distinct silks (diamonds, stripes, polka dots, chevrons) on saddle cloth and blinkers.
9. Broadcast overlay: commentator lower-third with live one-liners (face-plants, tangles, lead changes), odds board/tote with silks and live-moving odds, LIVE bug, channel/clock bug, race title card at the start.
10. Camera: broadcast side-tracking telephoto, head-on cut, replay cams.
11. Controls feel learnable (a human can finish 60 m in under ~60 s; mistimed keys give splits, dog-sits, cartwheels, face-plants).
12. Local 2-player (Q W E R vs U I O P) works and is discoverable from the HUD.
13. Style is judged as hard as gameplay: matches LOOK.md, refs/sheets/LOOK-board.png and refs/sheets/horse.png; the broadcast overlay reads as a 1970s TV race.
## References
refs/01.jpg · style (old direction) · inspiration · original brief
refs/02.jpg · layout (tote board) · inspiration · https://commons.wikimedia.org/w/index.php?curid=15892147 (CC BY 2.0)
refs/03.jpg · mood (Hialeah tote postcard) · inspiration · https://www.flickr.com/photos/52111934@N00/2543012284 (CC BY 2.0)
refs/04.jpg · UI (odds board with number chips) · inspiration · https://www.flickr.com/photos/91008793@N00/4853584445 (CC BY 2.0)
refs/05.jpg · style (silks) · inspiration · https://www.flickr.com/photos/91994044@N00/39855263230 (CC BY 2.0)
refs/06.jpg · mood (silks, rail, stands) · inspiration · https://www.flickr.com/photos/40279823@N00/6203994693 (CC BY-SA 2.0)
refs/07.jpg · layout (grandstand) · inspiration · https://www.flickr.com/photos/24724221@N07/4174469314 (CC BY 2.0)
refs/study/ (web study frames, never shown in the page)
## Sheets
LOOK.md · CHARACTERS.md · DESIGN.md · refs/sheets/LOOK.png (free) · refs/sheets/LOOK-board.png and refs/sheets/horse.png (Gemini via OpenRouter, supplied by the person; match)
Web study: yes (asked) · Picture sheets: yes (supplied, no image key on this machine) · Asset style: toon / cel-shaded (asked)
## Left to the builder
Camera cuts, AI tuning, commentary lines, sound flavour, odds model.
## Builder notes
- Grandstand, tote, camera tower, crowd: built in code (asset_search/Poly Haven had nothing toon that fit).
- In 2-player mode R is player 1's back-right leg, so restart is Enter or the RESTART button there.
- Three.js and Rapier are vendored in lib/; fonts in lib/fonts (Shrikhand, Bungee, OFL).

## Open from the restyle (fix early)
- A black rectangle covers the lower-left of the screen above the commentator lower-third in every look picture; find what draws it (a HUD div, the replay inset, or the post pass) and remove it.
- "YOU WINS!" / "YOU TAKES" grammar: the player's horse needs its own lines ("YOU WIN!").
- The photo finish only happens in ~35% of races; make a close finish with the sepia photo-finish replay happen in nearly every no-input solo race within the first minute, without making it look scripted.
- Re-run the critic and `reference` compare against refs/sheets/LOOK-board.png and refs/sheets/horse.png regularly; style is scored as hard as gameplay.
