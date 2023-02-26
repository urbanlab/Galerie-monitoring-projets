import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { Columns } from "../../../models";
import icons from "../assets/icons.json";
import { ChartDimensions, DragElement } from "../weatherModels";
import { ProjectItem } from "./ProjectItem";

interface Props {
    columns: Columns | undefined;
    setElements: (elements: DragElement[]) => void;
    elements: DragElement[];
    onShowDetails: (projectId: string) => void;
    saveProject: (projectId: string, etapePrecise: number, meteoPrecise: number) => void;
    mode: string;
    menuRef: React.MutableRefObject<any>;
}

export const WeatherChart = (props: Props) => {
    //chart container dimensions
    const { columns, setElements, elements, onShowDetails, saveProject, mode, menuRef } = props;

    const [chartDimensions, setChartDimensions] = useState<ChartDimensions>(new ChartDimensions({}));
    const etapes = columns?.etapes?.map((etape) => etape.text) ?? [];
    const meteos = columns?.meteos ?? [];
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const isDraggable = mode === "edition";

    const buildChart = (chartDimensions: ChartDimensions) => {
        const svg = d3
            .select(svgRef.current)
            .attr("width", chartDimensions.width)
            .attr("height", chartDimensions.height)
            .attr("overflow", "visible");

        const buildGrid = () => {
            for (var i = 1; i < meteos.length; i++) {
                svg.append("g")
                    .append("line")
                    .attr("x1", 0)
                    .attr("y1", (chartDimensions.height * i) / 3)
                    .attr("x2", chartDimensions.width)
                    .attr("y2", (chartDimensions.height * i) / 3)
                    .attr("stroke", "#9ca5aecf") // line color
                    .attr("stroke-dasharray", "4"); // make it dashed;;
            }
        };

        const buildXAxis = () => {
            const etapesConfig = {
                domain: etapes,
                padding: 0.5,
                range: [0, chartDimensions.width],
            };
            //scaling X
            const xScale = d3
                .scalePoint()
                .domain(etapesConfig.domain)
                .range(etapesConfig.range)
                .padding(etapesConfig.padding);

            const xAxis = d3.axisBottom(xScale).ticks(etapesConfig.domain.length);

            svg.append("g")
                .call(xAxis)
                .attr("class", "xAxis")
                .attr("transform", `translate(0, ${chartDimensions.height})`)
                .selectAll("text")
                .style("text-transform", "uppercase")
                .style("user-select", "none")
                .style("text-anchor", "center")
                .style("font-size", 12)
                .style("font-weight", "bold")
                .style("fill", "#242F3A");
        };

        const buildYAxis = () => {
            const yScale = d3.scalePoint().range([0, chartDimensions.height]);
            const yAxis = d3.axisLeft(yScale).tickSize(0);
            const iconSize = 30;
            const margin = 16;
            svg.append("g").call(yAxis).attr("class", "yAxis").style("user-select", "none");

            svg.append("g")
                .append("svg:image")
                .attr("class", "iconUserTotal")
                .attr("width", iconSize)
                .attr("height", iconSize)
                .attr("x", -(iconSize + margin))
                .attr("y", (chartDimensions.height - iconSize) / 6 - iconSize / 2)
                .attr("href", "data:image/svg+xml;base64," + icons.soleil);

            svg.append("g")
                .append("svg:image")
                .attr("class", "iconUserTotal")
                .attr("width", iconSize)
                .attr("height", iconSize)
                .attr("x", -(iconSize + margin))
                .attr("y", (chartDimensions.height - iconSize) / 2)
                .attr("href", "data:image/svg+xml;base64," + icons.nuage);

            svg.append("g")
                .append("svg:image")
                .attr("class", "iconUserTotal")
                .attr("width", iconSize)
                .attr("height", iconSize)
                .attr("x", -(iconSize + margin))
                .attr("y", ((chartDimensions.height - iconSize) * 5) / 6 + iconSize / 2)
                .attr("href", "data:image/svg+xml;base64," + icons.pluie);
        };

        const buildBackground = () => {
            //couleurs de fonds des étapes
            let width = columns?.etapes.length ?? 0 > 0 ? chartDimensions.width / columns!.etapes.length : 0;
            columns?.etapes?.forEach((etape, i) =>
                svg
                    .append("g")
                    .append("rect")
                    .attr("key", i)
                    .attr("x", width * i)
                    .attr("y", 0)
                    .attr("width", width)
                    .attr("height", chartDimensions.height)
                    .attr("fill", "black")
                    .attr("opacity", 0.033 * i),
            );
        };

        svg.selectAll("g").remove();
        buildBackground();
        buildYAxis();
        buildXAxis();
        buildGrid();
    };

    useEffect(() => {
        var newChartDimensions = new ChartDimensions({
            windowWidth: menuRef.current?.clientWidth,
            windowHeight: window.innerHeight,
        });
        setChartDimensions(newChartDimensions);
        buildChart(newChartDimensions);
        function handleResize() {
            var newChartDimensions = new ChartDimensions({
                windowWidth: menuRef.current?.clientWidth,
                windowHeight: window.innerHeight,
            });
            setChartDimensions(newChartDimensions);
            buildChart(newChartDimensions);
        }
        window.addEventListener("resize", () => handleResize());
    }, [columns, mode]);

    function handlePointerMove(e: React.PointerEvent<SVGElement>) {
        if (!elements.map((element) => element.active).includes(true)) return;
        let newElements = elements.map(function (item): DragElement {
            if (item.active === true) {
                const bbox = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - bbox.left - (item.offsetX ?? 0); //coord du clique sur l'écran
                const y = e.clientY - bbox.top - (item.offsetY ?? 0);
                var newXCoord = Math.min(Math.max(0, x), chartDimensions.width);
                var newYCoord = Math.min(Math.max(0, y), chartDimensions.height);

                return {
                    ...item,
                    xNorm: newXCoord / chartDimensions.width,
                    yNorm: newYCoord / chartDimensions.height,
                };
            }
            return item;
        });
        setElements(newElements);
    }

    function handlePointerUp(e: React.PointerEvent<SVGElement>) {
        let newElements = elements.map(function (item): DragElement {
            if (item.active && (item.xStart != item.yNorm || item.yStart != item.yNorm)) {
                saveProject(item.project.id, item.xNorm, 1 - item.yNorm);
            }
            return { ...item, active: false };
        });

        setElements(newElements);
    }

    function handlePointerDown(index1: number, e: React.PointerEvent<SVGElement>) {
        let newElements = elements.map(function (item, index2): DragElement {
            if (index1 === index2) {
                const el = e.currentTarget;
                el.setPointerCapture(e.pointerId);
                const bbox = e.currentTarget.getBoundingClientRect();

                const offsetX = e.clientX - (bbox.left + bbox.right) / 2; //offset par rapport au centre
                const offsetY = e.clientY - (bbox.top + bbox.bottom) / 2;
                return {
                    ...item,
                    active: true,
                    offsetX: offsetX,
                    offsetY: offsetY,
                    xStart: item.yNorm,
                    yStart: item.yNorm,
                };
            }
            return item;
        });

        setElements(newElements);
    }

    const rectElements = elements.map(function (item, index) {
        return (
            <ProjectItem
                key={index}
                item={item}
                index={index}
                chartDimensions={chartDimensions}
                onShowDetails={onShowDetails}
                handlePointerDown={(i, e) => isDraggable && handlePointerDown(i, e)}
            />
        );
    });

    return (
        <svg
            onPointerUp={(evt) => isDraggable && handlePointerUp(evt)}
            onPointerMove={(evt) => isDraggable && handlePointerMove(evt)}
            width={chartDimensions.width}
            height={chartDimensions.height}
            overflow="visible"
            ref={containerRef}
        >
            <svg ref={svgRef}></svg>
            {rectElements}
        </svg>
    );
};
