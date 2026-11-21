import json,re,xml.etree.ElementTree as ET
from pathlib import Path
root=Path(__file__).resolve().parent.parent
s=(root/'miniprogram/shared/screen.wxml').read_text().replace('<view class="app">','<view class="app" xmlns:wx="urn:wx">',1)
s=re.sub(r'\b(scroll-x|scroll-y)(?=[ >])',r'\1="true"',s)
def ast(el):
 return {'tag':el.tag,'attrs':{k.replace('{urn:wx}','wx:'):v for k,v in el.attrib.items()},'children':([el.text] if el.text else [])+sum(([ast(c)]+([c.tail] if c.tail else []) for c in el),[])}
(root/'preview/template.js').write_text('window.BYX_TEMPLATE='+json.dumps(ast(ET.fromstring(s)),ensure_ascii=False)+';')
modules=['catalog','engine','viewmodel','remote','page']
out='(function(){const modules={},cache={};\n'
for m in modules:
 out+='modules['+json.dumps(m)+']=function(module,exports,require){\n'+(root/f'miniprogram/shared/{m}.js').read_text()+'\n};\n'
out+='modules["../config"]=function(module){module.exports={apiBase:location.origin};};\n'
out+='window.byxRequire=function require(id){id=id.replace(/^.\\//, "");if(cache[id])return cache[id].exports;const m={exports:{}};cache[id]=m;modules[id](m,m.exports,require);return m.exports;};})();'
(root/'preview/shared.js').write_text(out)
css=(root/'miniprogram/app.wxss').read_text()
css=re.sub(r'([\d.]+)rpx',lambda m:str(round(float(m[1])*.52,3))+'px',css).replace('page{','.phone-content{')
css=re.sub(r'([^{}]+)\{',lambda m:re.sub(r'(?<![-\w])(view|text|image)(?![-\w])',lambda t:{'view':'div','text':'span','image':'img'}[t[0]],m[1])+'{',css)
(root/'preview/native.css').write_text(css)
print('Preview built from the native WXML and shared pricing code')
