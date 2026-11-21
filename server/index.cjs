'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {validate,publicCatalog}=require('./validate.cjs');
const C=require('../miniprogram/shared/catalog'),E=require('../miniprogram/shared/engine');
const ROOT=path.resolve(__dirname,'..'),DATA=process.env.BYX_DATA_DIR||path.join(__dirname,'data');
fs.mkdirSync(DATA,{recursive:true,mode:0o700});fs.mkdirSync(path.join(DATA,'uploads'),{recursive:true,mode:0o700});
function atomic(file,value){const tmp=file+'.'+crypto.randomBytes(6).toString('hex')+'.tmp';fs.writeFileSync(tmp,JSON.stringify(value,null,2),{mode:0o600});fs.renameSync(tmp,file);}
const stateFile=path.join(DATA,'catalog.json'),secretFile=path.join(DATA,'auth.json');
let state;
if(fs.existsSync(stateFile))state=JSON.parse(fs.readFileSync(stateFile,'utf8'));else{
 const initial=C.snapshot();for(const p of initial.presets){const d=E.presetDraft(p.id);p.selections={};for(const g of initial.groups)for(const f of g.fields)p.selections[f.id]=d[f.id];p.selections.homeDays=d.homeDays;p.priceMode='fixed';p.enabled=true;p.description='';}
 for(const g of initial.groups)for(const f of g.fields){f.enabled=true;f.billing=f.kind==='home'?'home':f.kind==='included'?'included':(['mom','baby'].includes(f.id)||f.kind==='daily')?'daily':'once';f.defaultValue=E.defaults()[f.id];}
 state={revision:1,publishedRevision:1,draft:initial,published:initial,history:[],updatedAt:new Date().toISOString()};atomic(stateFile,state);
}
let auth;
if(fs.existsSync(secretFile))auth=JSON.parse(fs.readFileSync(secretFile,'utf8'));else{
 const password=process.env.BYX_ADMIN_PASSWORD||crypto.randomBytes(12).toString('base64url');const salt=crypto.randomBytes(16).toString('hex');auth={username:'admin',salt,hash:crypto.scryptSync(password,salt,64).toString('hex')};atomic(secretFile,auth);
 fs.writeFileSync(path.join(DATA,'管理员登录.txt'),'伴月轩内容管理后台\n地址：http://localhost:8793/admin/\n账号：admin\n密码：'+password+'\n\n该文件仅供本机管理员使用，请勿随工程打包或公开。\n',{mode:0o600});
}
const sessions=new Map(),attempts=new Map();
function setActive(){C.applyCatalog(publicCatalog(state.published,state.publishedRevision));}setActive();
const error=(m,status=400)=>Object.assign(new Error(m),{status});
function json(res,status,data,headers={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});res.end(JSON.stringify(data));}
function session(req){const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('byx_admin='));if(!token)return null;const key=token.slice(10),s=sessions.get(key);if(!s||s.expires<Date.now()){sessions.delete(key);return null;}return {key,...s};}
async function body(req,max=2*1024*1024){let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>max)throw error('上传内容过大',413);chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}');}catch(e){throw error('JSON格式不正确');}}
function sameOrigin(req){const origin=req.headers.origin;if(origin&&origin!==(process.env.BYX_PUBLIC_ORIGIN||`${req.socket.encrypted?'https':'http'}://${req.headers.host}`))throw error('请求来源无效',403);}
function authorized(req,write=false){const s=session(req);if(!s)throw error('请先登录后台',401);if(write){sameOrigin(req);if(req.headers['x-csrf-token']!==s.csrf)throw error('登录状态已过期，请重新登录',403);}return s;}
function checkRevision(data){if(data.expectedRevision!==state.revision)throw error('其他页面已修改数据，请重新加载后编辑，避免覆盖。',409);}
function safeName(p){return /^[-a-f0-9]+\.(jpg|png|webp)$/.test(p);}
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
function staticFile(req,res,url){
 let base,relative;
 if(url==='/') {res.writeHead(302,{Location:'/preview/'});return res.end();}
 if(url.startsWith('/uploads/')){relative=url.slice(9);if(!safeName(relative))throw error('文件不存在',404);base=path.join(DATA,'uploads');}
 else if(url.startsWith('/assets/')){base=path.join(ROOT,'miniprogram/assets');relative=url.slice(8);}
 else if(url.startsWith('/miniprogram/assets/')){base=path.join(ROOT,'miniprogram/assets');relative=url.slice(20);}
 else if(url.startsWith('/preview/')||url.startsWith('/admin/')){const part=url.startsWith('/admin/')?'admin':'preview';base=path.join(ROOT,part);relative=url.slice(part.length+2)||'index.html';}
 else throw error('文件不存在',404);
 const target=path.resolve(base,relative);if(!target.startsWith(base+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile())throw error('文件不存在',404);
 res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','X-Frame-Options':'SAMEORIGIN','Referrer-Policy':'same-origin'});fs.createReadStream(target).pipe(res);
}
async function handler(req,res){try{
 const url=new URL(req.url,'http://localhost').pathname;
 if(req.method==='GET'&&url==='/api/catalog')return json(res,200,{catalog:publicCatalog(state.published,state.publishedRevision),publishedAt:state.publishedAt||state.updatedAt});
 if(req.method==='POST'&&url==='/api/quote'){sameOrigin(req);const b=await body(req);return json(res,200,{revision:state.publishedRevision,draft:E.normalize(b.draft),summary:E.price(b.draft)});}
 if(req.method==='POST'&&url==='/api/admin/login'){
  sameOrigin(req);const ip=req.socket.remoteAddress;const a=attempts.get(ip);if(a&&a.count>=8&&Date.now()-a.at<15*60000)throw error('登录尝试过多，请15分钟后重试',429);
  const b=await body(req,8192);if(typeof b.password!=='string'||b.password.length>200)throw error('账号或密码不正确',401);
  const hash=crypto.scryptSync(b.password,auth.salt,64);if(b.username!==auth.username||!crypto.timingSafeEqual(hash,Buffer.from(auth.hash,'hex'))){attempts.set(ip,{count:(a&&Date.now()-a.at<15*60000?a.count:0)+1,at:Date.now()});throw error('账号或密码不正确',401);}
  attempts.delete(ip);const key=crypto.randomBytes(32).toString('hex'),csrf=crypto.randomBytes(24).toString('hex');sessions.set(key,{csrf,expires:Date.now()+8*3600000});return json(res,200,{csrf,username:auth.username},{'Set-Cookie':`byx_admin=${key}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=28800${req.socket.encrypted||process.env.BYX_SECURE_COOKIE==='1'?'; Secure':''}`});
 }
 if(url.startsWith('/api/admin/')){
  const write=req.method!=='GET';const s=authorized(req,write);
  if(url==='/api/admin/session'&&req.method==='GET')return json(res,200,{csrf:s.csrf,username:auth.username});
  if(url==='/api/admin/logout'&&req.method==='POST'){sessions.delete(s.key);return json(res,200,{ok:true},{'Set-Cookie':'byx_admin=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0'});}
  if(url==='/api/admin/catalog'&&req.method==='GET')return json(res,200,{...state,history:state.history.map(h=>({revision:h.revision,at:h.at}))});
  if(url==='/api/admin/catalog'&&req.method==='PUT'){const b=await body(req);checkRevision(b);validate(b.catalog);const next={...state,revision:state.revision+1,draft:b.catalog,updatedAt:new Date().toISOString()};atomic(stateFile,next);state=next;return json(res,200,{revision:state.revision});}
  if(url==='/api/admin/publish'&&req.method==='POST'){const b=await body(req);checkRevision(b);validate(state.draft,true);const now=new Date().toISOString();const next={...state,revision:state.revision+1,publishedRevision:state.revision+1,published:JSON.parse(JSON.stringify(state.draft)),publishedAt:now,history:[{revision:state.publishedRevision,at:state.publishedAt||state.updatedAt,catalog:state.published},...state.history].slice(0,20)};atomic(stateFile,next);state=next;setActive();return json(res,200,{revision:state.revision,publishedRevision:state.publishedRevision});}
  if(url==='/api/admin/restore'&&req.method==='POST'){const b=await body(req);checkRevision(b);const h=state.history.find(h=>h.revision===b.revision);if(!h)throw error('历史版本不存在',404);const next={...state,revision:state.revision+1,draft:JSON.parse(JSON.stringify(h.catalog)),updatedAt:new Date().toISOString()};atomic(stateFile,next);state=next;return json(res,200,{revision:state.revision});}
  if(url==='/api/admin/upload'&&req.method==='POST'){const b=await body(req,8*1024*1024);if(typeof b.data!=='string'||!b.data.match(/^[A-Za-z0-9+/]*={0,2}$/))throw error('图片内容无效');const buf=Buffer.from(b.data,'base64');if(buf.length>5*1024*1024||buf.length<12)throw error('图片须小于5MB');let ext;if(buf[0]===255&&buf[1]===216&&buf[2]===255)ext='jpg';else if(buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))ext='png';else if(buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP')ext='webp';else throw error('仅支持JPG、PNG和WebP图片');const name=crypto.randomUUID()+'.'+ext;fs.writeFileSync(path.join(DATA,'uploads',name),buf,{mode:0o600});return json(res,201,{image:'/uploads/'+name});}
  throw error('接口不存在',404);
 }
 if(req.method!=='GET'&&req.method!=='HEAD')throw error('不支持的请求方式',405);
 staticFile(req,res,decodeURIComponent(url));
 }catch(e){if(!res.headersSent)json(res,e.status||500,{error:e.status?e.message:'服务处理失败，请稍后重试'});else res.end();}}
const server=http.createServer(handler);
if(require.main===module){const port=Number(process.env.BYX_PORT)||8793;server.listen(port,process.env.BYX_HOST||'127.0.0.1',()=>console.log(`伴月轩预览：http://localhost:${port}/preview/\n管理后台：http://localhost:${port}/admin/\n登录信息已写入 server/data/管理员登录.txt（请勿公开）。`));}
module.exports={server,DATA};
