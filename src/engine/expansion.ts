export function expandToPrompt(comment: string, pri: string, zone: string): string {
  const cm = (comment || '').trim();

  if (!cm) {
    if (pri === 'bug') return `There appears to be a visual bug in the ${zone}. Inspect the annotated region in the screenshot, identify the defect, and fix it. Check alignment, overflow, color, and z-index.`;
    if (pri === 'improve') return `The ${zone} could be enhanced. Review the annotated area for visual/UX improvements — consider spacing, typography, contrast, and interaction feedback.`;
    if (pri === 'question') return `I have a question about this element in the ${zone}. Explain what's happening here, whether it's intentional, and recommend next steps.`;
    return `Note this area in the ${zone} for reference while working on other items.`;
  }

  if (pri === 'bug') {
    if (/align|position|offset|shift|move|center|left|right/i.test(cm))
      return `${cm}. Fix the alignment/positioning in the ${zone}. Check \`display\`, \`align-items\`, \`justify-content\`, \`margin\`, \`position\`, and \`transform\`. Verify the element is correctly placed at all breakpoints (375px, 768px, 1024px, 1440px).`;
    if (/color|colour|contrast|dark|light|bright|faded|white|black/i.test(cm))
      return `${cm}. Fix the color/contrast issue in the ${zone}. Ensure text meets WCAG 2.1 AA minimum contrast (4.5:1 for normal text, 3:1 for large text). Check both light and dark mode. Use design system color tokens, not hardcoded hex values.`;
    if (/size|font|text|small|large|big|tiny|heading|title/i.test(cm))
      return `${cm}. Fix the text sizing in the ${zone}. Check \`font-size\`, \`font-weight\`, \`line-height\` (should be 1.5-1.75 for body), and \`letter-spacing\`. Body text minimum 16px. Verify the type scale is consistent.`;
    if (/spacing|gap|padding|margin|tight|cramped|room|breath/i.test(cm))
      return `${cm}. Fix the spacing in the ${zone}. Check \`padding\`, \`margin\`, \`gap\`, and \`row-gap\`. Use an 8px grid system. Ensure consistent spacing rhythm and adequate breathing room between elements.`;
    if (/miss|hidden|gone|disappear|invisible|empty|blank|absent|not show/i.test(cm))
      return `${cm}. An expected element in the ${zone} is missing or invisible. Check \`display\`, \`visibility\`, \`opacity\`, \`overflow: hidden\`, conditional rendering logic, and z-index stacking. Verify it renders at all viewport sizes.`;
    if (/overflow|clip|cut|truncat|crop|wrap|scroll/i.test(cm))
      return `${cm}. Content in the ${zone} is being clipped or overflowing. Check \`overflow\`, \`text-overflow\`, \`white-space\`, \`max-width\`, \`max-height\`, and flex/grid sizing. Ensure no horizontal scroll on mobile (375px).`;
    if (/broken|error|crash|fail|wrong|not work/i.test(cm))
      return `${cm}. Something in the ${zone} is broken. Investigate the root cause — check the browser console for errors, verify DOM structure, event handlers, and CSS specificity conflicts. Fix the underlying issue, not just the symptom.`;
    if (/responsive|mobile|tablet|resize|breakpoint|screen|media/i.test(cm))
      return `${cm}. Responsive layout issue in the ${zone}. Test at 375px (mobile), 768px (tablet), 1024px (desktop), and 1440px (wide). Check media queries, flex-wrap, grid auto-fit, and container queries. No horizontal overflow on any viewport.`;
    if (/z-index|overlap|behind|front|stack|layer|cover/i.test(cm))
      return `${cm}. Stacking/layering issue in the ${zone}. Check \`z-index\`, \`position\`, stacking context creation (\`transform\`, \`opacity\`, \`will-change\`), and DOM order. Ensure interactive elements remain clickable and not obscured.`;
    if (/border|shadow|outline|ring|divider|separator/i.test(cm))
      return `${cm}. Border/shadow issue in the ${zone}. Check \`border\`, \`box-shadow\`, \`outline\`, and \`border-radius\`. Ensure consistent styling with design tokens and visibility in both light and dark modes.`;
    if (/image|img|icon|svg|logo|photo|picture/i.test(cm))
      return `${cm}. Image/icon issue in the ${zone}. Check \`object-fit\`, \`aspect-ratio\`, \`width\`/\`height\` attributes, SVG viewBox, and \`loading\` attribute. Ensure proper alt text for accessibility and correct rendering at all sizes.`;
    return `${cm}. Bug in the ${zone}. Inspect the annotated region in the screenshot and fix the issue. Check layout, styles, and DOM structure. Verify the fix doesn't break anything at other breakpoints.`;
  }

  if (pri === 'improve') {
    if (/hover|click|interact|animation|transition|smooth|motion/i.test(cm))
      return `${cm}. Enhance interactions in the ${zone}. Add micro-interactions (150-300ms, ease-out). Animate only \`transform\` and \`opacity\`. Provide visible tap feedback within 100ms. Respect \`prefers-reduced-motion\`. Exit animations should be 60-70% of enter duration.`;
    if (/spacing|padding|margin|breath|room|tight|cramped|dense/i.test(cm))
      return `${cm}. Improve spacing in the ${zone}. Use 8px grid increments. Add breathing room between elements. Check \`gap\`, \`padding\`, \`margin\`. Ensure visual rhythm is consistent with the rest of the page.`;
    if (/style|design|look|aesthetic|modern|clean|polish|pretty|visual/i.test(cm))
      return `${cm}. Refine the visual design of the ${zone}. Improve hierarchy, consistency, and polish. Use semantic color tokens. Ensure consistent border-radius, shadow scale, and icon family throughout.`;
    if (/ux|usability|confus|unclear|intuiti|flow|experience|user/i.test(cm))
      return `${cm}. Improve UX in the ${zone}. Make the interaction more intuitive. Ensure clear affordances, predictable behavior, and helpful feedback states (loading, success, error). Touch targets minimum 44x44px with 8px+ gaps.`;
    if (/accessib|a11y|contrast|aria|screen.?reader|focus|keyboard|wcag/i.test(cm))
      return `${cm}. Improve accessibility in the ${zone}. Ensure 4.5:1 contrast ratio for normal text, 3:1 for large text (WCAG 2.1 AA). Add visible focus rings, keyboard navigation, \`aria-labels\` on icon-only buttons. Never convey information by color alone.`;
    if (/typography|font|typeface|readab|legib|line.?height|letter/i.test(cm))
      return `${cm}. Improve typography in the ${zone}. Check font-size (min 16px body), line-height (1.5-1.75), and max line length (65-75 characters). Ensure heading hierarchy is clear and weights are consistent (600-700 headings, 400 body, 500 labels).`;
    if (/color|palette|theme|brand|tone|warmth|mood/i.test(cm))
      return `${cm}. Refine the color usage in the ${zone}. Use semantic color tokens from the design system. Check contrast in both light and dark modes. Ensure the palette conveys the intended mood and brand identity.`;
    return `${cm}. Enhancement for the ${zone}. Implement this improvement as shown in the screenshot annotation. Follow accessibility and responsive best practices.`;
  }

  if (pri === 'question') {
    if (/why|reason|purpose|intentional/i.test(cm))
      return `${cm}. Explain the design rationale for this element in the ${zone}. Is the current behavior intentional? If it's a bug, explain the root cause. If intentional, explain the reasoning and whether it follows best practices.`;
    if (/how|implement|approach|method|technique/i.test(cm))
      return `${cm}. Explain the best implementation approach for this in the ${zone}. Consider CSS techniques, performance implications, browser support, and accessibility requirements. Recommend the most maintainable solution.`;
    if (/should|better|best|recommend|suggest|option|alternative/i.test(cm))
      return `${cm}. Evaluate the options for this element in the ${zone}. Compare approaches considering accessibility, performance, maintainability, and visual consistency. Recommend the best path forward with reasoning.`;
    return `${cm}. Question about the ${zone}. Please examine the annotated region in the screenshot, explain what's happening, and recommend the best approach.`;
  }

  return `${cm}. (Reference note for the ${zone} — keep in mind while addressing other items.)`;
}
