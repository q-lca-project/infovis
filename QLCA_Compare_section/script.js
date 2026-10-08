// =====================================================
// DATA
// =====================================================

// -----------------------------------------------------
// NEIGHBOURHOOD A
// -----------------------------------------------------

const S1_blockData = [
    { name: "KG300", value: 343250.9, color: "#3A86FF" },
    { name: "KG400", value: 309050.1, color: "#FD2B3B" },
    { name: "KG500", value: 183866, color: "#18AD24" },
    { name: "B6", value: 293949, color: "#FFB20B" }
];

const S1_blockNoUPData = [
    { name: "KG300", value: 343250.9, color: "#3A86FF" },
    { name: "KG400", value: 309050.1, color: "#FD2B3B" },
    { name: "KG500", value: 15122.0, color: "#18AD24" },
    { name: "B6", value: 293949, color: "#FFB20B" }
];


// -----------------------------------------------------
// NEIGHBOURHOOD B
// -----------------------------------------------------

const S1_efhData = [
    { name: "KG300", value: 49325.9, color: "#3A86FF" },
    { name: "KG400", value: 57042.8, color: "#FD2B3B" },
    { name: "KG500", value: 17955, color: "#18AD24" },
    { name: "B6", value: 25267, color: "#FFB20B" }
];

const S1_efhNoAPData = [
    { name: "KG300", value: 49325.9, color: "#3A86FF" },
    { name: "KG400", value: 57042.8, color: "#FD2B3B" },
    { name: "KG500", value: 15304.2, color: "#18AD24" },
    { name: "B6", value: 25267, color: "#FFB20B" }
];


// -----------------------------------------------------
// Further scenarios
// -----------------------------------------------------

const S2_rhData = [
    { name: "KG300", value: 158896.3, color: "#3A86FF" },
    { name: "KG400", value: 125371.0, color: "#FD2B3B" },
    { name: "KG500", value: 29662, color: "#18AD24" },
    { name: "B6", value: 58768, color: "#FFB20B" }
];

const S2_efhData = [
    { name: "KG300", value: 103328.4, color: "#3A86FF" },
    { name: "KG400", value: 69594.7, color: "#FD2B3B" },
    { name: "KG500", value: 25799, color: "#18AD24" },
    { name: "B6", value: 30209, color: "#FFB20B" }
];

const S2_efhOptData = [
    { name: "KG300", value: 101573.2, color: "#3A86FF" },
    { name: "KG400", value: 86313, color: "#FD2B3B" },
    { name: "KG500", value: 26458, color: "#18AD24" },
    { name: "B6", value: 44047, color: "#FFB20B" }
];

const S3_zhData = [
    { name: "KG300", value: 291533.0, color: "#3A86FF" },
    { name: "KG400", value: 224245.9, color: "#FD2B3B" },
    { name: "KG500", value: 113472, color: "#18AD24" },
    { name: "B6", value: 171246, color: "#FFB20B" }
];

const S3_zh50Data = [
    { name: "KG300", value: 186420.39, color: "#3A86FF" },
    { name: "KG400", value: 156378.66, color: "#FD2B3B" },
    { name: "KG500", value: 113472, color: "#18AD24" },
    { name: "B6", value: 28435.17, color: "#FFB20B" }
];

// =====================================================
// Factor icons A / B
// =====================================================

const factorIconsA = [
    "images/NA_Factor_1.png",
    "images/NA_Factor_2.png",
    "images/NA_Factor_3.png",
    "images/NA_Factor_4.png",
    "images/NA_Factor_5.png",
    "images/NA_Factor_6.png"
];

const factorIconsB = [
    "images/NB_Factor_1.png",
    "images/NB_Factor_2.png",
    "images/NB_Factor_3.png",
    "images/NB_Factor_4.png",
    "images/NB_Factor_5.png",
    "images/NB_Factor_6.png"
];

// =====================================================
// CURRENT STATE
// =====================================================

let currentNeighbourhood = "A";
let privateParking = true;


// =====================================================
// DOM ELEMENTS
// =====================================================

const absoluteContainer =
    document.querySelector("#absoluteChart");

const percentContainer =
    document.querySelector("#percentChart");

const highestComponent =
    document.querySelector("#highestComponent");

const neighbourhoodImage =
    document.querySelector(
        "#neighbourhoodImage");

const changeNeighbourhood =
    document.querySelector("#changeNeighbourhood");

const parkingYes =
    document.querySelector("#parkingYes");

const parkingNo =
    document.querySelector("#parkingNo");

const unitM2 =
    document.querySelector("#unitM2");

const unitCapita =
    document.querySelector("#unitCapita");

const metricValue =
    document.querySelector("#metricValue");

const metricUnit =
    document.querySelector("#metricUnit");

const populationValue =
    document.querySelector("#populationValue");

const buildingsValue =
    document.querySelector("#buildingsValue");

const hectaresValue =
    document.querySelector("#hectaresValue");

const factorOverviewButton =
    document.querySelector(
        "#factorOverviewButton");

const factorOverviewModal =
    document.querySelector(
        "#factorOverviewModal");

const factorModalClose =
    document.querySelector(
        "#factorModalClose");

const factorModalBody =
    factorOverviewModal.querySelector(
        ".factor-modal-body");



// =====================================================
// CHART CONTAINER SIZES
// =====================================================


const absoluteContainerHeight = 180;
const percentContainerHeight = 140;


// =====================================================
// CHART LAYOUT
// =====================================================


const barH = 25;
const absH = 25;


// =====================================================
// SCALES
// =====================================================

const minGWP = 97542;
const maxGWP = 2891682;



// =====================================================
// PERCENT STACKED BAR
// =====================================================

function drawPercentBar(g, data, y, percentBarWidth) {

    const xPct = d3.scaleLinear()
        .domain([0, 1])
        .range([0, percentBarWidth]);

    const total =
        d3.sum(data, d => d.value);

    let acc = 0;

    const norm = data.map(d => {

        const start = acc;

        const p = d.value / total;

        acc += p;

        return {
            ...d,
            start,
            end: acc,
            percent: p * 100,
            absolute: d.value
        };
    });


    // % label

    g.append("text")
        .attr("x", percentBarWidth)
        .attr("y", y - 10)
        .attr("text-anchor", "end")
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text("%");


    // Stacked bar

    g.selectAll(null)
        .data(norm)
        .join("rect")
        .attr("x", d => xPct(d.start))
        .attr("y", y)
        .attr(
            "width",
            d => xPct(d.end) - xPct(d.start)
        )
        .attr("height", barH)
        .attr("fill", d => d.color);


    // Percentage labels

    g.selectAll(".percent-label")
        .data(norm)
        .join("text")
        .attr("class", "percent-label")
        .attr(
            "x",
            d => xPct(
                d.start +
                (d.end - d.start) / 2
            )
        )
        .attr("y", y - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .style("fill", d => d.color)
        .text(d => d.percent.toFixed(1));


    // Cost group labels

    const labels = [
        {
            text: "Building",
            color: "#3A86FF"
        },
        {
            text: "Building services",
            color: "#FD2B3B"
        },
        {
            text: "Infrastructure",
            color: "#18AD24"
        },
        {
            text: "Operational energy",
            color: "#FFB20B"
        }
    ];


    const labelY =
        y + barH + 20;


    labels.forEach((d, i) => {

        const x =
            (i / (labels.length - 1)) *
            percentBarWidth;

        g.append("text")
            .attr("x", x)
            .attr(
                "y",
                labelY
            )
            .attr(
                "text-anchor",
                i === 0
                    ? "start"
                    : i === labels.length - 1
                        ? "end"
                        : "middle"
            )
            .style(
                "font-size",
                "14px"
            )
            .style(
                "fill",
                d.color
            )
            .text(d.text);
    });
}


// =====================================================
// ABSOLUTE BAR
// =====================================================

function drawAbsoluteBar(
    g,
    data,
    y,
    absoluteBarWidth
) {

    const xAbs = d3.scaleLinear()
        .domain([minGWP, maxGWP])
        .range([0, absoluteBarWidth]);

    const total =
        d3.sum(data, d => d.value);

    const avg =
        (minGWP + maxGWP) / 2;


    // Gradient

    g.append("rect")
        .attr("x", 0)
        .attr("y", y)
        .attr(
            "width",
            absoluteBarWidth
        )
        .attr(
            "height",
            absH
        )
        .attr(
            "fill",
            "url(#absGradient)"
        );


    // Total GWP marker

    g.append("line")
        .attr(
            "x1",
            xAbs(total)
        )
        .attr(
            "x2",
            xAbs(total)
        )
        .attr(
            "y1",
            y
        )
        .attr(
            "y2",
            y + absH
        )
        .attr(
            "stroke",
            "#111"
        )
        .attr(
            "stroke-width",
            4
        );


    // Total GWP text

    const title =
        g.append("text")
        .attr("x", 0)
        .attr("y", y - 35);


    title.append("tspan")
        .style("font-size", "18px")
        .style("font-weight", "700")
        .text(
            `${Math.round(total).toLocaleString("de-DE")} `
        );


    title.append("tspan")
        .style("font-size", "18px")
        .style("font-weight", "700")
        .text("Total GWP");


    title.append("tspan")
        .attr("x", 0)
        .attr("dy", "1.6em")
        .style("font-size", "14px")
        .style("font-weight", "300")
        .style("fill", "#666")
        .text("in kg CO₂-eq*a");


    // Min

    g.append("text")
        .attr("x", 0)
        .attr(
            "y",
            y + absH + 18
        )
        .style("font-size", "14px")
        .text("Min");


    // Max

    g.append("text")
        .attr(
            "x",
            absoluteBarWidth
        )
        .attr(
            "y",
            y + absH + 18
        )
        .attr(
            "text-anchor",
            "end"
        )
        .style("font-size", "14px")
        .text("Max");


    // Average

    g.append("text")
        .attr(
            "x",
            xAbs(avg)
        )
        .attr(
            "y",
            y + absH + 18
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .style("font-size", "14px")
        .style("font-weight", "600")
        .text("∅");
}

// =====================================================
// UPDATE CHARTS
// =====================================================

function updateCharts(data) {


    const absoluteContainerWidth =
        absoluteContainer.clientWidth;

    const percentContainerWidth =
        percentContainer.clientWidth;


    const percentBarWidth =
        percentContainerWidth - 80;

    // const absoluteBarWidth =
    //     Math.min(
    //         324,
    //         absoluteContainerWidth
    //     );
    const absoluteBarWidth = 
        absoluteContainerWidth;

    // Remove old SVGs

    d3.select("#percentChart")
        .select("svg")
        .remove();

    d3.select("#absoluteChart")
        .select("svg")
        .remove();


    // =================================================
    // ABSOLUTE CHART
    // =================================================

    const absoluteSvg =
        d3.select("#absoluteChart")
        .append("svg")
        .attr(
            "width",
            absoluteContainerWidth
        )
        .attr(
            "height",
            absoluteContainerHeight
        );


    const absoluteG =
        absoluteSvg.append("g");


    // Gradient

    const absoluteDefs =
        absoluteSvg.append("defs");


    const gradient =
        absoluteDefs
        .append("linearGradient")
        .attr(
            "id",
            "absGradient"
        )
        .attr(
            "x1",
            "0%"
        )
        .attr(
            "x2",
            "100%"
        )
        .attr(
            "y1",
            "0%"
        )
        .attr(
            "y2",
            "0%"
        );


    gradient.append("stop")
        .attr(
            "offset",
            "0%"
        )
        .attr(
            "stop-color",
            "#DADADC"
        );


    gradient.append("stop")
        .attr(
            "offset",
            "50%"
        )
        .attr(
            "stop-color",
            "#C7C7C7"
        );


    gradient.append("stop")
        .attr(
            "offset",
            "100%"
        )
        .attr(
            "stop-color",
            "#555555"
        );


    // =================================================
    // PERCENT CHART
    // =================================================

    const percentSvg =
        d3.select("#percentChart")
        .append("svg")
        .attr(
            "width",
            percentContainerWidth
        )
        .attr(
            "height",
            percentContainerHeight
        );


    const percentG =
        percentSvg.append("g")
        .attr(
            "transform",
            "translate(0, 30)"
        );


    // DRAW

    drawPercentBar(
        percentG,
        data,
        20,
        percentBarWidth
    );


    drawAbsoluteBar(
        absoluteG,
        data,
        60,
        absoluteBarWidth
    );
}


// =====================================================
// METRIC
// =====================================================

function updateMetric() {


    // NEIGHBOURHOOD A

    if (currentNeighbourhood === "A") {

        if (privateParking) {

            if (
                unitM2.classList.contains("active")
            ) {

                metricValue.textContent =
                    "13.36 GWP";

            } else {

                metricValue.textContent =
                    "654 GWP";
            }

        } else {

            if (
                unitM2.classList.contains("active")
            ) {

                metricValue.textContent =
                    "11.36 GWP";

            } else {

                metricValue.textContent =
                    "556 GWP";
            }
        }
    }


    // NEIGHBOURHOOD B

    else {

        if (privateParking) {

            if (
                unitM2.classList.contains("active")
            ) {

                metricValue.textContent =
                    "18.41 GWP";

            } else {

                metricValue.textContent =
                    "1252 GWP";
            }

        } else {

            if (
                unitM2.classList.contains("active")
            ) {

                metricValue.textContent =
                    "18.09 GWP";

            } else {

                metricValue.textContent =
                    "1230 GWP";
            }
        }
    }


    // Unit text

    if (
        unitM2.classList.contains("active")
    ) {

        metricUnit.textContent =
            "in kg CO₂-eq per m² NFA *a";

    } else {

        metricUnit.textContent =
            "in kg CO₂-eq per capita *a";
    }
}


// =====================================================
// UPDATE NEIGHBOURHOOD / METRIC / FACTOR ICONS / FIGUES
// =====================================================

function updateNeighbourhood(updateImage = true) {

    // Update image

    if (updateImage) {

        neighbourhoodImage.src =
            getNeighbourhoodImage();
    }

    updateImagePosition();

    // NEIGHBOURHOOD A

    if (currentNeighbourhood === "A") {

        if (privateParking) {

            updateCharts(
                S1_blockData
            );

            highestComponent.textContent =
                "Underground garages";

            highestComponent.style.color =
                "#18AD24";

        } else {

            updateCharts(
                S1_blockNoUPData
            );

            highestComponent.textContent =
                "Floor plates";

            highestComponent.style.color =
                "#3A86FF";
        }
    }


    // NEIGHBOURHOOD B

    else {

        if (privateParking) {

            updateCharts(
                S1_efhData
            );

            highestComponent.textContent =
                "Floor plates";

            highestComponent.style.color =
                "#3A86FF";

        } else {

            updateCharts(
                S1_efhNoAPData
            );

            highestComponent.textContent =
                "Floor plates";

            highestComponent.style.color =
                "#3A86FF";
        }
    }


    // METRIC

    updateMetric();


    // FACTOR ICONS

    updateFactorIcons();


    // FIGURES

    updateFigures();
}

// =====================================================
// Neighbourhood Image
// =====================================================


function getNeighbourhoodImage() {

    if (currentNeighbourhood === "A") {

        if (privateParking) {
            return "images/NA_PP.png";
        } else {
            return "images/NA_NoPP.png";
        }

    } else {

        if (privateParking) {
            return "images/NB_PP.png";
        } else {
            return "images/NB_NoPP.png";
        }
    }
}


// =====================================================
// Update factor icons
// =====================================================

function updateFactorIcons() {

    const factorContainer =
        document.querySelector("#factorIcons");

    if (!factorContainer) return;

    const icons =
        currentNeighbourhood === "A"
            ? factorIconsA
            : factorIconsB;

    factorContainer.innerHTML = "";

    icons.forEach(function (src) {

        const img = document.createElement("img");

        img.src = src;
        img.alt = "";

        factorContainer.appendChild(img);

    });
}

// =====================================================
// Update factor icons
// =====================================================

function updateFigures() {

    const populationValue =
        document.querySelector("#populationValue");

    const buildingsValue =
        document.querySelector("#buildingsValue");

    const hectaresValue =
        document.querySelector("#hectaresValue");


    if (currentNeighbourhood === "A") {

        populationValue.textContent = "1729";
        buildingsValue.textContent = "7";
        hectaresValue.textContent = "6";

    } else {

        populationValue.textContent = "119";
        buildingsValue.textContent = "52";
        hectaresValue.textContent = "6";
    }
}

// =====================================================
// PRIVATE PARKING — YES
// =====================================================

parkingYes.addEventListener(
    "click",
    function () {

        privateParking = true;

        parkingYes.classList.add(
            "active"
        );

        parkingNo.classList.remove(
            "active"
        );

        updateNeighbourhood();
    }
);


// =====================================================
// PRIVATE PARKING — NO
// =====================================================

parkingNo.addEventListener(
    "click",
    function () {

        privateParking = false;

        parkingNo.classList.add(
            "active"
        );

        parkingYes.classList.remove(
            "active"
        );

        updateNeighbourhood();
    }
);


// =====================================================
// UNIT — m²
// =====================================================

unitM2.addEventListener(
    "click",
    function () {

        unitM2.classList.add(
            "active"
        );

        unitCapita.classList.remove(
            "active"
        );

        updateMetric();
    }
);


// =====================================================
// UNIT — CAPITA
// =====================================================

unitCapita.addEventListener(
    "click",
    function () {

        unitCapita.classList.add(
            "active"
        );

        unitM2.classList.remove(
            "active"
        );

        updateMetric();
    }
);


// =====================================================
// UPDATE IMAGE POSITION
// =====================================================

function updateImagePosition() {

    if (currentNeighbourhood === "A") {

        // Neighbourhood A in focus
        neighbourhoodImage.style.transform =
            "translateX(5%)";

    } else {

        // Neighbourhood B in focus
        neighbourhoodImage.style.transform =
            "translateX(-40%)";

    }

}


// =====================================================
// CHANGE NEIGHBOURHOOD
// =====================================================

changeNeighbourhood.addEventListener(
"click",
function(){

    const changeText =
        changeNeighbourhood.querySelector("span");

    const arrow =
        changeNeighbourhood.querySelector(".arrow-button");


    if(currentNeighbourhood === "A"){


        currentNeighbourhood = "B";


        changeText.innerHTML =
        "Change to<br><strong>Neighbourhood A</strong>";

        arrow.textContent="‹";


        changeNeighbourhood.classList.remove("to-B");
        changeNeighbourhood.classList.add("to-A");


    } else {


        currentNeighbourhood="A";


        changeText.innerHTML =
        "Change to<br><strong>Neighbourhood B</strong>";

        arrow.textContent="›";


        changeNeighbourhood.classList.remove("to-A");
        changeNeighbourhood.classList.add("to-B");

    }


    updateNeighbourhood();

});



// =====================================================
// FACTOR OVERVIEW - OPEN
// =====================================================

factorOverviewButton.addEventListener(
    "click",
    function () {

        // Popup öffnen
        factorOverviewModal.classList.add(
            "active"
        );

        // Scrollposition sicher zurücksetzen
        requestAnimationFrame(function () {

            factorModalBody.scrollTop = 0;

        });

    }
);


// =====================================================
// FACTOR OVERVIEW - CLOSE
// =====================================================

factorModalClose.addEventListener(
    "click",
    function () {

        // Scrollposition zurücksetzen
        factorModalBody.scrollTop = 0;

        // Popup schließen
        factorOverviewModal.classList.remove(
            "active"
        );

    }
);




// =====================================================
// INTRO POPUP
// =====================================================

const introModal =
    document.querySelector("#introModal");

const introModalClose =
    document.querySelector("#introModalClose");



// CLOSE INTRO POPUP
function closeIntroModal() {

    introModal.style.display = "none";

}


// X
introModalClose.addEventListener(
    "click",
    closeIntroModal
);



// =====================================================
// INITIAL STATE
// =====================================================

parkingYes.classList.add("active");
parkingNo.classList.remove("active");

unitM2.classList.add("active");
unitCapita.classList.remove("active");

updateNeighbourhood();
