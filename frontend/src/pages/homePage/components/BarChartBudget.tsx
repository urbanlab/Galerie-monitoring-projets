import { ResponsiveBar } from "@nivo/bar";
import { Columns, Projet } from "../../../models";

interface Props {
    projects: Projet[];
    columns: Columns | undefined;
}

interface ColorMap {
    [key: string]: string;
}

const getBudgetByActivity = (projets: Projet[]) => {
    const data: { activity: string; budget: number }[] = [];
    projets.forEach((projet) => {
        if (projet.type_activite?.text != null) {
            if (projet.budget_global != null) {
                const index = data.findIndex((a) => a.activity === projet.type_activite?.text);
                const activity = projet.type_activite?.text;
                if (index === -1) {
                    data.push({
                        activity,
                        budget: projet.budget_global,
                    });
                } else {
                    data[index].budget += projet.budget_global;
                }
            } else {
                const index = data.findIndex((a) => a.activity === projet.type_activite?.text);
                const activity = projet.type_activite?.text;
                if (index === -1) {
                    data.push({
                        activity,
                        budget: 0,
                    });
                }
            }
        }
    });
    return data;
};

const BarChartBudget = (props: Props) => {
    const { projects, columns } = props;
    const activity = columns?.types_activite?.map((activity) => activity.text) ?? [];
    console.log(activity);
    const data = getBudgetByActivity(projects);
    console.log(data);
    return (
        <ResponsiveBar
            data={data}
            keys={["budget"]}
            indexBy="activity"
            margin={{ top: 20, right: 130, bottom: 70, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            borderWidth={0}
            borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -20,
                legend: "",
                legendPosition: "middle",
                legendOffset: 32,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Budget total",
                legendPosition: "middle",
                legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
            }}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={function (e) {
                return e.id + ": " + e.formattedValue + " in budgetry: " + e.indexValue;
            }}
        />
    );
};
export default BarChartBudget;
