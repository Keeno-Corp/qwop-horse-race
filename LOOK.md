# Look: Photo Finish Fiasco (QWOP horse race)
Board: refs/sheets/LOOK.png
## Palette
sky #7bbaff · dirt #99653e / #855836 · horse chestnut #d38042 · hills #acd270 · blue cloth #3f6cdc · green #3fb04a · yellow #f2d03a · red #d93a2e · socks #ffffff · mane #2a1d1a · UI cream #fff6e0 on #3a2416   (refs/01.jpg style inspiration, sampled)
## Lighting
Bright midday sun from upper left-behind, hard-ish shadows on dirt, light hemisphere fill, no fog.   (refs/01.jpg, style, inspiration)
## Materials
All flat-shaded matte (flatShading, roughness 1), no textures except subtle dirt vertex variation.   (refs/01.jpg, style)
## Shape language
Chunky faceted low-poly, horses ~2.2 m long, white socks, saddle cloth + bridle in lane colour, blocky spectators.   (refs/01.jpg)
## Camera
Side-on chase camera, 45° fov, ~9 m off the track and 3 m high, following the player's horse; cinematic orbits for replays; photo-finish side camera at the line.   (builder's call)
## UI and type
Chunky rounded comic type (Impact/Arial Black), cream on brown with thick dark outlines; big centre popups; lane-coloured name chips top-left.   (builder's call, comedy tone)
## Sound mood
Synthesised crowd cheer/gasp noise bursts, thuds, hoof ticks.   (builder's call)
## Assets
style: low-poly · code · by design (ragdoll built from primitives)
## Avoid
Realism, dark UI, neon.
## Checks
1. Sky at top-centre of the opening look near #7bbaff (±30).
2. Four horses with distinct cloth colours visible in the opening look; dirt brown filling the lower half.
3. HUD readable at 1280×800; popups centred.
4. No `Lighting:` fault line.
