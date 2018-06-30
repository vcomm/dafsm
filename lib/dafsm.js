'use strict';
/* 
logic = {
    id: "Test1",
    type: "FSM", //FSM, CPN, INDX
    prj:"PRJNAME",
    complete: false,
    context: {
        data: {},
        lib: {
            initialize: function(cntx) {},
            funX: function(cntx) {},
            funY: function(cntx) {},
            eventing: function(cntx) { return true/false },
            finalize: function(cntx) {},
            report: function(cntx) {},
            finishing: function(cntx) {}
        }
    }, // user data flow maybe with functions define 
    start: {
        func: this.context.lib.initialize
    },
    stop: {
        func: this.context.lib.finishing     
     },
     states: {
       init: {
 		name: "InitialState",
        exits: [
            {
                name: "funX",
                func: this.context.lib.funX
            }
        ],      
        stays: [
            {
                name: "funY",
                func: this.context.lib.funY
            }
        ],   
        transitions: [
            {
                nextstate: this.states.final,  //?
                nextstatename: "final",
                triggers: [
                    {
                        name: "eventing",
                        func: this.context.lib.eventing
                    }
                ],
                effects: [
                    {
                        name: "finalize",
                        func: this.context.lib.finalize
                    }
                ]
            }
        ]           
       },
       final: {
        name: "FinalState",										
        entries: [
            {
                name: "report",
                func: this.context.lib.report
            }
        ]
       }       
     }  
   }
*/

let DAFSM = (function () {

    function eventListener(fsm) {
        let trn = null
        if (fsm.state.hasOwnProperty("transitions")) {
            fsm.state.transitions.forEach(trans => {
                if (trans.hasOwnProperty("triggers")) {
                    trans.triggers.forEach(trig => {
                        if (trig.func(fsm.context))
                            return trn = trans
                    })
                }
            })
            
        }
        return trn  
    }
    function stayAction(fsm) {
        if (fsm.state.hasOwnProperty("stays")) {
            fsm.state.stays.forEach(action => {
                action.func(fsm.context)
            })
        }
    }
    function gotoNextstate(trans,fsm) {
        return trans.nextstate ? trans.nextstate : fsm.states[trans.nextstatename]	
    }
    function exitAction(fsm) {
        if (fsm.state.hasOwnProperty("exits")) {
            fsm.state.exits.forEach(action => {
                action.func(fsm.context)
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
    function entryAction(fsm) {
        if (fsm.state.hasOwnProperty("entries")) {
            fsm.state.entries.forEach(action => {
                action.func(fsm.context)
            })
        }
    }     
    function fsmError(message, cause) {
        this.message = message;
        this.cause = cause;
        this.name = 'fsmError';
        this.stack = cause.stack;
    }
    function test() {
        console.log('test')
    }
    return {
        event: function(fsm) {
            try {
                console.log('Event received: ')

                if (!fsm.state)
                    throw new fsmError("FSM error: missing current state", e)
                let trans = eventListener(fsm)
                if (trans) {
                    let nextstate = gotoNextstate(trans,fsm)
                    if (nextstate) {
                        exitAction(fsm)
                        effectAction(trans,fsm.context)   
                        fsm.state = nextstate 
                        entryAction(fsm)    
                    } else {
                        throw new fsmError("FSM error: next state missing", e);
                    }
                } else {
                    stayAction(fsm)
                }
            } catch(e) {
                console.log('Error: ' + e.name + ":" + e.message + "\n" + e.stack);
            } finally  {
				if (!fsm.state.hasOwnProperty("transitions") || 
                     fsm.state.transitions.length == 0) {
					 fsm.complete = true
				}                
                return fsm.state
            } 
        },
        load: function() {

        },
        store: function() {

        },
        graph: function() {

        },
        init: function(logic) {
            if (logic.states.hasOwnProperty("init")) {
                logic.complete = false
                logic.state = logic.states["init"]	
                console.log("Compilation completed")
            } else {
                console.log("Error: cannot find init state")
            }            
        }  
    }
})() 

module.exports.DAFSM = DAFSM

