import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
routes={'index':'index/index','story':'story/story','store':'store/select','mode':'mode-select/mode-select','presets':'package-preset/package-preset','customizer':'customizer/customizer','room':'room-detail/room-detail','service':'service-detail/service-detail','preview':'preview/preview','my':'my/my','consult':'consult/consult'}
config={'pages':['pages/'+v for v in routes.values()],'window':{'navigationBarTitleText':'伴月轩 · 定制月子','navigationBarBackgroundColor':'#101819','navigationBarTextStyle':'white','backgroundColor':'#101819'},'tabBar':{'color':'#8d9997','selectedColor':'#63d7b0','backgroundColor':'#131d1d','borderStyle':'black','list':[{'pagePath':'pages/index/index','text':'定制'},{'pagePath':'pages/my/my','text':'我的'}]},'style':'v2','sitemapLocation':'sitemap.json','lazyCodeLoading':'requiredComponents'}
(root/'miniprogram/app.json').write_text(json.dumps(config,ensure_ascii=False,indent=2))
(root/'project.config.json').write_text(json.dumps({'description':'伴月轩定制月子微信小程序','miniprogramRoot':'miniprogram/','compileType':'miniprogram','appid':'touristappid','projectname':'banyuexuan-custom','setting':{'es6':True,'minified':True,'urlCheck':True}},ensure_ascii=False,indent=2))
markup=(root/'miniprogram/shared/screen.wxml').read_text()
for name,path in routes.items():
 p=root/'miniprogram/pages'/path;p.parent.mkdir(parents=True,exist_ok=True)
 p.with_suffix('.js').write_text("Page(require('../../shared/page')('%s'));\n"%name)
 p.with_suffix('.json').write_text(json.dumps({'navigationBarTitleText':{'story':'品牌故事','store':'选择门店','mode':'开始定制','presets':'热门方案','customizer':'定制我的月子','room':'空间详情','service':'服务详情','preview':'我的月子方案','my':'我的伴月轩','consult':'预约咨询'}.get(name,'伴月轩 · 定制月子')},ensure_ascii=False))
 p.with_suffix('.wxml').write_text(markup)
 p.with_suffix('.wxss').write_text('/* Shared visual system: app.wxss */\n')
print('Built',len(routes),'native WeChat pages')
