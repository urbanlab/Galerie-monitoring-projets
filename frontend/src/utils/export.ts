const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a");
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
    } catch (err) {
        console.log(err);
    }
};

// Fonction pour convertir un svg en png
export const exportAsPNG = (svg: SVGSVGElement, fileName: string) => {
    try {
        // Extraire le svg comme une chaîne de données xml
        const svgString = new XMLSerializer().serializeToString(svg);
        // Créer un élément img et lui attribuer la chaîne de données xml comme source
        const img = new Image();
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
        // Créer un élément canvas et obtenir son contexte 2D
        const canvas = document.createElement("canvas");
        canvas.width = svg.width.baseVal.value;
        canvas.height = svg.height.baseVal.value;
        const ctx = canvas.getContext("2d");
        // Dessiner l'image sur le canvas quand elle est chargée
        img.onload = () => {
            ctx?.drawImage(img, 0, 0);
            // Convertir le canvas en une URL de données png
            const uri = canvas.toDataURL("image/png");
            // Télécharger l'URL de données comme un fichier png
            downloadURI(uri, `${fileName}.png`);
        };
    } catch (err) {
        console.log(err);
    }
};
