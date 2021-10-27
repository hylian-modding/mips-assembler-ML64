"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbols_1 = require("mips-assembler/dist/js/src/symbols");
const labels_1 = require("mips-assembler/dist/js/src/labels");
const functions_1 = require("mips-assembler/dist/js/src/functions");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * .definelabel adds a new symbol.
 * @param state Current assembler state.
 */
function definelabel(state) {
    if (state.lineExpressions.length !== 2) {
        (0, errors_1.throwError)(".definelabel must have two arguments, a label name and value", state);
    }
    var name = state.lineExpressions[0];
    var value = (0, functions_1.runFunction)(state.lineExpressions[1], state);
    if (typeof value !== "number") {
        (0, errors_1.throwError)("The value in .definelabel must evaluate to a numeric value", state);
        return false;
    }
    (0, symbols_1.addSymbol)(state, name, value);
    return true; // Symbol added
}
exports.default = definelabel;
var defineLabelRegex = new RegExp("^\\.definelabel\\s+(" + labels_1.LABEL_REGEX_STR + ")[\\s,]+([-\\w" + labels_1.LABEL_CHARS + "]+)$", "i");
definelabel.matches = function (state) {
    var results = state.line.match(defineLabelRegex);
    return results !== null;
};
