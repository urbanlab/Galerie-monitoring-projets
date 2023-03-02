import { Columns, Projet } from "../models";
import { FilterSelect } from "../pages/weatherPage/components/FilterSelect";
import { Filters } from "../pages/weatherPage/weatherModels";
import { styles } from "../pages/weatherPage/WeatherStyle";
interface Props {
    projects: Projet[];
    columns: Columns | undefined;
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

export const getDirecteursEtReferentsProjets = (projects: Projet[]) => {
    var directeursEtReferents: string[] = [];
    for (var project of projects) {
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

export const buildFilters = (projects: Projet[], filters: Filters, columns: Columns | undefined, setFilters: (filters: Filters) => void) => {
    return (
        <>
            <FilterSelect
                title={"Directeur ou Référent Projet"}
                options={getDirecteursEtReferentsProjets(projects)}
                values={filters.directeurOuReferentsProjet}
                onChange={(values: string[]) => {
                    var newFilters = new Filters({ ...filters, directeurOuReferentsProjet: values });
                    setFilters(newFilters);
                }}
            />
            <FilterSelect
                title={"Type d'activité"}
                options={columns?.types_activite?.map((type_activite) => type_activite.text) ?? []}
                values={filters.typeActivite}
                onChange={(values: string[]) => {
                    var newFilters = new Filters({ ...filters, typeActivite: values });
                    setFilters(newFilters);
                }}
            />
            <FilterSelect
                title={"Politiques publiques"}
                options={
                    columns?.politiques_publiques?.map((politique_publique) => politique_publique.text) ?? []
                }
                values={filters.politiquesPubliques}
                onChange={(values: string[]) => {
                    var newFilters = new Filters({ ...filters, politiquesPubliques: values });
                    setFilters(newFilters);
                }}
            />
            <FilterSelect
                title={"Etat"}
                options={columns?.etats.map((etat) => etat.text) ?? []}
                values={filters.etat}
                onChange={(values: string[]) => {
                    var newFilters = new Filters({ ...filters, etat: values });
                    setFilters(newFilters);
                }}
            />

        </>
    );
};

export const FiltersMenu = (props: Props) => {
    const { projects, columns, filters, setFilters } = props;

    return <div style={{ ...styles.menuContainer, padding: "20px 40px", alignItems: "center", maxHeight: '6em' }}>
        {buildFilters(projects, filters, columns, setFilters)}
    </div>
}
