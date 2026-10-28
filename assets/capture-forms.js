(()=>{'use strict';
const endpoint='https://script.google.com/macros/s/AKfycbwIJBg8ngWlFnF_jismd5qkkHcaotVkORh1d-rX6Z2WhWtKAiZ1O_KBlzX9g2MOa1II/exec';
const css=`
.nt-capture-float{position:fixed;right:20px;bottom:22px;z-index:980;max-width:calc(100vw - 40px);border:0;border-radius:16px;padding:16px 23px;cursor:pointer;color:#fff;font:700 15px/1.3 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:linear-gradient(110deg,#135a43,#22a97d,#d5a64b,#198b71,#135a43);background-size:300% 100%;animation:nt-capture-glow 6s ease-in-out infinite;box-shadow:0 10px 28px #124a3960;transition:transform .2s,box-shadow .2s}
.nt-capture-float:hover,.nt-capture-trigger:hover{transform:translateY(-2px);box-shadow:0 14px 32px #124a3950}
.nt-capture-trigger{display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;border:0;border-radius:13px;padding:15px 22px;cursor:pointer;color:#fff;font:700 15px/1.3 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:linear-gradient(110deg,#145c46,#21a57d,#d8ae59,#1b9b78,#145c46);background-size:300% 100%;animation:nt-capture-glow 6s ease-in-out infinite;box-shadow:0 8px 24px #124a3940;transition:transform .2s,box-shadow .2s}
@keyframes nt-capture-glow{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.nt-capture-overlay{position:fixed;inset:0;z-index:2000;display:none;align-items:center;justify-content:center;padding:20px;background:#0b2019bb;backdrop-filter:blur(5px)}
.nt-capture-overlay.is-open{display:flex}
.nt-capture-panel{position:relative;width:min(100%,440px);border-radius:24px;background:#fff;color:#1b2d25;padding:30px;box-shadow:0 22px 75px #071e1a50;font:15px/1.5 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.nt-capture-panel h2{font-size:25px;line-height:1.18;margin:0 30px 10px 0}
.nt-capture-panel p{margin:0 0 19px;color:#58665f}
.nt-capture-panel label{display:block;font-weight:600;margin:12px 0 6px}
.nt-capture-panel input[type=text],.nt-capture-panel input[type=tel]{width:100%;border:1px solid #bfcac3;border-radius:11px;padding:13px 14px;font:inherit;background:#fff;color:#172820;box-sizing:border-box}
.nt-capture-panel input:focus{outline:2px solid #20a47a;outline-offset:1px}
.nt-capture-panel .nt-capture-consent{display:flex;gap:9px;align-items:flex-start;font-weight:400;font-size:12px;line-height:1.5}
.nt-capture-panel .nt-capture-consent input{margin-top:3px;flex-shrink:0}
.nt-capture-panel .nt-capture-submit{width:100%;margin-top:12px}
.nt-capture-panel .nt-capture-close{position:absolute;top:14px;right:14px;border:0;background:transparent;color:#475c50;font-size:28px;cursor:pointer;padding:4px 10px}
.nt-capture-status{font-size:13px;margin-top:12px;min-height:18px}
@media(max-width:600px){.nt-capture-float{right:12px;bottom:12px;left:12px;max-width:none;width:calc(100% - 24px)}.nt-capture-panel{padding:23px}}
@media(prefers-reduced-motion:reduce){.nt-capture-float,.nt-capture-trigger{animation:none}}
`;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const format=raw=>{let d=String(raw||'').replace(/\D/g,'');if(d[0]==='7'||d[0]==='8')d=d.slice(1);d=d.slice(0,10);let v='+7(';v+=d.slice(0,3);if(d.length>=3)v+=')';if(d.length>3)v+=d.slice(3,6);if(d.length>6)v+='-'+d.slice(6,8);if(d.length>8)v+='-'+d.slice(8,10);return v};
const valid=v=>/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(v);
const applyMask=el=>{if(el.dataset.ntMaskReady)return;el.dataset.ntMaskReady='1';el.type='tel';el.inputMode='numeric';el.autocomplete='tel';el.required=true;el.maxLength=16;el.placeholder='+7(___)___-__-__';el.pattern='\\+7\\([0-9]{3}\\)[0-9]{3}-[0-9]{2}-[0-9]{2}';
el.addEventListener('focus',()=>{if(!el.value)el.value='+7('});
el.addEventListener('input',()=>{el.value=format(el.value);el.setCustomValidity('')});
el.addEventListener('paste',e=>{e.preventDefault();el.value=format(e.clipboardData.getData('text'));el.setCustomValidity('')});
el.addEventListener('blur',()=>{if(el.value==='+7(')el.value=''});
el.addEventListener('invalid',()=>el.setCustomValidity('Введите номер полностью: +7(999)123-45-67'));
el.closest('form')?.addEventListener('submit',e=>{if(!valid(el.value)){e.preventDefault();e.stopImmediatePropagation();el.setCustomValidity('Введите номер полностью: +7(999)123-45-67');el.reportValidity()}},true);
};
document.querySelectorAll('input[type="tel"],input[name="phone"],input[data-ru-phone-mask]').forEach(applyMask);
const float=document.createElement('button');float.type='button';float.className='nt-capture-float';float.textContent='Получить консультацию';float.setAttribute('aria-haspopup','dialog');document.body.appendChild(float);
const overlay=document.createElement('div');overlay.className='nt-capture-overlay';overlay.innerHTML=`<section class="nt-capture-panel" role="dialog" aria-modal="true" aria-labelledby="nt-capture-title"><button class="nt-capture-close" type="button" aria-label="Закрыть">×</button><h2 id="nt-capture-title">Подберём панели под ваш проект</h2><p>Оставьте телефон — свяжемся, уточним задачу и рассчитаем стоимость.</p><form id="nt-capture-form"><label for="nt-capture-name">Имя (необязательно)</label><input id="nt-capture-name" type="text" maxlength="100" autocomplete="name" placeholder="Как к вам обращаться"><label for="nt-capture-phone">Телефон *</label><input id="nt-capture-phone" type="tel" required autocomplete="tel" placeholder="+7(___)___-__-__"><label class="nt-capture-consent"><input type="checkbox" required><span>Согласен(на) на <a href="/personal-data.html" target="_blank" rel="noopener">обработку персональных данных</a> и ознакомлен(а) с <a href="/privacy.html" target="_blank" rel="noopener">политикой конфиденциальности</a>.</span></label><button type="submit" class="nt-capture-trigger nt-capture-submit">Жду звонка</button><div class="nt-capture-status" role="status" aria-live="polite"></div></form></section>`;document.body.appendChild(overlay);
const form=overlay.querySelector('form'),phone=overlay.querySelector('#nt-capture-phone'),status=overlay.querySelector('.nt-capture-status');applyMask(phone);
let lastFocus=null;
const open=()=>{lastFocus=document.activeElement;overlay.classList.add('is-open');document.body.style.overflow='hidden';status.textContent='';phone.focus()};
const close=()=>{overlay.classList.remove('is-open');document.body.style.overflow='';lastFocus?.focus()};
float.addEventListener('click',open);
overlay.querySelector('.nt-capture-close').addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('is-open'))close()});
const cta=document.createElement('div');cta.style.cssText='display:flex;justify-content:center;padding:22px 16px 38px';
const btn=document.createElement('button');btn.type='button';btn.className='nt-capture-trigger';btn.textContent='Получить расчёт и консультацию';btn.addEventListener('click',open);cta.appendChild(btn);
const main=document.querySelector('main');if(main)main.appendChild(cta);
form.addEventListener('submit',async e=>{e.preventDefault();if(!valid(phone.value)){phone.setCustomValidity('Введите номер полностью: +7(999)123-45-67');phone.reportValidity();return}
const send=form.querySelector('button[type=submit]');send.disabled=true;status.textContent='Передаём заявку…';
const qs=new URLSearchParams(location.search);
const payload={id:crypto.randomUUID(),name:overlay.querySelector('#nt-capture-name').value.trim()||'Без имени',phone:phone.value,form:'quick_callback',source:'bamboo.nimtech.ru',tag:'Бамбук',pipeline:'Объекты',page:location.href,first_page:sessionStorage.getItem('nimtech_first_page')||location.href,referrer:document.referrer,utm_source:qs.get('utm_source')||'',utm_medium:qs.get('utm_medium')||'',utm_campaign:qs.get('utm_campaign')||'',utm_content:qs.get('utm_content')||'',utm_term:qs.get('utm_term')||'',consent:true};
try{await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:AbortSignal.timeout(12000)});form.reset();window.location.assign('/thank-you/')}catch(err){status.textContent='Не удалось подтвердить отправку. Попробуйте ещё раз или позвоните нам.'}finally{send.disabled=false}
});
})();