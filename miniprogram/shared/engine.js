const {groups,presets,stores}=require('./catalog');
const fields=()=>groups.reduce((a,g)=>a.concat(g.fields),[]);
const rounded=n=>Math.round(n*100)/100;
const seed={mom:true,baby:true,babies:1,nurse:'platinum',extraNurse:'none',meal:true,feast:false,familyCard:false,baseRecovery:true,pregnancy:0,refresh:false,golden:false,beauty:false,star:'none',room:'north',pump:false,swim:0,education:0,car:'none',hospital:0,delivery:false,sterilizer:false,photo:true,daycare:true,homeNurse:'platinum'};
function defaults(){const d={version:2,storeId:stores[0].id,days:28,homeDays:0,presetId:''};for(const f of fields()){const candidate=f.defaultValue!==undefined?f.defaultValue:seed[f.id];d[f.id]=f.options.some(o=>o.value===candidate)?candidate:f.options[0].value;}return d;}
function normalize(input){
 const d=defaults();for(const k of Object.keys(d)){if(input&&Object.prototype.hasOwnProperty.call(input,k))d[k]=input[k];}
 d.days=Math.max(1,Math.min(60,Math.round(Number(d.days)||28)));
 d.homeDays=Math.max(0,Math.min(60,Math.round(Number(d.homeDays)||0)));
 if(!stores.some(s=>s.id===d.storeId)) d.storeId=stores[0].id;
 for(const f of fields()){if(!f.options.some(o=>o.value===d[f.id]))d[f.id]=defaults()[f.id];}
 if(d.babies===1&&fields().some(f=>f.id==='extraNurse'&&f.options.some(o=>o.value==='none')))d.extraNurse='none';
 if(!presets.some(p=>p.id===d.presetId))d.presetId='';
 return d;
}
function itemLines(input){const d=normalize(input);return fields().map(f=>{
 const option=f.options.find(o=>o.value===d[f.id]);
 const daily=(f.billing||((f.id==='mom'||f.id==='baby')?'daily':f.kind))==='daily';
 const kind=f.billing||f.kind;const count=kind==='home'?d.homeDays:daily?d.days:1;
 const active=option.price>0||kind==='included';
 return {id:f.id,title:f.title,label:option.label,rate:option.price,count,unit:kind==='home'||daily?'天':'项',total:rounded(option.price*count),original:rounded(option.original*count),active};
}).filter(l=>l.active && (l.count>0));}
function presetDraft(id,storeId){const p=presets.find(x=>x.id===id);if(!p)throw Error('套餐不存在');return normalize(Object.assign(defaults(),{storeId:storeId||stores[0].id,days:p.days,room:p.room,presetId:p.id},p.selections||p.patch));}
function price(input){
 const d=normalize(input),lines=itemLines(d),subtotal=rounded(lines.reduce((a,l)=>a+l.total,0)),original=rounded(lines.reduce((a,l)=>a+l.original,0));
 const p=presets.find(x=>x.id===d.presetId);
 // 文档未提供套餐完整构成：使用显式“套餐价格调整”保留文档报价，微调按项目差额结算。
 const adjustment=p&&p.priceMode!=='sum'?rounded(p.price-itemLines(presetDraft(p.id,d.storeId)).reduce((a,l)=>a+l.total,0)):0;
 const total=Math.max(0,rounded(subtotal+adjustment));
 return {lines,subtotal,adjustment,total,original:Math.max(total,original),savings:Math.max(0,rounded(original-total)),points:d.days>=28?Math.floor(total*0.15):0,giftEligible:d.days>=21,days:d.days,presetName:p?p.name:'我的专属月子',store:stores.find(s=>s.id===d.storeId)};
}
function change(d,key,value){const next=Object.assign({},d);if(key==='days'||key==='homeDays'){next[key]=Number(value);if(key==='days'&&Number(value)!==d.days)next.presetId='';}else{const f=fields().find(f=>f.id===key);if(f){const opt=f.options.find(o=>String(o.value)===String(value));if(opt)next[key]=opt.value;}}return normalize(next);}
function money(value){return Number(value).toLocaleString('en-US',{maximumFractionDigits:2});}
module.exports={defaults,normalize,presetDraft,price,change,money};
