'use strict'

const es6Patern = (function () {

    function sourceGenerator(logic) {
        let str = ''
        try {
            str += `         ${logic.start.name}: function(cntx) { }\n`+
                   `        ,${logic.stop.name}: function(cntx) { }\n`

            for(let key of Object.keys(logic.states)) {
                let state = logic.states[key];
                if (state.hasOwnProperty("exits")) {
                    state.exits.forEach(action => {
                        str += `        ,${action.name}: function(cntx) { }\n`
                    })
                }
                if (state.hasOwnProperty("stays")) {
                    state.stays.forEach(action => {
                        str += `        ,${action.name}: function(cntx) { }\n`
                    })
                }
                if (state.hasOwnProperty("entries")) {
                    state.entries.forEach(action => {
                        str += `        ,${action.name}: function(cntx) { }\n`
                    })
                }
                if (state.hasOwnProperty("transitions")) {
                    state.transitions.forEach(trans => {
                        if (trans.hasOwnProperty("triggers")) {
                            trans.triggers.forEach(trig => {
                                str += `        ,${trig.name}: function(cntx) { }\n`
                            })
                        }
                        if (trans.hasOwnProperty("effects")) {
                            trans.effects.forEach(effect => {
                                str += `        ,${effect.name}: function(cntx) { }\n`
                            })
                        }
                    })
                }
            }
        } catch(e) {
            console.error('Error: ' + e.name + ":" + e.message + "\n" + e.stack);
        } finally {
            return str;
        }        
    }
    return {
        code: function (fsm,bside,library) {
            let code = `'use strict'\n\n`
            if (bside) {
                code += `const Dafsm = require('dafsm').classDafsm\n\n`
            } else {
                code += `\n // include in html <script src='/scripts/dafsm/lib/cdafsm.js'></script>`;
            }
            code += `\n\n let ${library} = { }`
            code += `\n\n class Wrapper extends Dafsm {`
            code += `\n\n    constructor(name){`
            code += `\n       super(name)`
            code += `\n       this._lib = {\n`
            code += sourceGenerator(fsm)
            code += `\n       }`
            code += `\n    }`
            code += `\n\n    call(fname) { return this._lib[fname] }`
            code += `\n\n    runStep(cntx) { super.event(cntx) }`
            code += `\n\n    startLogic(cntx) {`
            code += `\n       if(cntx.logic && !cntx.complete) {`
            code += `\n          this.call(cntx.logic.start.name)(cntx)`
            code += `\n       }`
            code += `\n    }`
            code += `\n\n    stopLogic(cntx) {`
            code += `\n       if(cntx.logic && !cntx.complete) {`
            code += `\n          this.call(cntx.logic.stop.name)(cntx)`
            code += `\n       }`
            code += `\n    }`
            code += `\n\n }`
            
            return code;
        }
    }
})()

module.exports = es6Patern