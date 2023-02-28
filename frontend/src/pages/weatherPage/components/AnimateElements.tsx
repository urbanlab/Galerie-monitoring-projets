import { DragElement } from "../weatherModels";

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
                opacity: 1,
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

export const AnimateElements = (setElements: (elements: DragElement[]) => void,) => {
    let request: number;
    const easing = (t: number) => -t * (t - 2);

    const startAnimation = (startElements: DragElement[], endElements: DragElement[], duration: number = 300) => {
        let start: any = null;
        const performAnimation = (timestamp: any) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const t = Math.min(progress / duration, 1);
            var value = easing(t);
            animateElements(startElements, endElements, value, setElements);
            if (progress < duration) {
                request = window.requestAnimationFrame(performAnimation);
            } else {
                stopAnimation(endElements);
            }
        };
        request = window.requestAnimationFrame(performAnimation);
    }
    const stopAnimation = (endElements: DragElement[]) => {
        endElements = endElements.map((element) => {
            return { ...element, opacity: 1 };
        });
        setElements(endElements)
        window.cancelAnimationFrame(request);
    }

    return startAnimation
}
