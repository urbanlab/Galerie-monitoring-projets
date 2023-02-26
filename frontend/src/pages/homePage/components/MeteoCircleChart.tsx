import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { augmentSaturation } from "../../circlePackingPage/circlePackingDataFormat";

interface Props {
    meteo: any;
}

export interface ColorMap {
    [key: string]: string;
}

const MeteoCircleChart = ({ meteo /* see data tab */ }: Props) => {
    /* This component is a wrapper around the nivo circle packing component. It takes a list of projects and formats it to be displayed in a circle packing chart. */

    /* =================== Color map =================== */

    const colorMap: ColorMap = {
        sunny: augmentSaturation("#DDEDEA", 0.2, -0.15),
        cloudy: augmentSaturation("#FBF3DB", 0.4, -0.15),
        rainy: augmentSaturation("#FBE4E4", 0.4, -0.15),
        undefined: "#ebebeb",
    };

    /* =================== Render =================== */
    return (
        <div className="d-flex flex-column ">
            <div className="d-flex justify-content-center col-4 m-auto">
                <p style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }} className="m-2">
                    Météo
                </p>
            </div>
            <div className="d-block m-auto" style={{ width: 0.2 * window.innerWidth, height: "30vh" }}>
                <ResponsiveCirclePacking
                    data={meteo}
                    margin={{ top: 0, right: 20, bottom: 40, left: 20 }}
                    id="name"
                    value="loc"
                    leavesOnly={true}
                    colors={function (e) {
                        return colorMap[e.data.name];
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

export default MeteoCircleChart;
