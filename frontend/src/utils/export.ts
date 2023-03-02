export const exportAsSVG = (svg: SVGSVGElement, name: string) => {
    const svgString = new XMLSerializer().serializeToString(svg);
    // create a download link
    const downloadLink = document.createElement("a");
    downloadLink.download = `${name}.svg`;
    downloadLink.href = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}