import { Icon } from "../models";

interface Props {
    icon: Icon | null;
}

/*
    This component is used to display an icon.
    It takes an Icon object as a prop.

    The Icon object has a type and a value.
    The type can be "emoji", "file", or "external".
    The value is the actual icon.
 */
const IconDisplay: React.FC<Props> = ({ icon }) => {
    if (icon?.type === "emoji") {
        return <span>{icon.value}</span>;
    } else if (icon?.type === "file" || icon?.type === "external") {
        return <img src={icon?.value} alt="icon" style={{ height: "1em" }} />;
    } else {
        return null;
    }
};

export default IconDisplay;
