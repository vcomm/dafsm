// ------- user data flow define -----------
struct Context {
  var keystate = "key:"
  // User define parameters
}

// ---------- sdk library -------------------
func evComplete(_ cntx: inout Context) -> Bool {
    cntx.keystate += ",complete"
    print("evComplete ->  \( cntx.keystate )")
    return true
}
func fnGoto(_ cntx: inout Context) -> Bool {
    cntx.keystate += ",goto"
    print("fnGoto ->  \( cntx.keystate )")
    return true
}
func fnLetsgo(_ cntx: inout Context) -> Bool {
    cntx.keystate += ",lets"
    print("fnLetsgo ->  \( cntx.keystate )")
    return true
}
func fnWelcome(_ cntx: inout Context) -> Bool {
    cntx.keystate += ",welcome"
    print("fnWelcome ->  \( cntx.keystate )")
    return true
}
func fnStart(_ cntx: inout Context) -> Bool {
    print("fnStart ->  \( cntx.keystate )")
    cntx.keystate += ",init"
    return true
}
func fnStop(_ cntx: inout Context) -> Bool {
    print("fnStop ->  \( cntx.keystate )")
    cntx.keystate += ",deinit"
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

var myData = Context()

let trans = Transition(nxstate:"final",trnames:[Action(name: "evComplete",fn: evComplete)],efnames:[Action(name: "fnGoto",fn: fnGoto)])
let state0 = State(key:"init",name:"initialState",ennames:[],exnames:[Action(name: "fnLetsgo",fn: fnLetsgo)],stnames:[],trans:[trans])
let state1 = State(key:"final",name:"finishState",ennames:[Action(name: "fnWelcome",fn: fnWelcome)],exnames:[],stnames:[],trans:[])

let blogic = Logic(states:[state0,state1],fnstart: fnStart, fnstop: fnStop)

blogic.start.call(fname: "start", &myData)
state0.transitions[0].triggers[0].call(fname: "evComplete", &myData)
state0.exits[0].call(fname: "fnLetsgo", &myData)
state0.transitions[0].effects[0].call(fname: "fnGoto", &myData)
state1.entries[0].call(fname: "fnWelcome", &myData)
blogic.stop.call(fname: "stop", &myData)