struct Action: Codable {
    let name: String
//    var fnidx: Int?
}

struct Transition: Codable {
    let nextstatename: String
    var triggers, effects: [Action]
}

struct State: Codable {
    let key, name: String
    var entries, exits, stays: [Action]?
    var transitions: [Transition]?
}

struct Logic: Codable {
    let id, type,  prj: String
    var complete: Bool
    var start, stop: Action
    var countstates: Int
    var states: [State]
}

/*
let jsonData = jsonString.data(using: .utf8)!
let decoder = JSONDecoder()
var logic = try? decoder.decode(Logic.self, from: jsonData)


//logic?.start.fnidx = 5
print(logic as Any)
*/
// --------- User define structure -------------------
struct Context {
  var keystate: String = "init"
  var complete: Bool = false
  var logic: Logic?
  // User define parameters
  var mydata: String = ""
}

// ------ dafsm core -------------------------------

class dafsm {

  // Internal operation
  func call(fname: String) -> ((_ cntx: inout Context) -> Bool) {
    print("Must Override")
    return {(_ cntx: inout Context) -> Bool in
                return false
           }
  }

  private func eventListener(_ cntx: inout Context) -> Transition? {
    print("dafsm:eventListener: ",cntx.keystate)
    if let state = cntx.logic?.states.first(where: {$0.key == cntx.keystate}) {
       if let transitions = state.transitions {
          for trans in transitions {
              for trig in trans.triggers {
                  if self.call(fname: trig.name)(&cntx) {
                      return trans
                  }
              }
          }
       }
    }
    return nil
  }
  private func stayAction(_ cntx: inout Context) {

    if let state = cntx.logic?.states.first(where: {$0.key == cntx.keystate}) {
      if let stays = state.stays {
        for action in stays {
            let _ = self.call(fname: action.name)(&cntx)
        }
      }
    }
  }
  private func exitAction(_ cntx: inout Context) {

      if let state = cntx.logic?.states.first(where: {$0.key == cntx.keystate}) {
        if let exits = state.exits {
          for action in exits {
              let _ = self.call(fname: action.name)(&cntx)
          }
        }
    }
  }/*
  private func effectAction(trans: Transition,_ cntx: inout Context) {
      for action in trns.effects {
          //let _ = (action.fnct as! (_ cntx: inout Context) -> Bool)(&cntx)
          let _ = self.call(fname: action.name)(&cntx)
      }
  }*/
  private func entryAction(_ cntx: inout Context) {
      if let state = cntx.logic?.states.first(where: {$0.key == cntx.keystate}) {
        if let entries = state.entries {
          for action in entries {
              let _ = self.call(fname: action.name)(&cntx)
          }
        }
    }
  }

  private func singleStep(_ cntx: inout Context) throws {

     if let trans = self.eventListener(&cntx) {
        if let nextstate = cntx.logic?.states.first(where: {$0.key == trans.nextstatename}) {
            self.exitAction(&cntx)
            //self.effectAction(trans: trans,&cntx)
            for action in trans.effects {
                let _ = self.call(fname: action.name)(&cntx)
            }
            cntx.keystate = nextstate.key
            self.entryAction(&cntx)
        } else {
            print("Error: Next state is nil")
        }
     } else {
        self.stayAction(&cntx)
     }
  }

// Class Interface
  func link(logic: Logic, _ cntx: inout Context) {
    print("dafsm:link")

  }

  func inits(fsm: Logic,_ cntx: inout Context) -> Bool {
    print("dafsm:inits")
    let initState = "init"
    if fsm.states.contains(where: {$0.key == initState}) {
        cntx.complete = false
        cntx.keystate = initState
        cntx.logic = fsm
        print("Initialization completed")
        return true
    } else {
        print("Error: cannot find init state")
        return false
    }
  }

  func event(_ cntx: inout Context) {
    print("dafsm:step")
    do {
      try self.singleStep(&cntx)
    } catch {
      print("Step running error: \(error)")
    }
  }

}
