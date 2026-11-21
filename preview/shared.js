(function(){const modules={},cache={};
modules["catalog"]=function(module,exports,require){
/* 价格单位：人民币元。可选项、门店及文案均在此维护。 */
const BRAND = { name: '伴月轩', subtitle: '母婴健康管理', slogan: '价值交付，安心托付', phone: '', appId: '', benefitsConfirmed: false };
const stores = [
 { id:'gaoxin',name:'伴月轩高新店',tag:'专业护理 · 从容休养',address:'高新医院旁',description:'3000㎡专业护理月子中心，陪伴每一个家庭的新生。',image:'nursery-0.jpg'},
 { id:'zaoyuan',name:'伴月轩枣园店',tag:'贴心照护 · 品质之选',address:'临近枣园地铁站口',description:'便捷的到访动线，温暖的母婴照护，适合自己的月子生活。',image:'care-0.jpg'}
];
const o=(value,label,price,original,description)=>({value,label,price,original:original === undefined ? price : original,description:description||''});
const f=(id,title,kind,options,description,image)=>({id,title,kind,options,description:description||'',image:image||''});
const groups=[
 {id:'care',name:'护理',en:'PROFESSIONAL CARE',title:'专业照护，安心有依',subtitle:'从妈妈到宝宝，让每一份关怀恰到好处。',image:'care-0.jpg',fields:[
 f('mom','妈妈护理','toggle',[o(false,'不选择',0),o(true,'6大模块',110,165)],'团队护航、健康管理、泌乳管理、宝宝照护宣教、生活管理、体能修护指导。','care-0.jpg'),
 f('baby','宝宝护理','toggle',[o(false,'不选择',0),o(true,'6大模块',130,150)],'团队护航、日常照护、专业护理、宝宝潜能开发、科学喂养、特殊宝宝护理。','baby-0.jpg'),
 f('babies','宝宝胎数','daily',[o(1,'单胎',0),o(2,'双胎',130),o(3,'三胎',260)],'多胎宝宝护理按入住天数计费。'),
 f('nurse','生活照护','daily',[o('platinum','白金 1v1',350),o('diamond','钻石 1v1',385),o('double','双护制 2v1',675),o('none','自主休养',0)],'24小时专属陪伴；双护制为双人协同照护。自主休养不含专属护理师。'),
 f('extraNurse','多胎增配照护','daily',[o('none','无需增配',0),o('platinum','增配白金',350),o('diamond','增配钻石',385),o('double','增配双护制',675)],'双胎、三胎家庭可按需增加照护人员。') ]},
 {id:'meal',name:'膳食',en:'NOURISH YOUR EVERYDAY',title:'一餐一味，温柔滋养',subtitle:'科学食养，照顾产后每一天的好胃口。',image:'food-1.jpg',fields:[
 f('meal','食养月子餐','daily',[o(true,'每日三餐三点',275)],'基础食养月子餐按入住天数计费，具体菜单由门店根据情况安排。','food-1.jpg'),
 f('feast','入住迎新宴','toggle',[o(false,'不选择',0),o(true,'迎新家宴',288)],'新生命的第一场家宴，入住首日2–3人专属迎新宴。','kitchen-3.jpg'),
 f('familyCard','家属陪护餐膨胀金','toggle',[o(false,'不选择',0),o(true,'¥98 享 ¥199',98)],'入住期间用于指定陪护餐账号充值，具体使用规则请咨询门店。') ]},
 {id:'recovery',name:'修护',en:'A MOMENT FOR YOURSELF',title:'慢慢修护，找回自己',subtitle:'把一段专属于自己的时光，留给身心。',image:'recovery-0.jpg',fields:[
 f('baseRecovery','产后基础修护','included',[o(true,'已包含 · 4大模块',0,12000)],'身体修护测评、基础修护管理、体能修护管理、体态平衡管理。具体项目需经专业评估。','recovery-0.jpg'),
 f('pregnancy','孕期减压舒缓护理','once',[o(0,'不选择',0),o(1,'1期',198),o(2,'2期',336),o(3,'3期',498)],'针对孕期水肿、腰背酸胀、头部紧绷等不适提供舒缓护理，须先评估适宜性。'),
 f('refresh','产褥期体质焕新调理','toggle',[o(false,'不选择',0),o(true,'8项养护组合',1980,5380)],'头部、四肢、下肢、腋下、艾灸仪、肩颈、乳腺与关节舒缓养护各1次。'),
 f('golden','产褥期黄金三项','toggle',[o(false,'不选择',0),o(true,'核心三项组合',3980,19400)],'腹直肌修护、盆底舒缓养护、骨盆韧带舒柔养护各10次。由专业人员评估安排。'),
 f('beauty','产褥期焕颜美肌管理','toggle',[o(false,'不选择',0),o(true,'焕颜美肌组合',2580,6980)],'面部深层补水、眼周活肤、头皮舒缓各3次。'),
 f('star','明星妈妈同款加项','once',[o('none','不选择',0),o('itb','ITB筋膜疏解',298,880),o('moxa','灸炙爱温养',398,598),o('btl','BTL核心激活',680,1280),o('6d','6D骨盆舒护',980,1280)],'单选加购，每项1次。服务以专业评估及门店设备情况为准。') ]},
 {id:'room',name:'空间',en:'YOUR QUIET SANCTUARY',title:'安住一隅，静享新生',subtitle:'给妈妈留一处宁静，给家人留一份从容。',image:'nursery-0.jpg',fields:[
 f('room','选择月子房型','daily',[o('north','北向标间 · 50㎡',330),o('south','南向标间 · 50㎡',365),o('sun','南向大开间 · 60㎡',450),o('suite','套间 · 110㎡',850)],'房型面积采用需求文档详细规格；实际可订房型、朝向及设施以门店确认为准。','nursery-0.jpg') ]},
 {id:'addons',name:'增配',en:'LITTLE EXTRAS, MORE LOVE',title:'多一点心意，多一份周全',subtitle:'按需搭配，让这段时光更合心意。',image:'baby-0.jpg',fields:[
 f('pump','美德乐“心韵”吸乳器','toggle',[o(false,'不选择',0),o(true,'在住使用权益',980,2880)],'在住期间使用，含全新专用配件。','baby-0.jpg'),
 f('swim','宝宝游泳 SPA','once',[o(0,'不选择',0),o(3,'3次',450),o(5,'5次',670),o(7,'7次',825)],'根据宝宝状态评估后安排。'),
 f('education','宝宝多元潜能启蒙','once',[o(0,'不选择',0),o(2,'2次',390),o(4,'4次',740),o(6,'6次',1050)],'视觉探索、听觉互动、触觉体验、韵律感知、空间认知。'),
 f('car','商务专车接送','once',[o('none','不选择',0),o('one','单程',150),o('round','往返',200)],'7座商务车，提供轮椅或安全提篮，需提前预约。'),
 f('hospital','产后驻院照护','once',[o(0,'不选择',0),o(1,'1人服务包',1500),o(2,'2人服务包',3000),o(3,'3人服务包',4500)],'3–5天驻院陪伴，按照护人员数量计包价；实际天数由顾问确认。'),
 f('delivery','分娩关键期营养餐外送','toggle',[o(false,'不选择',0),o(true,'产后3天营养餐',1500)],'每日三餐三点，按约定送达医院。配送范围请与门店确认。'),
 f('sterilizer','移动空气灭菌站','toggle',[o(false,'不选择',0),o(true,'在住租借权益',980)],'在住期间租借使用，具体设备以门店为准。'),
 f('photo','新生儿纪念摄影','included',[o(true,'已包含',0,888)],'新生儿纪念照2套造型、满月全家福、宝宝纪念桌摆1个。'),
 f('daycare','出所宝宝专业托护','included',[o(true,'已包含 · 1天',0,200)],'适用1–3个月宝宝，白天送托、晚间接回，需提前预约。') ]},
 {id:'home',name:'到府',en:'CARE CONTINUES AT HOME',title:'回到家，关爱仍在身旁',subtitle:'从月子中心到熟悉的家，无缝延续照护。',image:'care-0.jpg',fields:[
 f('homeNurse','到府照护师','home',[o('platinum','白金 1v1',454),o('diamond','钻石 1v1',500),o('twinsP','双胎白金 2v2',908),o('twinsD','双胎钻石 2v2',1000),o('mixed','双胎白金＋钻石',954)],'到府天数0–60天，按天计费。服务区域、档期及人员由门店确认。','care-0.jpg') ]}
];
const presets=[
 {id:'feeding',name:'母乳喂养妈妈一键选配',tag:'母乳喂养',subtitle:'给第一次亲密喂养，多一份从容',price:40018,reference:72239,days:28,room:'north',image:'care-0.jpg',patch:{pump:true,golden:true,refresh:true,swim:5,education:4,feast:true}},
 {id:'growing',name:'宝宝早期潜能启发',tag:'成长启蒙',subtitle:'陪伴每一个小小的成长瞬间',price:38646,reference:56947,days:28,room:'south',image:'baby-0.jpg',patch:{refresh:true,education:6,swim:7,feast:true}},
 {id:'recovery',name:'28天辣妈修护首选',tag:'悦己修护',subtitle:'温柔照护之外，也好好爱自己',price:48424,reference:86545,days:28,room:'sun',image:'recovery-0.jpg',patch:{refresh:true,golden:true,beauty:true,pregnancy:3,pump:true,swim:7,education:6,feast:true,star:'6d'}},
 {id:'relay',name:'28＋26天专业照护接力',tag:'到府延续',subtitle:'28天在住，26天到府，关爱不断档',price:46674,reference:61474,days:28,room:'south',image:'care-0.jpg',patch:{homeDays:26,homeNurse:'platinum',feast:true}},
 {id:'premium',name:'42天高阶满配月子',tag:'从容满配',subtitle:'更宽裕的时间，更周全的照护',price:88024,reference:129445,days:42,room:'suite',image:'nursery-0.jpg',patch:{refresh:true,golden:true,beauty:true,pregnancy:3,pump:true,swim:7,education:6,feast:true,star:'6d',car:'round',hospital:1,delivery:true,sterilizer:true}},
 {id:'essential',name:'21天高效月子质价比',tag:'轻盈之选',subtitle:'基础全套，把预算花在需要的地方',price:26505,reference:40605,days:21,room:'north',image:'hero-0.jpg',patch:{}}
];
const inclusions=['妈妈护理专用牙刷、牙膏、漱口杯、木梳','月子护理服、月子鞋、陪护拖鞋、定制床品','浴巾、毛巾、面盆、宝宝盆、洗护用品','恒温温菜板、加湿器、冰箱、电视、电吹风','温奶器、恒温冲奶壶、奶瓶消毒锅、烧水壶','婴儿床、温湿度计、体重秤、衣架等'];

// 应用后端发布的数据时保留数组引用，确保计价引擎与页面始终读取同一版本。
let revision=0;
function applyCatalog(data){
 if(!data || !Array.isArray(data.groups)||data.groups.length!==6||!Array.isArray(data.stores)||!data.stores.length)throw Error('配置结构无效');
 Object.keys(BRAND).forEach(k=>delete BRAND[k]);Object.assign(BRAND,data.BRAND);
 for(const key of ['stores','groups','presets','inclusions']){const target={stores,groups,presets,inclusions}[key];target.splice(0,target.length,...JSON.parse(JSON.stringify(data[key])));}
 revision=data.revision||0;
}
function snapshot(){return JSON.parse(JSON.stringify({BRAND,stores,groups,presets,inclusions,revision}));}
module.exports={BRAND,stores,groups,presets,inclusions,applyCatalog,snapshot};

};
modules["engine"]=function(module,exports,require){
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

};
modules["viewmodel"]=function(module,exports,require){
const C=require('./catalog'),E=require('./engine');
const config=require('../config');
function asset(image){if(!image)return '';if(image.indexOf('https://')===0)return image;if(image.indexOf('/uploads/')===0)return config.apiBase+image;return '/assets/'+image;}
function decorate(x){return Object.assign({},x,{imageUrl:asset(x.image)});}
function view(draft,step){const d=E.normalize(draft),p=E.price(d);return {brand:C.BRAND,catalogRevision:C.snapshot().revision,stores:C.stores.map(decorate),presets:C.presets.map(x=>Object.assign(decorate(x),{priceText:E.money(E.price(E.presetDraft(x.id)).total),referenceText:E.money(x.reference)})),groups:C.groups.map(decorate),group:decorate(C.groups[step||0]),step:step||0,draft:d,store:decorate(p.store),summary:p,includedBenefits:p.lines.filter(l=>l.total===0).map(l=>l.title+' · '+l.label),totalText:E.money(p.total),originalText:E.money(p.original),savingsText:E.money(p.savings),pointsText:E.money(p.points),inclusions:C.inclusions,fields:C.groups[step||0].fields.filter(f=>f.id!=='extraNurse'||d.babies>1).map(f=>Object.assign(decorate(f),{options:f.options.map(o=>Object.assign({},o,{selected:o.value===d[f.id],priceText:E.money(o.price)})),daily:(f.billing||((f.id==='mom'||f.id==='baby')?'daily':f.kind))==='daily'||(f.billing||f.kind)==='home'})),summaryGroups:C.groups.map(g=>({name:g.name,lines:p.lines.filter(l=>g.fields.some(f=>f.id===l.id)).map(l=>Object.assign({},l,{totalText:E.money(l.total),rateText:E.money(l.rate)}))}))};}
module.exports={view,asset};

};
modules["remote"]=function(module,exports,require){
const C=require('./catalog');
const config=require('../config');
let pending;
function sync(){
 if(pending)return pending;
 if(!config.apiBase)return Promise.resolve(false);
 pending=new Promise(resolve=>{
  wx.request({url:config.apiBase+'/api/catalog',method:'GET',timeout:8000,success(res){
   try{if(res.statusCode===200&&res.data&&res.data.catalog){C.applyCatalog(res.data.catalog);wx.setStorageSync('byx.catalog',res.data.catalog);resolve(true);}else resolve(false);}catch(e){resolve(false);}
  },fail(){resolve(false);},complete(){pending=null;}});
 });return pending;
}
function cached(){try{const data=wx.getStorageSync('byx.catalog');if(data)C.applyCatalog(data);}catch(e){}}
module.exports={sync,cached};

};
modules["page"]=function(module,exports,require){
const Remote=require('./remote');
const E=require('./engine'),C=require('./catalog'),V=require('./viewmodel');
const routes={index:'/pages/index/index',story:'/pages/story/story',store:'/pages/store/select',mode:'/pages/mode-select/mode-select',presets:'/pages/package-preset/package-preset',customizer:'/pages/customizer/customizer',room:'/pages/room-detail/room-detail',service:'/pages/service-detail/service-detail',preview:'/pages/preview/preview',my:'/pages/my/my',consult:'/pages/consult/consult'};
const read=(k,fallback)=>{try{return wx.getStorageSync(k)||fallback;}catch(e){return fallback;}};
module.exports=function(screen){return {
 noop(){},
 data:{screen,step:0,detail:null,modalVisible:false,showBill:false,form:{name:'',phone:'',date:'',note:''},privacy:false},
 onLoad(q){this.setData({screen,step:Number(q.step)||0});if(screen==='service'){const f=C.groups.reduce((a,g)=>a.concat(g.fields),[]).find(f=>f.id===q.id);this.setData({detail:f?Object.assign({},f,{imageUrl:V.asset(f.image)}):null});}},
 onShow(){Remote.cached();this.refresh();Remote.sync().then(ok=>{if(ok)this.refresh();});},
 refresh(){const draft=E.normalize(read('byx.draft',E.defaults()));this.setData(Object.assign(V.view(draft,this.data.step),{wishes:read('byx.wishes',[]),consultations:read('byx.consultations',[])}));},
 persist(d){wx.setStorageSync('byx.draft',E.normalize(d));this.refresh();},
 go(e){const target=typeof e==='string'?e:e.currentTarget.dataset.route;if(target==='my'||target==='index')wx.switchTab({url:routes[target]});else wx.navigateTo({url:routes[target]||routes.index});},
 back(){if(getCurrentPages().length>1)wx.navigateBack();else this.go('index');},
 storeSelect(e){this.persist(Object.assign({},this.data.draft,{storeId:e.currentTarget.dataset.id}));},
 startCustom(){this.persist(Object.assign(E.defaults(),{storeId:this.data.draft.storeId}));this.go('customizer');},
 selectPreset(e){this.persist(E.presetDraft(e.currentTarget.dataset.id,this.data.draft.storeId));this.go('preview');},
 select(e){const {key,value}=e.currentTarget.dataset;this.persist(E.change(this.data.draft,key,value));},
 setStep(e){this.setData({step:Number(e.currentTarget.dataset.step)});this.refresh();wx.pageScrollTo({scrollTop:0,duration:180});},
 next(){if(this.data.step<5){this.setData({step:this.data.step+1});this.refresh();wx.pageScrollTo({scrollTop:0,duration:180});}else this.go('preview');},
 edit(e){wx.navigateTo({url:routes.customizer+'?step='+e.currentTarget.dataset.step});},
 days(e){this.persist(E.change(this.data.draft,'days',e.currentTarget.dataset.value));},
 homeInput(e){this.persist(E.change(this.data.draft,'homeDays',e.detail.value));},
 homeAdjust(e){this.persist(E.change(this.data.draft,'homeDays',this.data.draft.homeDays+Number(e.currentTarget.dataset.delta)));},
 detail(e){const f=C.groups.reduce((a,g)=>a.concat(g.fields),[]).find(f=>f.id===e.currentTarget.dataset.id);this.setData({detail:f?Object.assign({},f,{imageUrl:V.asset(f.image)}):null,modalVisible:!!f});},
 closeDetail(){this.setData({detail:null,modalVisible:false});},
 toggleBill(){this.setData({showBill:!this.data.showBill});},
 roomDetail(){this.go('room');},
 saveWish(){const all=read('byx.wishes',[]);all.unshift({id:Date.now().toString(),name:this.data.summary.presetName,created:new Date().toLocaleDateString(),total:this.data.totalText,store:this.data.store.name,draft:this.data.draft});wx.setStorageSync('byx.wishes',all.slice(0,30));this.refresh();wx.showToast({title:'心愿单已保存',icon:'success'});},
 loadWish(e){const w=this.data.wishes.find(w=>w.id===e.currentTarget.dataset.id);if(w){this.persist(w.draft);this.go('preview');}},
 deleteWish(e){const id=e.currentTarget.dataset.id;wx.showModal({title:'删除心愿单',content:'确定删除这份已保存的方案吗？',success:r=>{if(r.confirm){wx.setStorageSync('byx.wishes',this.data.wishes.filter(w=>w.id!==id));this.refresh();}}});},
 formInput(e){this.setData({['form.'+e.currentTarget.dataset.key]:e.detail.value});},
 togglePrivacy(){this.setData({privacy:!this.data.privacy});},
 submitConsult(){const f=this.data.form;if(!f.name.trim()||!/^1[3-9]\d{9}$/.test(f.phone)){wx.showToast({title:'请填写称呼和有效手机号',icon:'none'});return;}if(!this.data.privacy){wx.showToast({title:'请先阅读并同意隐私说明',icon:'none'});return;}
 const all=read('byx.consultations',[]);all.unshift({id:Date.now().toString(),name:f.name.trim(),phone:f.phone,date:f.date,note:f.note,store:this.data.store.name,total:this.data.totalText,draft:this.data.draft,created:new Date().toLocaleDateString()});wx.setStorageSync('byx.consultations',all.slice(0,30));this.setData({form:{name:'',phone:'',date:'',note:''},privacy:false});wx.showModal({title:'预约意向已保存在本机',content:'当前版本未连接门店后台，门店尚未收到预约。可在“我的”查看，并到店出示方案。',showCancel:false,success:()=>this.go('my')});},
 call(){if(C.BRAND.phone)wx.makePhoneCall({phoneNumber:C.BRAND.phone});else this.go('consult');},
 privacyInfo(){wx.showModal({title:'隐私说明',content:'本演示版本仅在你的设备保存配置、心愿单及预约意向，不上传个人信息。预约意向不会自动发送给门店。可在“我的”清空本机数据。正式线上服务需另行配置隐私协议及授权。',showCancel:false});},
 clearData(){wx.showModal({title:'清空本机数据',content:'将删除本机方案、心愿单、预约意向与联系方式，无法恢复。',success:r=>{if(r.confirm){['byx.draft','byx.wishes','byx.consultations'].forEach(k=>wx.removeStorageSync(k));this.refresh();}}});}
};};

};
modules["../config"]=function(module){module.exports={apiBase:location.origin};};
window.byxRequire=function require(id){id=id.replace(/^.\//, "");if(cache[id])return cache[id].exports;const m={exports:{}};cache[id]=m;modules[id](m,m.exports,require);return m.exports;};})();