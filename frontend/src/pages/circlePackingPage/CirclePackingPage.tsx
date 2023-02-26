// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/circle-packing

import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { ColoredText, Projet } from "../../models";
import getBgColorByName from "../../utils/colors";
import { augmentSaturation, formatData } from "./circlePackingDataFormat";

interface Props {
    projets: Projet[];
}

interface ColorMap {
    [key: string]: string;
}

// hardcoded possible values for the displayed_property
export type DisplayedProperty = "politiques_publiques" | "direction_metier" | "etape" | "besoins_lab";

const MyResponsiveCirclePacking = ({ projets /* see data tab */ }: Props) => {
    /* This component is a wrapper around the nivo circle packing component. It takes a list of projects and formats it to be displayed in a circle packing chart. */
    const [displayed_property, setDisplayedProperty] = useState<DisplayedProperty>("politiques_publiques");

    /* =================== Color map =================== */
    const allPropertyValues = projets.reduce(
        (acc: ColoredText[], projet: Projet) => [...acc, ...projet[displayed_property]],
        [],
    );
    const ColorMap: ColorMap = allPropertyValues.reduce((acc: ColorMap, pp) => {
        acc[pp.text] = augmentSaturation(getBgColorByName(pp.color), 0.4, -0.15);
        return acc;
    }, {});

    /* =================== Render =================== */
    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-center col-4 m-auto mb-3">
                <Form.Select
                    value={displayed_property}
                    // Hard codé mais j'arrive pa a faire différemment avec typescript :
                    onChange={(e) =>
                        (e.target.value === "politiques_publiques" ||
                            e.target.value === "direction_metier" ||
                            e.target.value === "etape" ||
                            e.target.value === "besoins_lab") &&
                        setDisplayedProperty(e.target.value)
                    }
                >
                    <option value="politiques_publiques">Politiques publiques</option>
                    <option value="direction_metier">Directions métiers</option>
                    <option value="etape">Étapes</option>
                    <option value="besoins_lab">Besoins lab</option>
                </Form.Select>
            </div>
            <div
                className="d-flex justify-content-center"
                style={{ width: 0.8 * window.innerWidth, height: 0.8 * window.innerHeight }}
            >
                <ResponsiveCirclePacking
                    data={formatData(projets, displayed_property)}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    id="name"
                    value="loc"
                    leavesOnly={true}
                    colors={function (e) {
                        return ColorMap[e.data.name];
                    }}
                    colorBy="id"
                    label={function (e) {
                        return e.id + " (" + e.value + ")";
                    }}
                    inheritColorFromParent={true}
                    childColor={{
                        from: "color",
                        modifiers: [["darker", 0.5]],
                    }}
                    padding={4}
                    enableLabels={true}
                    labelsFilter={function (n) {
                        return 1 === n.node.depth;
                    }}
                    labelsSkipRadius={0}
                    labelTextColor={{
                        from: "color",
                        modifiers: [["darker", 2]],
                    }}
                    borderWidth={4}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 0.5]],
                    }}
                    defs={
                        [
                            // {
                            //     id: 'lines',
                            //     type: 'patternLines',
                            //     background: 'none',
                            //     color: 'inherit',
                            //     rotation: -45,
                            //     lineWidth: 5,
                            //     spacing: 8
                            // }
                        ]
                    }
                    fill={
                        [
                            // {
                            //     match: {
                            //         depth: 1
                            //     },
                            //     id: 'lines'
                            // }
                        ]
                    }
                    isInteractive={true}
                />
            </div>
        </div>
    );
};

export default MyResponsiveCirclePacking;