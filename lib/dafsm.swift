// To parse the JSON, add this file to your project and do:
//
//   let logic = try? newJSONDecoder().decode(Logic.self, from: jsonData)

import Foundation

struct Logic: Codable {
    let id, type, prj: String
    let complete: Bool
    let action, stop: Action
    let countstates: Int
    let states: [State]
}

struct Action: Codable {
    let name: String
    let actionFunc: JSONNull?

    enum CodingKeys: String, CodingKey {
        case name
        case actionFunc = "func"
    }
}

struct State: Codable {
    let key, name: String
    let entries, exits, stays: [Action]
    let transitions: [Transition]
}

struct Transition: Codable {
    let nextstatename: String
    let triggers, effects: [Action]
}

// MARK: Encode/decode helpers

class JSONNull: Codable, Hashable {

    public static func == (lhs: JSONNull, rhs: JSONNull) -> Bool {
        return true
    }

    public var hashValue: Int {
        return 0
    }

    public init() {}

    public required init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if !container.decodeNil() {
            throw DecodingError.typeMismatch(JSONNull.self, DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Wrong type for JSONNull"))
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encodeNil()
    }
}

struct Context: Codable {
  var logic: Logic
  var keystate: String
  var complete: Bool
  // User define parameters
}

// dafsm core
class dafsm {
  // Internal operation
  private func eventListener(cntx: Context) -> Transition {
    //print("dafsm:eventListener: ", cntx)
    var trn: Any
    if let state = cntx.logic.states[cntx.keystate] {
       for trans in state.transitions {
          for trig in trans.triggers {
             if let ret  = trig.func(cntx) {
                return trn = trans
             }
          }
       }
    }
    return trn
  }
  private func stayAction(cntx: Context) {
    if let state = cntx.logic.states[cntx.keystate] {
        for action in state.stays {
            action.func(cntx)
        }
    }
  }
  private func gotoNextstate(trans: Transition,fsm: Logic) {
    return fsm.states[trans.nextstatename]
  }
  private func stateByKey(states: [State], key: String) -> State {

  }
  private func exitAction(cntx: Context) {
    if let state = cntx.logic.states[cntx.keystate] {
        for action in state.exits {
            action.func(cntx)
        }
    }
  }
  private func effectAction(trans: Transition,cntx: Context) {
      for action in trans.effects {
          action.func(cntx)
      }
  }
  private func entryAction(cntx: Context) {
    if let state = cntx.logic.states[cntx.keystate] {
        for action in state.entries {
            action.func(cntx)
        }
    }
  }
  private func singleStep(cntx: Context) {
     let trans = self.eventListener(cntx: cntx)
     if trans {
        let nextstate = self.gotoNextstate(trans: trans,fsm: cntx.logic)
        if nextstate {
            self.exitAction(cntx: cntx)
            self.effectAction(trans: trans,cntx: ctnx)
            cntx.keystate = nextstate.key
            self.entryAction(cntx: cntx)
        } else {
            print("Error: Next state is nil")
        }
     } else {
        self.stayAction(cntx: cntx)
     }
  }


// Class Interface
  func link(logic: Logic, context: Context) {
    print("dafsm:link")
    //self.eventListener(cntx: "test")
  }
  func inits(fsm: Logic, cntx: Context, istate: String? = nil) -> Bool {
    print("dafsm:inits")
    let initState = istate ? istate : "init"
    if (fsm.states.hasOwnProperty(initState)) {
        cntx.complete = false
        cntx.keystate = initState
        cntx.logic = fsm
        console.log("Initialization completed")
        return true
    } else {
        console.log("Error: cannot find init state")
        return false
    }
  }
  func event(cntx: Context) -> Context {
    print("dafsm:step")
    do {
      try self.singleStep(cntx: cntx)
      defer {
        return cntx
      }
    } catch cntx.keystate where cntx.keystate == "" {
      print("FSM error: missing current state")
    } catch {
      print("Step running error: \(error)")
    }
  }

}

class wrapper : dafsm {

  func loadLogic(name: String) {
    print("wrapper:loadLogic")
  }
  func initLogic(name: String, cntx: Any) {
    print("wrapper:initLogic")
    super.inits(fsm: 0,cntx: 1)

  }
  func startLogic(cntx: Any) {
    print("wrapper:startLogic")
  }
  func stopLogic(cntx: Any) {
    print("wrapper:stopLogic")
  }
  func runStep(cntx: Any) {
    print("wrapper:runStep")
  }
}

let bl = wrapper()
bl.loadLogic(name: "Test")
bl.link(logic: 1, context: 0)