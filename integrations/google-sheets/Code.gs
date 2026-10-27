/** NimTech Bamboo — приём заявок в Google Sheets. Развернуть как Apps Script Web App (execute as me, access anyone). */
const SPREADSHEET_ID = '1SHyhyVLBAKnuq_P-bIycIkmCHd8yykgbnUW_xkJ3WlU';
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const name = String(data.name || '').trim().slice(0,100);
    const phone = String(data.phone || '').trim().slice(0,30);
    if (!name || !/^[+0-9()\\s-]{10,30}$/.test(phone) || data.consent !== true) throw Error('Invalid lead');
    const id = String(data.id || Utilities.getUuid()).slice(0,100);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Заявки');
    const last = sheet.getLastRow();
    if (last > 1 && sheet.getRange(2,1,last-1,1).getValues().some(row => row[0] === id)) return ContentService.createTextOutput(JSON.stringify({ok:true,id,duplicate:true})).setMimeType(ContentService.MimeType.JSON);
    const now = new Date().toISOString();
    const safe = value => {const s=String(value == null ? '' : value).slice(0,15000);return /^[=+@-]/.test(s) ? "'"+s : s};
    const row=[id,now,name,phone,data.email||'',data.form||'calculator','Бамбуковые панели','bamboo.nimtech.ru',data.utm_source||'',data.utm_medium||'',data.utm_campaign||'',data.utm_content||'',data.utm_term||'',data.page||'',data.first_page||'',data.referrer||'',data.client_id||'',data.yandex_client_id||'',now,'Бамбук','Объекты','new','','','not_requested','',JSON.stringify(data.calculator||data.note||{}),'',0,now];
    sheet.appendRow(row.map(safe));
    return ContentService.createTextOutput(JSON.stringify({ok:true,id})).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {return ContentService.createTextOutput(JSON.stringify({ok:false,error:'Invalid request'})).setMimeType(ContentService.MimeType.JSON);} finally {lock.releaseLock();}
}
