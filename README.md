# Electron
Electron打包的socket即时通讯应用

### 使用方法
**使用时本机需要安装nodejs,所有需要的依赖已经在package.json列出,只需要npm install安装**
#### 服务器端

+ <kbd>cd server</kbd>
+ <kbd>npm insatll</kbd> 安装需要的依赖
+ <kbd>npm start</kbd>  启动服务器


#### 客户端
+ <kbd>cd client</kbd>
+ <kbd>npm insatll</kbd> 安装需要的依赖
+ <kbd>npm start</kbd>  启动应用(可以多开几个终端进行测试)

#### 应用打包
打包命令已经在client/package.json中加入  
**运行**
<kbd>npm run build</kbd>
  
命令仅仅只是打包和本机系统相同的应用安装包, 仅在Linux系统下测试过  
更多打包命令详见[electron-packager](https://recordnotfound.com/electron-packager-electron-userland-69033)
