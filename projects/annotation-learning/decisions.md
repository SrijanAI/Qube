# Annotation Learning -- Decisions & Standing Reference

Frameworks, definitions, and tool gotchas worth reusing across sessions -- not tied to one day's session log. See [progress.md](progress.md) for chronological status.

## CVAT keyframe/interpolation model (corrected mental model)

Dense/continuous annotation (HOI, keypoint tracking) does NOT mean clicking every single frame. You place keyframes only where motion meaningfully changes; CVAT linearly interpolates between them; you mark **"Outside"** when tracking should stop.

Discovered via a real bug (2026-09-14, see progress.md): if you place one keyframe and never set a second keyframe or "Outside," CVAT freezes that position and auto-extends it to the end of the video -- looks like dense tracking in the export, but is actually one frame's data copy-pasted forward. Always verify by checking whether coordinates actually change across the claimed frame range, not just whether frames have annotation entries.

## CVAT label attributes gap

Rectangles and points only ever produce raw geometry (pixel coordinates). Narration, action verb/noun, object state, and HOI contact/grip do NOT come from the shape tools -- they require:
- CVAT **label attributes** (text/select/checkbox fields attached to a label, e.g. `verb`, `noun`, `contact`, `grip`) configured on the label *before* annotating. Default labels have zero attributes.
- Narration and gaze are entirely outside CVAT (separate transcription pipeline / hardware or CV model pipeline respectively).

The combined per-video JSON described in context.md (Phase 1) is assembled post-hoc from multiple separate tool outputs -- never produced by CVAT alone.

## Staffing model: source hours -> headcount

Formula: `headcount = (source_hours x tier_multiplier) / (productive_hrs_per_day x working_days_per_month)`

Assumptions: 6 productive hrs/day (not 8 -- breaks/QA/overhead eat the rest), 22 working days/month => 132 hrs/month per annotator.

Tier multipliers (beginner-inclusive, i.e. team still on the learning curve):
| Tier | Multiplier |
|---|---|
| 1 -- raw narrated + QA | ~0.25x |
| 2 -- action segments + object state (sparse) | 2.5-4x |
| 3 -- + HOI, dense bbox/keypoints | 10-18x |
| 4 -- + phase decomposition/teleop | Tier 3 + ~25% |

**Worked example (Tier 2, 1000 hrs/month raw video):** 19-31 people; planning midpoint recommended **~23-25 people at 6 hrs/day**. Expect the multiplier to drop toward 1.5-2x (experienced) after a few months -> steady-state headcount could fall to ~12-19. Hours/day is a weak lever (7-8 hrs/day only saves 1-2 headcount vs 6 hrs/day) and risks quality/fatigue errors (like the tracking bug above) -- better to hire than stretch shifts. QA headcount is separate/additional, not included in this model.

## Annotation types beyond Phase 1's list

Surfaced from a "dexset"-branded reference screenshot (ties to the mop test clip's watermark), 2026-09-14:
- **Segmentation masks** -- pixel-level object outline, more precise/expensive than bounding boxes.
- **Object labels** -- plain classification tag, the parent category bbox/masks both point back to.
- **Failure event labels** -- dropped grip / missed grasp / slip. NOT covered in Phase 1's Ego4D-based framework; needed for robot policy robustness (models need failure examples, not just clean demos).
- **Environment metadata** -- lighting/camera/room layout. A video-level header field, not per-frame.
- **Task state labels** -- whole-attempt status (in_progress/complete/failed). Coarser than Phase 1's per-object state change.
- **Temporal sequence labels** -- likely the same as Phase 1's Tier 3-4 "phase decomposition" (reach->grasp->manipulate->release), different name.

Flagged to fold into Phase 4 content.

## Definitional note: Robotics vs Physical AI

**Robotics** = the engineering discipline (hardware, control theory, motion planning). Doesn't require AI or training data -- e.g. classical hand-coded industrial arm control needs zero annotated data.

**Physical AI** = the specific approach of training AI models on data (video, demonstrations, HOI, keypoints) to produce a learned policy for physical action.

Qube's annotation pipeline only makes sense for Physical AI clients (learned/data-driven robot policies) -- a classical robotics client wouldn't need any annotated data at all. This is why Phase 4 is scoped as "Physical AI specific," not "robotics specific."
