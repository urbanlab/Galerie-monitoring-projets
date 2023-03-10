// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/circle-packing

import { CirclePackingSvgProps, ResponsiveCirclePacking } from "@nivo/circle-packing";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import DownloadButton from "../../components/DownloadButton";
import { ColoredText, Projet } from "../../models";
import getBgColorByName from "../../utils/colors";
import { augmentSaturation, formatData } from "./circlePackingDataFormat";

interface Props {
    projets: Projet[];
    showProjectsTableModal: (title: string, filter: (projet: Projet) => boolean) => void;
}

interface ColorMap {
    [key: string]: string;
}

// hardcoded possible values for the displayed_property
export type DisplayedProperty = "politiques_publiques" | "direction_metier" | "etape" | "besoins_lab";

const MyResponsiveCirclePacking = ({ projets, showProjectsTableModal }: Props) => {
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

    const handleCircleClick: CirclePackingSvgProps<any>["onClick"] = (circle, event) => {
        showProjectsTableModal(circle.id, (projet) => {
            return projet[displayed_property].map((e) => e.text).includes(circle.id);
        });
    };

    function selectSvg(className: String) {
        const svg: any = document.querySelector(`.${className} svg`);
        return svg;
    }

    /* =================== Render =================== */
    return (
        <div>
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-center col-4 m-auto">
                    <Form.Select
                        value={displayed_property}
                        // Hard cod?? mais j'arrive pa a faire diff??remment avec typescript :
                        onChange={(e) =>
                            (e.target.value === "politiques_publiques" ||
                                e.target.value === "direction_metier" ||
                                e.target.value === "etape" ||
                                e.target.value === "besoins_lab") &&
                            setDisplayedProperty(e.target.value)
                        }
                    >
                        <option value="politiques_publiques">Politiques publiques</option>
                        <option value="direction_metier">Directions m??tiers</option>
                        <option value="etape">??tapes</option>
                        <option value="besoins_lab">Besoins lab</option>
                    </Form.Select>
                    <div className="ms-1">
                        <DownloadButton svg={selectSvg("CirclePage")} fileName="CirclePage" />
                    </div>
                </div>

                <div className="CirclePage" style={{ width: 0.8 * window.innerWidth, height: "calc(90vh - 8em)" }}>
                    <ResponsiveCirclePacking
                        data={formatData(projets, displayed_property)}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        id="name"
                        onClick={handleCircleClick}
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
                        isInteractive={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyResponsiveCirclePacking;
