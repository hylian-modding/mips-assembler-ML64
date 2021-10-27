"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaticLabel = exports.isLocalLabel = exports.parseGlobalLabel = exports.LABEL_REGEX_STR = exports.LABEL_CHARS = void 0;
const symbols_1 = require("mips-assembler/dist/js/src/symbols");
exports.LABEL_CHARS = "\\?\\!\\@";
exports.LABEL_REGEX_STR = "@?@?[\\w\\?\\!]+";
var labelRegex = new RegExp("^(" + exports.LABEL_REGEX_STR + ")\\:");
/**
 * Parses a LABEL: expression and adds it to the symbol table.
 * Examples of valid labels:
 *    basicLabel:    excited!Label!:    mystery?Label?:
 *    @@localLabel:  12345:             !?!:
 */
function parseGlobalLabel(state) {
    var results = state.line.match(labelRegex);
    if (results === null)
        return false; // Not a label.
    var name = results[1];
    if (!isLocalLabel(name) && !isStaticLabel(name)) {
        state.currentLabel = name;
    }
    (0, symbols_1.addSymbol)(state, name, getLabelValueFromState(state));
    return name;
}
exports.parseGlobalLabel = parseGlobalLabel;
function isLocalLabel(name) {
    return name.indexOf("@@") === 0;
}
exports.isLocalLabel = isLocalLabel;
function isStaticLabel(name) {
    return name.indexOf("@") === 0 && name[1] !== "@";
}
exports.isStaticLabel = isStaticLabel;
function getLabelValueFromState(state) {
    return (state.memPos + state.outIndex) >>> 0;
}
