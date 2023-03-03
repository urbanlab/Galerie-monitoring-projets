import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox, FormControl, FormControlLabel, Radio, RadioGroup, Slider, Typography } from "@mui/material";
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
    setShowAllLabels: (showAllLabels: boolean) => void;
    elementsScale: number;
    setElementsScale: (elementsSize: number) => void;
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
        setShowAllLabels,
        elementsScale,
        setElementsScale,
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

    const buildExportButton = () => {
        return (
            <div style={styles.menuElementContainer}>
                <h1 style={styles.menuTitle}>Exporter</h1>
                <Button variant="secondary" onClick={handleExport}>
                    <FontAwesomeIcon icon={faDownload} /> SVG
                </Button>

            </div>

        );
    };

    const buildModeSelector = () => {
        return (
            <div style={styles.menuElementContainer}>
                <h1 style={styles.menuTitle}>Mode de vue</h1>
                <FormControl>
                    <RadioGroup
                        value={filters.mode}
                        row
                        name="radio-buttons-group"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setFilters(new Filters({ ...filters, mode: event.target.value }));
                        }}
                    >
                        <FormControlLabel
                            value={MenuMode.EDITION}
                            control={<Radio />}
                            label={<Typography style={styles.formControlLabel}>Edition</Typography>} />
                        <FormControlLabel
                            value={MenuMode.EVOLUTION}
                            control={<Radio />}
                            label={<Typography style={styles.formControlLabel}>Evolution</Typography>} />
                    </RadioGroup>
                </FormControl>

            </div>

        );
    };

    const buildShowLabels = () => {
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setShowAllLabels(event.target.checked);
        };
        return (
            <div style={styles.menuElementContainer}>
                <h1 style={styles.menuTitle}>Affichage</h1>
                <FormControl>
                    <FormControlLabel
                        control={<Checkbox onChange={onChange} />}
                        label={<Typography style={styles.formControlLabel}>Afficher les labels</Typography>} />
                </FormControl>
            </div>
        );
    };

    const buildIconsSizeSlider = () => {

        const onChange = (event: any, value: any) => {
            setElementsScale(value);
        };

        return (
            <div style={styles.menuElementContainer}>
                <h1 style={styles.menuTitle}>Taille des icônes</h1>
                <Slider
                    value={elementsScale}
                    onChange={onChange}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `x ${value}`}
                    step={.1}
                    min={0.5}
                    max={2}
                />
            </div>
        );
    };



    const buildOptions = () => {
        return (
            < >
                {buildModeSelector()}
                {buildShowLabels()}
                {buildIconsSizeSlider()}
                {buildExportButton()}

            </>
        );
    }


    const buildMenu = () => {
        const content = () => {
            switch (menu) {
                case MenuOptions.FILTER:
                    return buildFilters(chartProjects, filters, columns, setFilters);
                case MenuOptions.OPTIONS:
                    return buildOptions()
                default:
                    return <></>;
            }
        };
        return <div style={styles.menuFrame}>{content()}</div>;
    };

    return (
        <div style={styles.menuContainer} ref={menuRef}>
            {buildMenuButtons()}
            {buildMenu()}
        </div>
    );
};
