# Annotation Learning -- Progress

## Status
- Phase 1: COMPLETE
- Phase 2: IN PROGRESS -- did one hands-on CVAT pass, found a real bug, not yet fixed/re-exported
- Phase 3: Not started
- Phase 4: Not started (preview material already surfaced -- see decisions.md)

**Next session should start with:** either (a) fix the CVAT tracking bug + re-export to close out Phase 2 properly, or (b) benchmark a clean 60-second clip end-to-end (with correct keyframing + label attributes configured) to get Qube's own measured time multiplier instead of relying on generic industry figures.

---

## Session Log

### 2026-09-14 -- Phase 2 first hands-on pass

Real CVAT task created (`task_2589883`), one clip annotated by hand: a rotated bounding box (label `Mopper`) and hand keypoints (label `Hand`, 5 points). Exported as Datumaro 1.0 JSON and inspected the raw file directly.

**Bug found in own output (the actual lesson of the session):** video was 5,401 frames (~3 min, not the planned 30-60s). The bbox was correctly sparse (1 frame only). But the keypoints were NOT what they looked like: two duplicate "Hand" point tracks (track_id 0 and 1) both showed annotations across 5,142/5,401 frames -- looked like dense continuous tracking, but coordinates were byte-identical at frame 259, 2759, and 5400. CVAT's points tool defaults to creating a track that freezes the last keyframe and auto-extends it to the end of the video unless you explicitly mark the track "Outside" after your last real keyframe. Net effect: the export claimed hand-position coverage for ~5,000 frames that was actually just one frame's data copy-pasted forward -- would have silently corrupted a real dataset.

**Not yet fixed:** still need to (1) delete the duplicate track, (2) mark "Outside" after the intended keyframe, (3) re-export and verify.

Also worked out a staffing model for 1000 hrs/month raw video at Tier 2, and reviewed a "dexset"-branded reference screenshot surfacing annotation types beyond Phase 1's list. See [decisions.md](decisions.md) for both -- they're standing reference facts, not one-time session notes.
