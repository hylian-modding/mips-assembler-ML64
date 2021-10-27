"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymbolByValue = exports.getSymbolValue = exports.popStaticLabelStateLevel = exports.pushStaticLabelStateLevel = exports.addStaticLabel = exports.addLocalSymbol = exports.addGlobalSymbol = exports.addSymbol = void 0;
const labels_1 = require("mips-assembler/dist/js/src/labels");
const types_1 = require("mips-assembler/dist/js/src/types");
const errors_1 = require("mips-assembler/dist/js/src/errors");
/**
 * Adds a symbol to the symbol table.
 * @param state Assembler state
 * @param name Symbol name
 * @param value Symbol value
 */
function addSymbol(state, name, value) {
    if ((0, labels_1.isLocalLabel)(name)) {
        if (!state.currentLabel) {
            (0, errors_1.throwError)("Local label " + name + " (starts with @@) cannot be used before a global label", state);
        }
        addLocalSymbol(state, name, value);
    }
    else if ((0, labels_1.isStaticLabel)(name)) {
        addStaticLabel(state, name, value);
    }
    else {
        addGlobalSymbol(state, name, value);
    }
}
exports.addSymbol = addSymbol;
/**
 * Adds a global symbol to the symbol table.
 * @param state Assembler state
 * @param name Symbol name
 * @param value Symbol value
 */
function addGlobalSymbol(state, name, value) {
    state.symbols[name] = value;
    state.symbolsByValue[value] = name;
    if (state.symbolOutputMap) {
        state.symbolOutputMap[name] = state.outIndex;
    }
}
exports.addGlobalSymbol = addGlobalSymbol;
/**
 * Adds a local symbol to the symbol table.
 * @param state Assembler state
 * @param name Local symbol name
 * @param value Local symbol value
 *
 * Assumes !!state.currentLabel
 */
function addLocalSymbol(state, name, value) {
    var localTable = state.localSymbols[state.currentLabel];
    if (!localTable) {
        localTable = state.localSymbols[state.currentLabel] = Object.create(null);
    }
    localTable[name] = value;
}
exports.addLocalSymbol = addLocalSymbol;
function addStaticLabel(state, name, value) {
    var staticsTable = state.staticSymbols[state.staticSymbols.length - 1];
    staticsTable[name] = value;
}
exports.addStaticLabel = addStaticLabel;
function pushStaticLabelStateLevel(state) {
    if (state.currentPass === types_1.AssemblerPhase.firstPass) {
        state.staticSymbols.push(Object.create(null));
        var prevIndex = state.staticSymbolIndices[state.staticSymbolIndices.length - 1];
        var newIndex = state.staticSymbols.length - 1;
        state.staticSymbolIndices.before[newIndex] = prevIndex;
        state.staticSymbolIndices.push(newIndex);
    }
    else {
        state.staticSymbolIndices.shift();
    }
}
exports.pushStaticLabelStateLevel = pushStaticLabelStateLevel;
function popStaticLabelStateLevel(state) {
    if (state.currentPass === types_1.AssemblerPhase.firstPass) {
        var indices = state.staticSymbolIndices;
        indices.push(indices.before[indices[indices.length - 1]]);
    }
    else {
        state.staticSymbolIndices.shift();
    }
}
exports.popStaticLabelStateLevel = popStaticLabelStateLevel;
function getCurrentStaticSymbols(state) {
    if (state.currentPass === types_1.AssemblerPhase.firstPass) {
        return state.staticSymbols[state.staticSymbolIndices[state.staticSymbolIndices.length - 1]];
    }
    else {
        return state.staticSymbols[state.staticSymbolIndices[0]];
    }
}
/**
 * Retrieves a symbol by name. Works for all: global, static, or local.
 */
function getSymbolValue(state, name) {
    if ((0, labels_1.isLocalLabel)(name)) {
        if (!state.currentLabel) {
            (0, errors_1.throwError)("Local label " + name + " cannot be referenced in the current scope", state);
        }
        var localTable = state.localSymbols[state.currentLabel];
        if (localTable && Object.prototype.hasOwnProperty.call(localTable, name)) {
            return localTable[name];
        }
        return null;
    }
    if ((0, labels_1.isStaticLabel)(name)) {
        var staticTable = getCurrentStaticSymbols(state);
        if (Object.prototype.hasOwnProperty.call(staticTable, name)) {
            return staticTable[name];
        }
        return null;
    }
    if (Object.prototype.hasOwnProperty.call(state.symbols, name)) {
        return state.symbols[name];
    }
    return null;
}
exports.getSymbolValue = getSymbolValue;
/**
 * Retrieves a symbol by value from the symbol table.
 * Does not retrieve local labels.
 * TODO: Should do static labels too.
 */
function getSymbolByValue(state, value) {
    // Don't need hasOwnProperty check here, all values in key->value should be truthy strings.
    return state.symbolsByValue[value] || null;
}
exports.getSymbolByValue = getSymbolByValue;
