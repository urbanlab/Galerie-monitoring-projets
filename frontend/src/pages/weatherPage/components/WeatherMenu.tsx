import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Button } from "react-bootstrap";
import { buildFilters } from "../../../components/FiltersMenu";
import { Columns, Projet } from "../../../models";
import { Filters, MenuMode, MenuOptions } from "../weatherModels";
import { styles } from "../WeatherStyle";

interface Props {
    menu: string;
    chartProjects: Projet[];
    setMenu: (menu: string) => void;
    columns: Columns | undefined;
    menuRef: React.MutableRefObject<any>;
    filters: Filters;
    setFilters: (filters: Filters) => void;
    handleExport: () => void;
}

export const WeatherMenu = (props: Props) => {
    const {
        menu,
        chartProjects,
        setMenu,
        menuRef,
        columns,
        filters,
        setFilters,
        handleExport,
    } = props;
    const buildMenuButtons = () => {
        const button = (text: string, isSelected: boolean, index: number) => {
            var style = isSelected ? styles.selected : styles.unselected;
            return (
                <div
                    key={index}
                    style={{ ...styles.button, ...style, marginTop: index === 0 ? 0 : styles.spacing }}
                    onMouseUp={() => {
                        setMenu(text);
                    }}
                >
                    {text}
                </div>
            );
        };
        return (
            <div style={styles.buttonsContainer}>
                {Object.values(MenuOptions).map((text, index) => button(text, menu === text, index))}
            </div>
        );
    };

    const buildExport = () => {
        return (
            <div style={styles.singleFilterContainer}>
                <Button variant="primary" onClick={handleExport}>
                    Exporter
                </Button>
            </div>
        );
    };

    const buildMode = () => {
        return (
            <div style={styles.singleFilterContainer}>
                <FormControl>
                    <RadioGroup
                        defaultValue={filters.mode}
                        name="radio-buttons-group"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setFilters(new Filters({ ...filters, mode: event.target.value }));
                        }}
                    >
                        <FormControlLabel value={MenuMode.EDITION} control={<Radio />} label="Edition" />
                        <FormControlLabel value={MenuMode.EVOLUTION} control={<Radio />} label="Evolution" />
                    </RadioGroup>
                </FormControl>
            </div>
        );
    };

    const buildMenu = () => {
        const content = () => {
            switch (menu) {
                case MenuOptions.FILTER:
                    return buildFilters(chartProjects, filters, columns, setFilters);
                case MenuOptions.EXPORT:
                    return buildExport();
                case MenuOptions.MODE:
                    return buildMode();
                default:
                    return <></>;
            }
        };
        return <div style={styles.filtersContainer}>{content()}</div>;
    };

    return (
        <div style={styles.menuContainer} ref={menuRef}>
            {buildMenuButtons()}
            {buildMenu()}
        </div>
    );
};
