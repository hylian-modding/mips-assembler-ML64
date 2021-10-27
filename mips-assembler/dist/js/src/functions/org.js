"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.org = void 0;
/** Current memory address */
function org(state, value) {
    return state.memPos + state.outIndex;
}
exports.org = org;
;
