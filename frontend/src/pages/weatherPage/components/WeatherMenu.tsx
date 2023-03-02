import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Button } from "react-bootstrap";
import { Columns, Projet } from "../../../models";
import { Filters, MenuMode, MenuOptions } from "../weatherModels";
import { styles } from "../WeatherStyle";
import { Select } from "./FilterSelect";

interface Props {
    menu: string;
    chartProjects: Projet[];
    setMenu: (menu: string) => void;
    columns: Columns | undefined;
    menuRef: React.MutableRefObject<any>;
    //applyFilters: (elements: DragElement[], filters: Filters) => void;
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

    const getDirecteursEtReferentsProjets = () => {
        var directeursEtReferents: string[] = [];
        for (var project of chartProjects) {
            for (var referent of project.chef_de_projet_ou_referent) {
                if (!directeursEtReferents.includes(referent.name)) {
                    directeursEtReferents.push(referent.name);
                }
            }
            for (var directeur of project.directeur_projet) {
                if (!directeursEtReferents.includes(directeur.name)) {
                    directeursEtReferents.push(directeur.name);
                }
            }
        }
        return directeursEtReferents;
    };

    const buildFilters = () => {
        return (
            <>
                <div style={styles.singleFilterContainer}>
                    <Select
                        title={"Directeur ou Référent Projet"}
                        options={getDirecteursEtReferentsProjets()}
                        value={filters.directeurOuReferentsProjet}
                        onChange={(value: string) => {
                            var newFilters = new Filters({ ...filters, directeurOuReferentsProjet: value });
                            //applyFilters(elements, newFilters);
                            setFilters(newFilters);
                        }}
                    />
                </div>

                <div style={styles.singleFilterContainer}>
                    <Select
                        title={"Type d'activité"}
                        options={columns?.types_activite?.map((type_activite) => type_activite.text) ?? []}
                        value={filters.typeActivite}
                        onChange={(value: string) => {
                            var newFilters = new Filters({ ...filters, typeActivite: value });
                            //applyFilters(elements, newFilters);
                            setFilters(newFilters);
                        }}
                    />
                </div>
                <div style={styles.singleFilterContainer}>
                    <Select
                        title={"Politiques publiques"}
                        options={
                            columns?.politiques_publiques?.map((politique_publique) => politique_publique.text) ?? []
                        }
                        value={filters.politiquesPubliques}
                        onChange={(value: string) => {
                            var newFilters = new Filters({ ...filters, politiquesPubliques: value });
                            //applyFilters(elements, newFilters);
                            setFilters(newFilters);
                        }}
                    />
                </div>
                <div style={styles.singleFilterContainer}>
                    <Select
                        title={"Etat"}
                        options={columns?.etats.map((etat) => etat.text) ?? []}
                        value={filters.etat}
                        onChange={(value: string) => {
                            var newFilters = new Filters({ ...filters, etat: value });
                            //applyFilters(elements, newFilters);
                            setFilters(newFilters);
                        }}
                    />
                </div>
            </>
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
                    return buildFilters();
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
