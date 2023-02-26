type ColorScheme = {
    name: string;
    bgColor: string;
};

const tableData: ColorScheme[] = [
    {
        name: "Default",
        bgColor: "#E1E1E1",
    },
    {
        name: "Gray",
        bgColor: "#EBECED",
    },
    {
        name: "Brown",
        bgColor: "#E9E5E3",
    },
    {
        name: "Orange",
        bgColor: "#FAEBDD",
    },
    {
        name: "Yellow",
        bgColor: "#FBF3DB",
    },
    {
        name: "Green",
        bgColor: "#DDEDEA",
    },
    {
        name: "Blue",
        bgColor: "#DDEBF1",
    },
    {
        name: "Purple",
        bgColor: "#EAE4F2",
    },
    {
        name: "Pink",
        bgColor: "#F4DFEB",
    },
    {
        name: "Red",
        bgColor: "#FBE4E4",
    },
];

function getBgColorByName(name: string): string {
    const colorScheme = tableData.find((data) => data.name.toLowerCase() === name.toLowerCase());
    return colorScheme?.bgColor || "white";
}

export default getBgColorByName;
