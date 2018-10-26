'use strict';

const jsPatern = (function () {
    
    function sourceGenerator(logic) {
        let str = ''
        try {
            str += `      ${logic.start.name}: function(cntx) {\n      }\n`+
                `     ,${logic.stop.name}: function(cntx) {\n      }\n`

            if (Array.isArray(logic.states))
                logic.states.forEach(state => {
                    if (state.hasOwnProperty("exits")) {
                        state.exits.forEach(action => {
                            str += `     ,${action.name}: function(cntx) {\n      }\n`
                        })
                    }
                    if (state.hasOwnProperty("stays")) {
                        state.stays.forEach(action => {
                            str += `     ,${action.name}: function(cntx) {\n      }\n`
                        })
                    }
                    if (state.hasOwnProperty("entries")) {
                        state.entries.forEach(action => {
                            str += `     ,${action.name}: function(cntx) {\n      }\n`
                        })
                    }
                    if (state.hasOwnProperty("transitions")) {
                        state.transitions.forEach(trans => {
                            if (trans.hasOwnProperty("triggers")) {
                                trans.triggers.forEach(trig => {
                                    str += `     ,${trig.name}: function(cntx) {\n      }\n`
                                })
                            }
                            if (trans.hasOwnProperty("effects")) {
                                trans.effects.forEach(effect => {
                                    str += `     ,${effect.name}: function(cntx) {\n      }\n`
                                })
                            }
                        })
                    }
                })
            else
                for(let key of Object.keys(logic.states)) {
                    let state = logic.states[key]
                    if (state.hasOwnProperty("exits")) {
                        state.exits.forEach(action => {
                            str += `     ,${action.name}: function(cntx) {\n      }\n`
                        })
                    }
                    if (state.hasOwnProperty("stays")) {
                        state.stays.forEach(action => {
                            str += `     ,${action.name}: function(cntx) {\n      }\n`
                        })
                    }
                    if (state.hasOwnProperty("entries")) {
                        state.entries.forEach(action => {
                            str += `     ,${action.name}: function(cntx) {\n      }\n`
                        })
                    }
                    if (state.hasOwnProperty("transitions")) {
                        state.transitions.forEach(trans => {
                            if (trans.hasOwnProperty("triggers")) {
                                trans.triggers.forEach(trig => {
                                    str += `     ,${trig.name}: function(cntx) {\n      }\n`
                                })
                            }
                            if (trans.hasOwnProperty("effects")) {
                                trans.effects.forEach(effect => {
                                    str += `     ,${effect.name}: function(cntx) {\n      }\n`
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
        code: function (fsm,type,library) {
            let code = `'use strict';\n\nlet ${library} = {\n` +
                '    ev_Proc: function(msg) {\n ' +
                '       // some receive msg processing\n' +
                `       // for nodejs call: dafsm.event(${library}.fsm)\n` +
                `       // for webjs  call: DAFSM.event(${library}.fsm)\n` +
                '    },\n' +
                '    lib: {\n'
            
            code += sourceGenerator(fsm)

            code += '    }\n' +
                '}\n'

            code += '\nlet wrapper  = (function () {\n' +
                '    let logicsStore = {};\n'
            if (type === 'nodejs')  {
                code += '    const dafsm = require(\'dafsm\').FDAFSM'
            }
            code += '\n' +
                '    return {\n'

            if (type === 'nodejs') {
                code += '        loadLogic: function(name) {\n' +
                    '            logicsStore[name] = require(\'./logic/\'+name+\'.json\')\n' +
                    '        }\n' +
                    '        ,attachLogic: function(name,mycntx,cblk) {\n' +
                    '           new Promise(function(resolve, reject) {\n' +
                    '                if(logicsStore[name]) {\n' +
                    '                    resolve(logicsStore[name])\n' +
                    '                } else {\n' +
                    '                    reject(new Error("Logic not exist!"))\n' +
                    '                }\n' +
                    '           })\n' +
                    '                .then(fsm => {\n' +
                    `                    return dafsm.link(fsm,${library})\n` +
                    '                })\n' +
                    '                .then(fsm => {\n' +
                    '                    logicsStore[name] = fsm\n' +
                    '                    dafsm.init(fsm,mycntx)\n' +
                    `                    ${library}.com = new comModule(${library}.ev_Proc)\n` +
                    '                    if (cblk) {\n' +
                    '                        cblk(mycntx)\n' +
                    '                    }\n' +
                    '                })\n' +
                    '                .catch(function catchErr(error) {\n' +
                    '                    if (error) console.error(error)\n' +
                    '                });\n' +
                    '        }\n'+
                    '        ,runStep: function(cntx) {\n'+
                    '            dafsm.event(cntx)\n'+
                    '        }\n'
            } else {
                code += '        loadLogic: function(name,cblk) {\n' +
                    '          fetch(\'/blogic?lname=\'+name, {\n' +
                    '            method: \'get\',\n' +
                    '            headers: {\n' +
                    '                \'Content-Type\': \'application/json\'\n' +
                    '            },\n' +
                    '            body: null\n' +
                    '          })\n' +
                    '            .then(res => { return res.json(); })\n' +
                    '            .then(data => {\n' +
                    '               logicsStore[name] = data;\n'+
                    '               if (cblk) cblk(name)\n'+
                    '             })\n' +
                    '            .catch(function catchErr(error) {\n' +
                    '                console.error(error);\n' +
                    '                alert(\'Failed to: \', param.route);\n' +
                    '            });\n' +
                    '        }\n' +
                    '        ,attachLogic: function(name,cblk) {\n' +
                    '           new Promise(function(resolve, reject) {\n' +
                    '                if(logicsStore[name]) {\n' +
                    '                    resolve(logicsStore[name])\n' +
                    '                } else {\n' +
                    '                    reject(new Error("Logic not exist!"))\n' +
                    '                }\n' +
                    '           })\n' +
                    '                .then(fsm => {\n' +
                    `                    return DAFSM.link(fsm,${library})\n` +
                    '                })\n' +
                    '                .then(fsm => {\n' +
                    '                    logicsStore[name] = DAFSM.init(fsm)\n' +
                    `                    ${library}.fsm = logicsStore[name]\n` +
                    `                    ${library}.com = new comModule(${library}.ev_Proc)\n` +
                    '                    if (cblk) {\n' +
                    '                        cblk(logicsStore[name])\n' +
                    '                    }\n' +
                    '                })\n' +
                    '                .catch(function catchErr(error) {\n' +
                    '                    if (error) console.error(error)\n' +
                    '                });\n' +
                    '        }\n'
            }

            code += '    }\n' +
                '})()\n'

            if (type === 'nodejs') {
                code += `\nmodule.exports = wrapper\n`+
                '// insert in main file \n'+
                '// let myContent = { id: "test"}\n'+
                '// const lserver = require("./wrapper")\n'+
                '// lserver.loadLogic("client")\n'+
                '// lserver.attachLogic("client", myContent, function (cntx) {\n'+
                '//    cntx.logic.start.func(cntx)\n'+
                '//})'
            } else {  // webjs
                code += `\nwindow.addEventListener('load', function () {`+
                    `\nconst name = 'logicName'`+
                    `\nwrapper.loadLogic(name, function (lname) {`+
                    `\n  wrapper.attachLogic(lname,function (fsm) {`+
                    `\n       fsm.cntx = ${library}`+
                    `\n       fsm.start.func(fsm.cntx)`+
                    `\n  })`+
                    `\n})`+
                    `\n}, false);`+
                    `\nwindow.addEventListener('unload', function () {`+
                    `\n})`+
                    "\n // include in html <script src='/scripts/dafsm/lib/dafsm.js'></script>"
            }
            return code;
        }
    }
})()

module.exports = jsPatern