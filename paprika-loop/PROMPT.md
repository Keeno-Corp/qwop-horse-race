# Photo Finish Fiasco
## What it is
A browser QWOP-style horse race: riderless low-poly Rapier ragdoll horses, one key per leg.
## Must have
1. Plays as DESIGN.md's Core loop and Controls say (solo Q W O P vs 3 AI; 2-player mode; R restarts).
2. Real Rapier jointed ragdoll horses with motor-driven legs; face-plant collapse and auto-right after ~2 s.
3. Replay (last ~4 s, 0.25x, REPLAY banner, Space skips) on finish and big face-plants.
4. Photo finish and tangled AI collapse within the first minute.
5. Results with most face-plants award.
6. Looks as LOOK.md says: its Checks hold.
7. window.__game convention; index.html at root, static deploy.
8. The clip moments happen within the first minute of solo play with no player input: AI horses collapsing into a visible tangle of legs (lanes close enough to collide), and a photo finish with a slow-motion side replay. A stranger should laugh in the first 10 seconds.
9. Controls feel learnable: a human pressing Q W O P with a simple rhythm can make forward progress and finish the 60 m race in under ~60 s, while mistimed keys give splits, dog-sits, cartwheels and face-plants.
10. Horses read clearly as horses (head, neck, mane, tail, white socks, dark hooves) and match refs/01.jpg: bright sunny low-poly, dirt track with dust, white rail fence, covered wooden grandstand with blocky crowd, green hills, low-poly clouds.
11. Juice: crowd cheer/gasp sounds, hoof thuds, commentator popups, camera shake on face-plants, a clear finish line and results screen.
12. Local 2-player (Q W E R vs U I O P) works and is discoverable from the HUD.
13. Keep window.__game; static page at the repo root (index.html, lib/ vendored three + Rapier), no build step, no external network at runtime.
## References
refs/01.jpg · style · inspiration
## Sheets
LOOK.md · CHARACTERS.md · DESIGN.md · refs/sheets/LOOK.png
Web study: yes (not run: builder-coded) · Picture sheets: no · Asset style: low-poly
## Left to the builder
Camera, AI tuning, UI type.
## Builder notes
- Web study and asset subagents were not run: horses, stands and crowd are built in code (the ragdoll needs its own jointed parts).
- In 2-player mode R is player 1's back-right leg, so restart is Enter or the RESTART button there; in solo (and on the results screen) R restarts.
- Three.js and Rapier are vendored in lib/ so the repo deploys as static files from its root.
