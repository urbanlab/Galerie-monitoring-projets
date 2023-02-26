import { ColoredText, Projet } from "../../models";
import { DisplayedProperty } from "./CirclePackingPage";

export const formatData = (projets: Projet[], propertyName: DisplayedProperty): any => {
    const allPropertyValues = projets
        .reduce((acc: ColoredText[], projet: Projet) => [...acc, ...projet[propertyName]], [])
        .map((pp) => pp.text);

    type PropertyValuesCounts = Record<string, number>;

    const propertyValuesCounts = allPropertyValues.reduce((acc: PropertyValuesCounts, pp) => {
        acc[pp] = acc[pp] ? acc[pp] + 1 : 1;
        return acc;
    }, {});

    const data = Object.entries(propertyValuesCounts).map(([name, loc]) => ({
        name,
        loc,
        children: [],
    }));

    return {
        name: "root",
        children: data,
    };
};

export function augmentSaturation(hex: string, saturationDelta: number, lightnessDelta: number): string {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let cMax = Math.max(r, g, b);
    let cMin = Math.min(r, g, b);
    let delta = cMax - cMin;

    let h = 0;
    if (delta == 0) {
        h = 0;
    } else if (cMax == r) {
        h = ((g - b) / delta) % 6;
    } else if (cMax == g) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }

    let l = (cMax + cMin) / 2;
    l = l + lightnessDelta;
    if (l > 1) {
        l = 1;
    }
    if (l < 0) {
        l = 0;
    }

    let s = 0;
    if (delta == 0) {
        s = 0;
    } else {
        s = delta / (1 - Math.abs(2 * l - 1));
    }
    s = s + saturationDelta;
    if (s > 1) {
        s = 1;
    }
    if (s < 0) {
        s = 0;
    }

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;

    let r2 = 0;
    let g2 = 0;
    let b2 = 0;

    if (0 <= h && h < 60) {
        r2 = c;
        g2 = x;
        b2 = 0;
    } else if (60 <= h && h < 120) {
        r2 = x;
        g2 = c;
        b2 = 0;
    } else if (120 <= h && h < 180) {
        r2 = 0;
        g2 = c;
        b2 = x;
    } else if (180 <= h && h < 240) {
        r2 = 0;
        g2 = x;
        b2 = c;
    } else if (240 <= h && h < 300) {
        r2 = x;
        g2 = 0;
        b2 = c;
    } else if (300 <= h && h < 360) {
        r2 = c;
        g2 = 0;
        b2 = x;
    }

    r2 = Math.round((r2 + m) * 255);
    g2 = Math.round((g2 + m) * 255);
    b2 = Math.round((b2 + m) * 255);

    let result = "#" + ((1 << 24) + (r2 << 16) + (g2 << 8) + b2).toString(16).slice(1);
    return result;
}
