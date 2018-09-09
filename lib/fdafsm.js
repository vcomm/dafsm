'use strict';

/*
Factory DAFSM
 */

let FDAFSM = (function () {

    function eventListener(cntx) {
        let trn = null, trans = null
        let state = cntx.logic.states[cntx.keystate]
        if (state && state.hasOwnProperty("transitions")) {
            for (let i=0; i<state.transitions.length; i++) {
                trans = state.transitions[i]
                if (trans.hasOwnProperty("triggers")) {
                    for(let j=0; j<trans.triggers.length; j++) {
                        if (trans.triggers[j].func(cntx))
                            return trn = trans
                    }
                }
            }
        }
        return trn
    }
    function stayAction(cntx) {
        let state = cntx.logic.states[cntx.keystate]
        if (state && state.hasOwnProperty("stays")) {
            state.stays.forEach(action => {
                action.func(cntx)
            })
        }
    }
    function gotoNextstate(trans,fsm) {
        return trans.nextstate ? trans.nextstate : fsm.states[trans.nextstatename]
    }
    function exitAction(cntx) {
        let state = cntx.logic.states[cntx.keystate]
        if (state && state.hasOwnProperty("exits")) {
            state.exits.forEach(action => {
                action.func(cntx)
            })
        }
    }
    function effectAction(trans,cntx) {
        if (trans.hasOwnProperty("effects")) {
            trans.effects.forEach(action => {
                action.func(cntx)
            })
        }
    }
    function entryAction(cntx) {
        let state = cntx.logic.states[cntx.keystate]
        if (state && state.hasOwnProperty("entries")) {
            state.entries.forEach(action => {
                action.func(cntx)
            })
        }
    }
    function fsmError(message, cause) {
        this.message = message;
        this.cause = cause;
        this.name = 'fsmError';
        this.stack = cause.stack;
    }
    return {
        event: function(cntx) {
            try {
                console.log('Event received: ')

                if (!cntx.keystate)
                    throw new fsmError("FSM error: missing current state", e)
                let trans = eventListener(cntx)
                if (trans) {
                    let nextstate = gotoNextstate(trans,cntx.logic)
                    if (nextstate) {
                        exitAction(cntx)
                        effectAction(trans,cntx)
                        cntx.keystate = nextstate.key
                        entryAction(cntx)
                    } else {
                        throw new fsmError("FSM error: next state missing", e);
                    }
                } else {
                    stayAction(cntx)
                }
            } catch(e) {
                console.log('Error: ' + e.name + ":" + e.message + "\n" + e.stack);
            } finally  {
                let state = cntx.logic.states[cntx.keystate]
                if (state &&
                   (!state.hasOwnProperty("transitions") ||
                    state.transitions.length == 0)) {
                    cntx.complete = true
                }
                return cntx
            }
        },
        init: function(fsm,cntx,istate) {
            let initState = istate ? istate : "init"
            if (fsm.states.hasOwnProperty(initState)) {
                cntx.complete = false
                cntx.keystate = initState
                cntx.logic = fsm
                console.log("Initialization completed")
                return cntx
            } else {
                console.log("Error: cannot find init state")
                return null
            }
        },
        link: function (logic,context) {
            try {
                logic.start.func = context.lib[logic.start.name];
                logic.stop.func  = context.lib[logic.stop.name];

                for(let key of Object.keys(logic.states)) {
                    let state = logic.states[key];
                    if (state.hasOwnProperty("exits")) {
                        state.exits.forEach(action => {
                            action.func = context.lib[action.name];
                        })
                    }
                    if (state.hasOwnProperty("stays")) {
                        state.stays.forEach(action => {
                            action.func = context.lib[action.name];
                        })
                    }
                    if (state.hasOwnProperty("entries")) {
                        state.entries.forEach(action => {
                            action.func = context.lib[action.name];
                        })
                    }
                    if (state.hasOwnProperty("transitions")) {
                        state.transitions.forEach(trans => {
                            if (trans.hasOwnProperty("triggers")) {
                                trans.triggers.forEach(trig => {
                                    trig.func = context.lib[trig.name];
                                })
                            }
                            if (trans.hasOwnProperty("effects")) {
                                trans.effects.forEach(effect => {
                                    effect.func = context.lib[effect.name];
                                })
                            }
                        })
                    }
                }
            } catch(e) {
                console.log('Error: ' + e.name + ":" + e.message + "\n" + e.stack);
            } finally {
                console.log("Compilation completed")
                return logic;
            }
        }
    }
})()

if (typeof module !== 'undefined' &&
    typeof module.exports !== 'undefined') {
    module.exports.FDAFSM = FDAFSM
}