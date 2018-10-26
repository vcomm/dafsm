// ---------- sdk library -------------------
func evComplete(_ cntx: inout Context) -> Bool {
    cntx.mydata += ",complete"
    print("evComplete ->  \( cntx.mydata )")
    return true
}
func fnGoto(_ cntx: inout Context) -> Bool {
    cntx.mydata += ",goto"
    print("fnGoto ->  \( cntx.mydata )")
    return true
}
func fnLetsgo(_ cntx: inout Context) -> Bool {
    cntx.mydata += ",lets"
    print("fnLetsgo ->  \( cntx.mydata )")
    return true
}

func fnWelcome(_ cntx: inout Context) -> Bool {
    cntx.mydata += ",welcome"
    print("fnWelcome ->  \( cntx.mydata )")
    return true
}
func fnStart(_ cntx: inout Context) -> Bool {
    print("fnStart ->  \( cntx.mydata )")
    cntx.mydata += ",init"
    return true
}
func fnStop(_ cntx: inout Context) -> Bool {
    print("fnStop ->  \( cntx.mydata )")
    cntx.mydata += ",deinit"
    return true
}

// ----------  dafsm structure define --------------

struct Logic {
    let id, type, prj: String
    let complete: Bool
    let start, stop: Action
    let countstates: Int
    let states: [State]

    init(states: [State],fnstart: Any, fnstop: Any) {
      self.id = "test"
      self.type = "FSM"
      self.prj = "iOS"
      self.complete = false
      self.start = Action(name: "start",fn: fnstart)
      self.stop  = Action(name: "stop",fn: fnstop)
      self.countstates = 3
      self.states = states
    }
}

struct Action {
    let name: String
  //  var fnct: (_ cntx: inout Context) -> Bool = runStep
    var fnct: Any

    init(name: String,fn: Any) {
      self.name = name
      self.fnct = fn
    }
    func call(fname: String,_ cntx: inout Context) {
      if fname == name {
        let mfunc = self.fnct as! (_ cntx: inout Context) -> Bool
        let ret = mfunc(&cntx)
        print("\(self.name)->\(ret)")
      } else {
        print("Wrong function name!")
      }
    }
}

struct State {
    let key, name: String
    let entries, exits, stays: [Action]
    let transitions: [Transition]

    init(key: String, name: String,ennames: [Action],exnames: [Action],stnames: [Action], trans: [Transition]) {
      self.key  = key
      self.name = name
      self.entries = ennames
      self.exits = exnames
      self.stays = stnames
      self.transitions = trans
    }
}

struct Transition {
    let nextstatename: String
    let triggers, effects: [Action]

    init(nxstate: String,trnames: [Action],efnames: [Action]) {
      self.nextstatename = nxstate
      self.triggers = trnames
      self.effects = efnames
    }
}

// ------- user data flow define -----------
struct Context {
  var keystate: String
  var complete: Bool
  var logic: Logic
  // User define parameters
  var mydata: String = ""

  init(keystate: String, complete: Bool, logic: Logic) {
    self.keystate = keystate
    self.complete = complete
    self.logic = logic
  }
}


let trans = Transition(nxstate:"final",trnames:[Action(name: "evComplete",fn: evComplete)],efnames:[Action(name: "fnGoto",fn: fnGoto)])
let state0 = State(key:"init",name:"initialState",ennames:[],exnames:[Action(name: "fnLetsgo",fn: fnLetsgo)],stnames:[],trans:[trans])
let state1 = State(key:"final",name:"finishState",ennames:[Action(name: "fnWelcome",fn: fnWelcome)],exnames:[],stnames:[],trans:[])

let blogic = Logic(states:[state0,state1],fnstart: fnStart, fnstop: fnStop)

var myData = Context(keystate: "init",complete: false,logic: blogic)

// ------ dafsm core -------------------------------

class dafsm {

  // Internal operation

  private func eventListener(_ cntx: inout Context) -> Transition? {
    print("dafsm:eventListener: ",cntx.keystate)
    if let state = cntx.logic.states.first(where: {$0.key == cntx.keystate}) {
       for trans in state.transitions {
          for trig in trans.triggers {
              let mfunc = trig.fnct as! (_ cntx: inout Context) -> Bool
              if  mfunc(&cntx) {
                  return trans
             }
          }
       }
    }
    return nil
  }
  private func stayAction(_ cntx: inout Context) {

    if let state = cntx.logic.states.first(where: {$0.key == cntx.keystate}) {
        for action in state.stays {
            let _ = (action.fnct as! (_ cntx: inout Context) -> Bool)(&cntx)
        }
    }
  }
  private func exitAction(_ cntx: inout Context) {

      if let state = cntx.logic.states.first(where: {$0.key == cntx.keystate}) {
         for action in state.exits {
             let _ = (action.fnct as! (_ cntx: inout Context) -> Bool)(&cntx)
         }
    }
  }
  private func effectAction(trans: Transition,_ cntx: inout Context) {
      for action in trans.effects {
          let _ = (action.fnct as! (_ cntx: inout Context) -> Bool)(&cntx)
      }
  }
  private func entryAction(_ cntx: inout Context) {
      if let state = cntx.logic.states.first(where: {$0.key == cntx.keystate}) {
         for action in state.entries {
             let _ = (action.fnct as! (_ cntx: inout Context) -> Bool)(&cntx)
         }
    }
  }

  private func singleStep(_ cntx: inout Context) throws {

     if let trans = self.eventListener(&cntx) {
        if let nextstate = cntx.logic.states.first(where: {$0.key == trans.nextstatename}) {
            self.exitAction(&cntx)
            self.effectAction(trans: trans,&cntx)
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

// ----------------------------------------
let proc = dafsm()
proc.event(&myData)
print(myData.keystate)
proc.inits(fsm: blogic,&myData)
print(myData.keystate)
