# Look: Photo Finish Fiasco, a 1970s TV horse-race broadcast
Board: refs/sheets/LOOK.png (free, from tagged refs) · refs/sheets/LOOK-board.png (Gemini via OpenRouter, supplied by the person) · horse: refs/sheets/horse.png
## Palette
tomato #d3432b · mustard #e5af2c · avocado #95a641 · burnt orange #d06322 · royal blue #305da2 · gold dirt #cc8930 · cream #f2e1ad · chocolate #4c2c21 · haze sky #d2dac0 → warm horizon #fbf1b6 · track shadow side #ac8053   (refs/sheets/LOOK-board.png, style, match: swatch strip sampled at y=727 and scene at (700,60), (300,560), (1000,300))
## Lighting
Low warm golden sun from the front-left, behind the stands' side, long soft-edged shadows stretching across the dirt, hemisphere fill (cool haze sky, warm dirt ground), light warm haze toward the horizon; sun glints on an infield lake.   (refs/sheets/LOOK-board.png, mood, match)
## Materials
MeshToonMaterial with a 3-step gradient map (shadow / mid / light), no textures except canvas silks patterns and hand-painted-looking dirt bands; every character and prop gets a thick dark inverted-hull outline (chocolate #2b1810).   (refs/sheets/LOOK-board.png, style, match; builder's call: outline colour)
## Shape language
Chunky, rounded, cartoon: barrel body, long wobbly legs, oversized dark hooves, bobbly head with big round eyes, bristly mane, tufted tail. Architecture: flat concrete slabs, steel posts, striped scalloped awning, a big wide scoreboard.   (refs/sheets/horse.png, match; refs/sheets/LOOK-board.png)
## Camera
Broadcast side-tracking telephoto (narrow fov ~28-34°, 25-40 m off the rail, slow lateral pan following the lead pack), cuts to a head-on cam when a horse falls or near the line, replay cams: low rail cam for tangles, photo-finish side cam at the line. Never shows the sky above 40% of frame.   (refs/sheets/LOOK-board.png, layout, inspiration; study/STUDY.md: telephoto tracking pan from the stand side, head-on shot in the stretch, finish-line cam; study/02-horse-finish-line-1970s-photo.jpg, camera, inspiration)
## Broadcast pass (full-screen)
Scanlines, slight barrel curve with dark rounded corners, chromatic fringe at edges, warm faded grade (lifted blacks, desaturated ~15%), vignette, light noise. Replays: sepia, heavy film grain, vertical scratches, flicker, gate weave, "PHOTO FINISH" frame.   (refs/sheets/LOOK-board.png, style, match: CRT inset and sepia inset)
## UI and type
Display face Shrikhand (OFL, lib/fonts) for titles and big popups, Bungee for bugs, odds and numbers. Numbered distance poles and a striped finish gantry (study/02-horse-finish-line-1970s-photo.jpg). Cream #f2e1ad on chocolate #4c2c21 strips with mustard and tomato edge stripes, lower-third bottom-left, odds board top-left with silks swatches, LIVE bug + channel clock top-right, title card at start.   (builder's call: 70s broadcast graphics; study/STUDY.md)
## Sound mood
Synth crowd swell and gasp, thuds, hoof ticks, a bugle-ish start fanfare, tape-hiss under replays.   (builder's call)
## Assets
style: toon / cel-shaded · maxTris n/a · asked · sources: code (library/web had no usable grandstand, tote or camera tower in this style; `asset_search` hits were a pony, a TV, flags)
## Avoid
Realism, neon, dark translucent rounded UI, cool blue haze, glossy PBR.
## Checks
1. Opening look: dirt band in the lower half within 40/255 of #cc8930 / #b87a2c; warm golden haze (no pure blue anywhere).
2. Four horses with distinct silks (stripes, diamonds, dots, chevrons) and dark outlines visible.
3. Lower-third, odds board with silks, LIVE bug and clock bug visible during the race; title card at the start.
4. Replay is sepia with grain and a PHOTO FINISH frame.
5. CRT pass visible: scanlines and rounded dark corners, text still readable at 1280×800; no `Lighting:` fault line.
