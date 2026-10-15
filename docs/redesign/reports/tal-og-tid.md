# Tal og tid - design note

- Theme: `shared/themes/tal-og-tid.css` (linked after sd-extras.css). Identity: stopur-amber `#FFB11F` on brass field `#F0C36A` (light) / charcoal `#14171F` with amber lines (dark). LCD readouts (counter, tag, digital time, result numbers, number badges) = amber on `#14171F` / `#0A0C11`. Card top = dial ruler with tick marks. Clock face cream, ink hands, orange pivot.
- Sprite: `stopur` (brand + title). Brand hidden at <=480 px to avoid a duplicate icon.
- Motion: only a stepped shake on the wrongly chosen option (off under reduced motion); the inline scale pulse on the question is disabled.
- Checked (360/390/820/1440, light+dark): no horizontal scroll, no tap target <44 px, no contrast failures, no console issues. Reduced motion checked at 360 light.
- Not checked: real screen reader, 390 visual review beyond metrics.
