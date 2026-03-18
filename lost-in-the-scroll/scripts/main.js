document.addEventListener("DOMContentLoaded", () => {
    const originalConsoleWarn = console.warn.bind(console);
    console.warn = (...args) => {
        if (args.length === 1 && String(args[0]).includes("scale not eligible for reset")) {
            return;
        }

        originalConsoleWarn(...args);
    };

    if (!window.gsap || !window.ScrollTrigger) {
        console.error("GSAP or ScrollTrigger failed to load.");
        return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    document.body.classList.add("gsap-ready");

    const themeStorageKey = "blueprint-theme-choice";
    const prefersReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: light)");

    const viewport = document.getElementById("viewport-content");
    const backgroundLayer = document.getElementById("background-layer");
    const tutorialTextContainer = document.getElementById("tutorial-text-container");
    const tutorialLayout = document.querySelector(".tutorial-layout");
    const tutorialColumn = document.querySelector(".tutorial-column");
    const consoleColumn = document.querySelector(".console-column");
    const consoleWindow = document.getElementById("main-console");
    const consoleOutput = document.getElementById("console-output");
    const consoleTyping = document.getElementById("console-typing");
    const controlPanel = document.getElementById("control-panel");
    const header = document.querySelector(".fixed-header");
    const rfMeterShell = document.querySelector(".rf-meter-shell");
    const rfBarsGroup = document.querySelector("#rfMeter .rf-bars");
    const rfPeak = document.querySelector("#rfMeter .rf-peak");
    const readoutNoise = document.querySelector("#readout-noise .value");
    const readoutFreq = document.querySelector("#readout-frequency .value");
    const readoutFocus = document.querySelector("#readout-focus .value");
    const gridOverlay = document.getElementById("grid-overlay");
    const noiseCanvas = document.getElementById("noise-overlay");
    const noiseContext = noiseCanvas.getContext("2d", { alpha: true });
    const knob = document.querySelector("#knob");
    const depthUp = document.getElementById("depth-up");
    const depthDown = document.getElementById("depth-down");
    const statusBezel = document.querySelector(".status-bezel");
    const statusScreen = document.querySelector(".status-screen");
    const statusMarquee = document.getElementById("status-marquee");
    const chapterTwo = document.getElementById("chapter-two");
    const chapterTwoVeil = chapterTwo.querySelector(".chapter-two__veil");
    const chapterTwoFreeze = chapterTwo.querySelector(".chapter-two__freeze");
    const chapterTwoFreezeBase = document.getElementById("chapter-two-freeze-base");
    const chapterTwoFragments = document.getElementById("chapter-two-fragments");
    const chapterTwoLabel = chapterTwo.querySelector(".chapter-two__label");
    const chapterTwoLine = chapterTwo.querySelector(".chapter-two__line");
    const chapterTwoIncomingLine = chapterTwo.querySelector(".chapter-two__line--incoming");
    const showpieceSection = document.getElementById("showpiece-section");
    const leadSection = document.getElementById("lead-section");
    const themeButtons = Array.from(document.querySelectorAll(".theme-button"));
    const relayVisualSections = Array.from(document.querySelectorAll(".story-section--visual"));
    const relayTextSections = Array.from(document.querySelectorAll(".story-section--text"));
    const sectionThreeVisual = document.getElementById("relay-visual-a");
    const sectionFourEntry = document.getElementById("relay-text-a");
    const sectionFourShell = sectionFourEntry?.querySelector(".section-shell");
    const sectionFourStage = sectionFourEntry?.querySelector(".section-four-stage");
    const sectionFourMatrix = document.getElementById("section-four-matrix");
    const sectionFourFocus = document.getElementById("section-four-focus");
    const sectionFiveVisual = document.getElementById("relay-visual-b");
    const sectionFiveStage = sectionFiveVisual?.querySelector(".section-five-stage");
    const sectionFiveTurnText = document.getElementById("section-five-turn-text");
    const sectionFiveVideoShell = document.getElementById("section-five-video-shell");
    const sectionFiveVideo = document.getElementById("section-five-video");
    const sectionSixVisual = document.getElementById("relay-text-b");
    const sectionSixStage = sectionSixVisual?.querySelector(".section-six-stage");
    const sectionSixVideoProxyShell = document.getElementById("section-six-video-proxy-shell");
    const sectionSixVideoProxy = document.getElementById("section-six-video-proxy");
    const sectionSixTutorialShell = document.getElementById("section-six-tutorial-shell");
    const revealSections = [...relayVisualSections, ...relayTextSections].filter(
        (section) =>
            section !== sectionThreeVisual &&
            section !== sectionFourEntry &&
            section !== sectionFiveVisual &&
            section !== sectionSixVisual
    );
    const sectionThreeStage = document.querySelector(".section-three-stage");
    const sectionThreeHeadPath = document.getElementById("section-three-head-path");
    const sectionThreeHead = document.querySelector(".section-three-head");
    const sectionThreeScreen = document.querySelector(".section-three-screen");
    const sectionThreeGlow = document.querySelector(".section-three-screen-glow");
    const sectionThreeScreenShell = document.querySelector(".section-three-screen-shell");
    const sectionThreeDesk = document.querySelector(".section-three-desk");
    const sectionThreeDeskShadow = document.querySelector(".section-three-desk-shadow");
    const sectionThreeLogo = document.querySelector(".section-three-logo");
    const sectionThreeFlash = document.querySelector(".section-three-flash");
    const toggleFocus = document.getElementById("toggle-focus");
    const toggleJitter = document.getElementById("toggle-jitter");
    const toggleMode = document.getElementById("toggle-grid");
    const toggleNoise = document.getElementById("toggle-noise");
    const introRevealElements = document.querySelectorAll(
        "#main-title, #sub-title, .tutorial-section, .tutorial-step, .tutorial-troubleshoot"
    );

    const tutorialCode = 'console.log("Hello, world!");';
    const chapterTwoStart = 0.78;
    const chapterTwoRevealStart = 0.86;
    const chapterTwoLines = [
        "The signal does not comfort.",
        "It only admits that the noise had laws.",
        "What breaks us is not everything.",
        "What remains is smaller, colder, ours.",
        "Clarity is a winter light.",
        "It does not save the room. It lets us see it."
    ];
    const chapterTwoLineStops = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
    const sectionFourGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\\\[]{}()*&^%$#@!?+=-_~|:;.,";
    const sectionFourMessageOne = "What am I doing? ";
    const sectionFourMessageTwo = "Who am I? ";
    const sectionFourMessageThree = "Is reality something we discover or something we assemble? ";
    const sectionFourMessageFour = "I wish I was you. ";
    const phases = [
        { name: "arrival", threshold: 0, label: "nothing" },
        { name: "instability", threshold: 0.2, label: "a lesson" },
        { name: "breakdown", threshold: 0.45, label: "the interference" },
        { name: "collapse", threshold: 0.7, label: "the collapse" },
        { name: "aftermath", threshold: 0.88, label: "the end" }
    ];
    const focusPlanes = [
        { tutorial: 1.15, console: 1.15, meter: 0, header: 0.25, panel: 0.4, tutorialZ: 2, consoleZ: 2, meterZ: 9 },
        { tutorial: 0.82, console: 1.05, meter: 0.08, header: 0.45, panel: 0.55, tutorialZ: 3, consoleZ: 2, meterZ: 8 },
        { tutorial: 0.35, console: 0.72, meter: 0.28, header: 0.65, panel: 0.75, tutorialZ: 4, consoleZ: 3, meterZ: 7 },
        { tutorial: 0, console: 0.38, meter: 0.58, header: 0.92, panel: 1, tutorialZ: 8, consoleZ: 4, meterZ: 6 },
        { tutorial: 0.38, console: 0, meter: 0.82, header: 1.05, panel: 1.08, tutorialZ: 5, consoleZ: 8, meterZ: 5 },
        { tutorial: 0.9, console: 0.35, meter: 1.05, header: 0.75, panel: 0.85, tutorialZ: 3, consoleZ: 6, meterZ: 4 },
        { tutorial: 1.15, console: 1.1, meter: 1.15, header: 0.45, panel: 0.55, tutorialZ: 2, consoleZ: 2, meterZ: 3 }
    ];
    const chars = "ABCDEFGHIJKLMN0123456789!@#$%^&*()_+{}[]|;:,.<>?";

    let prefersReducedMotion = prefersReducedMotionQuery.matches;
    let scrollProgress = 0;
    let lastRenderedProgress = 0;
    let currentPhase = null;
    let lastLoggedIndex = -1;
    let chapterTwoActive = false;
    let chapterTwoTransitionComplete = false;
    let chapterTwoLineIndex = -1;
    let chapterTwoMorphTween = null;
    let lastScrambleAt = 0;
    let knobRotation = 0;
    let focusPlaneIndex = 2;
    let noiseFrame = 0;
    let noiseWidth = 0;
    let noiseHeight = 0;
    let noiseImage = null;
    let currentMode = "dark";
    let themeChoice = loadThemeChoice();
    let modeGlitchActive = false;
    let smoother = null;
    let showpieceTrigger = null;
    let sectionFourProgress = 0;
    let sectionFourTick = 0;
    let sectionFourActive = false;
    let sectionFourLayout = { columns: 0, rows: 0, total: 0 };

    const chapterTwoFragmentSeeds = [];
    const originalTexts = new Map();
    const textDriftSeeds = new Map();
    const textElements = tutorialTextContainer.querySelectorAll("h2, h3, h4, p, div.code-snippet, li");

    let setNoiseOpacity = () => { };
    let setGridOpacity = () => { };
    let setHeaderOpacity = () => { };
    let setJitterX = () => { };
    let setJitterY = () => { };
    let setTutorialFilter = () => { };
    let setConsoleFilter = () => { };
    let setMeterFilter = () => { };
    let setHeaderFilter = () => { };
    let setPanelFilter = () => { };
    let setPanelY = () => { };
    let setPanelOpacity = () => { };

    textElements.forEach((element) => {
        originalTexts.set(element, element.textContent);
        textDriftSeeds.set(element, {
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            speed: 0.55 + Math.random() * 1.2,
            range: 0.6 + Math.random() * 1.1
        });
    });

    function loadThemeChoice() {
        const stored = window.localStorage.getItem(themeStorageKey);
        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored;
        }

        return "dark";
    }

    function setModeClass(mode) {
        document.body.classList.remove("mode-light", "mode-dark");
        document.body.classList.add(`mode-${mode}`);
        currentMode = mode;
    }

    function getResolvedTheme(choice) {
        if (choice === "system") {
            return systemThemeQuery.matches ? "light" : "dark";
        }

        return choice;
    }

    function updateThemeButtons() {
        themeButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.themeValue === themeChoice);
        });
    }

    function applyThemeChoice(choice, { persist = false } = {}) {
        themeChoice = choice;
        if (persist) {
            window.localStorage.setItem(themeStorageKey, choice);
        }
        updateThemeButtons();
        setModeClass(getResolvedTheme(choice));
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function mapRange(value, start, end) {
        if (end === start) return 0;
        return clamp((value - start) / (end - start), 0, 1);
    }

    function scramble(text, intensity) {
        if (intensity <= 0) return text;
        return text
            .split("")
            .map((char) => {
                if (char === " " || char === "\n" || Math.random() > intensity) return char;
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
    }

    function getPhase(progress) {
        return phases.reduce((active, phase) => {
            return progress >= phase.threshold ? phase : active;
        }, phases[0]);
    }

    function buildRfMeter() {
        const barCount = 28;
        const startX = 26;
        const gap = 17;
        const barWidth = 10;
        const baseY = 82;

        rfBarsGroup.innerHTML = "";

        for (let index = 0; index < barCount; index += 1) {
            const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bar.setAttribute("x", String(startX + index * gap));
            bar.setAttribute("y", String(baseY));
            bar.setAttribute("width", String(barWidth));
            bar.setAttribute("height", "0");
            bar.setAttribute("rx", "3");
            bar.dataset.index = String(index);
            rfBarsGroup.appendChild(bar);
        }
    }

    function buildSectionFourLayout() {
        if (!sectionFourStage || !sectionFourMatrix) return;

        const stageRect = sectionFourStage.getBoundingClientRect();
        const matrixStyle = window.getComputedStyle(sectionFourMatrix);
        const fontSize = parseFloat(matrixStyle.fontSize) || 16;
        const lineHeight = parseFloat(matrixStyle.lineHeight) || fontSize;
        const horizontalPadding = (parseFloat(matrixStyle.paddingLeft) || 0) + (parseFloat(matrixStyle.paddingRight) || 0);
        const verticalPadding = (parseFloat(matrixStyle.paddingTop) || 0) + (parseFloat(matrixStyle.paddingBottom) || 0);
        const availableWidth = Math.max(0, stageRect.width - horizontalPadding);
        const availableHeight = Math.max(0, stageRect.height - verticalPadding);
        const characterWidth = fontSize * 0.44;
        const columns = Math.max(24, Math.floor(availableWidth / characterWidth));
        const rows = Math.max(16, Math.floor(availableHeight / lineHeight));

        sectionFourLayout = {
            columns,
            rows,
            total: columns * rows,
            characterWidth,
            lineHeight,
            paddingLeft: parseFloat(matrixStyle.paddingLeft) || 0,
            paddingTop: parseFloat(matrixStyle.paddingTop) || 0,
            fontSize
        };
    }

    function renderSectionFourField() {
        if (!sectionFourMatrix || sectionFourLayout.total === 0) return;

        const { columns, rows, total, characterWidth, lineHeight, paddingLeft, paddingTop, fontSize } = sectionFourLayout;
        const focusSentence = "I wish I was you.";
        const focusRow = Math.floor(rows / 2);
        const centeredFocusStartColumn = Math.max(0, Math.floor((columns - focusSentence.length) / 2));
        const focusOffsetColumns = Math.max(6, Math.floor(columns * 0.1));
        const initialFocusStartColumn = Math.min(
            Math.max(0, columns - focusSentence.length),
            centeredFocusStartColumn + focusOffsetColumns
        );
        const fillPhase = clamp(sectionFourProgress / 0.10, 0, 1);
        const firstResolvePhase = clamp((sectionFourProgress - 0.10) / 0.08, 0, 1);
        const firstHoldPhase = clamp((sectionFourProgress - 0.18) / 0.08, 0, 1);
        const firstDestabilizePhase = clamp((sectionFourProgress - 0.26) / 0.08, 0, 1);
        const secondResolvePhase = clamp((sectionFourProgress - 0.34) / 0.08, 0, 1);
        const secondHoldPhase = clamp((sectionFourProgress - 0.42) / 0.08, 0, 1);
        const secondDestabilizePhase = clamp((sectionFourProgress - 0.50) / 0.08, 0, 1);
        const thirdResolvePhase = clamp((sectionFourProgress - 0.58) / 0.08, 0, 1);
        const thirdHoldPhase = clamp((sectionFourProgress - 0.66) / 0.08, 0, 1);
        const thirdDestabilizePhase = clamp((sectionFourProgress - 0.74) / 0.08, 0, 1);
        const fourthResolvePhase = clamp((sectionFourProgress - 0.82) / 0.07, 0, 1);
        const isolatePhase = clamp((sectionFourProgress - 0.89) / 0.06, 0, 1);
        const centerShiftRaw = clamp((sectionFourProgress - 0.93) / 0.055, 0, 1);
        const centerShiftPhase = centerShiftRaw * centerShiftRaw * (3 - (2 * centerShiftRaw));
        const overlayTakeoverPhase = clamp((sectionFourProgress - 0.95) / 0.002, 0, 1);
        const overlayActive = overlayTakeoverPhase > 0;
        const handoffPhase = clamp((sectionFourProgress - 0.984) / 0.01, 0, 1);
        const zoomPhase = clamp((sectionFourProgress - 0.982) / 0.018, 0, 1);
        const exitPhase = clamp((sectionFourProgress - 0.987) / 0.013, 0, 1);
        const chaosIntensity = Math.max(
            firstDestabilizePhase * (1 - secondResolvePhase),
            secondDestabilizePhase * (1 - thirdResolvePhase),
            thirdDestabilizePhase * (1 - fourthResolvePhase)
        );
        const focusStartColumn = Math.round(
            initialFocusStartColumn + ((centeredFocusStartColumn - initialFocusStartColumn) * centerShiftPhase)
        );
        const focusEndColumn = focusStartColumn + focusSentence.length;
        const revealedCount = Math.max(0, Math.min(total, Math.floor(total * fillPhase)));
        const firstResolvedCount = Math.max(0, Math.min(total, Math.floor(total * firstResolvePhase)));
        const firstDestabilizedCount = Math.max(0, Math.min(total, Math.floor(total * firstDestabilizePhase)));
        const secondResolvedCount = Math.max(0, Math.min(total, Math.floor(total * secondResolvePhase)));
        const secondDestabilizedCount = Math.max(0, Math.min(total, Math.floor(total * secondDestabilizePhase)));
        const thirdResolvedCount = Math.max(0, Math.min(total, Math.floor(total * thirdResolvePhase)));
        const thirdDestabilizedCount = Math.max(0, Math.min(total, Math.floor(total * thirdDestabilizePhase)));
        const fourthResolvedCount = Math.max(0, Math.min(total, Math.floor(total * fourthResolvePhase)));
        const phase = Math.floor(sectionFourProgress * 1000);
        let output = "";

        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                const index = row * columns + column;
                const glyphIndex = (row * 31 + column * 17 + sectionFourTick * 3 + phase) % sectionFourGlyphs.length;
                const randomGlyph = sectionFourGlyphs[glyphIndex];
                const firstMessageGlyph = sectionFourMessageOne[index % sectionFourMessageOne.length];
                const secondMessageGlyph = sectionFourMessageTwo[index % sectionFourMessageTwo.length];
                const thirdMessageGlyph = sectionFourMessageThree[index % sectionFourMessageThree.length];
                const fourthMessageGlyph = sectionFourMessageFour[index % sectionFourMessageFour.length];
                const isFocusCell = row === focusRow && column >= focusStartColumn && column < focusEndColumn;
                const focusGlyph = isFocusCell ? focusSentence[column - focusStartColumn] : " ";

                if (index < revealedCount) {
                    if (firstResolvePhase < 1) {
                        output += index < firstResolvedCount ? firstMessageGlyph : randomGlyph;
                    } else if (firstHoldPhase < 1) {
                        output += firstMessageGlyph;
                    } else if (firstDestabilizePhase < 1) {
                        output += index < firstDestabilizedCount ? randomGlyph : firstMessageGlyph;
                    } else if (secondResolvePhase < 1) {
                        output += index < secondResolvedCount ? secondMessageGlyph : randomGlyph;
                    } else if (secondHoldPhase < 1) {
                        output += secondMessageGlyph;
                    } else if (secondDestabilizePhase < 1) {
                        output += index < secondDestabilizedCount ? randomGlyph : secondMessageGlyph;
                    } else if (thirdResolvePhase < 1) {
                        output += index < thirdResolvedCount ? thirdMessageGlyph : randomGlyph;
                    } else if (thirdHoldPhase < 1) {
                        output += thirdMessageGlyph;
                    } else if (thirdDestabilizePhase < 1) {
                        output += index < thirdDestabilizedCount ? randomGlyph : thirdMessageGlyph;
                    } else if (fourthResolvePhase < 1) {
                        output += index < fourthResolvedCount ? fourthMessageGlyph : randomGlyph;
                    } else if (isolatePhase < 1) {
                        output += isFocusCell ? focusGlyph : (Math.random() < isolatePhase ? " " : fourthMessageGlyph);
                    } else {
                        output += overlayActive ? " " : (isFocusCell ? focusGlyph : " ");
                    }
                } else {
                    output += " ";
                }
            }

            if (row < rows - 1) {
                output += "\n";
            }
        }

        sectionFourMatrix.textContent = output;
        sectionFourMatrix.setAttribute("data-text", output);

        const glitchScale = 1 + (chaosIntensity * 0.04);
        const glitchBlur = chaosIntensity * 2;
        const glitchTracking = (chaosIntensity * 0.8) + "em";
        const glitchX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * chaosIntensity * 8) + "px";
        const glitchY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * chaosIntensity * 4) + "px";
        const glitchGhostOpacity = chaosIntensity > 0.02 ? Math.min(0.8, chaosIntensity * 0.95) : 0;

        gsap.set(sectionFourMatrix, {
            "--glitch-scale": glitchScale,
            "--glitch-blur": `blur(${glitchBlur}px)`,
            "--glitch-tracking": glitchTracking,
            "--glitch-x": glitchX,
            "--glitch-y": glitchY,
            "--glitch-ghost-opacity": glitchGhostOpacity
        });

        if (sectionFourFocus) {
            sectionFourFocus.textContent = focusSentence;
            const handoffEase = handoffPhase * handoffPhase * (3 - (2 * handoffPhase));
            const exitEase = exitPhase * exitPhase * (3 - (2 * exitPhase));
            const focusOpacity = overlayActive ? (1 - exitPhase) : 0;
            const sentenceWidth = focusSentence.length * characterWidth;
            const focusCenterX = paddingLeft + (focusStartColumn * characterWidth) + (sentenceWidth / 2);
            const focusCenterY = paddingTop + (focusRow * lineHeight) + (lineHeight / 2);
            sectionFourFocus.style.left = `${focusCenterX}px`;
            sectionFourFocus.style.top = `${focusCenterY}px`;
            sectionFourFocus.style.fontSize = `${fontSize}px`;
            sectionFourFocus.style.lineHeight = `${lineHeight}px`;

            if (sectionFourProgress < 1) {
                const measuredWidth = sectionFourFocus.getBoundingClientRect().width || sentenceWidth;
                const targetScale = Math.max(1, Math.min(8, (window.innerWidth * 0.92) / measuredWidth));
                const focusScale = 1 + ((targetScale - 1) * zoomPhase);

                gsap.set(sectionFourFocus, {
                    opacity: focusOpacity,
                    scale: focusScale,
                    xPercent: -50,
                    yPercent: -50,
                    x: -window.innerWidth * 0.78 * exitEase,
                    rotationY: -52 * exitEase,
                    rotationX: 8 * exitEase,
                    skewY: -7 * exitEase,
                    scaleX: focusScale * (1 - (0.2 * exitEase)),
                    scaleY: focusScale * (1 + (0.04 * exitEase)),
                    filter: `blur(${exitEase * 1.4}px)`,
                    transformPerspective: 1600,
                    transformOrigin: "50% 50%"
                });
                gsap.set(sectionFourMatrix, { opacity: 1 });
            }
        }
    }

    function styleStatusDisplay() {
        if (!statusBezel || !statusScreen || !statusMarquee) return;
        Object.assign(statusBezel.style, {
            display: "block",
            width: "100%",
            padding: "0.9rem 1rem",
            borderRadius: "22px",
            background:
                "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02)), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.18))",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -10px 22px rgba(0,0,0,0.12), 0 16px 30px rgba(0,0,0,0.12)"
        });

        Object.assign(statusScreen.style, {
            display: "block",
            width: "100%",
            overflow: "hidden",
            borderRadius: "18px",
            padding: "0.85rem 1rem",
            background: "linear-gradient(180deg, rgba(17,20,23,0.96), rgba(25,28,31,0.98))",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 2px 12px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(255,255,255,0.04)"
        });

        Object.assign(statusMarquee.style, {
            display: "block",
            width: "100%",
            fontFamily: '"Workbench", sans-serif',
            fontSize: "1.4rem",
            lineHeight: "1",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            color: "var(--primitive-grey-10)",
            textShadow: "0 0 6px rgba(255,255,255,0.18), 0 0 18px rgba(255,255,255,0.08)"
        });
    }

    function resizeNoise() {
        const scale = 2;
        noiseWidth = Math.max(1, Math.ceil(window.innerWidth / scale));
        noiseHeight = Math.max(1, Math.ceil(window.innerHeight / scale));
        noiseCanvas.width = noiseWidth;
        noiseCanvas.height = noiseHeight;
        noiseCanvas.style.width = `${window.innerWidth}px`;
        noiseCanvas.style.height = `${window.innerHeight}px`;
        noiseImage = noiseContext.createImageData(noiseWidth, noiseHeight);
    }

    function renderNoise() {
        if (!noiseImage || prefersReducedMotion) return;

        const data = noiseImage.data;
        for (let i = 0; i < data.length; i += 4) {
            const grain = Math.random() * 255;
            data[i] = grain;
            data[i + 1] = grain;
            data[i + 2] = grain;
            data[i + 3] = 36 + Math.random() * 62;
        }

        noiseContext.putImageData(noiseImage, 0, 0);
        noiseFrame = window.requestAnimationFrame(renderNoise);
    }

    function logToConsole(message, type = "system") {
        const line = document.createElement("p");
        line.textContent = message;
        if (type === "error") {
            line.style.color = "#d61d00";
        } else {
            line.classList.add("system-msg");
        }
        consoleOutput.appendChild(line);

        while (consoleOutput.children.length > 12) {
            consoleOutput.removeChild(consoleOutput.firstChild);
        }

        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function applyPhase(phase) {
        if (currentPhase && currentPhase.name === phase.name) return;

        document.body.classList.remove(
            "phase-arrival",
            "phase-instability",
            "phase-breakdown",
            "phase-collapse",
            "phase-aftermath"
        );
        document.body.classList.add(`phase-${phase.name}`);
        currentPhase = phase;

    }

    function getBlurAmount() {
        if (toggleFocus.checked) return 0;

        const envelope = Math.pow(scrollProgress, 1.2);
        const waveA = (Math.sin(scrollProgress * 10.5) + 1) * 0.5;
        const waveB = (Math.sin(scrollProgress * 27 - 0.8) + 1) * 0.5;
        const waveC = (Math.sin(scrollProgress * 53 + 1.4) + 1) * 0.5;
        const pulseMix = waveA * 0.5 + waveB * 0.3 + waveC * 0.2;
        const stutter = scrollProgress > 0.38 ? Math.abs(Math.sin(scrollProgress * 85)) * 0.18 : 0;

        return (pulseMix + stutter) * envelope * 18;
    }

    function updateTextDrift() {
        const driftStrength = Math.pow(scrollProgress, 1.35);
        const time = performance.now() * 0.001;

        textElements.forEach((element) => {
            const seed = textDriftSeeds.get(element);

            if (scrollProgress <= 0.01) {
                gsap.set(element, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    force3D: true
                });
                return;
            }

            const maxX = 3 + driftStrength * 42 * seed.range;
            const maxY = 2 + driftStrength * 26 * seed.range;
            const x = Math.sin(time * (0.45 + seed.speed) + seed.x) * maxX;
            const y = Math.cos(time * (0.3 + seed.speed * 0.8) + seed.y) * maxY;
            const rotate = Math.sin(time * (0.18 + seed.speed * 0.32) + seed.x) * driftStrength * 3.8;

            gsap.set(element, {
                x,
                y,
                rotation: rotate,
                force3D: true
            });
        });
    }

    function updateScrambledText(scrambleIntensity) {
        const now = performance.now();
        const cadence = 460 - scrollProgress * 380;

        if (scrambleIntensity <= 0.01) {
            textElements.forEach((element) => {
                element.textContent = originalTexts.get(element) || "";
            });
            lastScrambleAt = now;
            return;
        }

        if (now - lastScrambleAt < cadence) return;
        lastScrambleAt = now;

        textElements.forEach((element) => {
            const originalText = originalTexts.get(element) || "";
            element.textContent = scramble(originalText, scrambleIntensity);
        });
    }

    function updateRfMeter(blurAmount) {
        const bars = [...rfBarsGroup.querySelectorAll("rect")];
        const normalized = clamp(blurAmount / 18, 0, 1);
        let peakHeight = 0;
        let peakX = 26;

        bars.forEach((bar, index) => {
            const wave = (Math.sin(scrollProgress * 11 + index * 0.45) + 1) * 0.5;
            const ripple = (Math.sin(scrollProgress * 29 + index * 0.8) + 1) * 0.5;
            const energy = clamp(normalized * 0.55 + wave * normalized * 0.35 + ripple * 0.22, 0.04, 1);
            const height = 10 + energy * 54;
            const y = 82 - height;

            bar.setAttribute("y", y.toFixed(2));
            bar.setAttribute("height", height.toFixed(2));
            bar.setAttribute("opacity", (0.2 + energy * 0.8).toFixed(2));

            if (height > peakHeight) {
                peakHeight = height;
                peakX = Number(bar.getAttribute("x")) + 5;
            }
        });

        rfPeak.setAttribute("x1", String(peakX));
        rfPeak.setAttribute("x2", String(peakX));
    }

    function setFocusPlane(index) {
        focusPlaneIndex = clamp(index, 0, focusPlanes.length - 1);
        const plane = focusPlanes[focusPlaneIndex];
        const midpoint = Math.floor((focusPlanes.length - 1) / 2);

        depthUp.classList.toggle("is-disabled", focusPlaneIndex === focusPlanes.length - 1);
        depthDown.classList.toggle("is-disabled", focusPlaneIndex === 0);
        depthUp.classList.toggle("is-active", focusPlaneIndex > midpoint);
        depthDown.classList.toggle("is-active", focusPlaneIndex < midpoint);

        gsap.to(consoleColumn, {
            zIndex: plane.consoleZ,
            duration: 0.2,
            overwrite: true
        });
        gsap.to(tutorialColumn, {
            zIndex: plane.tutorialZ,
            duration: 0.2,
            overwrite: true
        });
        gsap.to(rfMeterShell, {
            zIndex: plane.meterZ,
            opacity: 1 - Math.min(plane.meter * 0.25, 0.35),
            duration: 0.2,
            overwrite: true
        });
    }

    function applyChaos() {
        const scrambleIntensity = mapRange(scrollProgress, 0.16, 0.9) * 0.92;
        const blurAmount = getBlurAmount();
        const jitterAmount = toggleJitter.checked ? 0 : mapRange(scrollProgress, 0.28, 0.95) * 22;
        const noiseOpacity = toggleNoise.checked ? 0.03 : 0.14 + mapRange(scrollProgress, 0, 1) * 0.22;

        updateScrambledText(scrambleIntensity);
        updateTextDrift();

        setGridOpacity(scrollProgress > 0.82 || toggleMode.checked ? 1 : 0);
        setNoiseOpacity(Number(noiseOpacity.toFixed(2)));

        const plane = focusPlanes[focusPlaneIndex];
        const tutorialBlur = blurAmount * plane.tutorial;
        const consoleBlur = blurAmount * plane.console;
        const meterBlur = blurAmount * plane.meter;
        const headerBlur = blurAmount * plane.header;
        setTutorialFilter(`blur(${tutorialBlur.toFixed(2)}px)`);
        setConsoleFilter(`blur(${consoleBlur.toFixed(2)}px)`);
        setMeterFilter(`blur(${meterBlur.toFixed(2)}px)`);
        setHeaderFilter(`blur(${headerBlur.toFixed(2)}px)`);
        setPanelFilter("none");
        updateRfMeter(blurAmount);

        const jitterX = jitterAmount > 0 ? (Math.random() - 0.5) * jitterAmount : 0;
        const jitterY = jitterAmount > 0 ? (Math.random() - 0.5) * jitterAmount * 0.6 : 0;
        setJitterX(Number(jitterX.toFixed(2)));
        setJitterY(Number(jitterY.toFixed(2)));
    }

    function updateReadouts() {
        const blurAmount = getBlurAmount();
        const noiseValue = toggleNoise.checked ? 0.03 : 0.14 + mapRange(scrollProgress, 0, 1) * 0.22;
        const focusValue = toggleFocus.checked ? "SHARP" : blurAmount < 3 ? "SHARP" : "DRIFT";

        readoutNoise.textContent = noiseValue.toFixed(2);
        readoutFreq.textContent = ((blurAmount / 18) * 10).toFixed(1);
        readoutFocus.textContent = focusValue;
        setHeaderOpacity(scrollProgress > 0.03 ? 1 : 0);
    }

    function updateConsole() {
        if (scrollProgress < 0.15) {
            const charCount = Math.floor(mapRange(scrollProgress, 0, 0.15) * tutorialCode.length);
            consoleTyping.textContent = tutorialCode.slice(0, charCount);
        } else {
            consoleTyping.textContent = tutorialCode;
        }

        const chaosMessages = [
            "> INTERNAL ERROR: Frequency resonance detected",
            "> WARNING: Signal misalignment in sector 7",
            "> WHAT IS HAPPENING?",
            "> The text... I cannot read it",
            "> 01010111 01001000 01011001",
            "> SYSTEM_FAIL_STACK_OVERFLOW",
            "> RECALIBRATE NOW",
            "> SIGNAL LOSS IN TUTORIAL_LAYER",
            "> VIEWPORT MEMORY CORRUPTION"
        ];

        const logIndex = Math.floor(mapRange(scrollProgress, 0.35, 1) * 12);
        if (scrollProgress > 0.35 && logIndex > lastLoggedIndex) {
            logToConsole(
                chaosMessages[Math.floor(Math.random() * chaosMessages.length)],
                Math.random() > 0.45 ? "error" : "system"
            );
            lastLoggedIndex = logIndex;
        }
    }

    function updateControlPanel() {
        const panelVisible = scrollProgress > 0.08 && scrollProgress < chapterTwoStart;
        setPanelY(panelVisible ? 0 : 150);
        setPanelOpacity(panelVisible ? 1 : 0);
        gsap.set(controlPanel, {
            autoAlpha: panelVisible ? 1 : 0,
            pointerEvents: panelVisible ? "auto" : "none"
        });
    }

    function updateKnobRotation(progress) {
        const delta = progress - lastRenderedProgress;
        if (delta === 0) return;
        knobRotation += delta * 1100;
        gsap.to(knob, {
            rotation: knobRotation,
            duration: 0.25,
            ease: "power2.out",
            overwrite: true
        });
    }

    function stripSnapshotIds(root) {
        if (!(root instanceof Element)) return;
        root.removeAttribute("id");
        root.removeAttribute("for");
        root.removeAttribute("aria-labelledby");
        root.removeAttribute("aria-describedby");
        root.removeAttribute("aria-controls");
        root.querySelectorAll("[id], [for], [aria-labelledby], [aria-describedby], [aria-controls]").forEach((node) => {
            node.removeAttribute("id");
            node.removeAttribute("for");
            node.removeAttribute("aria-labelledby");
            node.removeAttribute("aria-describedby");
            node.removeAttribute("aria-controls");
        });
    }

    function sanitizeSnapshotClone(root) {
        if (!(root instanceof Element)) return;
        root.querySelectorAll("*").forEach((node) => {
            if (!(node instanceof HTMLElement) && !(node instanceof SVGElement)) return;
            node.style.transition = "none";
            node.style.animation = "none";
            node.style.willChange = "auto";
        });
        if (root instanceof HTMLElement || root instanceof SVGElement) {
            root.style.transition = "none";
            root.style.animation = "none";
            root.style.willChange = "auto";
        }
    }

    function buildSectionSixTutorialReturn() {
        if (!sectionSixTutorialShell || !tutorialLayout) return;

        sectionSixTutorialShell.innerHTML = "";

        const layoutClone = tutorialLayout.cloneNode(true);
        stripSnapshotIds(layoutClone);
        sanitizeSnapshotClone(layoutClone);

        const title = layoutClone.querySelector("h1");
        const subtitle = layoutClone.querySelector("h2");
        const tutorialSection = layoutClone.querySelector(".tutorial-section");
        const tutorialSteps = Array.from(layoutClone.querySelectorAll(".tutorial-step"));
        const troubleshoot = layoutClone.querySelector(".tutorial-troubleshoot");
        const consoleTitle = layoutClone.querySelector(".console-title");
        const inputText = layoutClone.querySelector(".input-text");
        const cursor = layoutClone.querySelector(".cursor");
        const outputArea = layoutClone.querySelector(".console-output-area");

        if (title) title.textContent = "JavaScript";
        if (subtitle) subtitle.textContent = "Variables";

        if (tutorialSection) {
            const sectionHeading = tutorialSection.querySelector("h3");
            const sectionBody = tutorialSection.querySelector("p");
            if (sectionHeading) sectionHeading.textContent = "1.2 Variables";
            if (sectionBody) {
                sectionBody.textContent =
                    "Variables store values so the same program can shift meaning without rewriting every line.";
            }
        }

        if (tutorialSteps[0]) {
            tutorialSteps[0].classList.add("is-muted");
            const stepHeading = tutorialSteps[0].querySelector("h4");
            const paragraphs = tutorialSteps[0].querySelectorAll("p");
            const snippets = tutorialSteps[0].querySelectorAll(".code-snippet");
            if (stepHeading) stepHeading.textContent = "Step 1";
            if (paragraphs[0]) paragraphs[0].textContent = "Create a variable and store a phrase in it:";
            if (paragraphs[1]) paragraphs[1].textContent = "You should see this in the console output:";
            if (snippets[0]) snippets[0].textContent = 'let message = "I wish I was you.";';
            if (snippets[1]) snippets[1].textContent = "undefined";
        }

        if (troubleshoot) {
            const troubleshootLead = troubleshoot.querySelector("p");
            const troubleshootItems = troubleshoot.querySelectorAll("li");
            if (troubleshootLead) {
                troubleshootLead.innerHTML = "<strong>If it breaks, check these:</strong>";
            }
            if (troubleshootItems[0]) {
                troubleshootItems[0].innerHTML =
                    "Make sure the variable name matches exactly every time you use it.";
            }
            if (troubleshootItems[1]) {
                troubleshootItems[1].innerHTML =
                    "Keep the text inside quotes so JavaScript reads it as a string.";
            }
        }

        if (tutorialSteps[1]) {
            tutorialSteps[1].classList.add("is-active");
            const stepHeading = tutorialSteps[1].querySelector("h4");
            const stepBody = tutorialSteps[1].querySelector("p");
            if (stepHeading) stepHeading.textContent = "Step 2";
            if (stepBody) stepBody.textContent = "Log the variable to the console, then press Run again:";

            const newSnippet = document.createElement("div");
            newSnippet.className = "code-snippet";
            newSnippet.textContent = "console.log(message);";
            tutorialSteps[1].appendChild(newSnippet);

            const newOutputLead = document.createElement("p");
            newOutputLead.textContent = "The console should print the saved text:";
            tutorialSteps[1].appendChild(newOutputLead);

            const newOutput = document.createElement("div");
            newOutput.className = "code-snippet output";
            newOutput.textContent = "I wish I was you.";
            tutorialSteps[1].appendChild(newOutput);

            const loopButton = document.createElement("button");
            loopButton.type = "button";
            loopButton.className = "tutorial-loop-button pixel-font";
            loopButton.textContent = "Continue";
            loopButton.addEventListener("click", () => {
                window.scrollTo({
                    top: showpieceSection ? showpieceSection.offsetTop : 0,
                    behavior: "smooth"
                });
            });
            tutorialSteps[1].appendChild(loopButton);
        }

        if (consoleTitle) consoleTitle.textContent = "Console";
        if (inputText) inputText.textContent = 'let message = "I wish I was you.";';
        if (cursor) cursor.remove();
        if (outputArea) {
            outputArea.innerHTML = [
                '<div class="output-line">&gt; console.log(message);</div>',
                '<div class="output-line">I wish I was you.</div>'
            ].join("");
        }

        sectionSixTutorialShell.append(layoutClone);
    }

    function buildSnapshotSurface(offsetX = 0, offsetY = 0) {
        const surface = document.createElement("div");
        surface.className = "chapter-two__fragment-surface";
        surface.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;

        const snapshot = document.createElement("div");
        snapshot.className = "chapter-two__snapshot";

        const headerClone = header.cloneNode(true);
        headerClone.classList.add("chapter-two__snapshot-header");
        stripSnapshotIds(headerClone);
        sanitizeSnapshotClone(headerClone);
        headerClone.style.opacity = "1";
        headerClone.style.transform = "none";
        headerClone.style.filter = "none";

        const layoutClone = tutorialLayout.cloneNode(true);
        layoutClone.classList.add("chapter-two__snapshot-layout");
        stripSnapshotIds(layoutClone);
        sanitizeSnapshotClone(layoutClone);
        layoutClone.style.transform = "translate(-50%, -50%)";
        layoutClone.style.filter = "none";
        layoutClone.style.opacity = "1";

        const controlPanelClone = controlPanel.cloneNode(true);
        controlPanelClone.classList.remove("hidden");
        controlPanelClone.classList.add("chapter-two__snapshot-panel");
        stripSnapshotIds(controlPanelClone);
        sanitizeSnapshotClone(controlPanelClone);
        controlPanelClone.style.opacity = "1";
        controlPanelClone.style.filter = "none";
        controlPanelClone.style.transform = "translateX(-50%)";

        snapshot.append(headerClone, layoutClone, controlPanelClone);
        surface.appendChild(snapshot);
        return surface;
    }

    function buildChapterTwoFragments() {
        const columns = 4;
        const rows = 3;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const totalFragments = columns * rows;
        chapterTwoFragments.innerHTML = "";
        chapterTwoFragmentSeeds.length = 0;

        for (let index = 0; index < totalFragments; index += 1) {
            const column = index % columns;
            const row = Math.floor(index / columns);
            const normX = columns > 1 ? column / (columns - 1) - 0.5 : 0;
            const normY = rows > 1 ? row / (rows - 1) - 0.5 : 0;
            const fragment = document.createElement("span");
            fragment.className = "chapter-two__fragment";
            const surface = buildSnapshotSurface(
                Math.round((column / columns) * viewportWidth),
                Math.round((row / rows) * viewportHeight)
            );
            fragment.appendChild(surface);
            chapterTwoFragments.appendChild(fragment);
            chapterTwoFragmentSeeds.push({
                element: fragment,
                driftX: normX * 460 + (Math.random() - 0.5) * 90,
                driftY: (normY * 0.6 + 0.14) * 520 + (Math.random() - 0.5) * 120,
                rotate: normX * 18 + (Math.random() - 0.5) * 12,
                scale: 0.92 + Math.random() * 0.26,
                delay: Math.random() * 0.22
            });
        }
    }

    function captureChapterTwoFreeze() {
        chapterTwoFreezeBase.innerHTML = "";
        chapterTwoFreezeBase.appendChild(buildSnapshotSurface());
        buildChapterTwoFragments();
    }

    function setChapterTwoLineText(element, text) {
        element.textContent = "";
        element.dataset.text = text;
        const words = text.split(" ");

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement("span");
            wordSpan.className = "chapter-two__word";

            [...word].forEach((character) => {
                const span = document.createElement("span");
                span.className = "chapter-two__char";
                span.textContent = character;
                wordSpan.appendChild(span);
            });

            element.appendChild(wordSpan);

            if (wordIndex < words.length - 1) {
                const spacer = document.createElement("span");
                spacer.className = "chapter-two__char chapter-two__char--space";
                spacer.textContent = "\u00A0";
                element.appendChild(spacer);
            }
        });
    }

    function getChapterTwoLineText(element) {
        return element.dataset.text || element.textContent.trim();
    }

    function resetChapterTwoChars(element, { opacity = 1 } = {}) {
        const chars = element.querySelectorAll(".chapter-two__char");
        gsap.set(chars, {
            opacity,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            filter: "blur(0px)"
        });
    }

    function transitionChapterTwoLine(nextIndex, { immediate = false } = {}) {
        if (nextIndex === chapterTwoLineIndex && !immediate) return;

        const nextText = chapterTwoLines[nextIndex];
        if (!nextText) return;

        const previousText = getChapterTwoLineText(chapterTwoLine) || nextText;
        chapterTwoLineIndex = nextIndex;
        gsap.killTweensOf([
            chapterTwoLine,
            chapterTwoIncomingLine,
            ...chapterTwoLine.querySelectorAll(".chapter-two__char"),
            ...chapterTwoIncomingLine.querySelectorAll(".chapter-two__char")
        ]);
        if (chapterTwoMorphTween) {
            chapterTwoMorphTween.kill();
            chapterTwoMorphTween = null;
        }

        if (immediate) {
            setChapterTwoLineText(chapterTwoLine, nextText);
            resetChapterTwoChars(chapterTwoLine);
            gsap.set(chapterTwoLine, {
                opacity: 1,
                xPercent: -50,
                yPercent: -50,
                y: 0,
                filter: "blur(0px)",
                letterSpacing: "-0.06em",
                rotationX: 0,
                scale: 1
            });
            chapterTwoIncomingLine.textContent = "";
            chapterTwoIncomingLine.dataset.text = "";
            gsap.set(chapterTwoIncomingLine, {
                opacity: 0,
                xPercent: -50,
                yPercent: -50,
                y: 54,
                filter: "blur(28px)",
                letterSpacing: "-0.18em",
                rotationX: -76,
                scale: 0.96,
                x: 0
            });
            return;
        }

        setChapterTwoLineText(chapterTwoIncomingLine, previousText);
        setChapterTwoLineText(chapterTwoLine, nextText);
        resetChapterTwoChars(chapterTwoIncomingLine);
        resetChapterTwoChars(chapterTwoLine, { opacity: 0 });
        const outgoingChars = [...chapterTwoIncomingLine.querySelectorAll(".chapter-two__char:not(.chapter-two__char--space)")];
        const incomingChars = [...chapterTwoLine.querySelectorAll(".chapter-two__char:not(.chapter-two__char--space)")];

        gsap.set(chapterTwoIncomingLine, {
            opacity: 1,
            xPercent: -50,
            yPercent: -50,
            y: 0,
            filter: "blur(0px)",
            letterSpacing: "-0.06em",
            rotationX: 0,
            scale: 1,
            x: 0,
            zIndex: 2
        });
        gsap.set(chapterTwoLine, {
            opacity: 0,
            xPercent: -50,
            yPercent: -50,
            y: 28,
            filter: "blur(10px)",
            letterSpacing: "-0.08em",
            rotationX: 0,
            scale: 1,
            x: 0,
            zIndex: 1
        });
        gsap.set(incomingChars, {
            opacity: 0,
            y: 42
        });

        chapterTwoMorphTween = gsap.timeline({
            defaults: { overwrite: true },
            onComplete: () => {
                chapterTwoIncomingLine.textContent = "";
                chapterTwoIncomingLine.dataset.text = "";
                gsap.set(chapterTwoIncomingLine, {
                    opacity: 0,
                    xPercent: -50,
                    yPercent: -50,
                    y: 54,
                    filter: "blur(28px)",
                    letterSpacing: "-0.18em",
                    rotationX: -76,
                    scale: 0.96,
                    x: 0
                });
                chapterTwoMorphTween = null;
            }
        });

        chapterTwoMorphTween.to(
            outgoingChars,
            {
                opacity: 0,
                x: () => gsap.utils.random(-320, 320),
                y: () => gsap.utils.random(-240, 180),
                rotate: () => gsap.utils.random(-180, 180),
                scale: () => gsap.utils.random(0.45, 1.25),
                filter: "blur(10px)",
                duration: 0.7,
                ease: "power3.out",
                stagger: {
                    each: 0.01,
                    from: "random"
                }
            },
            0
        );

        chapterTwoMorphTween.to(
            chapterTwoIncomingLine,
            {
                opacity: 0,
                duration: 0.18,
                ease: "none"
            },
            0.52
        );

        chapterTwoMorphTween.to(
            chapterTwoLine,
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "power2.out"
            },
            0.12
        );

        chapterTwoMorphTween.to(
            incomingChars,
            {
                opacity: 1,
                y: 0,
                duration: 0.58,
                ease: "expo.out",
                stagger: 0.012
            },
            0.12
        );

        chapterTwoMorphTween.to(
            chapterTwoLine,
            {
                letterSpacing: "-0.06em",
                duration: 0.2,
                ease: "power1.out"
            },
            0.14
        );
    }

    function updateChapterTwoSequence() {
        if (!chapterTwoTransitionComplete) return;
        const localProgress = mapRange(scrollProgress, chapterTwoRevealStart, 1);
        const nextIndex = Math.max(
            0,
            chapterTwoLineStops.findLastIndex((stop) => localProgress >= stop)
        );
        transitionChapterTwoLine(nextIndex);
    }

    function updateChapterTwoTransition() {
        const introProgress = mapRange(scrollProgress, chapterTwoStart, chapterTwoRevealStart);
        chapterTwoTransitionComplete = introProgress >= 1;

        document.body.classList.toggle("chapter-two-transition", introProgress < 1);
        gsap.set(chapterTwo, { opacity: 1 });
        gsap.set(controlPanel, {
            opacity: 1 - introProgress * 1.2,
            yPercent: introProgress * 180
        });
        gsap.set(header, { opacity: 1 - introProgress * 0.92 });
        gsap.set(viewport, {
            filter: `contrast(${1 + introProgress * 0.16}) saturate(${1 - introProgress * 0.24}) blur(${introProgress * 1.1}px)`
        });

        const veilOpacity = Math.min(0.98, 0.1 + introProgress * 0.9);
        const freezeHoldOpacity = 1 - mapRange(introProgress, 0.12, 0.26);
        const crumbleProgress = mapRange(introProgress, 0.14, 0.92);
        const tileOpacity = mapRange(introProgress, 0.1, 0.2);
        const sentenceVisibility = mapRange(introProgress, 0.68, 1);

        gsap.set(chapterTwoFreeze, { opacity: 1 });
        gsap.set(chapterTwoVeil, { opacity: veilOpacity });
        gsap.set(chapterTwoFreezeBase, { opacity: freezeHoldOpacity });
        gsap.set(chapterTwoFragments, { opacity: tileOpacity });

        chapterTwoFragmentSeeds.forEach((seed) => {
            const fragmentProgress = clamp((crumbleProgress - seed.delay) / (1 - seed.delay), 0, 1);
            const lift = Math.pow(fragmentProgress, 1.02);
            gsap.set(seed.element, {
                opacity: fragmentProgress > 0 ? Math.max(0, 1 - fragmentProgress * 1.05) : 1,
                x: seed.driftX * lift,
                y: seed.driftY * lift,
                rotate: seed.rotate * lift,
                scale: 1 + (seed.scale - 1) * lift,
                filter: "none"
            });
        });

        gsap.set(chapterTwoLabel, {
            opacity: sentenceVisibility,
            y: 16 - sentenceVisibility * 16,
            filter: `blur(${(1 - sentenceVisibility) * 10}px)`
        });

        gsap.set(chapterTwoLine, {
            opacity: sentenceVisibility,
            xPercent: -50,
            yPercent: -50,
            y: 50 - sentenceVisibility * 50,
            filter: `blur(${(1 - sentenceVisibility) * 22}px)`
        });

        if (!chapterTwoTransitionComplete) {
            gsap.set(chapterTwoIncomingLine, { opacity: 0 });
        }
    }

    function activateChapterTwo() {
        if (chapterTwoActive) return;
        chapterTwoActive = true;
        chapterTwoTransitionComplete = false;
        captureChapterTwoFreeze();
        transitionChapterTwoLine(0, { immediate: true });
        document.body.classList.add("chapter-two-active");
        gsap.set(chapterTwo, { opacity: 1 });
        gsap.set(chapterTwoFreeze, { opacity: 0 });
        gsap.set(chapterTwoFreezeBase, { opacity: 0 });
        gsap.set(chapterTwoFragments, { opacity: 0 });
        gsap.set(chapterTwoLabel, { opacity: 0, y: 16, filter: "blur(10px)" });
        gsap.set(chapterTwoLine, {
            opacity: 0,
            xPercent: -50,
            yPercent: -50,
            y: 34,
            filter: "blur(30px)",
            letterSpacing: "-0.06em",
            rotationX: 0
        });
        gsap.set(chapterTwoIncomingLine, {
            opacity: 0,
            xPercent: -50,
            yPercent: -50,
            y: 54,
            filter: "blur(28px)",
            letterSpacing: "-0.18em",
            rotationX: -76
        });
    }

    function deactivateChapterTwo() {
        if (!chapterTwoActive) return;
        chapterTwoActive = false;
        chapterTwoTransitionComplete = false;
        document.body.classList.remove("chapter-two-active", "chapter-two-transition");
        if (chapterTwoMorphTween) {
            chapterTwoMorphTween.kill();
            chapterTwoMorphTween = null;
        }
        gsap.set(chapterTwo, { opacity: 0 });
        gsap.set(chapterTwoFreeze, { opacity: 0 });
        gsap.set(chapterTwoFreezeBase, { opacity: 0 });
        gsap.set(chapterTwoFragments, { opacity: 0 });
        gsap.set(chapterTwoLabel, { opacity: 0, y: 16, filter: "blur(10px)" });
        gsap.set(chapterTwoLine, {
            opacity: 0,
            xPercent: -50,
            yPercent: -50,
            y: 16,
            filter: "blur(18px)",
            letterSpacing: "-0.06em",
            rotationX: 0
        });
        gsap.set(chapterTwoIncomingLine, {
            opacity: 0,
            xPercent: -50,
            yPercent: -50,
            y: 54,
            filter: "blur(28px)",
            letterSpacing: "-0.18em",
            rotationX: -76
        });
        gsap.set(viewport, { clearProps: "filter" });
        chapterTwoLineIndex = -1;
    }

    function renderShowpiece(progress) {
        scrollProgress = clamp(progress, 0, 1);
        updateKnobRotation(scrollProgress);
        applyPhase(getPhase(scrollProgress));

        if (scrollProgress >= chapterTwoStart) {
            activateChapterTwo();
            updateChapterTwoTransition();
            updateChapterTwoSequence();
        } else {
            deactivateChapterTwo();
            applyChaos();
            updateReadouts();
            updateConsole();
            updateControlPanel();
        }

        if (!chapterTwoActive) {
            setGridOpacity(scrollProgress > 0.82 || toggleMode.checked ? 1 : 0);
        }

        lastRenderedProgress = scrollProgress;
    }

    function runIntroSequence() {
        gsap.timeline()
            .from(".section-shell--lead > *", {
                opacity: 0,
                y: 28,
                stagger: 0.12,
                duration: 0.7,
                ease: "power2.out"
            })
            .from(
                "#main-title",
                {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: "power2.out"
                },
                "-=0.25"
            )
            .from(
                "#sub-title",
                {
                    opacity: 0,
                    y: 18,
                    duration: 0.6,
                    ease: "power2.out"
                },
                "-=0.45"
            )
            .to(
                ".tutorial-section, .tutorial-step, .tutorial-troubleshoot",
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    stagger: 0.12,
                    ease: "power1.out"
                },
                "-=0.2"
            )
            .set("#main-title", { opacity: 1, clearProps: "transform" });
    }

    function initShowpieceControls() {
        setNoiseOpacity = gsap.quickTo(noiseCanvas, "opacity", { duration: 0.22, ease: "power2.out" });
        setGridOpacity = gsap.quickTo(gridOverlay, "opacity", { duration: 0.24, ease: "power2.out" });
        setHeaderOpacity = gsap.quickTo(header, "opacity", { duration: 0.35, ease: "power2.out" });
        setJitterX = gsap.quickTo(tutorialLayout, "x", { duration: 0.08, ease: "none" });
        setJitterY = gsap.quickTo(tutorialLayout, "y", { duration: 0.08, ease: "none" });
        setTutorialFilter = gsap.quickSetter(tutorialColumn, "filter");
        setConsoleFilter = gsap.quickSetter(consoleWindow, "filter");
        setMeterFilter = gsap.quickSetter(rfMeterShell, "filter");
        setHeaderFilter = gsap.quickSetter(header, "filter");
        setPanelFilter = () => {
            controlPanel.style.filter = "none";
        };
        setPanelY = gsap.quickTo(controlPanel, "yPercent", { duration: 0.45, ease: "power3.out" });
        setPanelOpacity = gsap.quickTo(controlPanel, "opacity", { duration: 0.35, ease: "power2.out" });
    }

    function createSectionReveals() {
        if (leadSection) {
            gsap.from(".section-shell--lead", {
                opacity: 0,
                y: 40,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: leadSection,
                    start: "top 75%"
                }
            });
        }

        revealSections.forEach((section) => {
            const shell = section.querySelector(".section-shell");
            if (!shell) return;

            gsap.to(shell, {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 72%"
                }
            });
        });

        if (sectionThreeVisual && sectionThreeStage && sectionThreeHeadPath) {
            const getSectionThreeStart = () => {
                const sectionStart = ScrollTrigger.positionInViewport(sectionThreeVisual, "top") === 0
                    ? ScrollTrigger.scroll()
                    : sectionThreeVisual.offsetTop;
                return showpieceTrigger ? Math.max(sectionStart, showpieceTrigger.end + 1) : sectionStart;
            };

            gsap.set(sectionThreeVisual.querySelector(".section-shell"), { opacity: 1, y: 0 });
            gsap.set(sectionThreeHead, { y: -200, rotation: 0, transformOrigin: "50% 85%" });
            gsap.set(sectionThreeVisual, { backgroundColor: "#000000" });
            gsap.set(sectionThreeGlow, { opacity: 0.95, scale: 1 });
            gsap.set(sectionThreeScreen, { filter: "brightness(1)" });
            gsap.set(sectionThreeScreenShell, { scale: 1, transformOrigin: "50% 50%" });
            gsap.set(sectionThreeDesk, { opacity: 1 });
            gsap.set(sectionThreeDeskShadow, { opacity: 0.38, scaleX: 0.88 });
            gsap.set(sectionThreeLogo, { opacity: 0.72, scale: 1 });
            gsap.set(sectionThreeFlash, { opacity: 0 });
            if (sectionFourShell) {
                gsap.set(sectionFourShell, { opacity: 1, y: 0 });
            }

            gsap.timeline({
                scrollTrigger: {
                    trigger: sectionThreeVisual,
                    start: getSectionThreeStart,
                    end: () => getSectionThreeStart() + window.innerHeight * 2.8,
                    pin: sectionThreeVisual,
                    scrub: 1,
                    anticipatePin: 1,
                    onEnter: () => {
                        sectionThreeVisual.classList.add("is-active");
                        gsap.set(controlPanel, { autoAlpha: 0, pointerEvents: "none" });
                    },
                    onEnterBack: () => {
                        sectionThreeVisual.classList.add("is-active");
                        gsap.set(controlPanel, { autoAlpha: 0, pointerEvents: "none" });
                    },
                    onLeave: () => {
                        sectionThreeVisual.classList.remove("is-active");
                        gsap.set(controlPanel, { autoAlpha: 0, pointerEvents: "none" });
                    },
                    onLeaveBack: () => {
                        sectionThreeVisual.classList.remove("is-active");
                        gsap.set(controlPanel, { autoAlpha: 1, pointerEvents: "auto" });
                    }
                }
            })
                .to(sectionThreeGlow, { opacity: 1, scale: 1.12, ease: "none" }, 0)
                .to(sectionThreeScreen, { filter: "brightness(1.12)", ease: "none" }, 0)
                .to(sectionThreeLogo, { opacity: 0.84, scale: 1.04, ease: "none" }, 0)
                .to(sectionThreeHead, { y: 18, rotation: 17, scaleX: 1.07, scaleY: 0.76, ease: "none" }, 0)
                .to(sectionThreeDeskShadow, { opacity: 0.88, scaleX: 1.72, scaleY: 1.16, ease: "none" }, 0)
                .to(sectionThreeHead, { filter: "drop-shadow(0 12px 20px rgba(0, 0, 0, 0.68))", ease: "none" }, 0.1)
                .to(sectionThreeHead, { y: 250, rotation: 24, scaleX: 1.1, scaleY: 0.7, autoAlpha: 0.08, ease: "none" }, 0.58)
                .to(sectionThreeDesk, { opacity: 0, ease: "none" }, 0.58)
                .to(sectionThreeDeskShadow, { opacity: 0.12, scaleX: 2.1, scaleY: 1.24, ease: "none" }, 0.58)
                .to(sectionThreeScreenShell, { scale: 1.18, ease: "none" }, 0.58)
                .to(sectionThreeLogo, { scale: 1.35, opacity: 0.92, ease: "none" }, 0.62)
                .to(sectionThreeScreenShell, { scale: 1.75, ease: "none" }, 0.72)
                .to(sectionThreeLogo, { scale: 2.45, opacity: 0.98, ease: "none" }, 0.74)
                .to(sectionThreeStage, {
                    backgroundColor: "#ffffff",
                    borderRadius: 0,
                    borderWidth: 0,
                    borderColor: "transparent",
                    boxShadow: "none",
                    ease: "none"
                }, 0.78)
                .to(sectionThreeVisual, { backgroundColor: "#ffffff", ease: "none" }, 0.82)
                .to(sectionThreeScreenShell, { scale: 3.8, ease: "none" }, 0.84)
                .to(sectionThreeLogo, { scale: 7.4, opacity: 1, ease: "none" }, 0.84)
                .to(sectionThreeGlow, { opacity: 1, scale: 1.56, ease: "none" }, 0.84)
                .to(sectionThreeScreenShell, { scale: 7.2, ease: "none" }, 0.93)
                .to(sectionThreeLogo, { scale: 18, opacity: 1, ease: "none" }, 0.93)
                .to(sectionThreeFlash, { opacity: 1, ease: "none" }, 0.97);
        }

        if (sectionFourEntry && sectionFourShell && sectionFourStage && sectionFourMatrix) {
            buildSectionFourLayout();
            renderSectionFourField();

            gsap.ticker.add(() => {
                if (!sectionFourActive) return;
                sectionFourTick += 1;
                renderSectionFourField();
            });

            ScrollTrigger.create({
                trigger: sectionFourEntry,
                start: "top top",
                end: "+=1780%",
                pin: sectionFourEntry,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onRefresh: buildSectionFourLayout,
                onEnter: () => {
                    sectionFourActive = true;
                    renderSectionFourField();
                },
                onEnterBack: () => {
                    sectionFourActive = true;
                    renderSectionFourField();
                },
                onLeave: () => {
                    sectionFourActive = false;
                },
                onLeaveBack: () => {
                    sectionFourActive = false;
                },
                onUpdate: (self) => {
                    sectionFourProgress = self.progress;
                    renderSectionFourField();
                }
            });
        }

        const sectionFiveVisual = document.getElementById("relay-visual-b");
        const sectionFiveTurnText = document.getElementById("section-five-turn-text");
        const theVideoShell = document.getElementById("section-five-video-shell");
        const theVideo = document.getElementById("section-five-video");

        if (sectionFiveVisual && sectionFiveTurnText && theVideoShell && theVideo) {
            const sectionFiveVideoStart = () => window.innerWidth * 1.2;

            gsap.set(sectionFiveTurnText, {
                opacity: 0,
                xPercent: -50,
                yPercent: -50,
                x: 0,
                rotationY: 0,
                scale: 1,
                transformOrigin: "50% 50%"
            });

            gsap.set(theVideoShell, {
                xPercent: -50,
                yPercent: -50,
                x: sectionFiveVideoStart(),
                rotationY: -45,
                rotationX: 10,
                z: -300,
                transformPerspective: 1600,
                transformOrigin: "left center",
                opacity: 1,
                zIndex: 10
            });

            theVideo.muted = true;
            theVideo.loop = true;
            theVideo.autoplay = true;
            theVideo.playsInline = true;
            theVideo.removeAttribute("controls");

            const transitionTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionFiveVisual,
                    start: "top top",
                    end: "+=250%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onEnter: () => theVideo.play().catch(() => { }),
                    onEnterBack: () => theVideo.play().catch(() => { })
                }
            });

            transitionTimeline.to(theVideoShell, {
                x: 0,
                rotationY: 0,
                rotationX: 0,
                z: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 0.1)
                .to(theVideoShell, {
                    width: "100%",
                    height: "100vh",
                    borderRadius: "0px",
                    border: "none",
                    duration: 0.8,
                    ease: "power1.inOut"
                }, 1.0);
        }

        if (sectionFourEntry) {
            const hideWhitePhaseChrome = () => {
                gsap.set(header, { autoAlpha: 0 });
                gsap.set(gridOverlay, { autoAlpha: 0 });
                gsap.set(noiseCanvas, { autoAlpha: 0 });
                if (backgroundLayer) {
                    gsap.set(backgroundLayer, { autoAlpha: 0 });
                }
            };
            const showWhitePhaseChrome = () => {
                gsap.set(header, { autoAlpha: 1 });
                if (backgroundLayer) {
                    gsap.set(backgroundLayer, { autoAlpha: 1 });
                }
            };

            ScrollTrigger.create({
                trigger: sectionFourEntry,
                start: "top top",
                endTrigger: sectionSixVisual || sectionFiveVisual || sectionFourEntry,
                end: "bottom bottom",
                onEnter: hideWhitePhaseChrome,
                onEnterBack: hideWhitePhaseChrome,
                onLeaveBack: showWhitePhaseChrome
            });
        }

        if (sectionSixVisual && sectionSixStage && sectionSixVideoProxyShell && sectionSixVideoProxy && sectionSixTutorialShell) {
            gsap.set(sectionSixVisual, { autoAlpha: 0 });
            gsap.set(sectionSixVisual.querySelector(".section-shell"), { opacity: 1, y: 0 });
            gsap.set(sectionSixVideoProxyShell, {
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: 0,
                rotationY: 0,
                rotationX: 0,
                z: 0,
                scale: 1,
                opacity: 1,
                transformPerspective: 2200,
                transformOrigin: "center center"
            });
            gsap.set(sectionSixVideoProxy, {
                filter: "invert(0) contrast(1) saturate(1) brightness(1)"
            });
            gsap.set(sectionSixTutorialShell, {
                xPercent: -50,
                yPercent: -50,
                x: window.innerWidth * 1.1,
                y: 0,
                rotationY: -54,
                rotationX: 8,
                z: -320,
                scale: 0.92,
                opacity: 1,
                transformPerspective: 2200,
                transformOrigin: "right center"
            });

            sectionSixVideoProxy.muted = true;
            sectionSixVideoProxy.loop = true;
            sectionSixVideoProxy.autoplay = true;
            sectionSixVideoProxy.playsInline = true;
            sectionSixVideoProxy.removeAttribute("controls");

            gsap.timeline({
                scrollTrigger: {
                    trigger: sectionSixVisual,
                    start: "top top",
                    end: "+=380%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onEnter: () => {
                        gsap.set(sectionSixVisual, { autoAlpha: 1 });
                        sectionSixVideoProxy.play().catch(() => { });
                    },
                    onEnterBack: () => {
                        gsap.set(sectionSixVisual, { autoAlpha: 1 });
                        sectionSixVideoProxy.play().catch(() => { });
                    },
                    onLeaveBack: () => {
                        gsap.set(sectionSixVisual, { autoAlpha: 0 });
                    },
                    onRefresh: (self) => {
                        gsap.set(sectionSixVisual, { autoAlpha: self.progress > 0 ? 1 : 0 });
                    }
                }
            })
                .to(sectionSixVideoProxyShell, {
                    x: 0,
                    rotationY: 0,
                    rotationX: 0,
                    z: 0,
                    scale: 1,
                    duration: 0.34,
                    ease: "none"
                }, 0)
                .to(sectionSixVideoProxy, {
                    filter: "invert(1) contrast(1.32) saturate(0.8) brightness(1.1)",
                    duration: 0.14,
                    ease: "none"
                }, 0.34)
                .to(sectionSixVideoProxyShell, {
                    x: -window.innerWidth * 1.06,
                    rotationY: 56,
                    rotationX: -7,
                    z: -260,
                    scale: 0.92,
                    duration: 0.62,
                    ease: "none"
                }, 0.38)
                .to(sectionSixVideoProxyShell, {
                    opacity: 0,
                    duration: 0.42,
                    ease: "none"
                }, 0.58)
                .to(sectionSixTutorialShell, {
                    x: 0,
                    rotationY: 0,
                    rotationX: 0,
                    z: 0,
                    scale: 1,
                    duration: 0.62,
                    ease: "none"
                }, 0.38);
        }

        relayVisualSections.forEach((section) => {
            const cards = section.querySelectorAll(".visual-card");
            const stack = section.querySelector(".visual-stack");

            if (cards.length > 0) {
                gsap.from(cards, {
                    opacity: 0,
                    y: 52,
                    stagger: 0.14,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 68%"
                    }
                });
            }

            if (stack) {
                gsap.to(stack, {
                    yPercent: -8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            }
        });

        relayTextSections.forEach((section) => {
            if (section.id === "relay-text-a") {
                return;
            }

            const textBlocks = section.querySelectorAll("p, h2");
            gsap.from(textBlocks, {
                opacity: 0,
                y: 30,
                stagger: 0.08,
                duration: 0.65,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%"
                }
            });
        });
    }

    function createShowpieceTimeline() {
        const state = { progress: 0 };

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: showpieceSection,
                start: "top top",
                end: "+=1450%",
                scrub: 1,
                pin: showpieceSection,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onRefresh: () => {
                    if (chapterTwoActive) {
                        captureChapterTwoFreeze();
                    }
                },
                onLeave: () => {
                    deactivateChapterTwo();
                    gsap.set(controlPanel, { autoAlpha: 0, pointerEvents: "none" });
                },
                onEnterBack: () => {
                    gsap.set(controlPanel, { autoAlpha: 1, pointerEvents: "auto" });
                }
            }
        });
        showpieceTrigger = timeline.scrollTrigger;

        timeline
            .to(state, {
                progress: 0.18,
                duration: 1,
                ease: "none",
                onUpdate: () => renderShowpiece(state.progress)
            })
            .to(state, {
                progress: 0.74,
                duration: 2.4,
                ease: "none",
                onUpdate: () => renderShowpiece(state.progress)
            })
            .to(state, {
                progress: 0.86,
                duration: 3.2,
                ease: "none",
                onUpdate: () => renderShowpiece(state.progress)
            })
            .to(state, {
                progress: 1,
                duration: 7.4,
                ease: "none",
                onUpdate: () => renderShowpiece(state.progress)
            });

        renderShowpiece(0);
    }

    function initReducedMotionMode() {
        applyThemeChoice(themeChoice);
        styleStatusDisplay();
        consoleTyping.textContent = tutorialCode;
        readoutNoise.textContent = "0.03";
        readoutFreq.textContent = "0.0";
        readoutFocus.textContent = "SHARP";
        header.style.opacity = "1";
        controlPanel.style.transform = "translate(-50%, 0)";
        controlPanel.style.opacity = "1";
        noiseCanvas.style.opacity = "0";
        gridOverlay.style.opacity = "0";

        introRevealElements.forEach((element) => {
            element.style.opacity = "1";
            element.style.transform = "none";
        });

        revealSections.forEach((section) => {
            const shell = section.querySelector(".section-shell");
            if (!shell) return;
            shell.style.opacity = "1";
            shell.style.transform = "none";
        });

        gsap.set(chapterTwo, { opacity: 1 });
        gsap.set(chapterTwoVeil, { opacity: 0.55 });
        gsap.set(chapterTwoLabel, { opacity: 1, y: 0, filter: "none" });
        gsap.set(chapterTwoLine, {
            opacity: 1,
            xPercent: -50,
            yPercent: -50,
            y: 0,
            filter: "none",
            letterSpacing: "-0.06em",
            rotationX: 0
        });
        gsap.set(chapterTwoIncomingLine, { opacity: 0 });
    }

    buildRfMeter();
    buildSectionSixTutorialReturn();
    styleStatusDisplay();
    logToConsole("> SYSTEM INITIALIZED");
    logToConsole("> LOADING TUTORIAL...");
    gsap.set(knob, { svgOrigin: "742 530", transformOrigin: "50% 50%" });
    gsap.set(controlPanel, { xPercent: -50, yPercent: 150, autoAlpha: 0, pointerEvents: "none" });
    gsap.set(tutorialLayout, { x: 0, y: 0 });
    gsap.set(tutorialColumn, { filter: "blur(0px)" });
    gsap.set(consoleWindow, { filter: "blur(0px)" });
    gsap.set(rfMeterShell, { filter: "blur(0px)" });
    gsap.set(header, { filter: "blur(0px)" });
    gsap.set(chapterTwo, { opacity: 0 });
    gsap.set(chapterTwoLabel, { y: 16 });
    gsap.set(chapterTwoLine, { xPercent: -50, yPercent: -50, y: 16 });
    gsap.set(chapterTwoIncomingLine, { xPercent: -50, yPercent: -50, y: 54, opacity: 0 });
    gsap.set(chapterTwoFreeze, { opacity: 0 });
    gsap.set(chapterTwoFreezeBase, { opacity: 0 });
    setFocusPlane(2);
    applyPhase(phases[0]);
    updateThemeButtons();
    applyThemeChoice(themeChoice);

    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            applyThemeChoice(button.dataset.themeValue, { persist: true });
        });
    });

    systemThemeQuery.addEventListener("change", () => {
        if (themeChoice === "system") {
            applyThemeChoice("system");
        }
    });

    [toggleFocus, toggleJitter, toggleMode, toggleNoise].forEach((toggle) => {
        toggle.addEventListener("change", () => renderShowpiece(scrollProgress));
    });

    depthUp.addEventListener("click", () => {
        setFocusPlane(focusPlaneIndex + 1);
        renderShowpiece(scrollProgress);
    });

    depthDown.addEventListener("click", () => {
        setFocusPlane(focusPlaneIndex - 1);
        renderShowpiece(scrollProgress);
    });

    knob.addEventListener("mouseenter", () => {
        gsap.to(knob, {
            rotation: knobRotation + 360,
            duration: 1.2,
            ease: "power2.out",
            overwrite: true,
            onComplete: () => {
                knobRotation += 360;
            }
        });
    });

    if (prefersReducedMotion) {
        initReducedMotionMode();
        return;
    }

    initShowpieceControls();
    resizeNoise();
    renderNoise();
    runIntroSequence();
    createShowpieceTimeline();
    ScrollTrigger.create({
        start: () => (showpieceTrigger ? showpieceTrigger.end + 1 : showpieceSection.offsetTop + window.innerHeight),
        end: "max",
        onEnter: () => setModeClass("dark"),
        onEnterBack: () => setModeClass("dark"),
        onLeaveBack: () => applyThemeChoice(themeChoice)
    });
    createSectionReveals();

    window.addEventListener("resize", () => {
        resizeNoise();
        if (chapterTwoActive) {
            captureChapterTwoFreeze();
        }
        ScrollTrigger.refresh();
    });

    prefersReducedMotionQuery.addEventListener("change", () => {
        window.location.reload();
    });

    window.addEventListener("beforeunload", () => {
        if (noiseFrame) {
            window.cancelAnimationFrame(noiseFrame);
        }
        if (smoother) {
            smoother.kill();
        }
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    });
});
