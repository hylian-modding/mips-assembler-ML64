"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = void 0;
function throwError(message, state) {
    throw new Error(message + "\nLine: " + state.line);
}
exports.throwError = throwError;
