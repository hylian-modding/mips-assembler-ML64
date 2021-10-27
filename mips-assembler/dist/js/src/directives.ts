import definelabel from "mips-assembler/dist/js/src/directives/definelabel";
import equ from "mips-assembler/dist/js/src/directives/equ";
import org from "mips-assembler/dist/js/src/directives/org";
import orga from "mips-assembler/dist/js/src/directives/orga";
import align from "mips-assembler/dist/js/src/directives/align";
import skip from "mips-assembler/dist/js/src/directives/skip";
import fill from "mips-assembler/dist/js/src/directives/fill";
import { ascii, asciiz } from "mips-assembler/dist/js/src/directives/ascii";
import byte from "mips-assembler/dist/js/src/directives/byte";
import halfword from "mips-assembler/dist/js/src/directives/halfword";
import word from "mips-assembler/dist/js/src/directives/word";
import float from "mips-assembler/dist/js/src/directives/float";
import ifcond from "mips-assembler/dist/js/src/directives/if";
import elseblock from "mips-assembler/dist/js/src/directives/else";
import elseif from "mips-assembler/dist/js/src/directives/elseif";
import endif from "mips-assembler/dist/js/src/directives/endif";
import include from "mips-assembler/dist/js/src/directives/include";
import beginfile from "mips-assembler/dist/js/src/directives/beginfile";
import endfile from "mips-assembler/dist/js/src/directives/endfile";
import beqz from "mips-assembler/dist/js/src/macros/beqz";
import bnez from "mips-assembler/dist/js/src/macros/bnez";
import bnezl from "mips-assembler/dist/js/src/macros/bnezl";
import li from "mips-assembler/dist/js/src/macros/li";
import move from "mips-assembler/dist/js/src/macros/move";
var directives = [
    definelabel,
    equ,
    org,
    orga,
    align,
    skip,
    fill,
    ascii,
    asciiz,
    byte,
    halfword,
    word,
    float,
    ifcond,
    elseif,
    elseblock,
    endif,
    include,
    beginfile,
    endfile,
];
var macros = [
    beqz,
    bnez,
    bnezl,
    li,
    move,
];
/**
 * Returns a directive function to run for the given state/line.
 * @param state Current assembler state.
 */
export function getDirectiveToRun(state) {
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
/**
 * Runs a directive, which changes the assembler state.
 * @param state Current assembler state.
 */
export function handleDirective(state, directive) {
    directive(state);
}
/**
 * Tests if a line represents a conditional block directive.
 * @param line Line from the pre-assembly input
 */
export function isConditionalDirective(line) {
    var normalized = line.toLowerCase();
    return startsWith(normalized, ".if")
        || startsWith(normalized, ".else")
        || startsWith(normalized, ".endif");
}
function startsWith(str, search) {
    return str.substr(0, search.length) === search;
}
