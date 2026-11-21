# 兼容旧启动命令；新版预览与后台由同一个Node服务提供。
import os
from pathlib import Path
os.chdir(Path(__file__).resolve().parent.parent)
os.execvp('node',['node','server/index.cjs'])
