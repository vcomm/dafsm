import java.util.*;

import org.json.simple.JSONValue; 
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;

public class Wrapper<T>  extends  Dafsm<T> {
   public Map<String, Object> mSDK = new HashMap<String, Object>();
   public String status = "complete";

	 @Override
   public boolean call(String name,T cntx) {
      System.out.println("Wrapper call: "+name);
      boolean status = false;
      try {
        status = mSDK.get(name).equals(cntx);
      } catch (Exception e) {
        System.out.println("HashMap Dictionary Exception: " + e);
      } finally {
        return status;
      }
   }

   public Wrapper() {
     mSDK.put("Hello", new Object() {
        @Override public boolean equals(Object obj) {
            mCntx cntx = (mCntx) obj;
            cntx.set("connect");
            return true;
        }
    });    
    mSDK.put("evComplete", new Object() {
        @Override public boolean equals(Object obj) {
            mCntx cntx = (mCntx) obj;
            System.out.println("evComplete: Work!");
            return true;
        }
    });
    mSDK.put("fnGoto", new Object() {
        @Override public boolean equals(Object obj) {
            mCntx cntx = (mCntx) obj;
            System.out.println("fnGoto: Work!");
            return true;
        }
    });
    mSDK.put("fnLetsgo", new Object() {
        @Override public boolean equals(Object obj) {
            mCntx cntx = (mCntx) obj;
            System.out.println("fnLetsgo: Work!");
            return true;
        }
    });
    mSDK.put("fnWelcome", new Object() {
        @Override public boolean equals(Object obj) {
            mCntx cntx = (mCntx) obj;
            System.out.println("fnWelcome: Work!");
            return true;
        }
    });
    mSDK.put("fnStart", new Object() {
        @Override public boolean equals(Object obj) {
            mCntx cntx = (mCntx) obj;
            System.out.println("fnStart: Work!");
            return true;
        }
    });
    mSDK.put("fnStop", new Object() {
        @Override public boolean equals(Object obj) {
            mCntx cntx = (mCntx) obj;
            System.out.println("fnStop: Work!");
            return true;
        }
    });

   }   

   public boolean loadLogic(String jsonstring, T ctx) {
      boolean status = false;
      JSONParser parser = new JSONParser();
      try {
          JSONObject json = (JSONObject) parser.parse(jsonstring);
          status = super.inits(json, ctx);
      } catch (ParseException exc) {
          System.out.println("JSON Parse Exception: " + exc);
      } finally {
          return status;
      }
   }

   public T event(T cntx) {
     //return this.call("Hello",cntx);
     return super.singleStep(cntx);
   }   

}