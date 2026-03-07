document.addEventListener("DOMContentLoaded", () => {
    if (!window.gsap) {
        console.error("GSAP failed to load.");
        return;
    }

    const { gsap } = window;
    document.body.classList.add("gsap-ready");
    const tutorialTextContainer = document.getElementById("tutorial-text-container");
    const controlPanel = document.getElementById("control-panel");
    const consoleOutput = document.getElementById("console-output");
    const consoleTyping = document.getElementById("console-typing");
    const tutorialLayout = document.querySelector(".tutorial-layout");
    const tutorialColumn = document.querySelector(".tutorial-column");
    const consoleColumn = document.querySelector(".console-column");
    const consoleWindow = document.getElementById("main-console");
    const rfMeterShell = document.querySelector(".rf-meter-shell");
    const readoutNoise = document.querySelector("#readout-noise .value");
    const readoutFreq = document.querySelector("#readout-frequency .value");
    const readoutFocus = document.querySelector("#readout-focus .value");
    const header = document.querySelector(".fixed-header");
    const viewport = document.getElementById("viewport-content");
    const noiseCanvas = document.getElementById("noise-overlay");
    const noiseContext = noiseCanvas.getContext("2d", { alpha: true });
    const gridOverlay = document.getElementById("grid-overlay");
    const knob = document.querySelector("#knob");
    const rfBarsGroup = document.querySelector("#rfMeter .rf-bars");
    const rfPeak = document.querySelector("#rfMeter .rf-peak");
    const statusBezel = document.querySelector(".status-bezel");
    const statusScreen = document.querySelector(".status-screen");
    const statusMarquee = document.getElementById("status-marquee");
    const depthUp = document.getElementById("depth-up");
    const depthDown = document.getElementById("depth-down");
    const introRevealElements = document.querySelectorAll(
        "#main-title, #sub-title, .tutorial-section, .tutorial-step, .tutorial-troubleshoot"
    );

    const toggleFocus = document.getElementById("toggle-focus");
    const toggleJitter = document.getElementById("toggle-jitter");
    const toggleMode = document.getElementById("toggle-grid");
    const toggleNoise = document.getElementById("toggle-noise");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tutorialCode = 'console.log("Hello, world!");';
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

    let scrollProgress = 0;
    let lastLoggedIndex = -1;
    let noiseFrame = 0;
    let noiseWidth = 0;
    let noiseHeight = 0;
    let noiseImage = null;
    let currentPhase = null;
    let lastScrollY = window.scrollY;
    let knobRotation = 0;
    let focusPlaneIndex = 2;
    let currentMode = "dark";
    let lockedMode = null;
    let modeGlitchActive = false;
    let marqueeTween = null;
    let lastScrambleAt = 0;
    const originalTexts = new Map();
    const textElements = tutorialTextContainer.querySelectorAll("h2, h3, h4, p, div.code-snippet, li");
    const textDriftSeeds = new Map();
    let setNoiseOpacity = () => {};
    let setGridOpacity = () => {};
    let setViewportScale = () => {};
    let setHeaderOpacity = () => {};
    let setJitterX = () => {};
    let setJitterY = () => {};

    textElements.forEach((element) => {
        originalTexts.set(element, element.textContent);
        textDriftSeeds.set(element, {
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            speed: 0.55 + Math.random() * 1.2,
            range: 0.6 + Math.random() * 1.1
        });
    });

    const chars = "ABCDEFGHIJKLMN0123456789!@#$%^&*()_+{}[]|;:,.<>?";

    function setModeClass(mode) {
        document.body.classList.remove("mode-light", "mode-dark");
        document.body.classList.add(`mode-${mode}`);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function mapRange(value, start, end) {
        return clamp((value - start) / (end - start), 0, 1);
    }

    function scramble(text, intensity) {
        if (intensity <= 0) return text;
        return text.split("").map((char) => {
            if (char === " " || char === "\n" || Math.random() > intensity) return char;
            return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
    }

    function getPhase(progress) {
        return phases.reduce((active, phase) => {
            return progress >= phase.threshold ? phase : active;
        }, phases[0]);
    }

    function getAutoMode(progress) {
        if (progress < 0.18) return "dark";

        const instability =
            Math.sin(progress * 18) +
            Math.sin(progress * 46) * 0.55 +
            Math.sin(progress * 93) * 0.18;

        if (progress < 0.42) return instability > 0.9 ? "light" : "dark";
        if (progress < 0.78) return instability > 0.05 ? "light" : "dark";
        return instability > 0.55 ? "light" : "dark";
    }

    function applyMode(mode, { glitch = false } = {}) {
        if (currentMode === mode && !glitch) return;

        if (!glitch || modeGlitchActive) {
            currentMode = mode;
            setModeClass(mode);
            return;
        }

        modeGlitchActive = true;
        const alternate = mode === "dark" ? "light" : "dark";
        const timeline = gsap.timeline({
            defaults: { ease: "steps(1)" },
            onComplete: () => {
                currentMode = mode;
                setModeClass(mode);
                document.body.classList.remove("mode-glitch");
                gsap.set([document.body, viewport], { clearProps: "opacity,filter" });
                modeGlitchActive = false;
            }
        });

        document.body.classList.add("mode-glitch");
        timeline
            .call(() => setModeClass(alternate))
            .to(document.body, { opacity: 0.92, duration: 0.04 }, 0)
            .call(() => setModeClass(mode))
            .to(viewport, { filter: "contrast(1.12)", duration: 0.05 }, "<")
            .call(() => setModeClass(alternate))
            .to(viewport, { x: "+=2", duration: 0.03, yoyo: true, repeat: 1 }, "<")
            .call(() => setModeClass(mode))
            .to(document.body, { opacity: 1, duration: 0.08 });
    }

    function updateModeState() {
        if (toggleMode.checked) {
            if (!lockedMode) {
                lockedMode = currentMode === "dark" ? "light" : "dark";
                applyMode(lockedMode, { glitch: true });
            } else {
                applyMode(lockedMode, { glitch: false });
            }
            return;
        }

        lockedMode = null;
        const autoMode = getAutoMode(scrollProgress);
        applyMode(autoMode, { glitch: scrollProgress > 0.24 && autoMode !== currentMode });
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

    function styleStatusDisplay() {
        if (!statusBezel || !statusScreen || !statusMarquee) return;
        Object.assign(statusBezel.style, {
            display: "block",
            width: "100%",
            padding: "0.9rem 1rem",
            borderRadius: "22px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02)), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.18))",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -10px 22px rgba(0,0,0,0.12), 0 16px 30px rgba(0,0,0,0.12)"
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

    function initStatusMarquee() {
        if (!statusMarquee) return;
        if (marqueeTween) marqueeTween.kill();
        styleStatusDisplay();
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
        if (!noiseImage) return;

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
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 0.18,
                    ease: "power1.out",
                    overwrite: true
                });
                return;
            }

            const maxX = 3 + driftStrength * 42 * seed.range;
            const maxY = 2 + driftStrength * 26 * seed.range;
            const x = Math.sin(time * (0.45 + seed.speed) + seed.x) * maxX;
            const y = Math.cos(time * (0.3 + seed.speed * 0.8) + seed.y) * maxY;
            const rotate = Math.sin(time * (0.18 + seed.speed * 0.32) + seed.x) * driftStrength * 3.8;

            gsap.to(element, {
                x,
                y,
                rotation: rotate,
                duration: 0.18 + (1 - driftStrength) * 0.28,
                ease: driftStrength > 0.68 ? "steps(2)" : "power1.out",
                overwrite: true
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

        gsap.to(rfPeak, {
            attr: { x1: peakX, x2: peakX },
            duration: 0.18,
            ease: "power1.out",
            overwrite: true
        });
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

        setGridOpacity(scrollProgress > 0.82 ? 1 : 0);
        setNoiseOpacity(Number(noiseOpacity.toFixed(2)));
        const plane = focusPlanes[focusPlaneIndex];
        const tutorialBlur = blurAmount * plane.tutorial;
        const consoleBlur = blurAmount * plane.console;
        const meterBlur = blurAmount * plane.meter;
        const headerBlur = blurAmount * plane.header;
        const panelBlur = blurAmount * plane.panel;

        gsap.to(tutorialColumn, {
            filter: `blur(${tutorialBlur.toFixed(2)}px)`,
            duration: 0.24,
            ease: "power2.out",
            overwrite: "auto"
        });
        gsap.to(consoleWindow, {
            filter: `blur(${consoleBlur.toFixed(2)}px)`,
            duration: 0.24,
            ease: "power2.out",
            overwrite: "auto"
        });
        gsap.to(rfMeterShell, {
            filter: `blur(${meterBlur.toFixed(2)}px)`,
            duration: 0.24,
            ease: "power2.out",
            overwrite: "auto"
        });
        gsap.to(header, {
            filter: `blur(${headerBlur.toFixed(2)}px)`,
            duration: 0.24,
            ease: "power2.out",
            overwrite: "auto"
        });
        gsap.to(controlPanel, {
            filter: `blur(${panelBlur.toFixed(2)}px)`,
            duration: 0.24,
            ease: "power2.out",
            overwrite: "auto"
        });
        updateRfMeter(blurAmount);

        const jitterX = jitterAmount > 0 ? (Math.random() - 0.5) * jitterAmount : 0;
        const jitterY = jitterAmount > 0 ? (Math.random() - 0.5) * jitterAmount * 0.6 : 0;
        setJitterX(Number(jitterX.toFixed(2)));
        setJitterY(Number(jitterY.toFixed(2)));

        setViewportScale(scrollProgress > 0.86 ? 1 - mapRange(scrollProgress, 0.86, 1) * 0.03 : 1);
    }

    function updateReadouts() {
        const blurAmount = getBlurAmount();
        const noiseValue = toggleNoise.checked ? 0.03 : 0.14 + mapRange(scrollProgress, 0, 1) * 0.22;
        const focusValue = toggleFocus.checked ? "SHARP" : (blurAmount < 3 ? "SHARP" : "DRIFT");

        readoutNoise.textContent = noiseValue.toFixed(2);
        readoutFreq.textContent = ((blurAmount / 18) * 10).toFixed(1);
        readoutFocus.textContent = focusValue;

        setHeaderOpacity(scrollProgress > 0.3 ? 1 : 0);
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

        const logIndex = Math.floor(mapRange(scrollProgress, 0.4, 1) * 12);
        if (scrollProgress > 0.4 && logIndex > lastLoggedIndex) {
            logToConsole(
                chaosMessages[Math.floor(Math.random() * chaosMessages.length)],
                Math.random() > 0.45 ? "error" : "system"
            );
            lastLoggedIndex = logIndex;
        }
    }

    function updateControlPanel() {
        gsap.to(controlPanel, {
            xPercent: -50,
            yPercent: scrollProgress > 0.5 ? 0 : 150,
            opacity: scrollProgress > 0.5 ? 1 : 0.9,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true
        });
    }

    function updateKnobRotation() {
        const deltaY = window.scrollY - lastScrollY;
        if (deltaY !== 0) {
            knobRotation += deltaY * 0.18;
            gsap.to(knob, {
                rotation: knobRotation,
                duration: 0.45,
                ease: "power2.out",
                overwrite: true
            });
        }
        lastScrollY = window.scrollY;
    }

    function update() {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
        scrollProgress = clamp(scrollProgress, 0, 1);

        updateKnobRotation();
        updateModeState();
        applyPhase(getPhase(scrollProgress));
        applyChaos();
        updateReadouts();
        updateConsole();
        updateControlPanel();
    }

    function runIntroSequence() {
        const introTl = gsap.timeline();
        introTl
            .from("#main-title", {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power2.out"
            })
            .from("#sub-title", {
                opacity: 0,
                y: 18,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.35")
            .to(".tutorial-section, .tutorial-step, .tutorial-troubleshoot", {
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.12,
                ease: "power1.out"
            }, "-=0.2")
            .set("#main-title", { opacity: 1, clearProps: "transform" });
    }

    buildRfMeter();
    initStatusMarquee();
    window.setTimeout(initStatusMarquee, 120);
    setModeClass("dark");
    applyPhase(phases[0]);
    logToConsole("> SYSTEM INITIALIZED");
    logToConsole("> LOADING TUTORIAL...");

    if (prefersReducedMotion) {
        header.style.opacity = "1";
        controlPanel.style.transform = "translate(-50%, 0)";
        controlPanel.style.opacity = "1";
        noiseCanvas.style.opacity = "0";
        consoleTyping.textContent = tutorialCode;
        introRevealElements.forEach((element) => {
            element.style.opacity = "1";
            element.style.transform = "none";
        });
        readoutNoise.textContent = "0.03";
        readoutFreq.textContent = "0.0";
        readoutFocus.textContent = "SHARP";
        return;
    }

    gsap.set(knob, { svgOrigin: "742 530", transformOrigin: "50% 50%" });
    gsap.set(controlPanel, { xPercent: -50, yPercent: 150, opacity: 0.9 });
    gsap.set(tutorialLayout, { x: 0, y: 0 });
    gsap.set(tutorialColumn, { filter: "blur(0px)" });
    gsap.set(consoleColumn, { filter: "blur(0px)" });
    gsap.set(consoleWindow, { filter: "blur(0px)" });
    gsap.set(rfMeterShell, { filter: "blur(0px)" });
    gsap.set(header, { filter: "blur(0px)" });

    setNoiseOpacity = gsap.quickTo(noiseCanvas, "opacity", { duration: 0.22, ease: "power2.out" });
    setGridOpacity = gsap.quickTo(gridOverlay, "opacity", { duration: 0.24, ease: "power2.out" });
    setViewportScale = gsap.quickTo(viewport, "scale", { duration: 0.45, ease: "power2.out" });
    setHeaderOpacity = gsap.quickTo(header, "opacity", { duration: 0.35, ease: "power2.out" });
    setJitterX = gsap.quickTo(tutorialLayout, "x", { duration: 0.08, ease: "none" });
    setJitterY = gsap.quickTo(tutorialLayout, "y", { duration: 0.08, ease: "none" });

    setFocusPlane(2);
    resizeNoise();
    runIntroSequence();
    renderNoise();
    update();

    [toggleFocus, toggleJitter, toggleMode, toggleNoise].forEach((toggle) => {
        toggle.addEventListener("change", update);
    });

    gsap.ticker.add(update);

    depthUp.addEventListener("click", () => {
        setFocusPlane(focusPlaneIndex + 1);
        update();
    });

    depthDown.addEventListener("click", () => {
        setFocusPlane(focusPlaneIndex - 1);
        update();
    });

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => {
        resizeNoise();
        initStatusMarquee();
        update();
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

    window.addEventListener("beforeunload", () => {
        gsap.ticker.remove(update);
        window.cancelAnimationFrame(noiseFrame);
    });
});
