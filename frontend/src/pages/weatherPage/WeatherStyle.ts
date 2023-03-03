const spacing = "3px";
const chartMargin = 60;

const frame = {
    backgroundColor: "#ebebeb",
    boxShadow: "-1px 1px 3px 0px rgba(0,0,0,0.3)",
}

export const styles: any = {
    menuContainer: {
        display: "flex",
        alignItems: "stretch",
        //marginLeft: chartMargin,
    },
    frame: frame,
    filtersContainer: {
        ...frame,
        display: "flex",
        marginLeft: spacing,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px 40px",
        height: "6em",
    },

    singleFilterContainer: {
        display: "flex",
        flex: 1,
        margin: '0px 10px',
        textAlign: "start",
    },

    button: {
        display: "flex",
        flex: 1,
        padding: "0px 40px",
        alignItems: "center",
        boxShadow: "-1px 1px 3px 0px rgba(0,0,0,0.3)",
    },

    selected: {
        color: "black",
        fontWeight: 600,
        backgroundColor: "#ebebeb",
    },
    unselected: {
        color: "#888888",
        backgroundColor: "#f4f4f4",
    },
    buttonsContainer: {
        display: "flex",
        flexDirection: "column",
    },

    spacing: spacing,

    chartMargin: chartMargin,

    chartContainer: {
        marginTop: "1em",
        display: "flex",
    },

    sliderContainer: {
        ...frame,
        marginLeft: chartMargin,
        alignItems: "flex-end",

    }
};
