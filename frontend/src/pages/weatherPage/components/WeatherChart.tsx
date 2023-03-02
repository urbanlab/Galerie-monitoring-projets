import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { Columns } from "../../../models";
import { styles } from "..//WeatherStyle";
import icons from "../assets/icons.json";
import { DragElement, MenuMode } from "../weatherModels";
import { ProjectItem } from "./ProjectItem";

interface Props {
    columns: Columns | undefined;
    setElements: (elements: DragElement[]) => void;
    elements: DragElement[];
    onShowDetails: (projectId: string) => void;
    saveProject: (projectId: string, etapePrecise: number, meteoPrecise: number) => void;
    mode: string;
    menuRef: React.MutableRefObject<any>;
    sliderRef: React.MutableRefObject<any>;
    showAllLabels: boolean;
}

export const WeatherChart = (props: Props) => {
    //chart container dimensions
    const { columns, setElements, elements, onShowDetails, saveProject, mode, menuRef, sliderRef, showAllLabels } = props;

    const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

    const etapes = columns?.etapes?.map((etape) => etape.text) ?? [];
    const meteos = columns?.meteos ?? [];
    const svgRef = useRef(null);
    const isDraggable = mode === MenuMode.EDITION;

    const buildChart = (chartDimensions: { width: number, height: number }) => {
        const svg = d3
            .select(svgRef.current)
            .attr("width", chartDimensions.width)
            .attr("height", chartDimensions.height)
            .attr("viewBox", `0 0 ${chartDimensions.width} ${chartDimensions.height}`)
            .attr("viewBox", `0 0 ${chartDimensions.width} ${chartDimensions.height}`)
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
                .style("font-size", 14)
                .style("font-weight", "700")
                .call(wrap, xScale.step());

            function wrap(text: any, width: any) {
                //fonction qui wrap un label s'il est trop long
                text.each(function (this: any) {
                    var text = d3.select(this),
                        words = text.text().replace(/-/, " - ").split(/\s+/).reverse(),
                        word,
                        line: any = [],
                        lineNumber = 0,
                        lineHeight = 1.1, // ems
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        dx = parseFloat(text.attr("dx")) || 0,
                        tspan = text
                            .text(null)
                            .append("tspan")
                            .attr("x", 0)
                            .attr("y", y)
                            .attr("dy", dy + "em");
                    while ((word = words.pop())) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node()!.getComputedTextLength() > width) {

                            line.pop();
                            tspan.text(line.join(" ").replace(/-/, ""));
                            line = [word];
                            tspan = text
                                .append("tspan")
                                .attr("x", 0)
                                .attr("y", y)
                                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                                .text(word);
                        }
                    }
                });
            }


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

    function handleResize() {
        let height = window.innerHeight - menuRef.current?.clientHeight - 150
        if (mode == MenuMode.EVOLUTION) {
            height = height - sliderRef.current?.clientHeight
        }
        let width = menuRef.current?.clientWidth
        var newChartDimensions = {
            width: width,
            height: height,
        };
        setChartDimensions(newChartDimensions);
        buildChart(newChartDimensions);
    }

    useEffect(() => {
        handleResize()
        window.addEventListener("resize", () => handleResize());

    }, [columns, mode]);

    function handlePointerMove(e: React.PointerEvent<SVGElement>) {
        if (!elements.map((element) => element.active).includes(true)) return;
        let newElements = elements.map(function (item): DragElement {
            if (item.active === true) {
                const bbox = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - (item.offsetX ?? 0) - bbox.left - styles.chartMargin; //coord du clique sur l'écran
                const y = e.clientY - (item.offsetY ?? 0) - bbox.top;
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
                showAllLabels={showAllLabels}
            />
        );
    });

    return (
        <svg
            width={chartDimensions.width + styles.chartMargin}
            height={chartDimensions.height + styles.chartMargin}
            onPointerUp={(evt) => isDraggable && handlePointerUp(evt)}
            onPointerMove={(evt) => isDraggable && handlePointerMove(evt)}
        >
            <svg
                overflow="visible"
                x="60"
                width={chartDimensions.width}
                height={chartDimensions.height}
            >
                <svg ref={svgRef}></svg>
                {rectElements}
            </svg>
        </svg>
    );
};
