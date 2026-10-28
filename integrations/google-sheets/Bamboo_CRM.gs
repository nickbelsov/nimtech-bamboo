/** NimTech Bamboo: Google Sheets -> amoCRM. Install in the SAME Apps Script project as Code.gs. 
 * Script properties: AMO_SUBDOMAIN=nimtech, AMO_ACCESS_TOKEN=<OAuth access token>.
 * OAuth access tokens expire: refresh token handling must be configured before production use.
 * Install an every-minute time trigger for syncBambooLeads.
 * No test CRM records are created by this script on installation.
 */
const BAMBOO_CRM = Object.freeze({sheetId:'1SHyhyVLBAKnuq_P-bIycIkmCHd8yykgbnUW_xkJ3WlU',sheet:'Заявки',pipeline:9611890,status:76760446,manager:10027862,tag:'Бамбук'});
function bambooAmo_(method,path,body){
  const props=PropertiesService.getScriptProperties();
  const domain=props.getProperty('AMO_SUBDOMAIN')||'nimtech';
  const token=props.getProperty('AMO_ACCESS_TOKEN');
  if(!token)throw Error('AMO_ACCESS_TOKEN is not configured');
  const opt={method,headers:{Authorization:'Bearer '+token},muteHttpExceptions:true,contentType:'application/json'};
  if(body!==undefined)opt.payload=JSON.stringify(body);
  const res=UrlFetchApp.fetch('https://'+domain+'.amocrm.ru/api/v4/'+path,opt);
  const status=res.getResponseCode(), raw=res.getContentText();
  if(status===204)return {};
  if(status<200||status>=300)throw Error('amoCRM HTTP '+status+': '+raw.slice(0,400));
  return raw?JSON.parse(raw):{};
}
function bambooPhone_(v){let d=String(v||'').replace(/\D/g,'');if(d.length===11&&d[0]==='8')d='7'+d.slice(1);if(d.length===10)d='7'+d;return d;}
function bambooNote_(r){
 const lines=['Заявка с bamboo.nimtech.ru','ID заявки: '+r[0],'Форма: '+r[5],'Телефон: '+r[3]];
 const fields=[['Страница',r[13]],['Первая страница',r[14]],['Referrer',r[15]],['UTM source',r[8]],['UTM medium',r[9]],['UTM campaign',r[10]],['UTM content',r[11]],['UTM term',r[12]],['Калькулятор / комментарий',r[26]]];
 fields.forEach(x=>{if(x[1])lines.push(x[0]+': '+String(x[1]).slice(0,6000))});
 return lines.join('\n').slice(0,15000);
}
function syncBambooLeads(){
 const lock=LockService.getScriptLock();if(!lock.tryLock(1000))return;
 try{
  const sheet=SpreadsheetApp.openById(BAMBOO_CRM.sheetId).getSheetByName(BAMBOO_CRM.sheet);
  const last=sheet.getLastRow();if(last<2)return;
  const rows=sheet.getRange(2,1,last-1,30).getValues();
  let processed=0;
  for(let i=0;i<rows.length&&processed<20;i++){
   const r=rows[i], row=i+2, id=String(r[0]||'').trim(), state=String(r[21]||'').trim().toLowerCase();
   if(!id||!['new','retry'].includes(state))continue;
   // Keep retries manual after ambiguous network failures to avoid duplicate CRM records.
   processed++;
   try{
    const phone=bambooPhone_(r[3]);
    if(phone.length!==11||!phone.startsWith('7'))throw Error('Invalid phone');
    const name=String(r[2]||'').trim();
    const leadName='Бамбуковые панели — '+(name&&name!=='Без имени'?name:phone);
    // Search existing contacts to avoid duplicate contacts.
    const contacts=bambooAmo_('get','contacts?query='+encodeURIComponent(phone)+'&limit=50');
    const existing=(contacts._embedded&&contacts._embedded.contacts||[]).find(c=>(c.custom_fields_values||[]).some(f=>f.field_code==='PHONE'&&(f.values||[]).some(v=>bambooPhone_(v.value)===phone)));
    let contactId=existing&&existing.id;
    if(!contactId){
     const created=bambooAmo_('post','contacts',[{name:name&&name!=='Без имени'?name:'Клиент Bamboo',responsible_user_id:BAMBOO_CRM.manager,custom_fields_values:[{field_code:'PHONE',values:[{value:'+'+phone,enum_code:'WORK'}]}]}]);
     contactId=created._embedded.contacts[0].id;
    }
    // Persist contact ID before creating lead, to support recovery.
    sheet.getRange(row,24).setValue(contactId);
    const leads=bambooAmo_('post','leads',[{name:leadName,pipeline_id:BAMBOO_CRM.pipeline,status_id:BAMBOO_CRM.status,responsible_user_id:BAMBOO_CRM.manager,_embedded:{tags:[{name:BAMBOO_CRM.tag}],contacts:[{id:contactId}]}}]);
    const leadId=leads._embedded.leads[0].id;
    sheet.getRange(row,23).setValue(leadId);
    // Once lead ID is persisted, subsequent failures can retry the note only.
    try{bambooAmo_('post','leads/'+leadId+'/notes',[{note_type:'common',params:{text:bambooNote_(r)}}]);}
    catch(noteErr){sheet.getRange(row,25).setValue('note_pending: '+String(noteErr).slice(0,170));}
    sheet.getRange(row,22).setValue('created');
    sheet.getRange(row,30).setValue(new Date().toISOString());
   }catch(err){
    sheet.getRange(row,22).setValue('error');
    sheet.getRange(row,25).setValue(String(err).slice(0,450));
    sheet.getRange(row,30).setValue(new Date().toISOString());
   }
  }
 }finally{lock.releaseLock();}
}
function installBambooSyncTrigger(){
 const props=PropertiesService.getScriptProperties();
 if(!props.getProperty('AMO_ACCESS_TOKEN'))throw Error('Set AMO_ACCESS_TOKEN in Script Properties first');
 ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='syncBambooLeads').forEach(ScriptApp.deleteTrigger);
 ScriptApp.newTrigger('syncBambooLeads').timeBased().everyMinutes(1).create();
}
