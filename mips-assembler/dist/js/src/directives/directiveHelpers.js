"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNumericExprListRegExp = exports.makeBasicDirectiveRegExp = exports.basicDirectiveMatcher = void 0;
const expressions_1 = require("mips-assembler/dist/js/src/expressions");
function basicDirectiveMatcher(directiveAlias, noArgs) {
    var regex = makeBasicDirectiveRegExp(directiveAlias, noArgs);
    return function (state) { return !!state.line.match(regex); };
}
exports.basicDirectiveMatcher = basicDirectiveMatcher;
function makeBasicDirectiveRegExp(directiveAlias, noArgs) {
    return new RegExp("^\\." + directiveAlias + (noArgs ? "" : "\\s+"), "i");
}
exports.makeBasicDirectiveRegExp = makeBasicDirectiveRegExp;
function makeNumericExprListRegExp(directiveAlias) {
    return new RegExp("^\\." + directiveAlias + "\\s+([" + expressions_1.EXPR_CHARS + "]+)$", "i");
}
exports.makeNumericExprListRegExp = makeNumericExprListRegExp;
