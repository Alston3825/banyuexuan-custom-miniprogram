const {test,before,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'byx-api-'));process.env.BYX_DATA_DIR=dir;process.env.BYX_ADMIN_PASSWORD='test-only-pass';const {server}=require('../server/index.cjs');let origin,cookie,csrf;
before(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;});
after(async()=>{await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true});});
async function request(route,method='GET',value,authorized=true){const res=await fetch(origin+route,{method,headers:{'Content-Type':'application/json',...(authorized&&cookie?{Cookie:cookie,'X-CSRF-Token':csrf}:{})},body:value===undefined?undefined:JSON.stringify(value)});return {res,body:await res.json()};}
async function login(){const r=await request('/api/admin/login','POST',{username:'admin',password:'test-only-pass'},false);assert.equal(r.res.status,200);cookie=r.res.headers.get('set-cookie').split(';')[0];csrf=r.body.csrf;}
test('后台真实鉴权、草稿隔离、发布同步、服务端计价与持久化',async()=>{
 let r=await request('/api/admin/catalog','GET',undefined,false);assert.equal(r.res.status,401);
 for(const p of ['/server/data/auth.json','/server/data/管理员登录.txt','/miniprogram/config.js']){r=await request(p);assert.equal(r.res.status,404);}
 await login();let state=(await request('/api/admin/catalog')).body;const beforePublic=(await request('/api/catalog')).body.catalog;
 r=await request('/api/admin/catalog','PUT',{expectedRevision:0,catalog:state.draft});assert.equal(r.res.status,409);
 let invalid=structuredClone(state.draft);invalid.groups[0].fields[0].options[1].price=-1;r=await request('/api/admin/catalog','PUT',{expectedRevision:state.revision,catalog:invalid});assert.equal(r.res.status,400);
 let draft=structuredClone(state.draft);draft.stores[0].name='后台改名测试';draft.groups[0].fields[0].options[1].price=111.25;draft.groups[0].fields[0].options[1].original=166.25;draft.presets[0].price=41234.56;draft.presets[0].description='可编辑的完整方案说明';
 r=await request('/api/admin/catalog','PUT',{expectedRevision:state.revision,catalog:draft});assert.equal(r.res.status,200);let rev=r.body.revision;assert.equal((await request('/api/catalog')).body.catalog.stores[0].name,beforePublic.stores[0].name);
 r=await request('/api/admin/publish','POST',{expectedRevision:rev});assert.equal(r.res.status,200);rev=r.body.revision;const pub=(await request('/api/catalog')).body.catalog;assert.equal(pub.stores[0].name,'后台改名测试');assert.equal(pub.presets[0].price,41234.56);
 let q=(await request('/api/quote','POST',{draft:{days:28}})).body;assert.equal(q.summary.total,33495);assert.equal(q.summary.store.name,'后台改名测试');q=(await request('/api/quote','POST',{draft:{days:28,presetId:'feeding',...pub.presets[0].selections}})).body;assert.equal(q.summary.total,41234.56);
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'catalog.json'))).published.stores[0].name,'后台改名测试');
 state=(await request('/api/admin/catalog')).body;draft=structuredClone(state.draft);draft.groups[0].fields[0].options[1].enabled=false;r=await request('/api/admin/catalog','PUT',{expectedRevision:state.revision,catalog:draft});assert.equal(r.res.status,200);r=await request('/api/admin/publish','POST',{expectedRevision:r.body.revision});assert.equal(r.res.status,400);assert.match(r.body.error,/下架/);
 state=(await request('/api/admin/catalog')).body;r=await request('/api/admin/restore','POST',{expectedRevision:state.revision,revision:state.history[0].revision});assert.equal(r.res.status,200);assert.equal((await request('/api/catalog')).body.catalog.stores[0].name,'后台改名测试');
 const unauth=await fetch(origin+'/api/admin/catalog',{method:'PUT',headers:{Cookie:cookie,'Content-Type':'application/json'},body:'{}'});assert.equal(unauth.status,403);
 r=await request('/api/admin/upload','POST',{data:Buffer.from('not a picture').toString('base64')});assert.equal(r.res.status,400);
 const raw=fs.readFileSync(path.join(__dirname,'../miniprogram/assets/brand-logo-original.jpg'));r=await request('/api/admin/upload','POST',{data:raw.toString('base64')});assert.equal(r.res.status,201);const media=await fetch(origin+r.body.image);assert.equal(media.status,200);assert.equal((await media.arrayBuffer()).byteLength,raw.length);
 r=await request('/api/admin/logout','POST',{});assert.equal(r.res.status,200);r=await request('/api/admin/catalog');assert.equal(r.res.status,401);
});
