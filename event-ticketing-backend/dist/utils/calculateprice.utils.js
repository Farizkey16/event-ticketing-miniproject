"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDiscount = void 0;
const calculateDiscount = (total, type, value) => {
    return type === "fixed" ? value : Math.floor((value / 100) * total);
};
exports.calculateDiscount = calculateDiscount;
