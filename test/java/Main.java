//import java.io.FileReader;
//import java.util.*;
//import java.util.Map;
//import java.lang.reflect.*;
/*
import org.json.simple.JSONValue; 
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;
*/
import org.json.simple.*;

class Main {
  private final static String JSON_DATA =
   "{"
    +"  \"id\": \"client\","
    +"  \"type\": \"FSM\","
    +"  \"prj\": \"tb_\","
    +"  \"complete\": false,"
    +"  \"start\": {\"name\": \"fnStart\"},"
    +"  \"stop\": {\"name\": \"fnStop\"},"
    +"  \"countstates\": 3,"
    +"  \"states\": ["
    +"    {"
    +"      \"key\": \"init\","
    +"      \"name\": \"InitialState\","
    +"      \"exits\": [{\"name\": \"fnLetsgo\"}],"
    +"      \"transitions\": ["
    +"          {"
    +"            \"nextstatename\": \"final\","
    +"            \"triggers\": [{\"name\": \"evComplete\"}],"
    +"            \"effects\": [{\"name\": \"fnGoto\"}]"
    +"          }"
    +"       ]"
    +"    },"
    +"    {"
    +"      \"key\": \"final\","
    +"      \"name\": \"FinalState\","
    +"      \"entries\": [{\"name\": \"fnWelcome\"}]"
    +"    }"
    +"  ]"
    +"}";

  public static void main(String[] args) {

    mCntx<JSONObject> ctx = new mCntx<JSONObject>();
    Wrapper<mCntx> wrapper = new Wrapper<mCntx>();  
    
    try {
        wrapper.loadLogic(JSON_DATA, ctx);
        System.out.println("State:"+ctx.get());
        wrapper.event(ctx);
        System.out.println("State:"+ctx.get());    
    } catch (Exception exc) {
        System.out.println("Exception: " + exc);
    }
/*
    JSONParser parser = new JSONParser();
    try {
        JSONObject json = (JSONObject) parser.parse(JSON_DATA);
        mCntx<JSONObject> ctx = new mCntx<JSONObject>(json);

        Wrapper<mCntx> wrapper = new Wrapper<mCntx>();
        System.out.println("State:"+ctx.get());
        wrapper.event(ctx);
        System.out.println("State:"+ctx.get());

    } catch (ParseException exc) {
        System.out.println("Exception: " + exc);
    }
*/    
  }

}