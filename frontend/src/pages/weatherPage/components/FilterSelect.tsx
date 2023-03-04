import { useRef, useState } from 'react';
import Select from 'react-select';
import { styles } from "../WeatherStyle";



interface Props {
    title: string;
    all?: boolean;
    options: string[];
    values: string[];
    onChange: (values: string[]) => void;
}

export const FilterSelect = (props: Props) => {
    const { title, all, options, values, onChange } = props;
    const [isFocused, setIsFocused] = useState(false);
    const ref = useRef<React.RefAttributes<Select>>(null)

    const selectOptions: any = options.map((option) => {
        return {
            value: option,
            label: option,
        };
    });

    const selectValues = values.map((value) => {
        return {
            value: value,
            label: value,
        };
    });

    return (
        <div

            style={{ ...styles.menuElementContainer, flex: 1 }}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
        >
            <h1 style={styles.menuTitle}>{title}</h1>
            <div style={{ width: '100%' }}>
                <Select

                    value={selectValues}
                    isMulti
                    onChange={(selection) => {
                        onChange(selection.map((item: any) => item.value))
                        setIsFocused(false)
                    }}
                    options={selectOptions}
                    placeholder="L'ensemble"


                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderRadius: 0,
                            height: isFocused ? 'auto' : 36,
                            overflow: isFocused ? 'visible' : 'hidden',

                        }),

                        indicatorsContainer: (baseStyles, state) => ({
                            ...baseStyles,
                            height: isFocused ? 'auto' : 36,
                        })
                    }}

                />

            </div>

        </div>
    );
};
