// NimTech Bamboo → Google Sheets intake. amoCRM sync will be handled later by Apps Script.
// Deploy this Worker separately using worker/wrangler.toml; GitHub Pages does not deploy Workers.
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwIJBg8ngWlFnF_jismd5qkkHcaotVkORh1d-rX6Z2WhWtKAiZ1O_KBlzX9g2MOa1II/exec";
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8",...headers}});
const cors=(origin,env)=>({"Access-Control-Allow-Origin":origin===(env.ALLOWED_ORIGIN||"https://bamboo.nimtech.ru")?origin:"null","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin"});
export default {async fetch(request,env){
  const origin=request.headers.get("Origin")||"";
  const headers=cors(origin,env);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
  if(request.method!=="POST")return json({error:"Method not allowed"},405,headers);
  if(headers["Access-Control-Allow-Origin"]==="null")return json({error:"Origin not allowed"},403,headers);
  let body;try{body=await request.json()}catch{return json({error:"Invalid JSON"},400,headers)}
  const name=String(body.name||"").trim(),phone=String(body.phone||"").trim(),budget=Number(body.budget);
  if(name.length<2||name.length>100||!/^[+0-9()\\s-]{10,30}$/.test(phone)||body.consent!==true||!Number.isFinite(budget)||budget<0||budget>100000000)return json({error:"Invalid form fields"},422,headers);
  const id=String(body.id||crypto.randomUUID());
  const page=String(body.page||body.source||"https://bamboo.nimtech.ru/");
  const payload={...body,id,name,phone,form:body.form|| (page.includes("/calculator/")?"calculator":"homepage_calculator"),page,calculator:{budget,note:body.note||"",specification:body.note||""},utm_source:body.utm_source||"",utm_medium:body.utm_medium||"",utm_campaign:body.utm_campaign||"",utm_content:body.utm_content||"",utm_term:body.utm_term||""};
  try{
    const response=await fetch(SHEETS_ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),redirect:"follow"});
    if(!response.ok)throw Error("Sheets HTTP "+response.status);
    const result=await response.json();
    if(result.ok!==true)throw Error("Sheets rejected lead");
    return json({ok:true,id:result.id||id},200,headers);
  }catch(error){console.error("Bamboo Sheets intake error",error);return json({error:"Lead storage failed"},502,headers)}
}};
