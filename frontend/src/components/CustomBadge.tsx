import { ColoredText } from "../models";
import getBgColorByName from "../utils/colors";

interface Props {
    coloredText: ColoredText;
}

/*
    This component is used to display a colored badge.
    It takes a ColoredText object as a prop.
*/
const CustomBadge: React.FC<Props> = ({ coloredText }) => {
    const { text, color } = coloredText;

    return (
        <span
            className="my-1 mx-1 w-auto"
            style={{
                backgroundColor: getBgColorByName(color),
                padding: "0.05em 0.5em",
                borderRadius: "0.25em",
                color: "#37352F",
                whiteSpace: "nowrap",
            }}
            key={text}
        >
            {text}
        </span>
    );
};

export default CustomBadge;
