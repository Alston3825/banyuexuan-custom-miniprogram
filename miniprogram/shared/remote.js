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
