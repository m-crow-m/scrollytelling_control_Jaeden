# What am I doing?

What am I doing? is an interactive scrollytelling webpage built around a beginner JavaScript tutorial that slowly degrades into noise, repetition, and self-doubt. The piece begins as a clean lesson interface, then breaks apart into chaotic text, a collapsing visual sequence, a full-screen video interruption, and a return to the tutorial loop. The overall goal is to use the language of instruction and interface design to show confusion, pressure, and the feeling of losing orientation inside a system that is supposed to explain itself.

The main experience lives in [`lost-in-the-scroll/index.html`](lost-in-the-scroll/index.html). The structure and staged story sections are defined there, including the tutorial surface, Chapter 02 text, visual scenes, video section, and final return screen. The motion logic is handled in [`lost-in-the-scroll/scripts/main.js`](lost-in-the-scroll/scripts/main.js), where GSAP timelines, ScrollTrigger pinning, text scrambling, section handoffs, and transition behavior are all coordinated. Styling is handled in [`lost-in-the-scroll/styles/styles.css`](lost-in-the-scroll/styles/styles.css), while shared tokens live in [`lost-in-the-scroll/styles/tokens.css`](lost-in-the-scroll/styles/tokens.css).

One of the key design choices was to keep the tutorial recognizable even while it breaks down. Instead of abandoning the original interface language, the project keeps returning to it in altered forms: the tutorial becomes unstable, text starts to contradict itself, the page shifts into white-space sections and a floating video, and the final tutorial screen loops the user back to the beginning. That repetition was intentional because the project is about being stuck inside a system that keeps presenting itself as guidance, even when it no longer feels trustworthy.

Live URL: https://m-crow-m.github.io/scrollytelling_control_Jaeden/

Repository URL: https://github.com/m-crow-m/scrollytelling_control_Jaeden

## Tech Stack

- HTML
- CSS
- JavaScript
- GSAP

## Implementation Notes

- Tokens are defined in [`lost-in-the-scroll/styles/tokens.css`](lost-in-the-scroll/styles/tokens.css) and feed the visual system through shared CSS custom properties.
- Motion is driven with GSAP timelines, tweens, and scroll-linked state updates to preserve the current visual experience.
- Reduced-motion handling is included so the page remains readable when animation-heavy effects are bypassed.
- The root [`index.html`](index.html) redirects to the project entry in [`lost-in-the-scroll/index.html`](lost-in-the-scroll/index.html).

## Reflection

### Metaphor Summary

The project treats a beginner JavaScript lesson like a transmission that starts clean and instructional, then slowly degrades into noise. That breakdown stands in for information overload and the feeling of losing confidence inside a technical system that no longer feels stable.

### One Section I'm Most Proud Of

The strongest section is the late-stage collapse into Chapter 02. It feels like the clearest payoff because the interface stops behaving like a calm tutorial and instead turns into a fractured environment, which makes the metaphor visible rather than just explained in text.

### One Technical Bug I Solved

One bug I solved was noisy runtime output caused by the way viewport scale updates were being handled in GSAP. I replaced that warning-prone path with a direct setter so the page keeps the same visual result without flooding the console during scroll.

### One Accessibility Decision I Made

I included reduced-motion handling so the content remains readable even when motion-heavy effects are disabled. That mattered because the page uses blur, jitter, and transitions as part of the concept, and those effects can quickly become overwhelming if they are not bypassed for users who prefer less motion.

### What I Would Improve With More Time

With more time, I would expand the story into more sections so the signal-loss idea could build in clearer chapters from introduction through collapse. I would also add more polished content transitions that preserve the same visual identity while making the narrative progression feel more deliberate.
