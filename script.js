
		const heroModelCanvas = document.getElementById("heroModelCanvas");

		if (heroModelCanvas) {
			
// MODEL + LABELS 
	const heroModelScene =
    	document.getElementById("heroModelScene");

	const heroModelLabels =
    	document.getElementById("heroModelLabels");


// INFOGRAPHIC SIZE SETTINGS
const INFOGRAPHIC_SETTINGS = {

    assetPath: "./Neighbourhood_Model/Infographic.png",
    referenceSize: {
        width: 7440,
        height: 6520
    },

    camera: {
    	orthoSize: 2.9,
    	easeLambda: 12,
    	startPosition: [20, 20, 20],
        startTarget: [0, 0, 0],
        startZoom: 1
    },

    placement: {
        baseOffsetX: 120,
        baseOffsetY: 40,
        panPerLookX: 140,
        panPerLookZ: 0.62,
        panPerLookY: 0.35
    },

    labelPadding: 16
};


// VIEWPORT

	let viewportWidth = 1;
	let viewportHeight = 1;

	let sceneScale = 1;

	let sceneOffsetX = 0;
	let sceneOffsetY = 0;

	let cameraAspect =
		INFOGRAPHIC_SETTINGS.referenceSize.width /
		INFOGRAPHIC_SETTINGS.referenceSize.height;


// VECTORS FOR LABEL POSITIONS

	function vec3(x = 0, y = 0, z = 0) {
		return { x, y, z };
	}

	function vecSub(a, b) {
		return vec3(
			a.x - b.x,
			a.y - b.y,
			a.z - b.z
		);
	}

	function vecDot(a, b) {
		return (
			a.x * b.x +
			a.y * b.y +
			a.z * b.z
		);
	}

	function vecCross(a, b) {
		return vec3(
			a.y * b.z - a.z * b.y,
			a.z * b.x - a.x * b.z,
			a.x * b.y - a.y * b.x
		);
	}

	function vecLength(v) {
		return Math.hypot(
			v.x,
			v.y,
			v.z
		);
	}

	function vecNormalize(v) {
		const len = vecLength(v);
		if (len < 1e-6) {
			return vec3(0, 0, 0);
		}

		return vec3(
			v.x / len,
			v.y / len,
			v.z / len
		);
	}

	function vecLerp(current, target, t) {
		current.x +=
			(target.x - current.x) * t;
		current.y +=
			(target.y - current.y) * t;
		current.z +=
			(target.z - current.z) * t;
	}


// INFOGRAPHIC BASE

	const infographicImage =
		document.createElement("img");

	infographicImage.className =
		"hero__model-infographic";

	infographicImage.src =
		INFOGRAPHIC_SETTINGS.assetPath;

	infographicImage.alt = "";

	infographicImage.decoding = "async";

	infographicImage.draggable = false;

	infographicImage.width =
		INFOGRAPHIC_SETTINGS.referenceSize.width;

	infographicImage.height =
		INFOGRAPHIC_SETTINGS.referenceSize.height;

	heroModelScene.appendChild(
		infographicImage
	);


// HIGHLIGHTS
	const HIGHLIGHT_ASSETS = {

		"house.svg": {
			src:
				"./Neighbourhood_Model/Highlights/Step1_(House).svg",
				x: -7240,
				y: 7463, 
				width: 258
		},

		"buildingtype.svg": {
			src:
				"./Neighbourhood_Model/Highlights/BuildingType_Highlight.svg",
				x: 575,
				y: 2850,
				width: 3055
		},

		"parking.svg": {
			src:
				"./Neighbourhood_Model/Highlights/Step4_Parking.svg",
				x: 4107,
				y: 3023,
				width: 1795
		},

		"electricity.svg": {
			src:
				"./Neighbourhood_Model/Highlights/Step5_Electricity.svg",
				x: 3150,
				y: -150,
				width: 3750

		},

		"greenarea.svg": {
			src:
				"./Neighbourhood_Model/Highlights/Step5_GreenArea.svg",
			x: 1960,
			y: 3188,
			width: 1810

		}
	};

	Object.entries(HIGHLIGHT_ASSETS)
		.forEach(([id, cfg]) => {
			const img =
				document.createElement("img");
			img.id = id;
			img.className =
				"hero__model-highlight building-highlight";
			img.src = cfg.src;
			img.alt = "";
			img.decoding = "async";
			img.draggable = false;

			img.style.left = `${cfg.x}px`;
			img.style.top = `${cfg.y}px`;
			img.style.width = `${cfg.width}px`;
			img.style.height = "auto";

			heroModelScene.appendChild(img);
		});


	function updateHighlights(active = []) {

		document
			.querySelectorAll(".building-highlight")
			.forEach((el) => {

				const isActive =
					active.includes(el.id);

				el.classList.toggle(
					"is-highlighted",
					isActive
				);

				el.style.opacity =
					isActive ? "1" : "0";

				el.style.display =
					isActive ? "block" : "none";
			});
	}


// CAMERA SHOTS
	const CAMERA_SHOTS = [

	// Step 0 — Overview
		{
			position: [20, 20, 20],
			target: [-14, 0, -7],
			zoom: 1.1
		},

	// Step 1 — House (camera 1)
		{
			position: [20, 20, 20],
			target: [-80, -80, -3.9],
			zoom: 4.5
		},

	// Step 2 — Overview 
		{
			position: [20, 20, 20],
			target: [-14, 0, -7],
			zoom: 1
		},

	// Step 3 — Density / Building Components & Construction
		{
			position: [20, 20, 20],
			target: [-14, 0, -7],
			zoom: 1
		},

	// Step 4 — Street & Parking Areas / Underground Parking
		{
			position: [20, 20, 20],
			target: [2, -10, -2],
			zoom: 1.1
		},
	//Step 5 — Electricity / Pipe & Utility Lines / Space Heating & Warm Water
		{
			position: [20, 20, 20],
			target: [10, 30, 2],
			zoom: 1.5
		}, //position: [20, 20, 20],
			//target: [10, 30, 2],
			//zoom: 1.5


	//Step 6 — Green Space & Unbuilt Area
		{
			position: [20, 20, 20],
			target: [-10, -10, -2],
			zoom: 1.5
		},

	//Step 7 — Summary overview (all layers visible)

		{
			position: [20, 20, 20],
			target: [-8, 10, -7],
			zoom: 0.7
		},

	//Step 8 — Return to overview
		{
			position: [20, 20, 20],
			target: [0, 0, 0],
			zoom: 1.1
		},

	// Step 9 —  Overview
		{
			position: [20, 20, 20],
			target: [-14, 0, -7],
			zoom: 1.1
		},

	//Step 10 —  Overview
		{
			position: [20, 20, 20],
			target: [0, 0, 0],
			zoom: 6
		},

	//Step 11 — Concept intro bridge (before PNG models appear)
		{
			position: [20, 20, 20],
			target: [-20, -43, -8],
			zoom: 1.9
		}
	];

// CAMERA
	const cameraPositionCurrent =
		vec3(20, 20, 20);

	const cameraPositionTarget =
		vec3(20, 20, 20);

	const cameraLookAtCurrent =
		vec3(0, 0, 0);

	const cameraLookAtTarget =
		vec3(0, 0, 0);

	let cameraZoomCurrent =
		INFOGRAPHIC_SETTINGS.camera.startZoom;

	let cameraZoomTarget =
		INFOGRAPHIC_SETTINGS.camera.startZoom;

	const cameraEaseLambda =
		INFOGRAPHIC_SETTINGS.camera.easeLambda;




	cameraPositionCurrent.x =
		INFOGRAPHIC_SETTINGS.camera.startPosition[0];

	cameraPositionCurrent.y =
		INFOGRAPHIC_SETTINGS.camera.startPosition[1];

	cameraPositionCurrent.z =
		INFOGRAPHIC_SETTINGS.camera.startPosition[2];

	cameraPositionTarget.x =
		INFOGRAPHIC_SETTINGS.camera.startPosition[0];

	cameraPositionTarget.y =
		INFOGRAPHIC_SETTINGS.camera.startPosition[1];

	cameraPositionTarget.z =
		INFOGRAPHIC_SETTINGS.camera.startPosition[2];

	cameraLookAtCurrent.x =
		INFOGRAPHIC_SETTINGS.camera.startTarget[0];

	cameraLookAtCurrent.y =
		INFOGRAPHIC_SETTINGS.camera.startTarget[1];

	cameraLookAtCurrent.z =
		INFOGRAPHIC_SETTINGS.camera.startTarget[2];

	cameraLookAtTarget.x =
		INFOGRAPHIC_SETTINGS.camera.startTarget[0];

	cameraLookAtTarget.y =
		INFOGRAPHIC_SETTINGS.camera.startTarget[1];

	cameraLookAtTarget.z =
		INFOGRAPHIC_SETTINGS.camera.startTarget[2];


// CAMERA POSITIONS
	window.setIntroCamera = (index) => {

		const shot = CAMERA_SHOTS[index];

		if (!shot) return;

		cameraPositionTarget.x =
			shot.position[0];

		cameraPositionTarget.y =
			shot.position[1];

		cameraPositionTarget.z =
			shot.position[2];

		cameraLookAtTarget.x =
			shot.target[0];

		cameraLookAtTarget.y =
			shot.target[1];

		cameraLookAtTarget.z =
			shot.target[2];

		cameraZoomTarget =
			shot.zoom;
	};


// CAMERA EASING
	let lastFrameTime =
		performance.now();

	function updateCameraEasing() {
		const now =
			performance.now();

		const delta =
			Math.min(
				(now - lastFrameTime) / 1000,
				0.1
			);

		lastFrameTime = now;
		const ease =
			1 -
			Math.exp(
				-cameraEaseLambda * delta
			);

		vecLerp(
			cameraPositionCurrent,
			cameraPositionTarget,
			ease
		);

		vecLerp(
			cameraLookAtCurrent,
			cameraLookAtTarget,
			ease
		);

		cameraZoomCurrent +=
			(
				cameraZoomTarget -
				cameraZoomCurrent
			) * ease;
	}


// LABELS
	const stepFeatures = [

		null,
		{
			highlight: ["house.svg"]
		},

		null,
		{
			labels: [
				{
					svg: "./svgs/Labels/building_components.svg",
					anchor: [5.1, 11.25, 8]
				},
				{
					svg: "./svgs/Labels/Density.svg",
					anchor: [6, 12.4, 8]
				}
			],

			highlight: ["buildingtype.svg"]
		},

		{
			labels: [
				{
					svg: "./svgs/Labels/Street_&_Parking Areas.svg",
					anchor: [10.8, 5.2, 8]
				},
				{
					svg: "./svgs/Labels/Underground_Parking.svg",
					anchor: [12.2, 4.2, 8]
				}
			],

			highlight: ["parking.svg"]
		},

		{
			labels: [
				{
					svg: "./svgs/Labels/Electricity.svg",
					anchor: [14.1, 27.15, 8]
				},
				{
					svg: "./svgs/Labels/Pipe_& Utility_Lines.svg",
					anchor: [13, 26.85, 8]
				},
				{
					svg: "./svgs/Labels/Heating.svg",
					anchor: [14.8, 25.9, 8]
				}
			],

			highlight: ["electricity.svg"]
		},

		{
			labels: [
				{
					svg: "./svgs/Labels/Green_Space.svg",
					anchor: [-6.2, -6.6, 0]
				}
			],

			highlight: ["greenarea.svg"]
		},

		{
			labels: [

				{
					svg: "./svgs/Labels/0Building.svg",
					anchor: [3.3, 14.2, 0]
				},

				{
					svg: "./svgs/Labels/0Heating_Density.svg",
					anchor: [-0.55, 13.5, 0]
				},

				{
					svg: "./svgs/Labels/0Street.svg",
					anchor: [3.3, 13.4, 0]
				},

				{
					svg: "./svgs/Labels/0UndergroundParking.svg",
					anchor: [3.65, 12.83, 0]
				},

				{
					svg: "./svgs/Labels/0Electricity.svg",
					anchor: [2.65, 14.9, 0]
				},

				{
					svg: "./svgs/Labels/0Pipeline.svg",
					anchor: [3.4, 12, 0]
				},

				{
					svg: "./svgs/Labels/0Green_Space.svg",
					anchor: [1.95, 11.75, 0]
				}
			]
		}
	];


const labelElementCache =
    new Map();

let activeLabelEntries = [];


function getLabelElement(svgPath) {

    if (
        labelElementCache.has(svgPath)
    ) {
        return labelElementCache.get(
            svgPath
        );
    }

    const el =
        document.createElement("div");

    el.className =
        "hero__model-label";

    const img =
        document.createElement("img");

    img.src = svgPath;

    img.alt = "";

    img.decoding = "async";

    img.draggable = false;

    el.appendChild(img);

    heroModelLabels.appendChild(el);

    labelElementCache.set(
        svgPath,
        el
    );

    return el;
}


function setActiveLabels(labelConfigs) {

    labelElementCache.forEach(
        (el) => {
            el.classList.remove(
                "is-visible"
            );
        }
    );

    activeLabelEntries =
        labelConfigs.map((cfg) => {

            const el =
                getLabelElement(
                    cfg.svg
                );

            el.classList.add(
                "is-visible"
            );

            return {
                el,
                anchor: cfg.anchor
            };
        });

    requestAnimationFrame(
        updateStepLabels
    );
}


let currentFeatureIndex = -1;

window.setIntroFeature = (index) => {
    if (
        index === currentFeatureIndex
    ) {
        return;
    }

    currentFeatureIndex = index;
    const feature =
        stepFeatures[index];

    updateHighlights(
        (feature &&
            feature.highlight) ||
        []
    );

    if (
        feature &&
        feature.summary
    ) {

        const allLabels =
            stepFeatures
                .filter(
                    (f) =>
                        f &&
                        !f.summary
                )
                .flatMap(
                    (f) =>
                        f.labels || []
                );

        setActiveLabels(
            allLabels
        );

        return;
    }

    if (feature) {

        setActiveLabels(
            feature.labels || []
        );

    } else {

        setActiveLabels([]);
    }
};


function projectAnchorToReference(anchor) {

    const worldPoint =
        vec3(
            anchor[0],
            anchor[1],
            anchor[2]
        );

    const forward =
        vecNormalize(
            vecSub(
                cameraLookAtCurrent,
                cameraPositionCurrent
            )
        );

    let right =
        vecNormalize(
            vecCross(
                forward,
                vec3(0, 1, 0)
            )
        );

    if (
        vecLength(right) < 1e-6
    ) {
        right = vec3(1, 0, 0);
    }

    const up =
        vecNormalize(
            vecCross(
                right,
                forward
            )
        );

    const toPoint =
        vecSub(
            worldPoint,
            cameraPositionCurrent
        );

    const xCamera =
        vecDot(
            toPoint,
            right
        );

    const yCamera =
        vecDot(
            toPoint,
            up
        );

    const safeZoom =
        Math.max(
            0.01,
            cameraZoomCurrent
        );

	// FIXED VIEWPOINT
    const referenceWidth =
        INFOGRAPHIC_SETTINGS.referenceSize.width;

    const referenceHeight =
        INFOGRAPHIC_SETTINGS.referenceSize.height;

    const referenceAspect =
        referenceWidth /
        referenceHeight;

    const halfHeight =
        INFOGRAPHIC_SETTINGS.camera.orthoSize /
        safeZoom;

    const halfWidth =
        halfHeight *
        referenceAspect;

    const ndcX =
        xCamera / halfWidth;

    const ndcY =
        yCamera / halfHeight;

    return {
        x:
            (
                ndcX * 0.5 +
                0.5
            ) * referenceWidth,

        y:
            (
                -ndcY * 0.5 +
                0.5
            ) * referenceHeight
    };
}


function updateSceneViewport() {

    viewportWidth =
        heroModelCanvas.clientWidth ||
        window.innerWidth;

    viewportHeight =
        heroModelCanvas.clientHeight ||
        window.innerHeight;

    const referenceWidth =
        INFOGRAPHIC_SETTINGS.referenceSize.width;

    const referenceHeight =
        INFOGRAPHIC_SETTINGS.referenceSize.height;


    const fitScale =
        Math.max(
            viewportWidth / referenceWidth,
            viewportHeight / referenceHeight
        );


    sceneScale =
        fitScale;

    sceneOffsetX =
        Math.round(
            (
                viewportWidth -
                referenceWidth *
                sceneScale
            ) / 2
        );

    sceneOffsetY =
        Math.round(
            (
                viewportHeight -
                referenceHeight *
                sceneScale
            ) / 2
        );

    cameraAspect =
        referenceWidth /
        referenceHeight;
}

function updateInfographicTransform() {

    const zoom =
        Math.max(
            0.01,
            cameraZoomCurrent
        );

    const panX =
        INFOGRAPHIC_SETTINGS.placement.baseOffsetX -
        cameraLookAtCurrent.x *
        INFOGRAPHIC_SETTINGS.placement.panPerLookX;

    const panY =
        INFOGRAPHIC_SETTINGS.placement.baseOffsetY +

        cameraLookAtCurrent.z *
        INFOGRAPHIC_SETTINGS.placement.panPerLookX *
        INFOGRAPHIC_SETTINGS.placement.panPerLookZ +

        cameraLookAtCurrent.y *
        INFOGRAPHIC_SETTINGS.placement.panPerLookX *
        INFOGRAPHIC_SETTINGS.placement.panPerLookY;


    const transform = `
        translate3d(
            ${sceneOffsetX}px,
            ${sceneOffsetY}px,
            0
        )
        scale(
            ${sceneScale}
        )
    `;

    heroModelScene.style.transform =
        transform;


    const artworkTransform = `
        translate3d(
            ${Math.round(panX)}px,
            ${Math.round(panY)}px,
            0
        )
        scale(
            ${zoom}
        )
    `;

    infographicImage.style.transform =
        artworkTransform;

    document
        .querySelectorAll(
            ".building-highlight"
        )
        .forEach((el) => {

            el.style.transform =
                artworkTransform;
        });
}


/* =========================================================
   UPDATE LABEL POSITIONS
   ========================================================= */

function updateStepLabels() {

    if (
        !activeLabelEntries.length
    ) {
        return;
    }

    const referenceWidth =
        INFOGRAPHIC_SETTINGS.referenceSize.width;

    const referenceHeight =
        INFOGRAPHIC_SETTINGS.referenceSize.height;

    activeLabelEntries.forEach(
        ({ el, anchor }) => {

            const projected =
                projectAnchorToReference(
                    anchor
                );

            const labelW =
                el.offsetWidth || 0;

            const labelH =
                el.offsetHeight || 0;

            const halfW =
                labelW / 2;

            const halfH =
                labelH / 2;

            const padding =
                INFOGRAPHIC_SETTINGS.labelPadding;


        
            const clampedX =
                Math.max(
                    padding + halfW,

                    Math.min(
                        referenceWidth -
                            padding -
                            halfW,

                        projected.x
                    )
                );

            const clampedY =
                Math.max(
                    padding + halfH,

                    Math.min(
                        referenceHeight -
                            padding -
                            halfH,

                        projected.y
                    )
                );

            const x =
                Math.round(
                    clampedX -
                    halfW
                );

            const y =
                Math.round(
                    clampedY -
                    halfH
                );


            el.style.transform =
                `translate3d(${x}px, ${y}px, 0)`;
        }
    );
}


//RESIZE

function resizeRenderer() {

    updateSceneViewport();

    updateInfographicTransform();

    updateStepLabels();
}


// RESIZE OBSERVER

const modelResizeObserver =
    new ResizeObserver(() => {

        resizeRenderer();
    });

modelResizeObserver.observe(
    heroModelCanvas
);


// ASSET LOADING

function waitForImage(img) {

    if (img.complete) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {

        img.addEventListener(
            "load",
            resolve,
            { once: true }
        );

        img.addEventListener(
            "error",
            resolve,
            { once: true }
        );
    });
}


async function initializeModel() {

    await waitForImage(
        infographicImage
    );

    const highlights =
        Array.from(
            document.querySelectorAll(
                ".building-highlight"
            )
        );

    await Promise.all(
        highlights.map(
            waitForImage
        )
    );
		updateSceneViewport();
		updateInfographicTransform();
		updateStepLabels();
	}

	function animate() {
			updateCameraEasing();
			updateInfographicTransform();
			updateStepLabels();
			requestAnimationFrame(
				animate
			);
	}



/* =========================================================
   START
   ========================================================= */

		window.setIntroCamera(0);
		window.setIntroFeature(0);
		resizeRenderer();
		initializeModel();
		animate();
		}




//MENU

	const dropdown = document.getElementById("headerDropdown");
	const button = dropdown.querySelector(".Dropdownbutton");
	const menuTitle = document.getElementById("menuTitle");
	const menuGroupLinks = Array.from(document.querySelectorAll("[data-menu-group-link]"));
	const menuItemLinks = Array.from(document.querySelectorAll("[data-menu-item]"));
	const conceptStepItemMap = ["modular-approach", "modular-approach", "key-factors"];
	const compareStepItemMap = ["case-0", "case-1", "case-1", "case-1", "case-1"];

	function setMenuOpenState(isOpen) {
		dropdown.classList.toggle("open", isOpen);
		document.body.classList.toggle("menu-open", isOpen);
	}

	function scrollToSectionStart(groupKey) {
		if (groupKey === "introduction") {
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
			window.scrollTo(0, 0);
			return true;
		}

		if (groupKey === "concept" && conceptSection) {
			const y = Math.max(0, Math.round(conceptSection.getBoundingClientRect().top + window.pageYOffset));
			document.documentElement.scrollTop = y;
			document.body.scrollTop = y;
			window.scrollTo(0, y);
			return true;
		}

		if (groupKey === "compare" && compareSection) {
			const y = Math.max(0, Math.round(compareSection.getBoundingClientRect().top + window.pageYOffset));
			document.documentElement.scrollTop = y;
			document.body.scrollTop = y;
			window.scrollTo(0, y);
			return true;
		}

		return false;
	}

	function updateMenuHighlight() {
		let activeGroup = "introduction";
		let activeItem = "system-boundaries";

		const compareTop = compareSection.getBoundingClientRect().top;
		const conceptTop = conceptSection.getBoundingClientRect().top;
		if (compareTop <= 0) {
			activeGroup = "compare";
			activeItem = compareStepItemMap[currentCompareStepIndex] || "case-1";
		} else if (conceptTop <= 0) {
			activeGroup = "concept";
			activeItem = conceptStepItemMap[currentConceptStepIndex] || "key-factors";
		}

		menuGroupLinks.forEach((link) => {
			link.classList.toggle("is-active", link.dataset.menuGroupLink === activeGroup);
		});

		menuItemLinks.forEach((link) => {
			link.classList.toggle("is-active", link.dataset.menuItem === activeItem);
		});

		const activeGroupLink = menuGroupLinks.find((link) => link.dataset.menuGroupLink === activeGroup);
		if (activeGroupLink) {
			menuTitle.textContent = activeGroupLink.textContent.trim();
		}
	}

	button.addEventListener("click", () => {
		setMenuOpenState(!dropdown.classList.contains("open"));
	});

	dropdown.addEventListener("click", (e) => {
    	const item = e.target.closest(".Chapters a");
    	if (!item) return;

		if (item.dataset.menuGroupLink) {
			const didScroll = scrollToSectionStart(item.dataset.menuGroupLink);
			if (didScroll) {
				e.preventDefault();
			}
			menuTitle.textContent = item.textContent.trim();
		}
	    	setMenuOpenState(false);
	});

	document.addEventListener("click", (e) => {
   		if (!dropdown.contains(e.target)) {
	        	setMenuOpenState(false);
    	}
	});

	const main = d3.select("main");
	const introScrolly = main.select("#infographic");
	const introArticle = introScrolly.select("article");
	const introStep = introArticle.selectAll(".step");

	const conceptScrolly = main.select("#content");
	const conceptArticle = conceptScrolly.select("article");
	const conceptStep = conceptArticle.selectAll(".step");

	const compareScrolly = main.select("#compare");
	const compareArticle = compareScrolly.select("article");
	const compareStep = compareArticle.selectAll(".step");

	const heroVisualShell = document.querySelector(".hero__visual-shell");
	const introSection = document.getElementById("infographic");
	const conceptSection = document.getElementById("content");
	const compareSection = document.getElementById("compare");

// SCROLLBAR
	const progressThumb = document.getElementById("chapterProgressThumb");

// MODELS
	const models = [
		document.getElementById("model-0"),
		document.getElementById("model-1"),
		document.getElementById("model-2"),
		document.getElementById("model-3"),
		document.getElementById("model-4"),
		document.getElementById("model-5"),
		document.getElementById("model-6"),
		document.getElementById("model-7"),
		document.getElementById("model-8"),
		document.getElementById("model-9"),
		document.getElementById("model-10"),
		document.getElementById("model-11"),
		document.getElementById("model-12"),
		document.getElementById("model-13"),
		document.getElementById("model-14"),
		document.getElementById("model-15"),
		document.getElementById("model-16"),
		document.getElementById("model-17"),

	].filter(Boolean);
	const neighborhoodModels = Array.from(document.querySelectorAll(".neighborhood-model"));
	const factorOverviewTriggers = [
		document.getElementById("factorOverviewTriggerA"),
		document.getElementById("factorOverviewTriggerB"),
	].filter(Boolean);
	const factorOverviewModal = document.getElementById("factorOverviewModal");
	const factorModalClose = document.getElementById("factorModalClose");
	const factorModalBody = factorOverviewModal ? factorOverviewModal.querySelector(".factor-modal-body") : null;

// SCROLLAMA
	const introScroller = scrollama();
	const conceptScroller = scrollama();
	const compareScroller = scrollama();
	const introFadeStart = 0.01;
	const introFadeEnd = 0.62;
	const CONCEPT_PART1_PROGRESS = 0;
	const CONCEPT_PART2_PROGRESS = 0.56;
	const CONCEPT_PART3_PROGRESS = 0.8;
	const CONCEPT_PART4_PROGRESS = 0.92;

	const COMPARE_MODEL_START_INDEX = 13;
	const CONCEPT_INTRO_CAMERA_STEP = 11;
	// Keep the first infographic step on the same framing as landing.
	// Then continue model progression from the next shot.
	const INTRO_MODEL_STEP_OFFSET = 1;
	const INTRO_FIRST_PARAGRAPH_CAMERA_PROGRESS = introFadeEnd;

	let currentConceptStepIndex = 0;
	let currentCompareStepIndex = 0;
	let currentIntroOpacity = 1;
	let currentIntroTextVisible = false;
	let introProgressOrigin = null;
	let currentIntroCameraIndex = -1;
	let conceptSectionActive = false;

	function syncIntroCamera(index, progress = 1) {
		let modelIndex = index + INTRO_MODEL_STEP_OFFSET;
		if (index === 0 && window.scrollY <= 2) {
			modelIndex = 0;
		}

		const featureIndex = modelIndex;

		if (modelIndex !== currentIntroCameraIndex && typeof window.setIntroCamera === "function") {
			window.setIntroCamera(modelIndex);
			currentIntroCameraIndex = modelIndex;
		}
		if (typeof window.setIntroFeature === "function") {
			window.setIntroFeature(featureIndex);
		}
	}

	function syncMenuState() {
		updateMenuVisibility();
		updateMenuHighlight();
	}

	function setActiveStep(stepSelection, index) {
		stepSelection.classed("is-active", (d, i) => i === index);
	}

	function resetIntroFlowState() {
		resetFlowState(introStep);
	}

	function updateIntroFlowFromProgress(stepEl, progress) {
		if (!stepEl) return;
		if (!stepEl.querySelector(".step-flow")) return;

		stepEl.classList.add("concept-title-visible");
		stepEl.classList.toggle("concept-part1-visible", progress >= 0);
		stepEl.classList.toggle("concept-part2-visible", progress >= CONCEPT_PART2_PROGRESS);
		stepEl.classList.toggle("concept-part3-visible", progress >= CONCEPT_PART3_PROGRESS);
		stepEl.classList.toggle("concept-part4-visible", progress >= CONCEPT_PART4_PROGRESS);
	}

	function resetFlowState(stepSelection) {
		stepSelection.each(function () {
			this.classList.remove("concept-title-visible", "concept-part1-visible", "concept-part2-visible", "concept-part3-visible", "concept-part4-visible");
		});
	}

	function resetConceptFlowState() {
		resetFlowState(conceptStep);
	}

	function clearConceptStepFlowState(stepEl) {
		if (!stepEl) return;
		stepEl.classList.remove("concept-title-visible", "concept-part1-visible", "concept-part2-visible", "concept-part3-visible", "concept-part4-visible");
	}

	function resetCompareFlowState() {
		resetFlowState(compareStep);
	}

	function updateConceptFlowFromProgress(stepEl, progress) {
		if (!stepEl) return;
		if (!stepEl.querySelector(".concept-flow")) return;

		stepEl.classList.add("concept-title-visible");
		stepEl.classList.toggle("concept-part1-visible", progress >= CONCEPT_PART1_PROGRESS);
		stepEl.classList.toggle("concept-part2-visible", progress >= CONCEPT_PART2_PROGRESS);
		stepEl.classList.toggle("concept-part3-visible", progress >= CONCEPT_PART3_PROGRESS);
		stepEl.classList.toggle("concept-part4-visible", progress >= CONCEPT_PART4_PROGRESS);
	}

	function setConceptModelState(index, progress = 0) {
		const primaryIndex = Math.max(1, Math.min(index, models.length - 1));

		models.forEach((model) => {
			model.classList.remove("active");
			model.style.opacity = "";
		});

		if (index === 0) {
			return;
		}

		if (models[primaryIndex]) {
			models[primaryIndex].classList.add("active");
		}
	}

	function setConceptCasesReveal(index, progress = 0) {
		for (let modelIndex = 5; modelIndex <= 9; modelIndex += 1) {
			const model = document.getElementById(`model-${modelIndex}`);
			if (!model) continue;
			const casesNode = model.querySelector(".factor-panel__cases");
			if (!casesNode) continue;
			const revealForActiveStep = modelIndex === index && progress >= CONCEPT_PART2_PROGRESS;
			casesNode.classList.toggle("is-revealed", revealForActiveStep);
		}
	}

	function setCompareModelState(index) {
		const compareModelIndex = Math.min(COMPARE_MODEL_START_INDEX + index, 17);

		models.forEach((model) => {
			model.classList.remove("active");
			model.style.opacity = "";
		});

		if (models[compareModelIndex]) {
			models[compareModelIndex].classList.add("active");
		}

		setConceptCasesReveal(-1, 0);
	}

	function openFactorOverviewModal() {
		if (!factorOverviewModal) return;
		factorOverviewModal.classList.add("active");
		factorOverviewModal.setAttribute("aria-hidden", "false");
		if (factorModalBody) {
			factorModalBody.scrollTop = 0;
		}
	}

	function closeFactorOverviewModal() {
		if (!factorOverviewModal) return;
		factorOverviewModal.classList.remove("active");
		factorOverviewModal.setAttribute("aria-hidden", "true");
	}

	factorOverviewTriggers.forEach((trigger) => {
		trigger.addEventListener("click", () => {
			const isOpen = factorOverviewModal ? factorOverviewModal.classList.contains("active") : false;
			if (isOpen) {
				closeFactorOverviewModal();
			} else {
				openFactorOverviewModal();
			}
		});
	});

	if (factorModalClose) {
		factorModalClose.addEventListener("click", closeFactorOverviewModal);
	}

	if (factorOverviewModal) {
		factorOverviewModal.addEventListener("click", (event) => {
			if (event.target === factorOverviewModal) {
				closeFactorOverviewModal();
			}
		});
	}

	function handleIntroStepEnter(response) {
		const index = response.index;
		syncIntroCamera(index, 0);
		conceptSectionActive = false;

		resetIntroFlowState();
		setActiveStep(introStep, index);
		updateIntroFlowFromProgress(response.element, index === 0 ? -1 : 0);
		if (index > 0) {
			currentIntroOpacity = 0;
			currentIntroTextVisible = true;
			introProgressOrigin = null;
			document.documentElement.style.setProperty("--intro-hero-opacity", "0");
		} else {
			currentIntroOpacity = 1;
			currentIntroTextVisible = false;
			introProgressOrigin = null;
			document.documentElement.style.setProperty("--intro-hero-opacity", "1");
		}
		syncMenuState();
	}

	function updateIntroOverlayFade(response) {
		// Link landing-page fade to Scrollama progress on the first intro step.
		if (response.index > 0) {
			currentIntroOpacity = 0;
			introProgressOrigin = null;
			document.documentElement.style.setProperty("--intro-hero-opacity", "0");
			return;
		}

		if (window.scrollY <= 2) {
			introProgressOrigin = response.progress;
			currentIntroOpacity = 1;
			document.documentElement.style.setProperty("--intro-hero-opacity", "1");
			return;
		}

		if (introProgressOrigin === null) {
			introProgressOrigin = response.progress;
		}

		const calibratedProgress = Math.max(0, response.progress - introProgressOrigin);

		const normalized = (calibratedProgress - introFadeStart) / (introFadeEnd - introFadeStart);
		const clamped = Math.max(0, Math.min(1, normalized));
		const opacity = 1 - clamped;

		currentIntroOpacity = opacity;
		document.documentElement.style.setProperty("--intro-hero-opacity", opacity.toFixed(3));
	}

	function handleIntroStepProgress(response) {
		syncIntroCamera(response.index, response.progress);
		updateHeroVisualFromScroll(response);
		updateIntroOverlayFade(response);

		let introTextProgress = response.progress;
		if (response.index === 0) {
			// Keep intro text hidden until the same delayed point where
			// the first intro camera switch is allowed to happen.
			const normalizedProgress = (response.progress - INTRO_FIRST_PARAGRAPH_CAMERA_PROGRESS) / (1 - INTRO_FIRST_PARAGRAPH_CAMERA_PROGRESS);
			introTextProgress = Math.max(-1, Math.min(1, normalizedProgress));
		}

		currentIntroTextVisible = response.index > 0 || introTextProgress >= CONCEPT_PART1_PROGRESS;
		conceptSectionActive = false;

		setActiveStep(introStep, response.index);

		updateIntroFlowFromProgress(response.element, introTextProgress);
		updateChapterProgress(progressThumb, introStep, response);

		syncMenuState();
	}

	function handleStepEnter(response) {
		const index = response.index;
		currentConceptStepIndex = index;
		currentConceptStepProgress = 0;
		conceptSectionActive = index !== 0;

		setActiveStep(conceptStep, index);
		resetConceptFlowState();
		if (index === 0) {
			if (typeof window.setIntroCamera === "function") {
				window.setIntroCamera(CONCEPT_INTRO_CAMERA_STEP);
				if (typeof window.setIntroFeature === "function") {
					window.setIntroFeature(CONCEPT_INTRO_CAMERA_STEP);
				}
			}
			updateConceptFlowFromProgress(response.element, 0);
			setConceptModelState(index, 0);
		} else {
			updateConceptFlowFromProgress(response.element, 0);
			setConceptModelState(index, 1);
		}

		setConceptCasesReveal(index, 0);

		updateChapterProgress(progressThumb, conceptStep, response);
		syncMenuState();
	}

	function handleStepProgress(response) {
		currentConceptStepIndex = response.index;
		currentConceptStepProgress = response.progress;
		conceptSectionActive = response.index === 0
			? false
			: true;
		if (response.index === 0 && typeof window.setIntroCamera === "function") {
			window.setIntroCamera(CONCEPT_INTRO_CAMERA_STEP);
			if (typeof window.setIntroFeature === "function") {
				window.setIntroFeature(CONCEPT_INTRO_CAMERA_STEP);
			}
		}
		setActiveStep(conceptStep, response.index);
		if (response.index === 0) {
			updateConceptFlowFromProgress(response.element, response.progress);
			setConceptModelState(response.index, response.progress);
		} else {
			updateConceptFlowFromProgress(response.element, response.progress);
			setConceptModelState(response.index, 1);
		}

		setConceptCasesReveal(response.index, response.progress);

		updateChapterProgress(progressThumb, conceptStep, response);
		syncMenuState();
	}

	function handleCompareStepEnter(response) {
		currentCompareStepIndex = response.index;
		conceptSectionActive = true;

		setActiveStep(compareStep, response.index);
		resetCompareFlowState();
		updateConceptFlowFromProgress(response.element, 0);
		setCompareModelState(response.index);

		syncMenuState();
	}

	function handleCompareStepProgress(response) {
		currentCompareStepIndex = response.index;
		conceptSectionActive = true;

		setActiveStep(compareStep, response.index);
		updateConceptFlowFromProgress(response.element, response.progress);
		setCompareModelState(response.index);
		updateChapterProgress(progressThumb, compareStep, response);

		syncMenuState();
	}

	function updateChapterProgress(progressThumbEl, stepSelection, response) {
		if (!progressThumbEl) return;

		// Convert current step + in-step progress into one overall 0..1 value.
		const totalSteps = stepSelection.size();
		const overallProgress = (response.index + response.progress) / totalSteps;
		const totalTravel = progressThumbEl.parentElement.offsetHeight - progressThumbEl.offsetHeight;
		const y = totalTravel * overallProgress;

		progressThumbEl.style.transform = `translate3d(0, ${Math.round(y)}px, 0)`;
	}

	function updateHeroVisualFromScroll(response) {
		const progress = response.progress;
		if (typeof window.setIntroModelTilt === "function") {
			window.setIntroModelTilt(progress);
		}
	}

	function handleResize() {
		syncMenuState();
		introScroller.resize();
		conceptScroller.resize();
		compareScroller.resize();
	}

	function updateMenuVisibility() {
		if (!introSection) return;

		const sectionRect = introSection.getBoundingClientRect();
		const conceptRect = conceptSection ? conceptSection.getBoundingClientRect() : null;
		const compareRect = compareSection ? compareSection.getBoundingClientRect() : null;
		const pastLanding = window.scrollY > 2 && sectionRect.top <= 0;
		const conceptInView = !!conceptRect && conceptRect.top <= window.innerHeight * 0.75;
		const compareInView = !!compareRect && compareRect.top <= window.innerHeight * 0.75;
		const holdConceptCamera = currentConceptStepIndex === 0
			&& conceptInView
			&& !compareInView;
		const menuShouldShow = pastLanding && (currentIntroOpacity <= 0.08 || conceptInView || compareInView || conceptSectionActive);
		const contentActive = !holdConceptCamera && (conceptSectionActive || conceptInView || compareInView);

		document.body.classList.toggle("menu-visible", menuShouldShow);
		document.body.classList.toggle("content-active", contentActive);

		if (heroVisualShell) {
			heroVisualShell.style.opacity = "";
			heroVisualShell.style.visibility = "";
		}
	}

	function ensureCompareVisibleStateOnLoad() {
		const hash = window.location.hash;
		const compareInHash = hash === "#compare";
		const compareInView = compareSection && compareSection.getBoundingClientRect().top <= window.innerHeight * 0.8;

		if (!compareInHash && !compareInView) return;

		const firstCompareStep = compareStep.nodes()[0];
		if (!firstCompareStep) return;

		currentCompareStepIndex = 0;
		conceptSectionActive = true;
		setActiveStep(compareStep, 0);
		resetCompareFlowState();
		updateConceptFlowFromProgress(firstCompareStep, 0);
		setCompareModelState(0);
	}

	function init() {
		currentIntroOpacity = 1;
		currentIntroTextVisible = false;
		introProgressOrigin = null;
		currentIntroCameraIndex = -1;
		document.documentElement.style.setProperty("--intro-hero-opacity", "1");

		handleResize();
		syncMenuState();

		introScroller
			.setup({
				step: "#infographic article .step",
				offset: 0.5,
				progress: true,
				debug: false
			})
			.onStepEnter(handleIntroStepEnter)
			.onStepProgress(handleIntroStepProgress);

		conceptScroller
			.setup({
				step: "#content article .step",
				offset: 0.33,
				progress: true,
				debug: false
			})
			.onStepEnter(handleStepEnter)
			.onStepProgress(handleStepProgress);

		compareScroller
			.setup({
				step: "#compare article .step",
				offset: 0.33,
				progress: true,
				debug: false
			})
			.onStepEnter(handleCompareStepEnter)
			.onStepProgress(handleCompareStepProgress);

		ensureCompareVisibleStateOnLoad();

		requestAnimationFrame(() => {
			syncMenuState();
		});
	}

	init();

	window.addEventListener("resize", handleResize);
	window.addEventListener("scroll", () => {
		syncMenuState();
	}, { passive: true });


