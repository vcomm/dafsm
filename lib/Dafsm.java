import org.json.simple.*;

public class Dafsm<T> {

  public boolean call(String name,T cntx) {
      System.out.println("It's pure virtual function.");
      return true;
  }  

  public Dafsm() { }   

  private Object getByKey(JSONArray array, String key, String val) {
      Object value = null;
      for (int i = 0; i < array.size(); i++) {
          JSONObject item = (JSONObject) array.get(i);
          if (val.equals(item.get(key))) {
              value = item;
              break;
          }
      }
      return value;
  }   
  private JSONObject eventListener(T cntx) {
    mCntx ctx = (mCntx) cntx;
    String keystate = ctx.get(); 
    JSONObject logic = (JSONObject) ctx.logic;
    JSONArray states = (JSONArray) logic.get("states");
    JSONObject state = (JSONObject) this.getByKey(states, "key", keystate);
    JSONArray transitions = (JSONArray) state.get("transitions");
    for (int i = 0; i < transitions.size(); i++) {
         JSONObject trans = (JSONObject) transitions.get(i);
         JSONArray triggers = (JSONArray) trans.get("triggers");
         for (int j = 0; j < triggers.size(); j++) {
              JSONObject trig = (JSONObject) triggers.get(j);
              String fname = trig.get("name").toString();
              if (this.call(fname,cntx))
                  return trans;
         }  
    }
    return null;
  }
  private void stayAction(T cntx) { 
    mCntx ctx = (mCntx) cntx;
    String keystate = ctx.get(); 
    JSONObject logic = (JSONObject) ctx.logic;
    JSONArray states = (JSONArray) logic.get("states");
    JSONObject state = (JSONObject) this.getByKey(states, "key", keystate);
    JSONArray stays = (JSONArray) state.get("stays");
    for (int i = 0; i < stays.size(); i++) {
         JSONObject stay = (JSONObject) stays.get(i);
         String fname = stay.get("name").toString();
         this.call(fname,cntx);
    }   
  }
  private void exitAction(T cntx) { 
    mCntx ctx = (mCntx) cntx;
    String keystate = ctx.get(); 
    JSONObject logic = (JSONObject) ctx.logic;
    JSONArray states = (JSONArray) logic.get("states");
    JSONObject state = (JSONObject) this.getByKey(states, "key", keystate);
    JSONArray exits = (JSONArray) state.get("exits");
    for (int i = 0; i < exits.size(); i++) {
         JSONObject exit = (JSONObject) exits.get(i);
         String fname = exit.get("name").toString();
         this.call(fname,cntx);
    }   
  }
  private void entryAction(T cntx) { 
    mCntx ctx = (mCntx) cntx;
    String keystate = ctx.get(); 
    JSONObject logic = (JSONObject) ctx.logic;
    JSONArray states = (JSONArray) logic.get("states");
    JSONObject state = (JSONObject) this.getByKey(states, "key", keystate);
    JSONArray entries = (JSONArray) state.get("entries");
    for (int i = 0; i < entries.size(); i++) {
         JSONObject entry = (JSONObject) entries.get(i);
         String fname = entry.get("name").toString();
         this.call(fname,cntx);
    }   
  }
  private void effectAction(JSONObject trans,T cntx) {
    JSONArray effects = (JSONArray) trans.get("effects");
    for (int j = 0; j < effects.size(); j++) {
        JSONObject eff = (JSONObject) effects.get(j);
        String fname = eff.get("name").toString();
        this.call(fname,cntx);
    }  
  }  
  public T singleStep(T cntx)  {
    mCntx ctx = (mCntx) cntx;
    try {
        JSONObject logic = (JSONObject) ctx.logic;
        JSONArray states = (JSONArray) logic.get("states");
        JSONObject trans = this.eventListener(cntx);
        if (trans != null) {
            String nextstatename = trans.get("nextstatename").toString();
            JSONObject nextstate = (JSONObject) this.getByKey(states, "key", nextstatename);
            if (nextstate != null) {
                this.exitAction(cntx);
                this.effectAction(trans,cntx);
                ctx.set(nextstatename);
                this.entryAction(cntx);
            } else {
                System.out.println("Error: Next state is null");
            }
        } else {
            this.stayAction(cntx);
        }
	  } catch (Exception e) {
		    System.out.println("Single Step Exception: " + e);     
    } finally {
        return cntx;
    }
  }  
  /*
  public T event(T cntx) {
     //return this.call("Hello",cntx);
     return this.singleStep(cntx);
  }
  */
  public boolean inits(JSONObject fsm,T cntx) {
    
    String initState = "init";
    mCntx ctx = (mCntx) cntx;
    JSONArray states = (JSONArray) fsm.get("states");
    JSONObject state = (JSONObject)this.getByKey(states, "key", initState); 

    if (state != null) { 
        ctx.complete = false;
        ctx.set(initState);
        ctx.logic = fsm;
        return true;
    } else {
        System.out.println("Error: cannot find init state");
        return false;
    }    
  }  
}