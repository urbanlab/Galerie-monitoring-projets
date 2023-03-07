const spacing = "3px";
const chartMargin = 60; //marge à gauche et en dessous du container svg du graphique pour afficher les axes correctement

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
    menuFrame: {
        ...frame,
        display: "flex",
        marginLeft: spacing,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: "10px 20px",
        height: "6em",
    },

    menuElementContainer: {
        display: "flex",
        flexDirection: "column",
        height: '100%',
        justifyContent: "flex-start",
        margin: '0px 20px',
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
        alignItems: "flex-end",
    },

    menuTitle: {
        fontSize: 16,
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxLines: 1,
        display: 'inline-block',
        wordWrap: 'break-word',
        height: 20,
    },
    formControlLabel: {
        fontFamily: 'Montserrat',
    },

};
