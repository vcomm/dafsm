'use strict'

const swiftPatern = (function () {

    function sourceGenerator(logic) {
        let str = ''
        try {
            str += `         "${logic.start.name}": {(_ cntx: inout Context) -> Bool in return true }\n`+
                `        ,"${logic.stop.name}": {(_ cntx: inout Context) -> Bool in return true }\n`

            for(let key of Object.keys(logic.states)) {
                let state = logic.states[key];
                if (state.hasOwnProperty("exits")) {
                    state.exits.forEach(action => {
                        str += `        ,"${action.name}": {(_ cntx: inout Context) -> Bool in return true }\n`
                    })
                }
                if (state.hasOwnProperty("stays")) {
                    state.stays.forEach(action => {
                        str += `        ,"${action.name}": {(_ cntx: inout Context) -> Bool in return true }\n`
                    })
                }
                if (state.hasOwnProperty("entries")) {
                    state.entries.forEach(action => {
                        str += `        ,"${action.name}": {(_ cntx: inout Context) -> Bool in return true }\n`
                    })
                }
                if (state.hasOwnProperty("transitions")) {
                    state.transitions.forEach(trans => {
                        if (trans.hasOwnProperty("triggers")) {
                            trans.triggers.forEach(trig => {
                                str += `        ,"${trig.name}": {(_ cntx: inout Context) -> Bool in return true }\n`
                            })
                        }
                        if (trans.hasOwnProperty("effects")) {
                            trans.effects.forEach(effect => {
                                str += `        ,"${effect.name}": {(_ cntx: inout Context) -> Bool in return true }\n`
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
        code: function(fsm,bside,library) {
            let code = `import Foundation\n\n`
            code += `/* Logic structure define */`
            code += `\n\n struct Action: Codable {`
            code += `\n     let name: String`
            code += `\n }`

            code += `\n\n struct Transition: Codable {`
            code += `\n     let nextstatename: String`
            code += `\n     var triggers, effects: [Action]`
            code += `\n }`

            code += `\n\n struct State: Codable {`
            code += `\n     let key, name: String`
            code += `\n     var entries, exits, stays: [Action]?`
            code += `\n     var transitions: [Transition]?`
            code += `\n }`

            code += `\n\n struct Logic: Codable {`
            code += `\n     let id, type,  prj: String`
            code += `\n     var complete: Bool`
            code += `\n     var start, stop: Action`
            code += `\n     var countstates: Int`
            code += `\n     var states: [State]`
            code += `\n }`

            code += `\n\n/* User's content structure define */`
            code += `\n\n struct Context {`
            code += `\n     var keystate: String = "init"`
            code += `\n     var complete: Bool = false`
            code += `\n     var logic: Logic?`
            code += `\n\n`
            code += `\n }`

            code += `\n\n/* Dafsm engine core implementation */`
            code += `\n\n class dafsm {`
            code += `\n\n   func call(fname: String) -> ((_ cntx: inout Context) -> Bool) {`
            code += `\n       print("Must Override")`
            code += `\n       return {(_ cntx: inout Context) -> Bool in return false }`
            code += `\n     }`

            code += `\n\n   private func eventListener(_ cntx: inout Context) -> Transition? {`
            code += `\n     if let state = cntx.logic?.states.first(where: {$0.key == cntx.keystate}) {`
            code += `\n        if let transitions = state.transitions {`
            code += `\n           for trans in transitions {`
            code += `\n               for trig in trans.triggers {`
            code += `\n                  if self.call(fname: trig.name)(&cntx) { return trans }`
            code += `\n               }`
            code += `\n           }`
            code += `\n        }`
            code += `\n     }`
            code += `\n     return nil`
            code += `\n   }`

            code += `\n\n   private func stayAction(_ cntx: inout Context) {`
            code += `\n     if let state = cntx.logic?.states.first(where: {$0.key == cntx.keystate}) {`
            code += `\n        if let stays = state.stays {`
            code += `\n           for action in stays {`
            code += `\n               let _ = self.call(fname: action.name)(&cntx)`
            code += `\n           }`
            code += `\n        }`
            code += `\n     }`
            code += `\n   }`

            code += `\n\n   private func exitAction(_ cntx: inout Context) {`
            code += `\n\    if let state = cntx.logic?.states.first(where: {$0.key == cntx.keystate}) {`
            code += `\n        if let exits = state.exits {`
            code += `\n           for action in exits {`
            code += `\n               let _ = self.call(fname: action.name)(&cntx)`
            code += `\n           }`
            code += `\n        }`
            code += `\n     }`
            code += `\n   }`

            code += `\n\n   private func entryAction(_ cntx: inout Context) {`
            code += `\n\    if let state = cntx.logic?.states.first(where: {$0.key == cntx.keystate}) {`
            code += `\n        if let entries = state.entries {`
            code += `\n           for action in entries {`
            code += `\n               let _ = self.call(fname: action.name)(&cntx)`
            code += `\n           }`
            code += `\n        }`
            code += `\n    }`
            code += `\n  }`

            code += `\n\n   private func singleStep(_ cntx: inout Context) throws {`
            code += `\n     if let trans = self.eventListener(&cntx) {`
            code += `\n        if let nextstate = cntx.logic?.states.first(where: {$0.key == trans.nextstatename}) {`
            code += `\n           self.exitAction(&cntx)`
            code += `\n           for action in trans.effects {`
            code += `\n               let _ = self.call(fname: action.name)(&cntx)`
            code += `\n           }`
            code += `\n           cntx.keystate = nextstate.key`
            code += `\n           self.entryAction(&cntx)`
            code += `\n        } else {`
            code += `\n            print("Error: Next state is nil")`
            code += `\n        }`
            code += `\n     } else {`
            code += `\n       self.stayAction(&cntx)`
            code += `\n     }`
            code += `\n  }`

            code += `\n\n   func inits(fsm: Logic,_ cntx: inout Context) -> Bool {`
            code += `\n     let initState = "init"`
            code += `\n     if fsm.states.contains(where: {$0.key == initState}) {`
            code += `\n        cntx.complete = false`
            code += `\n        cntx.keystate = initState`
            code += `\n        cntx.logic = fsm`
            code += `\n        print("Initialization completed")`
            code += `\n        return true`
            code += `\n    } else {`
            code += `\n        print("Error: cannot find init state")`
            code += `\n        return false`
            code += `\n    }`
            code += `\n   }`

            code += `\n\n   func event(_ cntx: inout Context) {`
            code += `\n     do {`
            code += `\n       try self.singleStep(&cntx)`
            code += `\n     } catch {`
            code += `\n       print("Step running error: \(error)")`
            code += `\n     }`
            code += `\n   }`

            code += `\n\n }`

            code += `\n\n/* Users wrapper implementation */`
            code += `\n\n class wrapper: dafsm {`
            code += `\n     let mSDK : [ String : (_ cntx: inout Context) -> Bool] = [\n`
            code += sourceGenerator(fsm)
            code += `\n     ]`

            code += `\n\n   override func call(fname: String) -> ((_ cntx: inout Context) -> Bool) {`
            code += `\n     if let cfunc = self.mSDK[fname] {`
            code += `\n        return cfunc`
            code += `\n     } else {`
            code += `\n        return {(_ cntx: inout Context) -> Bool in`
            code += `\n                 print("Not found function in SDK")`
            code += `\n                 return false`
            code += `\n               }`
            code += `\n     }`
            code += `\n   }`

            code += `\n\n   func loadLogic(json: String) -> Logic? {`
            code += `\n     let jsonData = json.data(using: .utf8)!`
            code += `\n     let decoder = JSONDecoder()`
            code += `\n     if let logic = try? decoder.decode(Logic.self, from: jsonData) {`
            code += `\n       return logic`
            code += `\n     } else {`
            code += `\n       return nil`
            code += `\n     }`
            code += `\n   }`

            code += `\n\n}`
            code += `\n\n var ${library} = Context()`

            return code;
        }
    }
})()

module.exports = swiftPatern