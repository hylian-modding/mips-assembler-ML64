"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConditionalDirective = exports.handleDirective = exports.getDirectiveToRun = void 0;
const definelabel_1 = __importDefault(require("mips-assembler/dist/js/src/directives/definelabel"));
const equ_1 = __importDefault(require("mips-assembler/dist/js/src/directives/equ"));
const org_1 = __importDefault(require("mips-assembler/dist/js/src/directives/org"));
const orga_1 = __importDefault(require("mips-assembler/dist/js/src/directives/orga"));
const align_1 = __importDefault(require("mips-assembler/dist/js/src/directives/align"));
const skip_1 = __importDefault(require("mips-assembler/dist/js/src/directives/skip"));
const fill_1 = __importDefault(require("mips-assembler/dist/js/src/directives/fill"));
const ascii_1 = require("mips-assembler/dist/js/src/directives/ascii");
const byte_1 = __importDefault(require("mips-assembler/dist/js/src/directives/byte"));
const halfword_1 = __importDefault(require("mips-assembler/dist/js/src/directives/halfword"));
const word_1 = __importDefault(require("mips-assembler/dist/js/src/directives/word"));
const float_1 = __importDefault(require("mips-assembler/dist/js/src/directives/float"));
const if_1 = __importDefault(require("mips-assembler/dist/js/src/directives/if"));
const else_1 = __importDefault(require("mips-assembler/dist/js/src/directives/else"));
const elseif_1 = __importDefault(require("mips-assembler/dist/js/src/directives/elseif"));
const endif_1 = __importDefault(require("mips-assembler/dist/js/src/directives/endif"));
const include_1 = __importDefault(require("mips-assembler/dist/js/src/directives/include"));
const beginfile_1 = __importDefault(require("mips-assembler/dist/js/src/directives/beginfile"));
const endfile_1 = __importDefault(require("mips-assembler/dist/js/src/directives/endfile"));
const beqz_1 = __importDefault(require("mips-assembler/dist/js/src/macros/beqz"));
const bnez_1 = __importDefault(require("mips-assembler/dist/js/src/macros/bnez"));
const bnezl_1 = __importDefault(require("mips-assembler/dist/js/src/macros/bnezl"));
const li_1 = __importDefault(require("mips-assembler/dist/js/src/macros/li"));
const move_1 = __importDefault(require("mips-assembler/dist/js/src/macros/move"));
var directives = [
    definelabel_1.default,
    equ_1.default,
    org_1.default,
    orga_1.default,
    align_1.default,
    skip_1.default,
    fill_1.default,
    ascii_1.ascii,
    ascii_1.asciiz,
    byte_1.default,
    halfword_1.default,
    word_1.default,
    float_1.default,
    if_1.default,
    elseif_1.default,
    else_1.default,
    endif_1.default,
    include_1.default,
    beginfile_1.default,
    endfile_1.default,
];
var macros = [
    beqz_1.default,
    bnez_1.default,
    bnezl_1.default,
    li_1.default,
    move_1.default,
];
/**
 * Returns a directive function to run for the given state/line.
 * @param state Current assembler state.
 */
function getDirectiveToRun(state) {
    for (var _i = 0, directives_1 = directives; _i < directives_1.length; _i++) {
        var directive = directives_1[_i];
        if (directive.matches(state)) {
            return directive;
        }
    }
    for (var _a = 0, macros_1 = macros; _a < macros_1.length; _a++) {
        var macro = macros_1[_a];
        if (macro.matches(state)) {
            return macro;
        }
    }
    return null;
}
exports.getDirectiveToRun = getDirectiveToRun;
/**
 * Runs a directive, which changes the assembler state.
 * @param state Current assembler state.
 */
function handleDirective(state, directive) {
    directive(state);
}
exports.handleDirective = handleDirective;
/**
 * Tests if a line represents a conditional block directive.
 * @param line Line from the pre-assembly input
 */
function isConditionalDirective(line) {
    var normalized = line.toLowerCase();
    return startsWith(normalized, ".if")
        || startsWith(normalized, ".else")
        || startsWith(normalized, ".endif");
}
exports.isConditionalDirective = isConditionalDirective;
function startsWith(str, search) {
    return str.substr(0, search.length) === search;
}
