import { CirclePackingSvgProps, ResponsiveCirclePacking } from "@nivo/circle-packing";
import { Projet } from "../../../models";
import { augmentSaturation } from "../../circlePackingPage/circlePackingDataFormat";

interface Props {
    meteo: any;
    showProjectsTableModal: (title: string, filter: (projet: Projet) => boolean) => void;
}

export interface ColorMap {
    [key: string]: string;
}

const MeteoCircleChart = ({ meteo, showProjectsTableModal }: Props) => {
    /* =================== Color map =================== */
    const colorMap: ColorMap = {
        "☀️": augmentSaturation("#DDEDEA", 0.2, -0.15),
        "⛅️": augmentSaturation("#FBF3DB", 0.4, -0.15),
        "🌧": augmentSaturation("#FBE4E4", 0.4, -0.15),
        undefined: "#ebebeb",
    };

    const getWeatherType = (weather: string): string => {
        switch (weather) {
            case "sunny":
                return "☀️";
            case "cloudy":
                return "⛅️";
            case "rainy":
                return "🌧";
            default:
                return "unknown";
        }
    };

    const handleCircleClick: CirclePackingSvgProps<any>["onClick"] = (circle, event) => {
        showProjectsTableModal("Projets " + circle.id, (project) => project.meteo == circle.id);
    };

    /* =================== Render =================== */
    return (
        <div className="d-flex flex-column ">
            <div className="d-block m-auto" style={{ width: 0.2 * window.innerWidth, height: "calc(37vh - 4em)" }}>
                <ResponsiveCirclePacking
                    data={meteo}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    onClick={handleCircleClick}
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
                    isInteractive={true}
                />
            </div>
        </div>
    );
};

export default MeteoCircleChart;
