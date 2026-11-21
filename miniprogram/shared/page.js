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
