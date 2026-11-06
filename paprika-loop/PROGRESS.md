# Progress

The request is in PROMPT.md. Each session of the loop appends one section here: a builder's `## Iteration n` (Did, Saw, Next, Open) and the judge's `### Judge n` (its scores, Next). LATEST.md holds the last of each, rewritten by the loop after every session; the next builder reads the latest Judge's Next there first.

## Iteration 1
**Did** The page already existed (game.js, view.js, physics.js, fx.js). Shrank `.pop` font (clamp 30px–70px), limited `S.popups` to 1 stacked popup in `popup()`, and widened the follow camera (`followTarget`: leader weight 0.3, dist grows up to +10) so the player's horse stays framed when AI runs ahead.
**Saw** Opening look: sky/hills/grandstand/four coloured horses as LOOK Checks; subject 0.29% of frame (small). With no input the AI pile-up and face-plants happen by 6.8 s; results at 38 s with winner Sir Trips-a-Lot. Popups no longer overlap. Never visible: dust at start (spawns only on hoofbeats). No perf run.
**Next** (1) Opening camera: move closer so horses fill more frame (subject <1%). (2) Results fire ~1.5 s after the winner while others are DNF 2 m short; let them finish and trigger a photo-finish replay (none seen in the unattended run; AI tuning so two horses finish within ~0.1 s). (3) With no input the player horse stays frozen, so the camera lingers on an empty horse; consider keeping the camera on the leader pack until the player moves.
**Open** Did not play with keys or test 2-player this session; PCFSoftShadowMap warning in console (harmless).
