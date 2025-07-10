export const calculateDiscount = (
    total: number,
    type: "fixed" | "percentage",
    value: number
) => {
    return type === "fixed" ? value : Math.floor((value/100) * total)
}