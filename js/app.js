(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const KEY_DRAFT='eval.draft.v1', KEY_SAVED='eval.saved.v1';
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

// العلامة الثابتة للمنصة — تتعدّل هنا مرة واحدة (logo: رابط data: للشعار، أو اتركه فاضي)
const PLATFORM={name:'منصة علامة',logo:'assets/logo-white.png'};
const BAR_COLORS=['#FFB81C','#1FC2B4','#8B6CF6','#FF7A59','#2D7FF0','#E5487F'];

const LEVELS=[
  {id:'excellent',f:'ممتازة',m:'ممتاز',c:'#12A06B',stars:5},
  {id:'vgood',f:'جيدة جدًا',m:'جيد جدًا',c:'#1FA7C9',stars:4},
  {id:'good',f:'جيدة',m:'جيد',c:'#F29A00',stars:3},
  {id:'progress',f:'في تقدّم مستمر',m:'في تقدّم مستمر',c:'#8B6CF6',stars:3},
  {id:'support',f:'تحتاج دعمًا',m:'يحتاج دعمًا',c:'#E8664F',stars:2}
];
// [feminine, masculine]; {n}=name
const PHRASES={
  fLevel:[
    ['تُظهر {n} تقدمًا ملحوظًا في مستواها، ويعكس أداؤها أثر المتابعة والجهد المبذول معها من قِبل المعلمة.','يُظهر {n} تقدمًا ملحوظًا في مستواه، ويعكس أداؤه أثر المتابعة والجهد المبذول معه من قِبل المعلم.'],
    ['كما تشهد مهارات القراءة وفهم المقروء لديها تطورًا واضحًا مع استمرار التدريب.','كما تشهد مهارات القراءة وفهم المقروء لديه تطورًا واضحًا مع استمرار التدريب.'],
    ['مستوى {n} ممتاز ومستقر، وتؤدي المهام المطلوبة بثقة واستقلالية.','مستوى {n} ممتاز ومستقر، ويؤدي المهام المطلوبة بثقة واستقلالية.'],
    ['تحتاج {n} إلى مزيد من التدريب على المفردات الأساسية لتثبيت ما تعلمته.','يحتاج {n} إلى مزيد من التدريب على المفردات الأساسية لتثبيت ما تعلمه.'],
    ['تتحسن طلاقتها في النطق والمحادثة من حصة لأخرى.','تتحسن طلاقته في النطق والمحادثة من حصة لأخرى.']
  ],
  fNote:[
    ['أظهرت الطالبة تطورًا ملحوظًا خلال الحصص الأخيرة، خاصة في مهارات القراءة وفهم معاني الكلمات.','أظهر الطالب تطورًا ملحوظًا خلال الحصص الأخيرة، خاصة في مهارات القراءة وفهم معاني الكلمات.'],
    ['كما تتميز بتفاعل ممتاز وقدرة جيدة على فهم توجيهات المعلمة والتواصل معها أثناء الحصة.','كما يتميز بتفاعل ممتاز وقدرة جيدة على فهم توجيهات المعلم والتواصل معه أثناء الحصة.'],
    ['تلتزم بالحضور في المواعيد وتؤدي الواجبات بانتظام.','يلتزم بالحضور في المواعيد ويؤدي الواجبات بانتظام.'],
    ['تحتاج إلى تشجيع إضافي على المشاركة الشفهية لبناء ثقتها.','يحتاج إلى تشجيع إضافي على المشاركة الشفهية لبناء ثقته.'],
    ['لوحظ تأخر في تسليم بعض الواجبات، ونأمل متابعة الأسرة لذلك.','لوحظ تأخر في تسليم بعض الواجبات، ونأمل متابعة الأسرة لذلك.']
  ],
  fRec:[
    ['نوصي بمواصلة الحصص بشكل منتظم والاستمرار في تدريبات Reading والمفردات وفهم المقروء للحفاظ على مستوى {n} ودعم تقدمها بصورة مستمرة.','نوصي بمواصلة الحصص بشكل منتظم والاستمرار في تدريبات Reading والمفردات وفهم المقروء للحفاظ على مستوى {n} ودعم تقدمه بصورة مستمرة.'],
    ['نوصي بتخصيص ١٥ دقيقة يوميًا للقراءة في المنزل بمتابعة الأسرة.','نوصي بتخصيص ١٥ دقيقة يوميًا للقراءة في المنزل بمتابعة الأسرة.'],
    ['نوصي بزيادة عدد الحصص الأسبوعية لتسريع وتيرة التقدم.','نوصي بزيادة عدد الحصص الأسبوعية لتسريع وتيرة التقدم.'],
    ['نوصي بتشجيعها على المحادثة باللغة في مواقف يومية بسيطة.','نوصي بتشجيعه على المحادثة باللغة في مواقف يومية بسيطة.']
  ]
};
const CHIP_LABEL={fLevel:['تقدم ملحوظ','تطور القراءة','مستوى ممتاز','يحتاج مفردات','تحسن النطق'],fNote:['تطور في الحصص الأخيرة','تفاعل ممتاز','التزام بالحضور','تشجيع على المشاركة','تأخر الواجبات'],fRec:['مواصلة الحصص','قراءة يومية','زيادة الحصص','محادثة يومية']};

const today=()=>new Date().toISOString().slice(0,10);
const SAMPLE={id:null,gender:'f',name:'نوره البخيت',subject:'اللغة الإنجليزية',teacher:'',date:today(),supervisor:'',level:'vgood',showSkills:true,
  skills:[{n:'القراءة',v:4},{n:'فهم المقروء',v:4},{n:'المفردات',v:3},{n:'التفاعل في الحصة',v:5}],
  lvlText:'تُظهر نوره تقدمًا ملحوظًا في مستواها، ويعكس أداؤها أثر المتابعة والجهد المبذول معها من قِبل المعلمة.\nكما تشهد مهارات القراءة وفهم المقروء لديها تطورًا واضحًا مع استمرار التدريب.',
  note:'أظهرت الطالبة تطورًا ملحوظًا خلال الحصص الأخيرة، خاصة في مهارات القراءة وفهم معاني الكلمات.\nكما تتميز بتفاعل ممتاز وقدرة جيدة على فهم توجيهات المعلمة والتواصل معها أثناء الحصة.',
  rec:'نوصي بمواصلة الحصص بشكل منتظم والاستمرار في تدريبات Reading والمفردات وفهم المقروء للحفاظ على مستوى نوره ودعم تقدمها بصورة مستمرة.'};
const BLANK=()=>({id:null,gender:'f',name:'',subject:'',teacher:'',date:today(),supervisor:'',level:'',showSkills:true,
  skills:[{n:'القراءة',v:0},{n:'فهم المقروء',v:0},{n:'المفردات',v:0},{n:'التفاعل في الحصة',v:0}],lvlText:'',note:'',rec:''});

let S=Object.assign(BLANK(),store.get(KEY_DRAFT,SAMPLE));
let saved=store.get(KEY_SAVED,[]);

const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const G=()=>S.gender==='m';
const studentWord=()=>G()?'الطالب':'الطالبة';
const firstName=()=>(S.name.trim().split(/\s+/)[0]||studentWord());
const fmtDate=d=>{if(!d)return'';try{return new Date(d+'T00:00:00').toLocaleDateString('ar-SA-u-ca-gregory-nu-arab',{day:'numeric',month:'long',year:'numeric'})}catch(e){return d}};
const levelLabel=()=>{const l=LEVELS.find(x=>x.id===S.level);return l?(G()?l.m:l.f):''};

const ICONS={
  level:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
  note:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/></svg>',
  rec:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>'
};

function renderReport(){
  document.documentElement.dataset.g=S.gender;
  const sw=studentWord(), name=S.name.trim(), brand=PLATFORM.name.trim();
  const sec=(cls,ico,title,txt,ph)=>`<section class="r-sec ${cls}"><div class="r-ico">${ico}</div><div style="min-width:0"><h3>${title}</h3><p class="${txt.trim()?'':'placeholder'}">${esc(txt.trim()||ph)}</p></div></section>`;
  const skills=S.showSkills?S.skills.filter(s=>s.n.trim()&&s.v>0):[];
  const lv=LEVELS.find(x=>x.id===S.level);
  const brandHTML=PLATFORM.logo?`<span class="r-logo-wrap"><img class="r-logo" src="${PLATFORM.logo}" alt="${esc(brand)}"></span>`:`<span class="r-brand"><span class="r-mono">★</span>${esc(brand||'تقرير متابعة')}</span>`;
  $('#report').innerHTML=`
    <header class="r-head">
      <span class="r-dot" style="top:-50px;left:-40px;width:150px;height:150px;background:rgba(255,255,255,.13)"></span>
      <span class="r-dot" style="bottom:-30px;left:90px;width:80px;height:80px;background:rgba(255,255,255,.10)"></span>
      <span class="r-dot" style="top:58px;left:34px;width:16px;height:16px;background:#FFD45C"></span>
      <span class="r-dot" style="top:22px;left:130px;width:9px;height:9px;background:rgba(255,255,255,.8)"></span>
      <span class="r-dot" style="bottom:26px;left:28px;width:11px;height:11px;background:rgba(255,255,255,.55)"></span>
      <div class="r-brandline">${brandHTML}<span>${esc(fmtDate(S.date))}</span></div>
      <div class="r-who"><div class="r-avatar">${G()?'👦':'👧'}</div>
        <h2 class="r-title"><small>📚 تقييم ${sw}</small>${esc(name||'اسم '+sw)}</h2></div>
    </header>
    <div class="r-meta">
      <div><span>📖 المادة</span><b>${esc(S.subject.trim()||'—')}</b></div>
      ${S.teacher.trim()?`<div><span>${G()?'👨‍🏫 المعلم':'👩‍🏫 المعلمة'}</span><b>${esc(S.teacher.trim())}</b></div>`:''}
    </div>
    <div class="r-body">
      ${lv?`<div class="r-overall"><span class="lbl">🏅 التقدير العام</span><span style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end"><span class="r-stars">${'⭐'.repeat(lv.stars)}</span><span class="r-badge" style="background:${lv.c}">${esc(levelLabel())}</span></span></div>`:''}
      ${skills.length?`<div class="r-skills">${skills.map((s,i)=>`<div class="r-skill"><span>${esc(s.n)}</span><div class="r-bar"><i style="width:${s.v*20}%;background:${BAR_COLORS[i%BAR_COLORS.length]}"></i></div><em>${s.v}/5</em></div>`).join('')}</div>`:''}
      ${sec('s-level','🌟','مستوى '+sw,S.lvlText,'اكتب وصفًا لمستوى '+sw+'…')}
      ${sec('s-note','💡','ملاحظة الإشراف',S.note,'اكتب ملاحظة الإشراف…')}
      ${sec('s-rec','🚀',brand?'توصية '+brand:'توصية المنصة',S.rec,'اكتب التوصية…')}
    </div>
    <footer class="r-foot">
      <span>${S.supervisor.trim()?`الإشراف: <b>${esc(S.supervisor)}</b>`:'إعداد: فريق الإشراف التعليمي'}</span>
      <span class="r-cheer">${G()?'استمر يا بطل 💪':'استمري يا بطلة 💪'}</span>
    </footer>`;
  const t=encodeURIComponent(plainText());
  $('#waLink').href=$('#waLinkM').href='https://wa.me/?text='+t;
}

function plainText(){
  const sw=studentWord(), out=[];
  out.push(`📚 تقييم ${sw} ${S.name.trim()}`);
  if(PLATFORM.name.trim())out.push(`🏫 ${PLATFORM.name.trim()}${S.date?' — '+fmtDate(S.date):''}`);else if(S.date)out.push(`🗓️ ${fmtDate(S.date)}`);
  out.push('');
  out.push(`${G()?'👦':'👧'} ${sw}: ${S.name.trim()}`);
  if(S.subject.trim())out.push(`📖 المادة: ${S.subject.trim()}`);
  if(S.teacher.trim())out.push(`👩‍🏫 ${G()?'المعلم':'المعلمة'}: ${S.teacher.trim()}`);
  if(levelLabel())out.push(`🏅 التقدير العام: ${levelLabel()}`);
  const sk=S.showSkills?S.skills.filter(s=>s.n.trim()&&s.v>0):[];
  if(sk.length){out.push('');out.push('📊 المهارات:');sk.forEach(s=>out.push(`• ${s.n}: ${'★'.repeat(s.v)}${'☆'.repeat(5-s.v)}`))}
  if(S.lvlText.trim()){out.push('');out.push(`🌟 مستوى ${sw}:`);out.push(S.lvlText.trim())}
  if(S.note.trim()){out.push('');out.push('💡 ملاحظة الإشراف:');out.push(S.note.trim())}
  if(S.rec.trim()){out.push('');out.push(`➡️ ${PLATFORM.name.trim()?'توصية '+PLATFORM.name.trim():'توصية المنصة'}:`);out.push(S.rec.trim())}
  return out.join('\n');
}

/* ----- form binding ----- */
const MAP={fName:'name',fSubject:'subject',fTeacher:'teacher',fDate:'date',fSupervisor:'supervisor',fLevel:'lvlText',fNote:'note',fRec:'rec'};
function fillForm(){
  for(const id in MAP)$('#'+id).value=S[MAP[id]]||'';
  $('#fShowSkills').checked=!!S.showSkills;
  $$('#genderSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.g===S.gender));
  renderLevels();renderSkills();renderChips();renderSaved();renderReport();
}
function changed(){store.set(KEY_DRAFT,S);renderReport();}
for(const id in MAP)$('#'+id).addEventListener('input',e=>{S[MAP[id]]=e.target.value;if(id==='fName')renderChips();changed()});
$('#fShowSkills').addEventListener('change',e=>{S.showSkills=e.target.checked;changed()});
$('#genderSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;S.gender=b.dataset.g;$$('#genderSeg button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderLevels();renderChips();changed()});

function renderLevels(){
  $('#levels').innerHTML=LEVELS.map(l=>`<button type="button" data-l="${l.id}" aria-pressed="${S.level===l.id}">${G()?l.m:l.f}</button>`).join('');
}
$('#levels').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;S.level=S.level===b.dataset.l?'':b.dataset.l;renderLevels();changed()});

function renderSkills(){
  $('#skills').innerHTML=S.skills.map((s,i)=>`<div class="skill-row" data-i="${i}">
    <input type="text" id="skill-${i}" value="${esc(s.n)}" aria-label="اسم المهارة">
    <div class="dots" role="group" aria-label="درجة ${esc(s.n)} من ٥">${[1,2,3,4,5].map(v=>`<button type="button" data-v="${v}" class="${v<=s.v?'on':''}">${v}</button>`).join('')}</div>
    <button type="button" class="icon-btn" data-del aria-label="حذف المهارة"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
  </div>`).join('');
}
$('#skills').addEventListener('input',e=>{const r=e.target.closest('.skill-row');if(!r)return;S.skills[+r.dataset.i].n=e.target.value;changed()});
$('#skills').addEventListener('click',e=>{const r=e.target.closest('.skill-row');if(!r)return;const i=+r.dataset.i;
  const d=e.target.closest('[data-v]');if(d){const v=+d.dataset.v;S.skills[i].v=S.skills[i].v===v?0:v;renderSkills();changed();return}
  if(e.target.closest('[data-del]')){S.skills.splice(i,1);renderSkills();changed()}});
$('#addSkill').addEventListener('click',()=>{S.skills.push({n:'',v:0});renderSkills();const inp=$('#skill-'+(S.skills.length-1));inp&&inp.focus()});

function phrase(id,i){const p=PHRASES[id][i][G()?1:0];return p.replace(/\{n\}/g,firstName())}
function renderChips(){
  $$('.chips').forEach(box=>{const id=box.dataset.for;box.innerHTML=PHRASES[id].map((_,i)=>`<button type="button" data-i="${i}" title="${esc(phrase(id,i))}">${CHIP_LABEL[id][i]}</button>`).join('')});
}
document.addEventListener('click',e=>{const b=e.target.closest('.chips button');if(!b)return;const id=b.parentElement.dataset.for;const ta=$('#'+id);
  const add=phrase(id,+b.dataset.i);ta.value=ta.value.trim()?ta.value.replace(/\s+$/,'')+'\n'+add:add;S[MAP[id]]=ta.value;changed();ta.focus()});

/* ----- saved list ----- */
function renderSaved(){
  $('#savedCount').textContent=saved.length.toLocaleString('ar-EG');
  const q=($('#savedSearch').value||'').trim();
  const list=saved.filter(x=>!q||((x.name||'')+' '+(x.subject||'')).includes(q));
  if(!saved.length){$('#saved').innerHTML='<div class="empty">لا توجد تقييمات محفوظة بعد. اضغط «حفظ التقييم» لحفظ الحالي.</div>';return}
  if(!list.length){$('#saved').innerHTML='<div class="empty">لا توجد نتائج.</div>';return}
  $('#saved').innerHTML=list.slice().sort((a,b)=>(b.savedAt||0)-(a.savedAt||0)).map(s=>`<div class="saved-item ${s.id===S.id?'active':''}" data-id="${s.id}">
    <div style="min-width:0"><b>${esc(s.name||'بدون اسم')}</b><small>${esc(s.subject||'—')} · ${esc(fmtDate(s.date))}</small></div>
    <div class="acts"><button type="button" data-open>فتح</button><button type="button" data-rm>حذف</button></div></div>`).join('');
}
$('#saved').addEventListener('click',e=>{const it=e.target.closest('.saved-item');if(!it)return;const id=it.dataset.id;
  if(e.target.closest('[data-open]')){S=Object.assign(BLANK(),JSON.parse(JSON.stringify(saved.find(x=>x.id===id))));store.set(KEY_DRAFT,S);fillForm();toast('تم فتح التقييم');closeDrawer();setView('form');return}
  const rm=e.target.closest('[data-rm]');if(rm){if(rm.classList.contains('warn')){saved=saved.filter(x=>x.id!==id);store.set(KEY_SAVED,saved);if(S.id===id){S.id=null;store.set(KEY_DRAFT,S)}renderSaved();toast('تم الحذف')}else{rm.classList.add('warn');rm.textContent='تأكيد الحذف';setTimeout(()=>{if(rm.isConnected){rm.classList.remove('warn');rm.textContent='حذف'}},3000)}}});
function save(){
  if(!S.name.trim()){toast('اكتب اسم الطالب/ة أولًا');setView('form');$('#fName').focus();return}
  if(!S.id)S.id='e'+Date.now().toString(36);
  const rec=JSON.parse(JSON.stringify(S));rec.savedAt=Date.now();
  const i=saved.findIndex(x=>x.id===S.id);if(i>=0)saved[i]=rec;else saved.push(rec);
  store.set(KEY_SAVED,saved);store.set(KEY_DRAFT,S);renderSaved();toast('✓ تم حفظ تقييم '+S.name.trim()+' — تلاقيه في «المحفوظة»');
}
$('#btnSave').addEventListener('click',save);
function openDrawer(){$('#savedSearch').value='';renderSaved();$('#drawer').hidden=false}
function closeDrawer(){$('#drawer').hidden=true}
$('#btnSaved').addEventListener('click',openDrawer);$('#drawerClose').addEventListener('click',closeDrawer);
$('#drawer').addEventListener('click',e=>{if(e.target.id==='drawer')closeDrawer()});
$('#savedSearch').addEventListener('input',renderSaved);$('#mSave').addEventListener('click',save);
$('#btnNew').addEventListener('click',()=>{S=BLANK();store.set(KEY_DRAFT,S);fillForm();setView('form');$('#fName').focus();toast('نموذج جديد')});

/* ----- export ----- */
async function copyText(){const t=plainText();
  try{await navigator.clipboard.writeText(t);toast('تم نسخ التقييم — الصقه في واتساب أو أي رسالة')}
  catch(e){const ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();toast(ok?'تم نسخ التقييم':'تعذّر النسخ تلقائيًا')}}
// داخل معاينة Claude الصفحة بتشتغل في إطار مقفول: التحميل والمشاركة المباشرة ممنوعين هناك
const FRAMED=(()=>{try{return window.self!==window.top}catch(e){return true}})();
let shot=null; // {canvas, png:Blob}
const fileBase=()=>('تقييم '+(S.name.trim()||studentWord())).replace(/[\\/:*?"<>|]+/g,'').replace(/\s+/g,'-');
const toBlob=(c,type,q)=>new Promise(r=>c.toBlob(r,type,q));
function hint(msg){const h=$('#modalHint');h.textContent=msg;h.hidden=!msg}
const FRAMED_MSG='📌 أنت فاتح الصفحة جوّه Claude، وهنا التحميل والإرسال المباشر مقفولين. اضغط مطوّلًا على الصورة ← «مشاركة» ← واتساب، أو «حفظ الصورة». ولما الصفحة تتنشر على رابط عادي الأزرار هتشتغل مباشرة.';
async function exportImage(){
  if(!window.html2canvas){toast('أداة الصورة لم تُحمَّل، تأكد من الاتصال');return}
  setView('preview');toast('جارٍ تجهيز البطاقة…');
  try{await document.fonts.ready;
    const c=await html2canvas($('#report'),{scale:Math.max(2,Math.min(3,window.devicePixelRatio||2)),backgroundColor:'#FFFFFF',useCORS:true,logging:false});
    shot={canvas:c,png:await toBlob(c,'image/png')};
    $('#modalImg').src=c.toDataURL('image/png');
    hint('');
    $('#modal').hidden=false;
  }catch(err){toast('تعذّر إنشاء الصورة')}
}
function download(blob,name){
  const u=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),4000);
}
function makePdf(){
  const {jsPDF}=window.jspdf, c=shot.canvas, w=210, h=Math.round(w*c.height/c.width*10)/10;
  const doc=new jsPDF({unit:'mm',format:[w,h],orientation:h>=w?'portrait':'landscape',compress:true});
  doc.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',0,0,w,h);
  doc.setProperties({title:'تقييم '+S.name.trim()});
  return doc.output('blob');
}
async function shareFile(blob,name,type){
  const f=new File([blob],name,{type});
  if(navigator.canShare&&navigator.canShare({files:[f]})){
    try{await navigator.share({files:[f]});return true}
    catch(e){if(e&&e.name==='AbortError')return true}
  }
  return false;
}
// حفظ ملف: عبر قدرة التنزيل في Claude لو متاحة، وإلا تنزيل عادي على أي رابط آخر
let DL=null;
if(window.claude&&window.claude.use){window.claude.use('downloads').then(d=>{DL=d}).catch(()=>{})}
async function saveFile(blob,name){
  if(DL){
    try{await DL.save({filename:name,data:blob});return 'saved'}
    catch(e){const c=e&&e.code;
      if(c==='declined')return 'declined';
      if(c==='rate_limited'){toast('فيه نافذة حفظ مفتوحة بالفعل');return 'declined'}
      if(c==='rejected_extension'||c==='extension_not_enabled'){toast('الصيغة دي مش متاحة هنا، جرّب الصورة');return 'declined'}
    }
  }
  if(!FRAMED){download(blob,name);return 'saved'}
  return 'blocked';
}
const BLOCKED_MSG='📌 الحفظ مقفول في العرض ده. اضغط مطوّلًا على الصورة ← «حفظ الصورة» أو «مشاركة» ← واتساب.';
$('#shWa').addEventListener('click',async()=>{if(!shot)return;
  if(await shareFile(shot.png,fileBase()+'.png','image/png'))return;
  const r=await saveFile(shot.png,fileBase()+'.png');
  if(r==='blocked'){hint(BLOCKED_MSG);return}
  if(r!=='saved')return;
  const $h=$('#modalHint');
  $h.innerHTML='✓ اتحفظت الصورة. افتح واتساب، ادخل على محادثة ولي الأمر، واضغط 📎 ← الصور واختارها.<br><a href="https://wa.me/" target="_blank" rel="noopener" style="color:inherit;font-weight:700">فتح واتساب ←</a>';
  $h.hidden=false;
});
$('#dlPng').addEventListener('click',async()=>{if(!shot)return;
  const r=await saveFile(shot.png,fileBase()+'.png');
  if(r==='saved')toast('✓ اتحفظت الصورة');else if(r==='blocked')hint(BLOCKED_MSG)});
$('#dlPdf').addEventListener('click',async()=>{if(!shot)return;
  if(!window.jspdf){toast('أداة PDF لم تُحمَّل، تأكد من الاتصال');return}
  const pdf=makePdf();
  if(!DL&&await shareFile(pdf,fileBase()+'.pdf','application/pdf'))return;
  const r=await saveFile(pdf,fileBase()+'.pdf');
  if(r==='saved')toast('✓ اتحفظ ملف PDF');else if(r==='blocked')hint('📌 ملف PDF مش متاح في العرض ده. استخدم الصورة: اضغط عليها مطوّلًا ← حفظ أو مشاركة.')});
document.addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a)return;if(a.dataset.act==='copy')copyText();if(a.dataset.act==='image')exportImage()});
$('#modalX').addEventListener('click',()=>$('#modal').hidden=true);
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')$('#modal').hidden=true});

/* ----- mobile tabs ----- */
function setView(v){$('#app').dataset.view=v;$('#tabForm').setAttribute('aria-pressed',v==='form');$('#tabPreview').setAttribute('aria-pressed',v==='preview')}
$('#tabForm').addEventListener('click',()=>setView('form'));
$('#tabPreview').addEventListener('click',()=>{setView('preview');window.scrollTo({top:0})});

let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}

fillForm();
})();
