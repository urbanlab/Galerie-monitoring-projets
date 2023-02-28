import React, { useState } from "react";
import { DragElement } from "../weatherModels";
import { Fade } from "./Fade";

interface Props {
    item: DragElement;
    index: number;
    chartDimensions: { width: number, height: number };
    onShowDetails: (projectId: string) => void;
    handlePointerDown: (index1: number, e: React.PointerEvent<SVGElement>) => void;
}

export const ProjectItem = (props: Props) => {
    const { item, index, chartDimensions, onShowDetails, handlePointerDown } = props;
    const radius = Math.min(Math.max(chartDimensions.width, chartDimensions.height) / 50, 25);
    const xCoord = item.xNorm * chartDimensions.width;
    const yCoord = item.yNorm * chartDimensions.height;
    const labelWidth = Math.max(100, Math.min(300, 8 * radius));

    const [showLabel, setShowLabel] = useState(false);
    const buildLogo = () => {
        let icon;
        if (item.project.icon?.type === "emoji" || item.project.icon?.type == null) {
            icon = <span style={{ fontSize: 1.2 * radius }}>{item.project.icon?.value ?? "📌"}</span>;
        } else if (item.project.icon?.type === "file" || item.project.icon?.type === "external") {
            icon = (
                <img
                    src={item.project.icon?.value}
                    style={{
                        width: 1.6 * radius,
                        height: "auto",
                        maxHeight: 2 * radius,
                        pointerEvents: "none",
                        borderRadius: 4,
                    }}
                />
            );
        }
        return (
            <div
                style={{
                    userSelect: "none",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transitionDuration: "0.2s",
                    transform: item.active ? "scale(1.2)" : "",
                }}
            >
                {icon}
            </div>
        );
    };

    const label = (
        <Fade
            in={showLabel}
            duration={100}
            children={
                <foreignObject
                    x={xCoord - labelWidth / 2}
                    y={yCoord + radius}
                    style={{
                        height: 1,
                        width: labelWidth,
                        display: "block",
                        overflow: "visible",
                        position: "absolute",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                >
                    <p
                        style={{
                            wordWrap: "break-word",
                            fontSize: Math.min(14, 0.6 * radius),
                            color: "#323232",
                            fontWeight: 500,
                            lineHeight: 1,
                        }}
                    >
                        {item.project.projet}
                    </p>
                </foreignObject>
            }
        />
    );

    const toolTip = (
        <Fade
            in={item.active!}
            duration={100}
            children={
                <foreignObject
                    x={xCoord - labelWidth / 4}
                    y={yCoord - 2 * radius}
                    style={{
                        width: labelWidth / 2,
                        height: 1,
                        display: "block",
                        overflow: "visible",
                        position: "absolute",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                >
                    <p
                        style={{
                            fontSize: 0.5 * radius,
                            backgroundColor: "white",
                            borderRadius: 5,
                            boxShadow: "0px 1px 4px 1px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        x: {Math.round(item.xNorm * 100)}% y: {Math.round((1 - item.yNorm) * 100)}%
                    </p>
                </foreignObject>
            }
        />
    );

    var svg = (
        <svg
            overflow="visible"
            opacity={item.opacity}
            onMouseEnter={(_) => setShowLabel(true)}
            onMouseLeave={(_) => setShowLabel(false)}
        >
            {label}
            {toolTip}
            <foreignObject
                x={xCoord - radius}
                y={yCoord - radius}
                onPointerDown={(evt) => {

                    handlePointerDown(index, evt)
                }}
                onDoubleClick={(_) => {

                    onShowDetails(item.project.id)

                }}
                style={{
                    height: 2 * radius,
                    width: 2 * radius,
                    position: "relative",
                }}
            >
                {buildLogo()}
            </foreignObject>
        </svg>
    );
    return svg;
};
