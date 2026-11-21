/* Browser-only WXML interpreter. Native miniprogram shares this exact template and business code. */
const E=byxRequire('engine');
const container=document.getElementById('app');
const routes={index:'index/index',story:'story/story',store:'store/select',mode:'mode-select/mode-select',presets:'package-preset/package-preset',customizer:'customizer/customizer',room:'room-detail/room-detail',service:'service-detail/service-detail',preview:'preview/preview',my:'my/my',consult:'consult/consult'};
const titles={index:'伴月轩 · 定制月子',story:'品牌故事',store:'选择门店',mode:'开始定制',presets:'热门方案',customizer:'定制我的月子',room:'空间详情',preview:'我的月子方案',my:'我的伴月轩',consult:'预约咨询'};
let page,screen='index',toastTimer;
function toast(s){const el=document.getElementById('toast');el.textContent=s;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3000);}
function navigate(name,query='',replace=false){if(!routes[name])name='index';screen=name;let step=new URLSearchParams(query).get('step')||0;page=byxRequire('page')(name);page.setData=function(patch){for(const k in patch){const parts=k.split('.');if(parts.length===1)this.data[k]=patch[k];else{this.data[parts[0]][parts[1]]=patch[k];}}if(!Object.keys(patch).every(k=>k.startsWith('form.')))render();};page.onLoad({step});page.onShow();const hash='#'+name+(query?'?'+query:'');if(location.hash!==hash)history[replace?'replaceState':'pushState']({},'',hash);container.scrollTop=0;document.getElementById('title').textContent=titles[name]||'伴月轩';document.getElementById('tabbar').classList.toggle('hidden',name!=='index'&&name!=='my');document.querySelectorAll('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===name));document.getElementById('back').style.visibility=name==='index'||name==='my'?'hidden':'visible';}
function urlGo(url){const [path,query]=url.replace(/^\/pages\//,'').split('?');navigate(Object.keys(routes).find(k=>routes[k]===path)||'index',query||'');}
window.getCurrentPages=()=>[{},{}];
window.wx={request(opts){fetch(opts.url,{method:opts.method||'GET'}).then(async res=>opts.success&&opts.success({statusCode:res.status,data:await res.json()})).catch(e=>opts.fail&&opts.fail(e)).finally(()=>opts.complete&&opts.complete());},getStorageSync(k){try{return JSON.parse(localStorage.getItem(k));}catch{return null;}},setStorageSync(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{toast('存储空间不足或浏览器禁止本地存储');throw Error('无法保存本机数据');}},removeStorageSync(k){localStorage.removeItem(k);},navigateTo({url}){urlGo(url);},switchTab({url}){urlGo(url);},navigateBack(){history.back();},pageScrollTo({scrollTop}){container.scrollTo({top:scrollTop,behavior:'smooth'});},showToast({title}){toast(title);},showModal({title,content,showCancel=true,success}){const confirmed=showCancel?confirm(title+'\n\n'+content):(alert(title+'\n\n'+content),true);if(success)success({confirm:confirmed,cancel:!confirmed});},makePhoneCall({phoneNumber}){location.href='tel:'+phoneNumber;}};
const exprCache=new Map();
function evaluate(expr,ctx){try{let fn=exprCache.get(expr);if(!fn){fn=Function('ctx','with(ctx){return ('+expr+')}');exprCache.set(expr,fn);}return fn(ctx);}catch(e){return '';}}
function interpolate(value,ctx,raw=false){if(typeof value!=='string')return value;const m=value.match(/^{{([\s\S]*)}}$/);if(raw&&m)return evaluate(m[1],ctx);return value.replace(/{{([\s\S]*?)}}/g,(_,expr)=>{const v=evaluate(expr,ctx);return v==null?'':String(v);}).replace(/\\n/g,'\n');}
function renderChildren(children,parent,ctx){let inChain=false,matched=false;for(const child of children){if(typeof child==='string'){if(child.trim())parent.appendChild(document.createTextNode(interpolate(child,ctx)));continue;}const a=child.attrs;if(a['wx:if']!==undefined){inChain=true;matched=!!interpolate(a['wx:if'],ctx,true);if(!matched)continue;}else if(a['wx:elif']!==undefined){if(!inChain||matched)continue;matched=!!interpolate(a['wx:elif'],ctx,true);if(!matched)continue;}else if(a['wx:else']!==undefined){if(!inChain||matched)continue;matched=true;}else{inChain=false;matched=false;}renderNode(child,parent,ctx);}}
function renderNode(node,parent,ctx,loop=false){const a=node.attrs;
 if(a['wx:for']&&!loop){const values=interpolate(a['wx:for'],ctx,true)||[];values.forEach((item,index)=>{const c=Object.assign({},ctx,{[a['wx:for-item']||'item']:item,[a['wx:for-index']||'index']:index});renderNode(node,parent,c,true);});return;}
 if(node.tag==='block'){renderChildren(node.children,parent,ctx);return;}
 const tag={view:'div',text:'span',image:'img','scroll-view':'div',picker:'input'}[node.tag]||node.tag;
 const el=document.createElement(tag);let picker=node.tag==='picker';
 for(const [key,value] of Object.entries(a)){
  if(key.startsWith('wx:')||['mode','scroll-x','scroll-y'].includes(key))continue;
  if(key.startsWith('bind')||key.startsWith('catch')){let eventName=key.replace(/^(bind|catch):?/,'');eventName={tap:'click',input:'input',change:'change',blur:'blur'}[eventName]||eventName;if(picker)eventName='change';el.addEventListener(eventName,event=>{if(key.startsWith('catch'))event.stopPropagation();let method=page[value];if(method){let e={currentTarget:{dataset:el.dataset},detail:{value:el.value},target:event.target};method.call(page,e);}});continue;}
  let val=interpolate(value,ctx,true);
  if(key==='src'&&String(val).startsWith('/assets/'))val=String(val).replace('/assets/','../miniprogram/assets/');
  if(key==='value')el.value=val;else el.setAttribute(key,String(val));
 }
 if(picker){el.type='date';el.className='input';el.value=ctx.form.date||'';}else if(tag!=='img'&&tag!=='input'){renderChildren(node.children,el,ctx);if(tag==='textarea')el.value=interpolate(a.value||'',ctx);}
 if(tag==='button')el.type='button';
 parent.appendChild(el);
}
function render(){if(!page)return;const scroll=container.scrollTop;document.querySelectorAll('.phone>.price-bar,.phone>.fixed-actions').forEach(el=>el.remove());container.replaceChildren();renderNode(BYX_TEMPLATE,container,page.data);const footer=container.querySelector('.price-bar,.fixed-actions');if(footer){document.querySelector('.phone').appendChild(footer);container.querySelector('.app').style.paddingBottom='130px';}container.scrollTop=scroll;}
document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.screen)));
document.getElementById('back').addEventListener('click',()=>history.back());
window.addEventListener('popstate',()=>fromHash());
function fromHash(){const [name,query]=(location.hash.slice(1)||'index').split('?');navigate(name,query||'',true);}
fromHash();

window.addEventListener('focus',()=>{if(page)byxRequire('remote').sync().then(ok=>{if(ok)page.refresh();});});
