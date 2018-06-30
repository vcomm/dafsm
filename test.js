//const dasm = require('./lib/dafsm').DAFSM
const dasm = require('./index').DAFSM

/* test logic */
const context = {
    data: {},
    lib: {
        initialize: function(cntx) { console.log('initialize(): ', Date.now()) },
        funX: function(cntx) { console.log('funX(): ', Date.now()) },
        funY: function(cntx) {console.log('funY(): ', Date.now()) },
        eventing: function(cntx) { console.log('eventing(): ', Date.now()); return true; },
        finalize: function(cntx) { console.log('finalize(): ', Date.now()) },
        report: function(cntx) { console.log('report(): ', Date.now()) },
        finishing: function(cntx) { console.log('finishing(): ', Date.now()) }
    }
}

const logic = {
    id: "Test1",
    type: "FSM", 
    prj:"PRJNAME",
    complete: false,
    context: null, 
    start: {
        func: context.lib.initialize
    },
    stop: {
        func: context.lib.finishing     
     },
     states: {
       init: {
 		name: "InitialState",
        exits: [
            {
                name: "funX",
                func: context.lib.funX
            }
        ],      
        stays: [
            {
                name: "funY",
                func: context.lib.funY
            }
        ],   
        transitions: [
            {
                nextstate: null,//logic.states.final,  
                nextstatename: "final",
                triggers: [
                    {
                        name: "eventing",
                        func: context.lib.eventing
                    }
                ],
                effects: [
                    {
                        name: "finalize",
                        func: context.lib.finalize
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
                func: context.lib.report
            }
        ]
       }       
     }  
}

logic.context = context
dasm.init(logic)

setInterval(() => {
    if (logic.complete) {
        console.log('FSM complete, init logic again for testing...')
        dasm.init(logic)
    }
    dasm.event(logic)
},3000)

//dasm.event(logic)
