# Login Button Design QA

- Source visual truth: `/var/folders/rf/h9km1sc509j8q3yxx6f5b1xm0000gn/T/codex-clipboard-1f5f8555-fa86-4bb4-b949-d79a8b497112.png`
- Implementation screenshot: `/tmp/surgimap-home-implementation.png`
- Focused comparison: `/tmp/surgimap-login-button-comparison.png`
- Viewport: 1440 × 900 CSS px, desktop landing page, default state
- Source dimensions: 180 × 94 px at 2× density; normalized to 90 × 47 px
- Implementation crop: 90 × 47 px at 1× density

## Evidence

- Full view: the landing-page navigation renders the Login control between Contact and Search without overlap or wrapping.
- Focused comparison: the reference and implementation use the same compact outlined treatment, uppercase copy, gray-blue text, pale background, and rounded rectangular silhouette.
- Typography: Inter, 12 px, weight 700, uppercase, 0.6 px letter spacing.
- Spacing and layout: 16 px horizontal and 8 px vertical padding; rendered control is approximately 76 × 34 CSS px.
- Colors and tokens: `silverMist` border, `steelBlue` text, transparent/`iceWhite` surface.
- Image quality: no raster asset is required for this code-native navigation control.
- Copy: `LOGIN` matches the reference.
- Interaction: the control navigates to `/login`; no browser console errors were observed.

## Findings

- No actionable P0, P1, or P2 differences.

## Comparison History

- Initial pass: passed. The implementation directly reuses the Help-page Login control styling, so no visual correction iteration was required.

## Follow-up Polish

- None required for the requested control.

final result: passed
