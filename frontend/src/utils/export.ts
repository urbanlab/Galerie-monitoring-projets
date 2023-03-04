
const downloadURI = (uri: string, name: string) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportAsSVG = (svg: SVGSVGElement, fileName: string) => {
    try {
        const svgString = new XMLSerializer().serializeToString(svg);
        const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
        downloadURI(uri, `${fileName}.svg`);

    }
    catch (err) {
        console.log(err);
    }
}
