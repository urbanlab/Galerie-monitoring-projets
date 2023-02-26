import { ColoredText } from "../../../models";

interface Props {
    options?: ColoredText[];
}

export const ChartLegend = (props: Props) => {
    const { options } = props;

    const buildLegendItem = (option: ColoredText, key: number) => {
        let radius = 10;
        let borderWidth = 2;
        return (
            <div className="d-flex" style={{ margin: "0px 12px" }} key={key}>
                <div style={{ position: "relative", marginRight: 2 * radius + 4 }}>
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            top: 0,
                            margin: "auto",
                            backgroundColor: (option.color == "default" ? "lightgrey" : option.color) ?? "transparent",
                            opacity: 0.5,
                            height: 2 * radius,
                            width: 2 * radius,
                            borderRadius: radius,
                        }}
                    ></div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            top: 0,
                            margin: "auto",
                            border: "solid",
                            opacity: 0.5,
                            borderWidth: borderWidth,
                            height: 2 * radius,
                            width: 2 * radius,
                            borderRadius: radius,
                        }}
                    ></div>
                </div>
                <p style={{ margin: 0 }}>{option.text}</p>
            </div>
        );
    };
    return (
        <div className="d-flex flex-wrap align-items-center">
            {options?.map((option, key) => buildLegendItem(option, key))}
        </div>
    );
};
