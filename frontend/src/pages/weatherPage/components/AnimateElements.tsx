import { useEffect, useState } from "react";
import { DragElement, Filters } from "../weatherModels";

export function animateElements(
    startElements: DragElement[],
    endElements: DragElement[],
    value: number,
    setElements: (elements: DragElement[]) => void,
) {
    //for loop on all the elements that has the same project id
    var newElements: DragElement[] = [];

    startElements.forEach((startElement, index) => {
        var endElement = endElements.find((endElement) => endElement.project.id === startElement.project.id);
        if (endElement) {
            var xDiff = endElement.xNorm - startElement.xNorm;
            var yDiff = endElement.yNorm - startElement.yNorm;
            var xNorm = startElement.xNorm + xDiff * value;
            var yNorm = startElement.yNorm + yDiff * value;
            var element = {
                ...startElement,
                xNorm: xNorm,
                yNorm: yNorm,
            };
            newElements.push(element);
        } else {
            //element has been removed
            newElements.push({ ...startElement, opacity: 1 - value });
        }
    });
    endElements.forEach((endElement, index) => {
        var startElement = startElements.find((startElement) => startElement.project.id === endElement.project.id);
        if (!startElement) {
            //element has been added
            newElements.push({ ...endElement, opacity: value });
        }
    });
    setElements(newElements);
}

export function useAnimateValue(
    setElements: (elements: DragElement[]) => void,
    filters: Filters,
    applyFilters: (elements: DragElement[], filters: Filters) => void,
    duration: number,
) {
    const [value, setValue] = useState<any>(0);
    const [isRunning, setIsRunning] = useState<any>(false);
    const [startElements, setStartElements] = useState<DragElement[]>([]);
    const [endElements, setEndElements] = useState<DragElement[]>([]);
    const easing = (t: number) => -t * (t - 2);

    useEffect(() => {
        let start: any = null;
        const animation = (timestamp: any) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const t = Math.min(progress / duration, 1);
            const newValue = easing(t);

            setValue(newValue);
            animateElements(startElements, endElements, newValue, setElements);
            if (progress < duration && isRunning) {
                window.requestAnimationFrame(animation);
            } else {
                setIsRunning(false);
                applyFilters(endElements, filters);
            }
        };
        if (isRunning) {
            window.requestAnimationFrame(animation);
        }
    }, [isRunning]);

    const startAnimation = (startElements: DragElement[], endElements: DragElement[]) => {
        setIsRunning(false);
        setStartElements(startElements);
        setEndElements(endElements);
        setIsRunning(true);
    };

    return startAnimation;
}
