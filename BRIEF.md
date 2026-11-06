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
