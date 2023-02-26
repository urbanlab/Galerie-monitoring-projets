const spacing = "3px";
const leftMargin = 60;

export const styles: any = {
    filtersContainer: {
        display: "flex",
        marginLeft: spacing,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ebebeb",
        padding: "0px 40px",
        height: "6em",
        boxShadow: "-1px 1px 3px 0px rgba(0,0,0,0.3)",
    },

    singleFilterContainer: {
        display: "flex",
        //flex:1,
    },

    button: {
        display: "flex",
        flex: 1,
        padding: "0px 40px",
        //justifyContent: 'center',
        alignItems: "center",
        boxShadow: "-1px 1px 3px 0px rgba(0,0,0,0.3)",
    },

    selected: {
        color: "black",
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
    menuContainer: {
        display: "flex",
        alignItems: "stretch",
        marginLeft: leftMargin,
    },
    spacing: spacing,

    leftMargin: leftMargin,

    chartContainer: {
        marginTop: "1em",
        display: "flex",
        justifyContent: "flex-end",
    },
};
