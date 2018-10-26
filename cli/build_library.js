'use strict';

let type    = null
let library = null
let injson  = null
let outjs   = null

process.argv.forEach(function (val, index, array) {
    switch (index)  {
        case 2:
            type = val
            console.info(`Type: ${type}`)
            break;
        case 3:
            library = val
            console.info(`Library: ${library}`)
            break;
        case 4:
            injson = val
            console.info(`Input JSON: ${injson}`)
            break;
        case 5:
            outjs = val
            console.info(`Output JS: ${outjs}`)
            break;
    }
    //console.log(index + ': ' + val);
});


function sourceGenerator(logic) {
    let str = ''
    try {
        str += `      ${logic.start.name}: function(cntx) {\n      }\n`+
               `     ,${logic.stop.name}: function(cntx) {\n      }\n`

        for(let key of Object.keys(logic.states)) {
            let state = logic.states[key];
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

let bislogic = require(injson)
let code = `'use strict';\n\nlet ${library} = {\n` +
    '    ev_Proc: function(msg) {\n ' +
    '       // some receive msg processing\n' +
    `       dafsm.event(${library}.fsm)\n` +
    '    },\n' +
    '    lib: {\n'

code += sourceGenerator(bislogic)

code += '    }\n' +
    '}\n'

code += '\nlet wrapper  = (function () {\n' +
    '    let logicsStore = {};\n'
if (type === 'nodejs')  {
    code += '    const dafsm = require(\'dafsm\').DAFSM'
}
code += '\n' +
    '    return {\n'

if (type === 'nodejs') {
    code += '        loadLogic: function(name) {\n' +
        '            logicsStore[name] = require(\'./logic/\'+name+\'.json\')\n' +
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
        `                    return dafsm.link(fsm,${library})\n` +
        '                })\n' +
        '                .then(fsm => {\n' +
        '                    logicsStore[name] = dafsm.init(fsm)\n' +
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
} else {
    code += '        loadLogic: function(name,cblk) {\n' +
        '          fetch(\'blogic?lname=\'+name, {\n' +
        '            method: \'get\',\n' +
        '            headers: {\n' +
        '                \'Content-Type\': \'application/json\'\n' +
        '            },\n' +
        '            body: null\n' +
        '          })\n' +
        '            .then(res => { return res.json(); })\n' +
        '            .then(data => { logicsStore[name] = data; return name; })\n' +
        '            .then(logicname => { if (cblk) cblk(logicname) })\n'+
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
        `                    return dafsm.link(fsm,${library})\n` +
        '                })\n' +
        '                .then(fsm => {\n' +
        '                    logicsStore[name] = dafsm.init(fsm)\n' +
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
    //code += `module.exports = ${library}`
    code += `\nmodule.exports = wrapper`
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

/*
const log4js = require('log4js');
log4js.configure({
    appenders: { code: { type: 'file', filename: `${outjs}` } },
    categories: { default: { appenders: ['code'], level: 'info' } }
});

const logger = log4js.getLogger('code');

//console.info(code)
logger.info(code)

const open = require('open')
open(outjs,'safari')
*/

const fs = require('fs')
fs.writeFile(outjs, code,
    function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        require('open')(outjs,'safari')
    });