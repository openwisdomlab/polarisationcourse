# Feature Landscape

**Domain:** Discovery-based educational open world for polarization optics
**Researched:** 2026-02-20
**Overall confidence:** MEDIUM-HIGH (synthesized from game design analysis of The Witness/Outer Wilds/Animal Well/Monument Valley, PhET implicit scaffolding research, constructivist learning theory, and existing codebase analysis)

---

## Table Stakes

Features the experience must have or it fails to deliver its core promise of "2+ hours of curiosity-driven immersive exploration." Missing any of these means the experience degrades into yet another "demo list with pretty transitions" -- the exact failure mode of the 5 previous iterations.

| # | Feature | Why Expected | Complexity | Notes |
|---|---------|--------------|------------|-------|
| T1 | **Knowledge-gated progression** | The Witness/Outer Wilds core pattern: progress is gated by understanding, not by items or keys. Students advance because they *learned* something, not because they clicked the right button. Without this, it is a linear slideshow. Outer Wilds principle: "you don't even know you've encountered a gate until you gain the insight." | High | Core architectural decision. The "metroidbrainia" genre (coined for The Witness, Outer Wilds, Tunic) defines this: open-ended exploration where knowledge is the only real form of progression. Requires designing puzzles where the gate is invisible -- the student doesn't realize they need a concept until they encounter a phenomenon that requires it. |
| T2 | **Environmental puzzle language** | The Witness teaches rules through environment, not text. Each optical phenomenon must be discoverable through interaction -- rotating a polarizer and seeing light change, placing a crystal and watching the beam split. If the student has to read an explanation before the simulation makes sense, the discovery model has failed. PhET calls this "guiding without feeling guided." | High | Requires a consistent visual language for polarization states. The existing color system (0deg=red, 45deg=orange, 90deg=green, 135deg=blue) is a strong foundation. Shape language (symbol language, spatial cues) must reinforce color. Environmental storytelling research confirms: "the mastery lies in weaving narrative moments into a coherent visual language that players intuitively understand." |
| T3 | **Immediate, physics-accurate visual feedback** | When the student rotates a polarizer or changes a material, the light beam must respond instantly and correctly. PhET research: "dynamic feedback providing immediate responses to student actions" is the core scaffolding mechanism. Latency or inaccuracy destroys trust and learning. Brain imaging research confirms: insight moments "reshape how your brain represents information and sear it into memory" -- but only if the feedback is trustworthy. | Medium | Existing physics engines (Mueller/Jones/Stokes in `@/core/physics/unified/`, `benchPhysicsCalc.ts`) already handle the math. The challenge is visual rendering at 55fps, not physics correctness. |
| T4 | **Non-linear exploration** | Students must be able to explore in any order. The Witness has 11 areas accessible from the start. Outer Wilds: "none of the planets are self-contained, and you're constantly moving between them as you acquire new information." Forcing a linear path contradicts everything about discovery learning and was the root failure of v1-v5. | Medium | World design challenge. Need 3-5 distinct regions accessible from the start, with natural visual affordances drawing students toward simpler concepts first without forcing them. drei `<CameraControls>` with setLookAt transitions for smooth camera flights. |
| T5 | **Layered information depth (Intuition > Qualitative > Quantitative)** | Students choose their own depth. Layer 1: see the phenomenon and build intuition through visual/interactive play. Layer 2: qualitative explanation emerges when sought. Layer 3: full mathematical treatment with Jones/Mueller matrices. PhET implicit scaffolding research: "students must control their learning trajectory" -- design-in features guide without directing. Self-determination theory supports allowing learners to set their own goals and progress at their own pace. | Medium | Maps directly to the existing 3-tier system (Foundation/Application/Research) in odysseyData.ts. The UI challenge is making deeper layers accessible without cluttering the exploration view. |
| T6 | **Spatial coherence -- world feels like a place, not a menu** | Every region must feel like it belongs in the same physical world. Monument Valley principle: "every screen could be framed and hung on a wall." The crystal birefringence area and the scattering atmosphere area must feel connected, not like isolated demo stations. The fundamental lesson of v1-v5: "all versions were doing 'how to arrange 23 independent demos' instead of 'how to make knowledge fuse into one.'" | High | Art direction challenge more than technical. Needs a unifying visual metaphor (light's journey through different environments). Stylized, not realistic -- Monument Valley uses geometric minimalism; The Witness uses stylized environments. Abstract/stylized visuals let students focus on the physics. |
| T7 | **Manipulable optical components** | Core interaction: place, rotate, adjust optical elements (polarizers, waveplates, crystals, mirrors). This is the "verb" of the experience. Without hands-on manipulation, it is a video, not a discovery experience. Constructivist learning theory: "students construct their own knowledge through hands-on experiences and reflection." Games are active experiences where students learn by doing. | Medium | Existing patterns: odyssey-lab ComponentToolbar + BenchCanvas, game blocks system (16 block types with rotation, facing, polarization angle). Adapt these interactions to the 3D open world context -- drag to place, scroll to rotate, click to adjust. |
| T8 | **Ambient environmental response** | The world must visibly change in response to student actions. Discovery design research: "if your game is about exploration and discovery, your feedback should reward the player for finding secrets and solving puzzles." Environmental storytelling: props and light changes can suggest puzzle hints non-intrusively. Monument Valley: "hypnotic sound design and simplistic approach to surrealist architecture entraps the player in a restful, yet engaged, frame of mind." | Medium | Bloom intensification, color shifts, particle effects, ambient sound shifts. R3F postprocessing + Framer Motion for HTML overlays. The odyssey-v2 beam shaders and holographic HUD are reusable. Key: changes must feel consequential but not gamified (no score popups, no "ding" sounds). |
| T9 | **Smooth scene transitions** | Moving between regions must feel continuous, not page-load jarring. The illusion of a connected world depends on this. Outer Wilds achieves seamless planetary transitions. | Medium | Camera animation via drei CameraControls, lazy loading with React Suspense. Level-of-detail switching (drei `<Detailed />` can improve frame rates 30-40%). Asset compression with KTX2/Draco. Performance budget: maintain 55fps during transitions. |
| T10 | **Persistence of discovery state** | What you've discovered stays discovered across sessions. Outer Wilds: knowledge is the only persistent progress -- the world resets but understanding remains. Without persistence, returning students restart from zero, destroying the exploration arc. | Low | Zustand + localStorage. The existing `discoveryStore.ts` provides the foundation. Simple implementation, enormous impact on the 2-hour session goal. |

## Differentiators

Features that transform this from "a good physics simulation" into "an unforgettable learning experience." These are what make students stay for 2+ hours and return the next day.

| # | Feature | Value Proposition | Complexity | Notes |
|---|---------|-------------------|------------|-------|
| D1 | **Cross-concept "aha" connections** | The real insight in polarization optics is that concepts connect: Malus's Law, Brewster's angle, and birefringence are all aspects of how light interacts with matter's electromagnetic structure. The experience should create moments where a student realizes "wait, this is the SAME phenomenon I saw in a different context." Animal Well does this masterfully: items have unexpected second uses that recontextualize earlier puzzles. Neuroscience research: "aha moments reshape how your brain represents information" -- these are measurable, memorable, and the deepest form of learning. | High | Requires world design where the same light beam passes through multiple phenomena regions. A beam split by birefringence in one area arrives at a sensor in another that requires Malus's Law understanding. This is the killer feature and the hardest to design well. |
| D2 | **Three-layer depth architecture (Animal Well model)** | Layer 1: Complete the "main path" -- understand 6 core concepts through environmental interaction (accessible to all students). Layer 2: Hidden connections and deeper phenomena for curious students (optical rotation, Arago-Fresnel, Mueller matrices). Layer 3: Research-frontier challenges that connect to real-world applications. Animal Well proved this works commercially and critically: "a second, larger game hidden within the first" -- reviewers praised that Layers 2 and 3 are entirely optional but deeply rewarding. Billy Basso: Layer 3 is "meant to incentivize collaboration and build community." | High | Layer 1 is MVP. Layer 2 requires hiding "secret" interactions in already-explored areas (a crystal that only reveals its optical rotation when illuminated from a specific angle). Layer 3 is post-MVP and could connect to the existing Research module (/research). |
| D3 | **Mixed 2D/3D information architecture** | 3D for spatial immersion and phenomenon observation (watching a beam split through a crystal). 2D for theory panels, mathematical formalization, and precise measurement (seeing the Jones matrix representation). The transition should feel like "zooming in" -- from experiencing a beam in 3D space to seeing its mathematical representation in a clean 2D panel. Research on mixed-dimensional media: "interactions made over one representation translate to other representations in different forms." | Medium | R3F for 3D world + drei `<Html>` or CSS overlay for 2D theory. The existing demos use both (DemoCanvas for 3D, Demo2DCanvas for 2D). The innovation is making the transition feel organic: Framer Motion `layoutId` animations from 3D point of interest to 2D panel. |
| D4 | **Diegetic theory -- formulas emerge from phenomena** | Instead of showing I = I0*cos^2(theta) and then demonstrating it, let the student discover the cosine-squared relationship by manipulating a polarizer and observing intensity changes across angles. Then, optionally, the formula crystallizes from what they experienced. PhET: "implicit scaffolding enables students to have more control over their learning trajectory." The formula becomes a celebration of understanding, not a prerequisite for it. | High | Each region needs a "discovery arc": observe > manipulate > wonder > understand > (optionally) formalize. The existing `StationTheory` type in odysseyData.ts has `formula`, `foundationText`, `applicationText`, `researchText` fields -- these map to the layers. |
| D5 | **Environmental beauty as pedagogical tool** | Monument Valley team: "planned from the beginning to make a game where every screen could be framed and hung on a wall." Visual beauty creates engagement, patience, and attention. If the crystal birefringence scene is visually stunning, students will spend more time looking at it -- and notice more about how light splits. The "hypnotic" quality creates a "restful, yet engaged, frame of mind" that is ideal for learning. | Medium | Shader art, lighting design, color palettes per region. The odyssey-v2 shaders (beam.glsl.ts, chamberBeam.glsl.ts) and holographic HUD assets are starting points. This is ongoing art direction, not a one-time feature. Stylized geometry > photorealism. |
| D6 | **Concept constellation map** | A visual map showing discovered concepts and their connections. Not a checklist -- a living graph that grows as the student explores. Connections light up when cross-concept phenomena are experienced (D1). Knowledge graphs in education: "provide a multidimensional view of information, crucial where understanding intricate connections is paramount." This is the student's externalized mental model of polarization optics. | Medium | Custom SVG + Framer Motion, or adapt existing `ConceptNetwork` / `LearningPathMap` components. Driven by `discoveryStore.ts` state. Shown as an optional overlay, never forced. |
| D7 | **Ambient soundscape responsive to optical state** | Different polarization states, intensities, and phenomena produce different ambient sounds. Not gamified "ding" sounds -- subtle, atmospheric audio that reinforces the physics intuitively. Low-frequency hum for high intensity, crystalline tones for birefringence, silence for extinction angles. Game sound design research: sound "guides the player through the game world, reinforces systems and mechanics through feedback, creates an immersive environment." | Medium | Web Audio API or Tone.js. Technically straightforward but requires careful audio design. Must be optional (toggle on/off) for accessibility. Irregular, subtle audio cues produce best engagement (behavioral psychology: irregular reinforcement). |
| D8 | **Guided exploration mode (accessibility without hand-holding)** | For students who get stuck: subtle visual hints (a beam of light drawing attention to an unexplored area), a "curiosity compass" pointing toward undiscovered phenomena, a togglable "theory mentor" overlay. NOT a tutorial -- a lifeline. Celeste's Assist Mode is the gold standard: players adjust difficulty without shame. Game accessibility research: "camera hints for puzzles, allowing players to get guidance on where to look without revealing the solution." | Medium | Existing `GuidedExploration.tsx` and `InquiryPanel.tsx` show this pattern exists in the codebase. Adapt for open-world: hint intensity slider (off / subtle / moderate / explicit). Visual cues only at lower levels; text explanations at highest level. |
| D9 | **Real-world context anchors** | Each phenomenon region connects to a real-world application: LCD screens (polarizer arrays), stress analysis (photoelastic birefringence), sky color (Rayleigh scattering), fiber optics (waveplates). These appear as "windows to the real world" within the environment -- an in-world viewport showing an LCD display when you master polarizer stacking, not a text box saying "this is used in LCDs." | Low | Content already exists in odysseyData.ts (`realWorldExample` field). The challenge is spatial presentation: in-world portals/screens that activate upon discovery. Low effort, high pedagogical value. |
| D10 | **Seamless demo embedding** | The 23 existing demos can be accessed as "deep dives" from within the world. When a student wants to explore Malus's Law quantitatively, they transition into the full MalusLawDemo without leaving the experience. The demo becomes a "microscope" view of the phenomenon they just observed in-world. This leverages the massive existing content investment without rebuilding. | Medium | Lazy loading via existing odysseyData.ts component references (already set up with `React.lazy`). The modal/overlay pattern from odyssey-lab DemoEmbed.tsx is the right approach. drei `<Html>` or portal-based rendering. |

## Anti-Features

Features to deliberately NOT build. Each represents a design trap that would undermine the discovery-based learning philosophy or repeat the mistakes of v1-v5.

| # | Anti-Feature | Why Avoid | What to Do Instead |
|---|--------------|-----------|-------------------|
| A1 | **Scoring/grading system** | Scores transform exploration into performance anxiety. Students optimize for points instead of understanding. Self-determination theory: extrinsic rewards undermine intrinsic motivation. The Witness has no score. Outer Wilds has no score. Animal Well's deepest players are driven by curiosity, not points. PROJECT.md: "exploration-driven, not exam-driven." | Track discovery state (what has been observed/connected) but never assign numerical value. The concept constellation map (D6) shows progress as a growing web of understanding, not a percentage. |
| A2 | **Linear tutorial sequence** | "First, learn about polarization states. Then, learn about Malus's Law." This is the textbook approach that all 5 previous versions fell into. The Witness teaches its most complex rules without a single tutorial panel. PhET: implicit scaffolding outperforms explicit instruction for engaged exploration. | Environmental teaching through carefully designed interaction sequences. The first thing a student encounters should be self-explanatory through manipulation. If a concept requires prerequisite knowledge, the world design creates natural motivation to seek it. |
| A3 | **Text-heavy explanations as primary teaching** | If the student must read a paragraph before they can interact, the discovery model has failed. PhET: "minimal text allowing easy integration while reducing cognitive load." Environmental storytelling: "powerful environmental hints enhance accessibility by using visual language and spatial clues." Text that short-circuits discovery is anti-pedagogical in this model. | Text is Layer 2/3 depth (T5), accessed by choice. Layer 1 must be purely visual/interactive. Formulas and explanations are rewards for curiosity (D4), not prerequisites. |
| A4 | **Achievement/badge/XP system** | "You discovered birefringence! +100 XP!" This gamification cheapens genuine insight moments. The "aha" is the reward -- neuroscience shows these moments "sear into memory" precisely because they are internally generated. Extrinsic reward systems can "prioritize surface-level interaction over deeper conceptual understanding." | The concept constellation map (D6) naturally shows progress. Environmental changes (T8) serve as ambient acknowledgment. The student's own growing understanding IS the reward. |
| A5 | **Mandatory prerequisites / locked regions** | "You must complete Unit 0 before accessing Unit 1." This is course design, not exploration design. Outer Wilds: "if you have something you're curious about, use the information you have gathered to try and find it." Some students already know Malus's Law and want to jump straight to birefringence. | All regions accessible from the start (T4). Knowledge-gating (T1) handles difficulty organically: if a puzzle requires understanding from another area, the student will naturally seek that knowledge. If they already have it, they proceed immediately. The gates are invisible, not locked doors. |
| A6 | **Multiplayer/social features (for MVP)** | Social features add enormous complexity with unclear pedagogical benefit for solo discovery learning. Animal Well's Layer 3 community features came AFTER the single-player experience was proven compelling. Backend (NestJS + Colyseus) is planned but not for this milestone. | Design the discovery state system (T10) with extensibility for future sharing. Build the single-player discovery experience first, add community features only after Layer 1 is proven. |
| A7 | **Comprehensive in-world coverage of all 23 demos** | Trying to represent ALL 23 demos as full in-world phenomena would create an overwhelming, unfocused experience. Animal Well's genius: "Billy Basso created around three times as many rooms as were included in the final game" -- editing down is essential. Not every concept needs spatial 3D representation. | Select 8-12 core phenomena for in-world discovery (Layer 1). The remaining demos are accessible as "deep dives" (D10) via the demo embedding system. Quality of 8 experiences >> quantity of 23 shallow ones. |
| A8 | **Photorealistic 3D environments** | Photorealism is expensive, hard to maintain, and works AGAINST pedagogical clarity. Monument Valley: geometric minimalism. The Witness: stylized. Animal Well: pixel art. All chose stylization because it directs attention to gameplay/learning, not scenery appreciation. WebGL performance constraints make photorealism impractical at 55fps anyway. | Stylized, color-coded environments where the visual language IS the physics. Polarization states are visually distinct through color (existing system) and shape language. Beauty through art direction, not polygon count. |
| A9 | **Mobile-first design** | Open-world 3D exploration with precision optical manipulation requires mouse/keyboard. "3D User Interfaces introduce an entirely new spatial dimension" that touchscreens handle poorly. PROJECT.md: "Web desktop-first, mobile adaptation later." | Desktop-first with mouse/keyboard/trackpad controls. Mobile is a future phase with simplified 2D interaction patterns (not the same experience, a companion experience). |
| A10 | **Rebuilding existing demos from scratch** | The 23 demos work. They have been iterated over 5 versions. odysseyData.ts already has lazy-loaded components with theory content for all 23. Rebuilding wastes enormous effort and introduces bugs. PROJECT.md out-of-scope: "do not rewrite the 23 demo components." | Embed existing demos via lazy loading (D10). Invest new effort in the world/environment layer that CONNECTS them. The demos are the deep content; the world is the discovery framework. |

## Feature Dependencies

```
T3 (Physics-accurate feedback) --> T2 (Environmental puzzle language)
    Physics engine must render correctly before puzzles can teach through visual feedback.

T2 (Environmental puzzle language) --> T7 (Manipulable components)
    Visual language requires interaction to be meaningful -- you learn by manipulating.

T7 (Manipulable components) --> T8 (Ambient environmental response)
    Need interaction before the world can respond to interaction.

T7 (Manipulable components) --> T1 (Knowledge-gated progression)
    Manipulation creates understanding; understanding unlocks gates.

T6 (Spatial coherence) --> T4 (Non-linear exploration)
    World must feel connected before free exploration makes sense.

T4 (Non-linear exploration) --> T9 (Smooth transitions)
    Non-linear movement needs seamless transitions between areas.

T5 (Layered depth) --> D3 (Mixed 2D/3D architecture)
    Depth layers need the 2D/3D transition system to present theory content.

T5 (Layered depth) --> D4 (Diegetic theory)
    Layer 2/3 content uses the diegetic formula emergence system.

T1 (Knowledge gating) --> D1 (Cross-concept connections)
    Knowledge gates enable and reward cross-concept "aha" moments.

T8 (Environmental response) --> D5 (Environmental beauty)
    Response system enables aesthetic environmental reactions to discovery.

T10 (Persistence) --> D6 (Concept constellation map)
    Discovery state feeds the knowledge graph visualization.

D10 (Demo embedding) --> T5 (Layered depth)
    Embedded demos serve as the quantitative (Layer 3) depth option.

D8 (Guided exploration) --> T1 (Knowledge gating)
    Hint system must know what the student hasn't discovered yet.
```

**Critical path for MVP:**

```
T3 (physics rendering) --> T2 (visual language) --> T7 (manipulation)
                                                        |
                                                        v
T6 (spatial coherence) --> T4 (non-linear) -----> T8 (env response)
                                                        |
                                                        v
                                                  T1 (knowledge gating)
```

Build order: physics rendering first, visual language second, manipulation third, spatial world fourth, environmental response fifth, knowledge gating last. Each layer builds on the previous.

## MVP Recommendation

**Phase 1 -- Prove the Core Loop (one region, one phenomenon set):**

1. **T3: Physics-accurate visual feedback** -- Render polarization state changes in real-time using existing physics engines. This is the non-negotiable foundation.
2. **T7: Manipulable optical components** -- Drag/rotate polarizers and observe light behavior. Adapt from odyssey-lab BenchCanvas interactions.
3. **T2: Environmental puzzle language** -- Establish the visual language for polarization (color, shape, animation patterns). Build on existing color system.
4. **T6: Spatial coherence (one region)** -- Build one complete, beautiful region: suggest "Crystal Cavern" combining birefringence + Malus's Law because these are the two most visually dramatic and foundational concepts.
5. **D5: Environmental beauty** -- Make this first region visually stunning. This proves the concept to stakeholders and students alike. Monument Valley standard: "every frame worth framing."
6. **T8: Ambient response (basic)** -- Light patterns shift when the student achieves correct configurations. No text, no popups -- the world changes.

**Phase 2 -- Expand to Open World (3-5 regions, non-linear):**

7. **T4: Non-linear exploration** -- Add 2-4 more regions, accessible from a central hub.
8. **T9: Smooth transitions** -- Camera flights between regions, lazy loading, LOD.
9. **T1: Knowledge-gated progression** -- Now that multiple regions exist, design cross-region knowledge gates.
10. **D1: Cross-concept connections** -- Wire up "aha" moments between regions.
11. **T5: Layered information depth** -- Add qualitative/quantitative layers to completed regions.
12. **T10: Persistence** -- Save discovery state across sessions.

**Phase 3 -- Depth and Polish:**

13. **D3: Mixed 2D/3D architecture** -- Refined transitions from 3D phenomena to 2D theory.
14. **D4: Diegetic theory** -- Formulas emerge from phenomena.
15. **D10: Demo embedding** -- Existing 23 demos accessible as deep dives.
16. **D6: Concept constellation map** -- Visual knowledge graph.
17. **D8: Guided exploration** -- Built after playtesting reveals where students get stuck.

**Defer to post-MVP:**

- **D2 (Three-layer depth):** Layers 2 and 3 are for after Layer 1 is proven compelling.
- **D7 (Ambient soundscape):** High polish feature. Add after visual experience is solid.
- **D9 (Real-world anchors):** Content exists in odysseyData.ts; presentation can come later.
- **A6 (Multiplayer):** Only after single-player discovery is validated.

## Content Mapping: Phenomena to World Regions

The 6 existing units map to distinct environments where light behaves differently. This mapping is both pedagogically sound (each region has a coherent physics theme) and aesthetically driven (each region has a distinct visual identity).

| Region | Physics Unit | Key Phenomena | World Metaphor | Priority |
|--------|-------------|---------------|----------------|----------|
| **Origin Clearing** | Unit 0: Basics | Light wave nature, polarization states, polarizer filtering, Malus's Law | Open sunlit space where students first encounter light and its hidden polarization | MVP |
| **Crystal Cavern** | Unit 1: Modulation | Birefringence, o-ray/e-ray splitting, waveplate effects, quarter/half-wave | Underground crystal formations that split and transform light into extraordinary beams | MVP |
| **Glass Boundary** | Unit 2: Interfaces | Fresnel equations, Brewster's angle, reflection polarization | Smooth glass surfaces and water boundaries where light reflects with hidden polarization | Phase 2 |
| **Living Gallery** | Unit 3: Transparent Media | Chromatic polarization, optical rotation, anisotropy, sugar solutions | A gallery of colored crystalline and organic materials that rotate and filter light | Phase 2 |
| **Sky Terrace** | Unit 4: Turbid Media | Rayleigh scattering, Mie scattering, sky polarization, sunset effects | Open-air observation deck showing why the sky is blue and polarized | Phase 2-3 |
| **Measurement Chamber** | Unit 5: Polarimetry | Stokes vectors, Mueller matrices, Jones calculus, Poincare sphere | A precision laboratory where intuition is formalized into mathematics | Phase 3 |

**Design principle:** The first 4 regions are primarily experiential (Layer 1 -- intuition and qualitative understanding). The Measurement Chamber is where quantitative formalism lives -- students arrive here after building intuition in other regions and can now formalize what they already understand intuitively. This mirrors PhET's approach: "visual representations that encourage analogical reasoning about unfamiliar phenomena" first, then mathematical formalization.

**Cross-region connections (D1) examples:**
- A beam polarized in the Origin Clearing passes into the Crystal Cavern and splits -- connecting Malus's Law to birefringence
- Brewster's angle reflection from the Glass Boundary creates perfectly polarized light that the student recognizes from Origin Clearing manipulations
- Sky Terrace scattered light analyzed with Measurement Chamber tools reveals the same Stokes parameters studied in isolation

## Sources

### HIGH confidence (official docs, Wikipedia, peer-reviewed)
- [PhET Interactive Simulations research](https://phet.colorado.edu/en/research) -- Implicit scaffolding design principles
- [PhET on PhysPort](https://www.physport.org/methods/PhET) -- Physics education deployment patterns
- [Animal Well Wikipedia](https://en.wikipedia.org/wiki/Animal_Well) -- Three-layer design confirmed by developer interviews
- [Monument Valley Wikipedia](https://en.wikipedia.org/wiki/Monument_Valley_(video_game)) -- Design philosophy and art direction
- [The Witness Wikipedia](https://en.wikipedia.org/wiki/The_Witness_(2016_video_game)) -- Environmental puzzle design
- [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/) -- Accessibility best practices
- [R3F Scaling Performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) -- Performance optimization
- [Aha moments neuroscience (Scientific American)](https://www.scientificamerican.com/article/the-elusive-brain-science-of-aha-moments/) -- Insight memory formation
- Existing PolarCraft codebase (odysseyData.ts, physics engines, demo components) -- Direct inspection

### MEDIUM confidence (multiple credible sources agree)
- [The Witness environmental puzzle analysis](https://medium.com/game-design-fundamentals/the-witness-and-the-art-of-environmental-puzzles-af661f6dfff0) -- Environmental teaching patterns
- [The Witness puzzle design art](https://globalplay24.org/blog/cross-platform-gaming/the-art-of-puzzle-design-in-the-witness-minimalism-exploration-and-discovery) -- Minimalism and discovery
- [Outer Wilds emotional design deep dive](https://kirbylife.co.uk/2025/02/25/outer-wilds-a-gurs-deep-dive-into-emotional-design-and-exploration/) -- Knowledge as progression
- [Outer Wilds "Invention of Fire"](https://www.giantbomb.com/profile/gamer_152/blog/the-invention-of-fire-discovery-in-outer-wilds/264211/) -- Discovery loop design
- [Knowledge-Based Progression (TV Tropes)](https://tvtropes.org/pmwiki/pmwiki.php/Main/KnowledgeBasedProgression) -- Genre patterns
- [Metroidbrainia genre analysis](https://thinkygames.com/features/metroidbrainia-an-in-depth-exploration-of-knowledge-gated-games/) -- Knowledge-gated games
- [Animal Well environmental design](https://thinkygames.com/features/how-animal-wells-environmental-design-taps-into-our-need-for-puzzle-solving-satisfaction/) -- Hidden layer satisfaction
- [Monument Valley design inspiration](https://www.krasamo.com/game-design-inspiration-monument-valley-i-and-ii/) -- Art direction principles
- [Constructivism and video games](https://www.filamentgames.com/blog/constructivism-constructionism-and-video-games/) -- Learning theory
- [Environmental storytelling patterns](https://gamedesignskills.com/game-design/environmental-storytelling/) -- Visual language teaching
- [Feedback in games](https://www.gamedeveloper.com/game-platforms/feedback-in-games-how-to-design-rewards-and-punishments) -- Reward system design
- [Scaffolding in simulations (SpringerOpen 2024)](https://stemeducationjournal.springeropen.com/articles/10.1186/s40594-024-00490-7) -- Embedded scaffolding research

### LOW confidence (single source, needs validation)
- [Discovery in game design](https://www.numberanalytics.com/blog/ultimate-guide-to-discovery-in-game-design) -- Discovery mechanics taxonomy
- [R3F vs Three.js 2026](https://graffersid.com/react-three-fiber-vs-three-js/) -- WebGPU readiness claims
