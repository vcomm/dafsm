'use strict'

const javaPatern = (function () {

    function sourceGenerator(logic) {
        let str = ''
        try {
            str += `      mSDK.put("${logic.start.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`+
                `     ,mSDK.put("${logic.stop.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`

            if (Array.isArray(logic.states))
                logic.states.forEach(state => {
                    if (state.hasOwnProperty("exits")) {
                        state.exits.forEach(action => {
                            str += `     ,mSDK.put("${action.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                        })
                    }
                    if (state.hasOwnProperty("stays")) {
                        state.stays.forEach(action => {
                            str += `     ,mSDK.put("${action.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                        })
                    }
                    if (state.hasOwnProperty("entries")) {
                        state.entries.forEach(action => {
                            str += `     ,mSDK.put("${action.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                        })
                    }
                    if (state.hasOwnProperty("transitions")) {
                        state.transitions.forEach(trans => {
                            if (trans.hasOwnProperty("triggers")) {
                                trans.triggers.forEach(trig => {
                                    str += `     ,mSDK.put("${trig.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                                })
                            }
                            if (trans.hasOwnProperty("effects")) {
                                trans.effects.forEach(effect => {
                                    str += `     ,mSDK.put("${effect.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                                })
                            }
                        })
                    }
                })
            else
                for(let key of Object.keys(logic.states)) {
                    let state = logic.states[key];
                    if (state.hasOwnProperty("exits")) {
                        state.exits.forEach(action => {
                            str += `     ,mSDK.put("${action.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                        })
                    }
                    if (state.hasOwnProperty("stays")) {
                        state.stays.forEach(action => {
                            str += `     ,mSDK.put("${action.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                        })
                    }
                    if (state.hasOwnProperty("entries")) {
                        state.entries.forEach(action => {
                            str += `     ,mSDK.put("${action.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                        })
                    }
                    if (state.hasOwnProperty("transitions")) {
                        state.transitions.forEach(trans => {
                            if (trans.hasOwnProperty("triggers")) {
                                trans.triggers.forEach(trig => {
                                    str += `     ,mSDK.put("${trig.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
                                })
                            }
                            if (trans.hasOwnProperty("effects")) {
                                trans.effects.forEach(effect => {
                                    str += `     ,mSDK.put("${effect.name}", new Object() {@Override public boolean equals(Object obj) { mCntx cntx = (mCntx) obj; return true; }});\n`
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
            let code = `'//---- File Dafsm.java-------'\n\n`
            code += `\n import org.json.simple.*;`
            code += `\n public class Dafsm<T> {`
            code += `\n   public boolean call(String name,T cntx) {`
            code += `\n     System.out.println("It's pure virtual function.");`
            code += `\n     return true;`
            code += `\n   }`

            code += `\n   public Dafsm() { }`

            code += `\n   private Object getByKey(JSONArray array, String key, String val) {`
            code += `\n     Object value = null;`
            code += `\n     for (int i = 0; i < array.size(); i++) {`
            code += `\n          JSONObject item = (JSONObject) array.get(i);`
            code += `\n          if (val.equals(item.get(key))) {`
            code += `\n              value = item;`
            code += `\n              break;`
            code += `\n          }`
            code += `\n     }`
            code += `\n     return value;`
            code += `\n   }`

            code += `\n   private JSONObject eventListener(T cntx) {`
            code += `\n     mCntx ctx = (mCntx) cntx;`
            code += `\n     String keystate = ctx.get();`
            code += `\n     JSONObject logic = (JSONObject) ctx.logic;`
            code += `\n     JSONArray states = (JSONArray) logic.get("states");`
            code += `\n     JSONObject state = (JSONObject) this.getByKey(states, "key", keystate);`
            code += `\n     JSONArray transitions = (JSONArray) state.get("transitions");`
            code += `\n     for (int i = 0; i < transitions.size(); i++) {`
            code += `\n          JSONObject trans = (JSONObject) transitions.get(i);`
            code += `\n          JSONArray triggers = (JSONArray) trans.get("triggers");`
            code += `\n          for (int j = 0; j < triggers.size(); j++) {`
            code += `\n               JSONObject trig = (JSONObject) triggers.get(j);`
            code += `\n               String fname = trig.get("name").toString();`
            code += `\n               if (this.call(fname,cntx))`
            code += `\n                   return trans;`
            code += `\n          }`
            code += `\n    }`
            code += `\n    return null;`
            code += `\n  }`

            code += `\n  private void stayAction(T cntx) {`
            code += `\n    mCntx ctx = (mCntx) cntx;`
            code += `\n    String keystate = ctx.get();`
            code += `\n    JSONObject logic = (JSONObject) ctx.logic;`
            code += `\n    JSONArray states = (JSONArray) logic.get("states");`
            code += `\n    JSONObject state = (JSONObject) this.getByKey(states, "key", keystate);`
            code += `\n    JSONArray stays = (JSONArray) state.get("stays");`
            code += `\n    for (int i = 0; i < stays.size(); i++) {`
            code += `\n         JSONObject stay = (JSONObject) stays.get(i);`
            code += `\n         String fname = stay.get("name").toString();`
            code += `\n         this.call(fname,cntx);`
            code += `\n    }`
            code += `\n  }`

            code += `\n  private void exitAction(T cntx) {`
            code += `\n    mCntx ctx = (mCntx) cntx;`
            code += `\n    String keystate = ctx.get();`
            code += `\n    JSONObject logic = (JSONObject) ctx.logic;`
            code += `\n    JSONArray states = (JSONArray) logic.get("states");`
            code += `\n    JSONObject state = (JSONObject) this.getByKey(states, "key", keystate);`
            code += `\n    JSONArray exits = (JSONArray) state.get("exits");`
            code += `\n    for (int i = 0; i < exits.size(); i++) {`
            code += `\n         JSONObject exit = (JSONObject) exits.get(i);`
            code += `\n         String fname = exit.get("name").toString();`
            code += `\n         this.call(fname,cntx);`
            code += `\n    }`
            code += `\n  }`

            code += `\n  private void entryAction(T cntx) {`
            code += `\n    mCntx ctx = (mCntx) cntx;`
            code += `\n    String keystate = ctx.get();`
            code += `\n    JSONObject logic = (JSONObject) ctx.logic;`
            code += `\n    JSONArray states = (JSONArray) logic.get("states");`
            code += `\n    JSONObject state = (JSONObject) this.getByKey(states, "key", keystate);`
            code += `\n    JSONArray entries = (JSONArray) state.get("entries");`
            code += `\n    for (int i = 0; i < entries.size(); i++) {`
            code += `\n         JSONObject entry = (JSONObject) entries.get(i);`
            code += `\n         String fname = entry.get("name").toString();`
            code += `\n         this.call(fname,cntx);`
            code += `\n    }`
            code += `\n  }`

            code += `\n  private void effectAction(JSONObject trans,T cntx) {`
            code += `\n    JSONArray effects = (JSONArray) trans.get("effects");`
            code += `\n    for (int j = 0; j < effects.size(); j++) {`
            code += `\n         JSONObject eff = (JSONObject) effects.get(j);`
            code += `\n         String fname = eff.get("name").toString();`
            code += `\n        this.call(fname,cntx);`
            code += `\n    }`
            code += `\n  }`

            code += `\n  public T singleStep(T cntx)  {`
            code += `\n    mCntx ctx = (mCntx) cntx;`
            code += `\n    try {`
            code += `\n        JSONObject logic = (JSONObject) ctx.logic;`
            code += `\n        JSONArray states = (JSONArray) logic.get("states");`
            code += `\n        JSONObject trans = this.eventListener(cntx);`
            code += `\n        if (trans != null) {`
            code += `\n            String nextstatename = trans.get("nextstatename").toString();`
            code += `\n            JSONObject nextstate = (JSONObject) this.getByKey(states, "key", nextstatename);`
            code += `\n            if (nextstate != null) {`
            code += `\n                this.exitAction(cntx);`
            code += `\n                this.effectAction(trans,cntx);`
            code += `\n                ctx.set(nextstatename);`
            code += `\n                this.entryAction(cntx);`
            code += `\n            } else {`
            code += `\n                System.out.println("Error: Next state is null");`
            code += `\n            }`
            code += `\n        } else {`
            code += `\n            this.stayAction(cntx);`
            code += `\n        }`
            code += `\n    } catch (Exception e) {`
            code += `\n        System.out.println("Single Step Exception: " + e);`
            code += `\n    } finally {`
            code += `\n        return cntx;`
            code += `\n    }`
            code += `\n  }`

            code += `\n  public boolean inits(JSONObject fsm,T cntx) {`
            code += `\n    String initState = "init";`
            code += `\n    mCntx ctx = (mCntx) cntx;`
            code += `\n    JSONArray states = (JSONArray) fsm.get("states");`
            code += `\n    JSONObject state = (JSONObject)this.getByKey(states, "key", initState);`
            code += `\n    if (state != null) {`
            code += `\n        ctx.complete = false;`
            code += `\n        ctx.set(initState);`
            code += `\n        ctx.logic = fsm;`
            code += `\n        return true;`
            code += `\n    } else {`
            code += `\n        System.out.println("Error: cannot find init state");`
            code += `\n        return false;`
            code += `\n    }`
            code += `\n  }`
            code += `\n }`

            code += `\n\n'//---- File Wrapper.java-------'\n\n`

            code += `\n import java.util.*;`
            code += `\n import org.json.simple.JSONValue;`
            code += `\n import org.json.simple.JSONArray;`
            code += `\n import org.json.simple.JSONObject;`
            code += `\n import org.json.simple.parser.*;`

            code += `\n public class Wrapper<T>  extends  Dafsm<T> {`
            code += `\n    public Map<String, Object> mSDK = new HashMap<String, Object>();`
            code += `\n    public String status = "complete";`

            code += `\n    @Override`
            code += `\n    public boolean call(String name,T cntx) {`
            code += `\n      System.out.println("Wrapper call: "+name);`
            code += `\n      boolean status = false;`
            code += `\n      try {`
            code += `\n        status = mSDK.get(name).equals(cntx);`
            code += `\n      } catch (Exception e) {`
            code += `\n        System.out.println("HashMap Dictionary Exception: " + e);`
            code += `\n      } finally {`
            code += `\n        return status;`
            code += `\n      }`
            code += `\n    }`

            code += `\n    public Wrapper() {\n`
            code += sourceGenerator(fsm)
            code += `\n    }`

            code += `\n    public boolean loadLogic(String jsonstring, T ctx) {`
            code += `\n      boolean status = false;`
            code += `\n      JSONParser parser = new JSONParser();`
            code += `\n      try {`
            code += `\n        JSONObject json = (JSONObject) parser.parse(jsonstring);`
            code += `\n        status = super.inits(json, ctx);`
            code += `\n      } catch (ParseException exc) {`
            code += `\n        System.out.println("JSON Parse Exception: " + exc);`
            code += `\n      } finally {`
            code += `\n        return status;`
            code += `\n      }`
            code += `\n    }`

            code += `\n    public T event(T cntx) {`
            code += `\n      return super.singleStep(cntx);`
            code += `\n    }`

            code += `\n }`

            code += `\n\n'//---- File mCntx.java-------'\n\n`

            code += `\n public class mCntx<D> {`
            code += `\n     /*  Mandatory memeber */`
            code += `\n     private String keystate = "init";`
            code += `\n     public boolean complete = false;`
            code += `\n     public D logic;`

            code += `\n     public mCntx() { }`
            code += `\n     public mCntx(D fsm) { logic = fsm; }`

            code += `\n     public String get() { return keystate; }`
            code += `\n     public String set(String value) { return keystate = value; }`
            code += `\n }`

            code += `\n\n'//---- File Main.java-------'\n\n`

            code += `\n import org.json.simple.*;`

            code += `\n class Main {`
            code += `\n   private final static String JSON_DATA;`
            code += `\n     mCntx<JSONObject> ctx = new mCntx<JSONObject>();`
            code += `\n     Wrapper<mCntx> wrapper = new Wrapper<mCntx>();`

            code += `\n   try {`
            code += `\n     wrapper.loadLogic(JSON_DATA, ctx);`
            code += `\n     System.out.println("State:"+ctx.get());`
            code += `\n     wrapper.event(ctx);`
            code += `\n     System.out.println("State:"+ctx.get());`
            code += `\n   } catch (Exception exc) {`
            code += `\n     System.out.println("Exception: " + exc);`
            code += `\n   }`
            code += `\n  }`
            code += `\n }`
            return code;
        }
    }
})()

module.exports = javaPatern