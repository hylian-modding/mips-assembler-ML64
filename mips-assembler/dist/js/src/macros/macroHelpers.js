"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMacroRegExp = exports.basicMacroMatcher = void 0;
function basicMacroMatcher(macroAlias) {
    var regex = makeMacroRegExp(macroAlias);
    return function (state) { return !!state.line.match(regex); };
}
exports.basicMacroMatcher = basicMacroMatcher;
function makeMacroRegExp(macroAlias) {
    return new RegExp("^" + macroAlias + "\\s+", "i");
}
exports.makeMacroRegExp = makeMacroRegExp;
