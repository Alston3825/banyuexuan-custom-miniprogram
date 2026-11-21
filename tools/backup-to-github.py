#!/usr/bin/env python3
"""Backup this recovered project to its confirmed private GitHub repository."""
from pathlib import Path
import os,subprocess,json,hashlib,sys
ROOT=Path(__file__).resolve().parent.parent
REPO='Alston3825/banyuexuan-custom-miniprogram'
ENV=os.environ.copy()
for key in ['HTTP_PROXY','HTTPS_PROXY','ALL_PROXY','http_proxy','https_proxy','all_proxy']:ENV.pop(key,None)
def git(*args):
 r=subprocess.run(['git',*args],cwd=ROOT,env=ENV,capture_output=True,text=True)
 if r.returncode:raise RuntimeError(r.stderr.strip() or 'git operation failed')
 return r.stdout.strip()
def main():
 lock=ROOT/'.git/byx-backup.lock'
 try:lock.mkdir()
 except FileExistsError:raise RuntimeError('另一个备份正在运行；如异常中断，请先确认无备份进程再删除.git/byx-backup.lock')
 try:
  required=['package.json','package-lock.json','project.config.json','miniprogram/app.json','miniprogram/shared/catalog.js','miniprogram/shared/engine.js','miniprogram/shared/page.js','miniprogram/shared/screen.wxml','miniprogram/assets/brand-logo-original.jpg','server/index.cjs','server/validate.cjs','admin/admin.js','preview/runtime.js','AGENT_HANDOFF.md','RECOVERY_REPORT.md']
  for name in required:
   if not (ROOT/name).is_file():raise RuntimeError('关键文件缺失，停止备份：'+name)
  remote=git('remote','get-url','origin')
  if remote not in ['https://github.com/'+REPO+'.git','https://github.com/'+REPO,'git@github.com:'+REPO+'.git']:raise RuntimeError('远端与已确认仓库不一致，停止备份')
  candidates=git('ls-files','--cached','--others','--exclude-standard','-z').split('\0')
  records=[]
  for name in sorted(set(candidates)):
   if not name or name=='.backup-manifest.json':continue
   p=ROOT/name
   if not p.is_file():continue
   if p.is_symlink():raise RuntimeError('发现符号链接，需先人工确认：'+name)
   if p.name in ['auth.json','管理员登录.txt','.env'] or (p.name.startswith('.env.') and p.name!='.env.example') or name.startswith('server/data/') or p.suffix.lower() in ['.pem','.key','.p12','.pfx','.db','.sqlite','.sqlite3']:raise RuntimeError('发现可能的凭据/运行数据，不上传：'+name)
   if p.stat().st_size>95*1024*1024:raise RuntimeError('大文件需单独配置Git LFS后再备份：'+name)
   blob=p.read_bytes()
   if b'\0' not in blob and ((b'-----BEGIN '+b'PRIVATE KEY-----') in blob or (b'-----BEGIN '+b'OPENSSH PRIVATE KEY-----') in blob or (b'-----BEGIN '+b'RSA PRIVATE KEY-----') in blob):raise RuntimeError('发现私钥内容，停止备份：'+name)
   records.append({'path':name,'bytes':len(blob),'sha256':hashlib.sha256(blob).hexdigest()})
  if len(records)<70:raise RuntimeError('项目文件数量异常偏低，停止备份')
  manifest=ROOT/'.backup-manifest.json'
  if manifest.exists():
   old=json.loads(manifest.read_text()).get('files',[])
   existing={r['path'] for r in records}
   removed=[r['path'] for r in old if r['path'] not in existing]
   if old and len(removed)>max(3,len(old)*.2):raise RuntimeError('超过20%的文件消失，停止备份，避免覆盖历史')
  manifest.write_text(json.dumps({'schema':1,'recoveryStatus':'source-restored-original-media-and-runtime-data-incomplete','files':records},ensure_ascii=False,indent=2)+'\n')
  git('add','--all','--','.')
  if git('diff','--cached','--name-only'):
   git('-c','user.name=Alston3825','-c','user.email=60434020+Alston3825@users.noreply.github.com','commit','-m','backup: preserve recovered miniprogram source and handoff state')
  head=git('rev-parse','HEAD')
  git('push','origin','HEAD:main')
  remote_head=git('ls-remote','origin','refs/heads/main').split()[0]
  if head!=remote_head:raise RuntimeError('远端提交核验失败')
  print('备份已验证：https://github.com/'+REPO+'；main '+head+'；清单文件'+str(len(records))+'项。')
  print('注意：原始录屏、8张品牌场景照片及原后台运行数据仍缺失，详见RECOVERY_REPORT.md。')
 finally:lock.rmdir()
if __name__=='__main__':
 try:main()
 except Exception as e:print('备份未完成：'+str(e),file=sys.stderr);sys.exit(1)
