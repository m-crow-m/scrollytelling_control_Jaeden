# What am I doing?

An interactive scrollytelling webpage that uses a corrupted JavaScript tutorial as a metaphor for signal loss, breakdown, and forced clarity. The page starts as an instructional console lesson and gradually destabilizes into a controlled systems failure.

Live URL: https://m-crow-m.github.io/scrollytelling_control_Jaeden/

Repository URL: https://github.com/m-crow-m/scrollytelling_control_Jaeden

Reflection URL: https://m-crow-m.github.io/scrollytelling_control_Jaeden/reflection.html

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
