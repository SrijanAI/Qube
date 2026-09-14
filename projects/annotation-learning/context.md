# Annotation Learning -- Context

Stable reference material for this learning track. For current status and session-by-session log, see [progress.md](progress.md). For standing frameworks/decisions (staffing model, tool gotchas, definitions), see [decisions.md](decisions.md).

## Phase Structure

| Phase | Topic |
|---|---|
| 1 | Conceptual -- what clients want annotated, annotation types, data formats |
| 2 | Hands-on CVAT -- annotate a real video end to end |
| 3 | QA -- how to review and reject annotation work |
| 4 | Physical AI specific -- what robotics clients need differently |

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

## Phase 2 -- Hands-on CVAT

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

See [decisions.md](decisions.md) for the CVAT keyframe/interpolation model and label-attributes gap discovered while doing this.

---

## Phase 3 -- QA (after Phase 2)
How to review annotation work: what to reject, what to accept, how to give feedback to annotators.

## Phase 4 -- Physical AI Specific (after Phase 3)
What robotics clients need differently from NLP/CV clients. Task demonstration structure, teleoperation data, sim-to-real considerations. See [decisions.md](decisions.md) for additional annotation types (segmentation masks, failure events, environment metadata, task state) and the robotics-vs-physical-AI distinction already surfaced for this phase.
