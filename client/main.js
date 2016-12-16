const Electron = require('electron');
const app = Electron.app;
const BrowserWindow = Electron.BrowserWindow;
let ipcMain = Electron.ipcMain;

//窗口列表
let loginWindow = null; //登陆窗口
let listWindow = null; // 列表窗口
//用户列表
let userList = {};

app.on('ready', function () {
    // 设置登陆窗口宽高
    loginWindow = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        frame: true,
        show: false,
    });
    //载入登陆窗口文件
    loginWindow.loadURL('file://' + __dirname + '/html/login.html');
    //打开开发工具界面
    //loginWindow.openDevTools();
    loginWindow.once('ready-to-show', function () {
        loginWindow.show();
    })

    //把登陆的用户信息加入用户列表中
    ipcMain.on('save_uname_uid', function (event, obj) {
        userList[obj.uid] = obj.uname;
    });
    //获取uname&&弹出聊天框
    ipcMain.on('login_uname', function (event, obj) {
        loginWindow.hide();
        loginWindow = null;
        messWindow = new BrowserWindow({
            width: 400,
            height: 600,
            resizable: false,
            frame: true,
            show: false,
        });
        messWindow.loadURL('file://' + __dirname + '/html/mess.html');
        //messWindow.openDevTools();
        messWindow.once('ready-to-show', function () {
            messWindow.webContents.send('login_success', obj); //obj包含uname uid
            messWindow.show();
        });

        messWindow.on('closed',function(){
            app.quit();
        })

    });



})