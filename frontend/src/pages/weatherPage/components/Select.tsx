import Form from "react-bootstrap/Form";
interface Props {
    title: string;
    all?: boolean;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export const Select = (props: Props) => {
    const { title, all, options, value, onChange } = props;

    return (
        <div className="d-flex flex-column align-items-start">
            <h1 style={{ fontSize: 16 }}>{title}</h1>
            <Form.Control
                as="select"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                style={{ width: 200, padding: "2px 12px" }}
            >
                {all || (all == undefined && <option value="all">Tout</option>)}
                {options.map((option, index) => {
                    return (
                        <option value={option} key={index}>
                            {option}
                        </option>
                    );
                })}
            </Form.Control>
        </div>
    );
};
