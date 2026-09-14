# Annotation Learning -- Context

## Status
- Phase 1: COMPLETE
- Phase 2: IN PROGRESS -- did one hands-on CVAT pass, found a real bug, not yet fixed/re-exported
- Phase 3: Not started
- Phase 4: Not started (preview material already surfaced -- see below)

---

## Phase Structure

| Phase | Topic | Status |
|---|---|---|
| 1 | Conceptual -- what clients want annotated, annotation types, data formats | Complete |
| 2 | Hands-on CVAT -- annotate a real video end to end | Next |
| 3 | QA -- how to review and reject annotation work | Not started |
| 4 | Physical AI specific -- what robotics clients need differently | Not started |

---

## Phase 1 -- What Was Covered

### The 5 Ego4D Annotation Types

**1. Narration**
Timestamped free-text description of what's happening, spoken by the contributor as they record.
- Output: JSON array of `{ t: float, text: string }`
- Contributor narration wins over post-hoc free-text (captures intent, synchronized, already in audio)
- Narration timestamp ≠ action segment timestamp -- contributor speaks slightly after starting action

**2. Action Segments**
Start/end timestamps + verb + noun for notable actions only. Not continuous.
- Output: `{ start: float, end: float, verb: string, noun: string }`
- Action starts at hand CONTACT with object, not at reach or gaze
- EPIC-Kitchens format adds verb_class and noun_class integer IDs for model training generalization

**3. Object State Change**
Before/after state of objects involved in an action. Requires human judgment.
- Output: `{ object: string, state_before: string, state_after: string, change_at: float }`
- Examples: bolt (loose → tight), drawer (closed → open), container (empty → filled)
- Separate from action segments -- tells WHAT CHANGED, not what happened

**4. HOI (Hand Object Interaction)**
Continuous frame-by-frame log of hand-object contact. Runs the entire video duration, never stops.
- Output: array of `{ t: float, hand: string, object: string|null, contact: bool, grip: string|null }`
- Grip types: power_grip, precision_grip, pinch, stabilize, loose, null (no contact)
- HOI = HOW (spatial/physical). Phase decomposition = WHEN (temporal). Kept as separate JSON keys.
- Most expensive annotation type -- no frames can be skipped
- HOI is a different dimension from action segments, not the same thing

**5. Gaze**
X,Y pixel coordinates on frame + fixation vs saccade. Hardware-dependent.
- Hardware: Tobii Pro glasses ($15k+) required for real coordinates
- Gaze leads action by 600ms-1 second -- eyes fixate on target before hand moves
- Post-hoc estimation: OpenFace 2.0 (head pose) + GazeTR or L2CS-Net (saliency) = estimated region, not precise coordinates
- Post-hoc output flagged with `method: "post_hoc_estimation"` and confidence score

### Additional Spatial Annotation Types

**Bounding Boxes**
Rectangle around an object in a frame. Defined as [x, y, width, height].
- Sparse: box drawn only at key events (first contact, state change)
- Dense: box redrawn every frame or every N frames (what robotics clients need for tracking)
- Must specify mode in annotation brief -- sparse without labeling it is inconsistent data
- Combines with HOI: HOI says what grip, bbox says where in frame

**Keypoints**
Landmark points on body or object. Standard hand model = 21 keypoints (wrist, fingertips, joints).
- Used for grip type, finger position, pose estimation
- What bounding boxes can't capture -- geometry, not just location

### JSON Structure
All annotation types in one file per video under separate keys:
```json
{
  "video_id": "...",
  "narration": [...],
  "action_segments": [...],
  "object_states": [...],
  "HOI": [...],
  "gaze": [...],
  "bounding_boxes": [...],
  "keypoints": [...]
}
```
In production datasets (EPIC-Kitchens), each layer is a separate file linked by video_id + frame number. Not one combined CSV -- layers have different densities (action segments: sparse, HOI/boxes: dense).

### Tier Breakdown

| Tier | What's included | Qube status |
|---|---|---|
| 1 | Raw narrated video | Can do today |
| 2 | + Action segments + Object state change | Can do today |
| 3 | + HOI frame-by-frame | 4-6 weeks (needs CVAT training) |
| 4 | + Phase decomposition, teleoperation | Not yet |
| 5 | + Gaze hardware | Not yet ($15k hardware) |

Phase decomposition (reach → grasp → manipulate → release) is only for Tier 3-4 projects.

### Real Dataset Reference
- **EPIC-Kitchens**: `github.com/epic-kitchens/epic-kitchens-100-annotations` -- public CSV, action segments + narration, no signup
- **Ego4D**: `ego4d-data.org` -- free account required, most comprehensive, includes HOI and gaze
- **HuggingFace**: search "ego4d" or "EPIC-Kitchens" -- community mirrors, no signup

---

## Phase 2 -- What to Do Next

**Goal:** Annotate one real video end to end in CVAT. Read your own output file.

**Tool:** cvat.ai (hosted, free tier, no setup needed)

**Steps:**
1. Create account at cvat.ai
2. Upload one of Qube's test clips (or any short video 30-60 seconds)
3. Draw bounding boxes on the primary object (tool or item being manipulated)
4. Add keypoints on the hand at key frames
5. Export as JSON
6. Open the export and map each field back to the annotation types from Phase 1

**Success criteria:** Can read the exported JSON without referring back to these notes.

---

## Phase 3 -- QA (after Phase 2)
How to review annotation work: what to reject, what to accept, how to give feedback to annotators.

## Phase 4 -- Physical AI Specific (after Phase 3)
What robotics clients need differently from NLP/CV clients. Task demonstration structure, teleoperation data, sim-to-real considerations.

---

## Phase 2 -- Session Log (2026-09-14)

### What was done
Real CVAT task created (`task_2589883`), one clip annotated by hand: a rotated bounding box (label `Mopper`) and hand keypoints (label `Hand`, 5 points). Exported as Datumaro 1.0 JSON and inspected the raw file directly.

### Bug found in own output (the actual lesson)
Video was 5,401 frames (~3 min, not the planned 30-60s). The bbox was correctly sparse (1 frame only). But the keypoints were NOT what they looked like: two duplicate "Hand" point tracks (track_id 0 and 1) both showed annotations across 5,142/5,401 frames -- looked like dense continuous tracking, but coordinates were byte-identical at frame 259, 2759, and 5400. CVAT's points tool defaults to creating a track that freezes the last keyframe and auto-extends it to the end of the video unless you explicitly mark the track "Outside" after your last real keyframe. Net effect: the export claimed hand-position coverage for ~5,000 frames that was actually just one frame's data copy-pasted forward -- would have silently corrupted a real dataset.
**Not yet fixed**: still need to (1) delete the duplicate track, (2) mark "Outside" after the intended keyframe, (3) re-export and verify.

### Key corrected mental model
Dense/continuous annotation (HOI, keypoint tracking) does NOT mean clicking every single frame. You place keyframes only where motion meaningfully changes; CVAT linearly interpolates between them; you mark "Outside" when tracking should stop. The bug above happened because a second keyframe/Outside marker was never set.

### CVAT label attributes gap (important, unresolved)
Rectangles and points only ever produce raw geometry. Narration, action verb/noun, object state, and HOI contact/grip do NOT come from the shape tools -- they require:
- CVAT **label attributes** (text/select/checkbox fields attached to a label, e.g. `verb`, `noun`, `contact`, `grip`) -- not yet configured on this task's labels (`Mopper`, `Hand` currently have zero attributes).
- Narration and gaze are entirely outside CVAT (separate transcription pipeline / hardware or CV model pipeline respectively).
The combined per-video JSON from Phase 1 is assembled post-hoc from multiple separate tool outputs, never produced by CVAT alone.

### Staffing model worked out (Tier 2, 1000 hrs/month raw video)
Capacity formula: `headcount = (source_hours x tier_multiplier) / (productive_hrs_per_day x working_days_per_month)`.
Assumptions used: 6 productive hrs/day, 22 working days/month = 132 hrs/month per annotator.
Tier 2 (action segments + object state, sparse) multiplier 2.5-4x (beginner-inclusive) -> 19-31 people, planning midpoint recommended **~23-25 people at 6 hrs/day**.
Expect multiplier to drop toward 1.5-2x (experienced) after a few months -> steady-state headcount could fall to ~12-19.
Hours/day is a weak lever (7-8 hrs/day only saves 1-2 headcount vs 6 hrs/day) and risks quality/fatigue errors like the tracking bug above -- better to hire than stretch shifts.
QA headcount is separate/additional, not included in the above (Phase 3 territory).

### New annotation types surfaced (from a "dexset"-branded reference screenshot, ties to the mop clip's watermark)
Beyond Phase 1's 5 Ego4D types + bbox/keypoints, found: **segmentation masks** (pixel-level, more precise/expensive than bbox), **object labels** (plain classification tag, parent of bbox/mask), **failure event labels** (dropped grip/missed grasp/slip -- NOT covered in Phase 1, needed for robot policy robustness), **environment metadata** (lighting/camera/room -- video-level header field, not per-frame), **task state labels** (whole-attempt status: in_progress/complete/failed -- coarser than Phase 1's per-object state change), **temporal sequence labels** (likely same as Phase 1's Tier 3-4 "phase decomposition": reach->grasp->manipulate->release). Flagged to fold into Phase 4.

### Definitional note: Robotics vs Physical AI
Robotics = the engineering discipline (hardware, control theory, motion planning); doesn't require AI or training data (e.g. classical hand-coded industrial arm control). Physical AI = the specific approach of training AI models on data (video, demonstrations, HOI, keypoints) to produce a learned policy for physical action. Qube's annotation pipeline only makes sense for Physical AI clients (learned/data-driven robot policies) -- a classical robotics client wouldn't need any annotated data at all. This is why Phase 4 is scoped as "Physical AI specific."

### Next session should start with
Either (a) fix the CVAT tracking bug + re-export to close out Phase 2 properly, or (b) benchmark a clean 60-second clip end-to-end (with correct keyframing + label attributes configured) to get Qube's own measured time multiplier instead of relying on generic industry figures.
