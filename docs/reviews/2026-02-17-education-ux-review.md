# Education Design & UX Review

**Date**: 2026-02-17
**Reviewer**: Education Design & UX Reviewer (Claude Agent)
**Scope**: Prerequisite graph, completion criteria, difficulty tiers, cross-module links, progress visibility, collaboration workflow, learning styles, i18n quality, gamification balance

---

## 1. Prerequisite Graph: Pedagogical Soundness

### Current Chain Analysis

The prerequisite graph in `src/data/learningPaths.ts` follows this core flow:

```
em-wave (entry) --> polarization-intro --> polarization-types-unified --> optical-bench
                          |                        |
                          v                        +---> malus --> birefringence --> waveplate
                    polarization-state                     |              |
                          |                                |              v
                          v                                |        chromatic (also needs waveplate)
                        stokes (also needs malus)          |
                          |                                +---> fresnel --> brewster
                          +---> mueller --> polarimetric-microscopy
                          +---> jones
                          +---> calculator

                    polarization-intro --> anisotropy --> optical-rotation
                                                    +--> chromatic (also needs waveplate)

                    polarization-types-unified --> rayleigh --> mie-scattering --> monte-carlo-scattering
```

### Strengths

1. **Sound foundational sequencing**: em-wave -> polarization-intro -> polarization-types-unified is pedagogically correct. Students must understand electromagnetic waves before grasping polarization, and must understand what polarization is before learning about its types.

2. **Appropriate branching**: After `polarization-types-unified`, the graph branches into multiple paths (Malus, Fresnel, scattering, anisotropy) that can be pursued in parallel. This respects different learning interests and course sequences.

3. **Cross-unit connections**: `chromatic` requiring both `anisotropy` AND `waveplate` correctly models that chromatic polarization requires understanding both material properties and phase retardation.

4. **Stokes requiring both `polarization-state` and `malus`**: This is pedagogically sound -- understanding Stokes vectors requires both the concept of polarization states and quantitative intensity relationships.

### Issues Found

**Issue 1.1: AragoFresnel Demo missing from prerequisites**

The file `src/components/demos/unit1/AragoFresnelDemo.tsx` exists but is NOT listed in the DEMOS array in DemosPage.tsx, nor in the DEMO_PREREQUISITES. This demo covers the Arago-Fresnel laws which are foundational to understanding interference of polarized light. It should be included and placed after `waveplate` in the prerequisite chain.

**Recommendation**: Add `arago-fresnel` to both DEMOS and DEMO_PREREQUISITES, with prerequisites `['waveplate']`. Link it forward toward `stokes` as an alternative path.

**Issue 1.2: Missing connection from waveplate to Stokes/Mueller**

Students who understand waveplates have a natural bridge to understanding Stokes/Mueller formalism (since waveplates are typically described using Mueller matrices). Currently, `stokes` only requires `polarization-state` and `malus` -- it should also suggest (not require) `waveplate` as a recommended-but-not-required prerequisite.

**Recommendation**: Add a `softPrerequisites` field to the data structure for "recommended but not required" demos.

**Issue 1.3: Rayleigh scattering prerequisites too shallow**

`rayleigh` only requires `polarization-types-unified`. However, Rayleigh scattering produces partially polarized light, which is best understood after learning about Malus's Law and possibly Stokes vectors. A student going directly from "types of polarization" to "scattering" may lack the quantitative framework.

**Recommendation**: Consider adding `malus` as a prerequisite for `rayleigh`, or at minimum as a soft prerequisite.

**Issue 1.4: No entry point for Unit 3**

`anisotropy` has `polarization-intro` as its only prerequisite. While this is technically correct (you can observe anisotropy with basic polarization knowledge), the Unit 3 content on stress birefringence and optical activity involves quantitative concepts that benefit from knowing Malus's Law. This creates a risk that students explore Unit 3 before having adequate quantitative tools.

**Recommendation**: Keep the prerequisite as-is (to allow early exploration) but add a "recommended background" note in the UI.

---

## 2. Auto-Completion (30-Second Timer): Critical UX Issue

### Current Implementation

From `DemosPage.tsx:1635-1642`:
```typescript
// Mark demo as completed after 30 seconds of interaction
useEffect(() => {
  if (!activeDemo) return
  const timer = setTimeout(() => {
    markDemoCompleted(activeDemo)
  }, 30000)
  return () => clearTimeout(timer)
}, [activeDemo, markDemoCompleted])
```

### Problem Analysis

This is the **most significant pedagogical issue** in the current implementation. A 30-second timer:

1. **Does not verify engagement**: A student can open a demo, switch to another tab, and return to find it "completed." This undermines the entire prerequisite system.

2. **Penalizes slow learners**: 30 seconds is too short for complex demos like `monte-carlo-scattering` (25 min estimated) or `stokes` (20 min estimated). The timer has no relationship to the demo's actual complexity.

3. **Devalues "completed" status**: If completion is trivially achievable, progress indicators become meaningless. Students and teachers cannot trust the progress data.

4. **Encourages "speed-running"**: Students may learn that they can unlock later demos by simply opening earlier ones for 30 seconds each, bypassing the entire learning scaffolding.

### Recommended Alternatives

**Option A: Interaction-Based Completion (Recommended)**
Track meaningful interactions specific to each demo:
```typescript
interface CompletionCriteria {
  demoId: string
  // Must interact with at least N controls/sliders
  minInteractions: number
  // Must view the demo for at least this many seconds (scaled to estimated time)
  minViewTimeSeconds: number
  // Must answer at least one question correctly (if quiz exists)
  requireQuizAttempt?: boolean
}
```
For example:
- `em-wave`: Adjust wavelength slider + view for 60s
- `malus`: Rotate polarizer angle through at least 3 values + observe intensity change
- `stokes`: Interact with at least 2 Stokes parameter controls + view for 3 min

**Option B: Explicit "Mark Complete" Button**
Add a visible "I've explored this demo" button that students click. This:
- Respects student agency (they decide when they're done)
- Is simple to implement
- Can be combined with a minimum time requirement (e.g., button appears after 2 minutes)

**Option C: Quiz-Gated Completion**
Each demo has 1-2 simple questions. Answering correctly (even on retry) marks completion. The `DemoQuiz.tsx` component already exists in the codebase.

**Recommended Implementation**: Use Option B as the default, with Option A for demos that have interactive controls. Option C should remain available as an enhancement through the existing `DemoQuiz` component.

---

## 3. Difficulty Tiers: Foundation / Application / Research

### Current Implementation

The difficulty system is well-designed in the COURSE_DESIGN.md:

| Tier | Icon | Audience | Learning Mode |
|------|------|----------|---------------|
| Foundation | Seedling | Beginners | PSRT: Problem-driven |
| Application | Microscope | Intermediate | ESRT: Rotational training |
| Research | Rocket | Advanced | ORIC/SURF: Independent |

### Assessment

**Strength**: The DemosPage already supports difficulty levels with content adaptation -- formulas are hidden at Foundation, shown at Application, and fully derived at Research. This is well-implemented.

**Issue 3.1: Prerequisites are NOT difficulty-dependent**

The prerequisite graph is the same regardless of difficulty tier. This means:
- A Foundation-level student must complete `em-wave` before accessing `polarization-intro`, which is appropriate.
- But a Research-level student (e.g., a graduate student) must follow the same path, which may be frustrating.

**Recommendation**: Add a "skip prerequisites" option at the Research tier. Research-level users should be treated as self-directed learners who can navigate freely. Implementation:
```typescript
function isDemoAvailable(demoId: string, completedDemoIds: Set<string>, tier: DifficultyLevel): boolean {
  if (tier === 'research') return true // Research students can access anything
  const prereq = prerequisiteMap.get(demoId)
  if (!prereq) return true
  return prereq.prerequisites.every((pid) => completedDemoIds.has(pid))
}
```

**Issue 3.2: Default difficulty level**

The default difficulty is `application` (line 1622: `useState<DifficultyLevel>('application')`). For a platform targeting Chinese university students, this is reasonable. But first-time visitors have no onboarding to explain what the tiers mean.

**Recommendation**: Add a brief one-time onboarding tooltip or modal explaining the three tiers when a user first visits the Demos page.

---

## 4. Cross-Module Links: Learning Reinforcement

### Current Implementation

The `CrossModuleLinks` component in `src/components/shared/CrossModuleLinks.tsx` surfaces contextual links after completing demos. Example links:

| After Demo | Links To | Module |
|------------|----------|--------|
| polarization-intro | History & Stories | Chronicles |
| malus | Try Optical Studio, Play 2D Puzzles | Studio, Games |
| birefringence | View Experiments | Gallery |
| brewster | Real-World Applications | Research |
| monte-carlo-scattering | Virtual Lab | Research |
| stokes | Stokes Calculator | Demos/Calc |
| mueller | Mueller Calculator | Demos/Calc |

### Assessment

**Strength**: These links reinforce learning through multiple modalities:
- Demo (theory) -> Game (practice) is classic "learn then apply"
- Demo (theory) -> Studio (experiment) enables hands-on exploration
- Demo (theory) -> Calculator (tool) provides computational practice
- Demo (theory) -> Chronicles (context) gives historical perspective

**Issue 4.1: Some cross-links feel generic**

`birefringence -> View Experiments` and `chromatic -> View Experiments` both link to `/gallery` with the same label. These should be more specific:
- birefringence -> "See Calcite Double Image" (specific experiment)
- chromatic -> "Create Polarization Art" (specific creative activity)

**Issue 4.2: Missing game-specific links**

After `malus`, the link to "Play 2D Puzzles" goes to `/games/2d` generically. It would be more pedagogically effective to deep-link to a specific level that uses Malus's Law (e.g., Level 2: Crossed Polarizers).

**Issue 4.3: No reverse links**

When a student is in the Games module and gets stuck, there's no link back to the relevant demo. Cross-module links should be bidirectional.

**Recommendation**: Add "Learn the physics" links in game levels and Optical Studio experiments that point back to the relevant demo.

---

## 5. Progress Visibility: Motivating vs. Anxiety-Inducing

### Current Implementation

- **Homepage**: Progress rings on module cards (SVG circles showing percentage)
- **DemosPage**: Unit-level progress bars + per-demo completion checkmarks + lock icons
- **Sidebar**: "Start Here" badge on recommended next demo

### Assessment

**Issue 5.1: Progress rings may create false expectations**

For modules like "History" (Chronicles), "Games", or "Gallery" that are exploratory, a progress ring implies there's a fixed amount of content to "finish." This conflicts with the exploration-based learning philosophy described in COURSE_DESIGN.md: "支持自由探索和推荐路径" (supports free exploration and recommended paths).

**Recommendation**:
- Only show progress rings for modules with clear learning objectives (Demos/Theory module).
- For exploration modules (Chronicles, Gallery, Games), use an "explored" indicator instead (e.g., "You've visited 3 areas") or remove the ring entirely.
- Consider a "curiosity meter" that celebrates exploration rather than completion.

**Issue 5.2: Lock icons may frustrate**

Locked demos show a lock icon and dimmed text, but are still clickable (the click is not actually prevented). This creates a confusing UX: the visual says "locked" but the behavior says "accessible." Students may either:
- Avoid clicking (missing content they could access)
- Click and be confused why it works despite the lock

**Recommendation**: Either:
(a) Actually prevent access to locked demos (show a modal explaining prerequisites), or
(b) Remove the lock icon and instead show "Recommended: complete X first" as a suggestion, making it clear that access is not restricted.

Option (b) better fits the exploration-based philosophy. Gating content behind hard locks in educational software often frustrates rather than motivates.

**Issue 5.3: "Start Here" badge is good but should be more prominent**

The current "Start Here" badge is a small tag (`text-[9px]`). For first-time users, this is the most important navigation cue. It should be more visible.

**Recommendation**: Make the "Start Here" badge slightly larger and consider adding a subtle pulsing animation for the first visit.

---

## 6. Collaboration Workflow: Realism for Chinese University Classrooms

### Current Implementation

The `collaborationStore.ts` implements:
- Create research projects with optical designs
- Export as JSON file (download)
- Import peer's JSON file (upload)
- Write reviews (observations, suggestions, rating)
- Export/import reviews as JSON
- Publish to showcase

### Assessment

**Issue 6.1: JSON file exchange is high-friction in Chinese university contexts**

In Chinese universities, the dominant communication platform is WeChat (not email or LMS). The workflow of "download JSON -> send via WeChat file transfer -> recipient saves and uploads" is technically feasible but:
- WeChat compresses/renames files unpredictably
- Students are not accustomed to handling JSON files
- The workflow requires multiple manual steps

**Recommendations (prioritized)**:

1. **QR Code sharing (high priority)**: Generate a QR code containing a compressed/base64-encoded project URL or data blob. Students scan with WeChat to import. This is the most natural sharing mechanism in China.

2. **Copy-paste sharing (medium priority)**: Allow copying the JSON to clipboard as a text string. Students can paste in WeChat chat. On the receiving end, paste text into an import field. WeChat preserves text reliably.

3. **Short code sharing (medium priority)**: Generate a 6-digit alphanumeric code that maps to a project (requires backend). Students share codes verbally or in class.

4. **WeChat Mini Program (future)**: A companion WeChat mini-program could enable seamless sharing within the WeChat ecosystem.

**Issue 6.2: Review workflow is too formal**

The current review form (observations, suggestions, rating 1-5) mimics academic peer review. For undergraduate students in a teaching context, this may feel:
- Intimidating (they're reviewing peers' work with a rating)
- Time-consuming (three separate text fields)

**Recommendation**: Simplify the review form:
- Single text field: "What do you notice about this design? Any suggestions?"
- Optional emoji-based reaction instead of 1-5 rating (e.g., Interesting, Creative, Needs work, Excellent)
- Add structured prompts: "Is the light path physically correct?", "Does the design achieve its goal?"

**Issue 6.3: No real-time collaboration**

The collaboration is entirely async. For classroom use, real-time collaboration (multiple students working on the same optical bench) would be more engaging. The backend skeleton (NestJS + Colyseus) already exists.

**Recommendation**: Prioritize "classroom mode" where a teacher can broadcast their optical bench design to all students' screens in real-time (one-way sync). This is more immediately useful than full two-way collaboration and simpler to implement.

---

## 7. Learning Styles Accommodation

### Assessment

The platform accommodates multiple learning styles reasonably well:

| Learning Style | Supported By | Quality |
|----------------|-------------|---------|
| **Visual** | 20+ interactive demos with 2D/3D visualizations | Excellent |
| **Kinesthetic/Hands-on** | 2D/3D games, Optical Studio drag-and-drop | Good |
| **Logical/Mathematical** | Calculator Workshop (Jones, Stokes, Mueller) | Good |
| **Reading/Writing** | Chronicles, course content, DIY instructions | Good |
| **Social** | Collaboration workflow | Nascent |
| **Auditory** | Not supported | Missing |

### Gaps

**Issue 7.1: No audio/narration support**

For a platform used in Chinese education, audio narration (especially in Chinese) would significantly improve accessibility. Many students learn better with voice-guided instruction.

**Recommendation**: Consider adding optional Chinese narration for key demos, especially at the Foundation difficulty level.

**Issue 7.2: Limited social learning**

The collaboration store exists but is not integrated into the main learning flow. Students learn alone by default.

**Recommendation**: Add lightweight social features:
- "X students have completed this demo" counters (anonymized)
- Shared class leaderboard for games (opt-in)
- "Ask the class" button that exports a question screenshot

**Issue 7.3: No note-taking facility**

Students cannot annotate demos or save personal notes. The "Lab Notebook" concept exists in the discovery system but is limited to unlocking achievements.

**Recommendation**: Add a simple per-demo notes field (saved in localStorage) where students can write observations. This reinforces reflective learning.

---

## 8. i18n Quality Assessment

### English Translations

The English translations in `en.json` are professional and accurate:
- Physics terms are correctly used (Stokes, Mueller, Malus, Brewster, Fresnel)
- Labels are concise and clear
- The learning paths section uses appropriate educational terminology

### Chinese Translations

The Chinese translations in `zh.json` are generally natural:
- "马吕斯定律" (Malus's Law) - Correct standard Chinese physics term
- "双折射" (Birefringence) - Correct
- "布儒斯特角" (Brewster's Angle) - Correct
- "偏振态" (Polarization state) - Correct
- "Stokes计算器" / "Mueller计算器" - Mixing English names with Chinese is standard practice in Chinese physics

### Issues Found

**Issue 8.1: Inconsistent English name handling**

Some translations keep English names (Stokes, Mueller), others translate them:
- "Stokes计算器" -- keeps English (correct, standard in Chinese physics)
- "马吕斯定律实验" -- transliterated (correct)
- "琼斯矩阵" -- transliterated (correct but some Chinese physicists use "Jones矩阵")

**Recommendation**: This is acceptable as-is. Both approaches are used in Chinese physics education.

**Issue 8.2: "从这里开始" (Start Here) is natural**

This translation is good and commonly used in Chinese educational software.

**Issue 8.3: "未解锁" vs "已锁定"**

"未解锁" (not-yet-unlocked) is used for locked demos. This is slightly softer than "已锁定" (locked) and is a good choice pedagogically as it implies eventual access.

### Overall i18n Verdict: Good quality, no critical issues.

---

## 9. Gamification Balance: Lock/Unlock Mechanics

### Current State

- Demos have visual lock indicators (dimmed + lock icon) but are NOT actually locked
- "Start Here" badge guides but doesn't force
- Progress rings track completion percentage
- Cross-module links reward exploration

### Assessment

**Strength**: The current approach is more "soft guidance" than "hard gating." This is appropriate for a university-level educational platform where students should have autonomy.

**Issue 9.1: No bypass for advanced students**

A graduate student or someone with prior optics knowledge must still follow the prerequisite chain from `em-wave` forward. There is no "test out" or "I already know this" mechanism.

**Recommendation**: Add a "Mark as already known" option (perhaps hidden behind a long-press or settings toggle) that lets experienced students skip prerequisites. Alternatively, implement the Research-tier bypass mentioned in Section 3.

**Issue 9.2: No consequence for accessing "locked" demos**

Since locked demos are accessible anyway, the lock icon is purely visual. Students will quickly learn this and ignore it. This creates a "crying wolf" effect where the prerequisite system loses credibility.

**Recommendation**: Either enforce the lock (with a friendly modal explaining prerequisites) or remove it entirely. The current halfway approach is worse than either extreme.

**Issue 9.3: Discovery system is disconnected from learning path**

The `discoveryStore` tracks 28 discoveries (polarization types, interference, techniques, etc.) but these are not connected to the demo prerequisite system. A student could unlock "Malus's Law" discovery in the game without ever visiting the Malus's Law demo, creating an inconsistency.

**Recommendation**: Consider unifying the two systems: completing a demo should also trigger relevant discoveries, and unlocking a discovery in a game could count as "soft completion" of the related demo.

---

## Summary of Recommendations (Priority Order)

### Critical (Should Fix Before Release)

1. **Replace 30-second auto-completion** with interaction-based or explicit "Mark Complete" button
2. **Resolve lock icon inconsistency**: Either enforce locks or remove them; the current hybrid is confusing

### High Priority

3. **Add Research-tier bypass**: Advanced students should not be gated by Foundation-level prerequisites
4. **Add QR code and copy-paste sharing** for collaboration (critical for Chinese classroom adoption)
5. **Add missing AragoFresnel demo** to prerequisite graph
6. **Unify discovery system with learning path completion**

### Medium Priority

7. **Make cross-module links more specific** (deep-link to specific levels/experiments)
8. **Add bidirectional cross-module links** (games -> demos, not just demos -> games)
9. **Simplify review workflow** (single text field + emoji reactions)
10. **Add per-demo notes** (localStorage-based reflection journal)
11. **Progress rings only for structured modules** (Demos/Theory), exploration indicators for others

### Low Priority / Future

12. Add audio narration for Foundation-level demos (Chinese)
13. Add "classroom broadcast" mode for teachers
14. Add soft prerequisites / "recommended background" indicators
15. Add onboarding tooltip explaining difficulty tiers
16. Enlarge "Start Here" badge for first-time visitors

---

*Report generated by Education Design & UX Review Agent*
