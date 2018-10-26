//import org.json.simple.*;

public class mCntx<D> {
  /*  Mandatory memeber */
  private String keystate = "init";
  public boolean complete = false;
  public D logic;

   public mCntx() { }
   public mCntx(D fsm) { logic = fsm; }

   public String get() { return keystate; }
   public String set(String value) { return keystate = value; }
   
}

