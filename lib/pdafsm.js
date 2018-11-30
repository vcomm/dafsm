
'use strict';

/*
 * Class DAFSM implementation by ES6
 */

class pDafsm {

    constructor(text){
        this._text = text;
    }
    /**
     * Private methods
     */
    getByKey(obj, key, value) {
        if (typeof Array.isArray === 'undefined') {
            Array.isArray = function(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }
        }
        if (Array.isArray(obj)) {
            let item = null
            for (let i=0; i<obj.length; i++) {
                item = obj[i]
                if (item[key] === value)
                    break
            }
            return item
        } else {
            return obj[value]
        }
    }
    eventListener(cntx) {
        let trn = null, trans = null
//        let state = cntx.logic.states[cntx.keystate]
        let state = this.getByKey(cntx.logic.states, "key", cntx.keystate)
        if (state && state.hasOwnProperty("transitions")) {
            for (let i=0; i<state.transitions.length; i++) {
                trans = state.transitions[i]
                if (trans.hasOwnProperty("triggers")) {
                    for(let j=0; j<trans.triggers.length; j++) {
                        if (this.call(trans.triggers[j].name)(cntx))
                            return trn = trans
                    }
                }
            }
        }
        return trn
    }
    stayAction(cntx) {
//        let state = cntx.logic.states[cntx.keystate]
        let state = this.getByKey(cntx.logic.states, "key", cntx.keystate)
        if (state && state.hasOwnProperty("stays")) {
            state.stays.forEach(action => {
                cntx.seqfuncs.push(this.call(action.name))
            })
        }
    }
    gotoNextstate(trans,fsm) {
//        return fsm.states[trans.nextstatename]
        return this.getByKey(fsm.states, "key", trans.nextstatename)
    }
    exitAction(cntx) {
//        let state = cntx.logic.states[cntx.keystate]
        let state = this.getByKey(cntx.logic.states, "key", cntx.keystate)
        if (state && state.hasOwnProperty("exits")) {
            state.exits.forEach(action => {
                cntx.seqfuncs.push(this.call(action.name))
            })
        }
    }
    effectAction(trans,cntx) {
        if (trans.hasOwnProperty("effects")) {
            trans.effects.forEach(action => {
                cntx.seqfuncs.push(this.call(action.name))
            })
        }
    }
    entryAction(cntx) {
//        let state = cntx.logic.states[cntx.keystate]
        let state = this.getByKey(cntx.logic.states, "key", cntx.keystate)
        if (state && state.hasOwnProperty("entries")) {
            state.entries.forEach(action => {
                cntx.seqfuncs.push(this.call(action.name))
            })
        }
    }
    fsmError(message, cause) {
        this.message = message;
        this.cause = cause;
        this.name = 'fsmError';
        this.stack = cause.stack;
    }

    seqCalls(list,cntx) {
        let names = list.map(action=>{return action.name})
        Promise.all(names.map(this.call))
            .then(funcs=>{
                
            })
    }
/*
example for asyn function
    function(next) {
      let context = this;
      new Promise(function(resolve, reject) {
        setTimeout(() => resolve('b'), 80);
      })
        .then(name=>{    
            context.value += `${name}:80,` 
            context[name] = 80;
            next();
        })
    }
example for sync funtion
    function(next) {
        this.value += 'a:0,';
        this['a'] = 0;
        next();
    }    
*/
    queueCalls(funcs, scope, finish) {
        (function next() {
              if(funcs.length > 0) {
                  funcs.shift().apply(scope || {}, [next].concat(Array.prototype.slice.call(arguments, 0)));
              } else {
                  if (finish) finish(scope)
              }    
        })();
    }
    /**
     * Public Implementation fsm single step
     */
    event(cntx) {
//        console.log('running from super class. Text: '+this._text);
//        this.call('init')('starting')
        try {
            if (!cntx.keystate)
                throw new fsmError("FSM error: missing current state", e)
            let trans = this.eventListener(cntx)
            if (trans) {
                let nextstate = this.gotoNextstate(trans,cntx.logic)
                if (nextstate) {
                    cntx.seqfuncs = []
                    this.exitAction(cntx)
                    this.effectAction(trans,cntx)
                    cntx.keystate = nextstate.key
                    this.entryAction(cntx)
                    queueCalls(cntx.seqfuncs, cntx, 
                        (context)=>{ delete context.seqfuncs })
                } else {
                    throw new fsmError("FSM error: next state missing", e);
                }
            } else {
                cntx.seqfuncs = []
                this.stayAction(cntx)
                queueCalls(cntx.seqfuncs, cntx, 
                    (context)=>{ delete context.seqfuncs })
            }
        } catch(e) {
            console.log('Error: ' + e.name + ":" + e.message + "\n" + e.stack);
        } finally {
            let state = cntx.logic.states[cntx.keystate]
            if (state &&
                (!state.hasOwnProperty("transitions") ||
                    state.transitions.length == 0)) {
                cntx.complete = true
            }
            return cntx
        }
    }

    init(fsm,cntx,istate) {
        let initState = istate ? istate : "init"
//      if (fsm.states.hasOwnProperty(initState)) {
        if (this.getByKey(fsm.states, "key", initState)) {
            cntx.complete = false
            cntx.keystate = initState
            cntx.logic = fsm
            console.log("Initialization completed")
            return cntx
        } else {
            console.log("Error: cannot find init state")
            return null
        }
    }
    /**
     * Implementation required
     */
    call() {
        throw new Error('You have to implement the method doSomething!');
    }

}

if (typeof module !== 'undefined' &&
    typeof module.exports !== 'undefined') {
    module.exports.classDafsm = pDafsm
}