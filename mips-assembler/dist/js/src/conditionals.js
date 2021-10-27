"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIfElseBlockState = exports.IfElseBlockStateMask = exports.IfElseStateFlags = void 0;
(function (IfElseStateFlags) {
    /** Unused */
    IfElseStateFlags[IfElseStateFlags["None"] = 0] = "None";
    /**
     * We are within an if block, but haven't reached a part we should execute.
     */
    IfElseStateFlags[IfElseStateFlags["AcceptingBlock"] = 1] = "AcceptingBlock";
    /** We are executing code within an if/else block. */
    IfElseStateFlags[IfElseStateFlags["ExecutingBlock"] = 2] = "ExecutingBlock";
    /**
     * We have already executed an if or elseif block, and are passing over
     * remaining instructions.
     */
    IfElseStateFlags[IfElseStateFlags["NoLongerAcceptingBlock"] = 4] = "NoLongerAcceptingBlock";
    /** Flag set once a plain else directive is encountered. */
    IfElseStateFlags[IfElseStateFlags["SawElse"] = 8] = "SawElse";
})(exports.IfElseStateFlags || (exports.IfElseStateFlags = {}));
/** Mask for checking current block state. */
exports.IfElseBlockStateMask = exports.IfElseStateFlags.AcceptingBlock
    | exports.IfElseStateFlags.ExecutingBlock
    | exports.IfElseStateFlags.NoLongerAcceptingBlock;
function setIfElseBlockState(state, newBlockState) {
    state.ifElseStack[state.ifElseStack.length - 1] &= ~exports.IfElseBlockStateMask;
    state.ifElseStack[state.ifElseStack.length - 1] |= newBlockState;
}
exports.setIfElseBlockState = setIfElseBlockState;
