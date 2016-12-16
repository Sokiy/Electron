var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//连接人数
var num = 0;

//连接列表
var clientList = {};
app.get('/', function (req, res) {
    res.send('<h1>Hello Server</h1>');
});
//监测连接
io.on('connection', function (socket) {
    num++;
    socket.on('post_uname_get_uid', function (obj, fn) {
        console.log(obj + "加入战场,当前在线人数:" + num);
        clientList[socket.id] = socket;
        console.log(socket.id);
        socket.name = obj;
        var all = {};
        for(var i in clientList){
            all[i] = clientList[i].name;
        }
        io.emit('newUser_join_tip',{uname:obj,uid:socket.id});
        //socket.broadcast.emit('update_userlist',{uname:obj,uid:socket.id});
        io.emit('update_userlist',all);
        fn(socket.id);

    });

    socket.on('chat_everybody', function (obj) {
        io.emit('allClient', {uname:socket.name,msg:obj,uid:socket.id});
    });

    socket.on('chat_somebody', function (obj) {
        var d ={};
        var target = clientList[obj.to_uid];
        d.from_uname = socket.name;
        d.to_uname = target.name;
        d.msg = obj.msg;
        target.emit("privateMessage",d);
    });
    //私聊事件
    socket.on('private_message', function (obj) {
        var target = clientList[obj.to];
        var d = {};
        d.from_uid = obj.from;
        d.from_name = clientList[obj.from].name;
        d.to_uid = obj.to;
        d.to_name = clientList[obj.to].name;
        d.msg = obj.msg;
        io.emit('sixin', d);
    });


    socket.on('disconnect', function () {
        if (clientList.hasOwnProperty(socket.id)) {
            num--;
            console.log(socket.name + "退出战场,当前在线人数" + num);
            delete clientList[socket.id];
        }
    });

});



//监听端口
http.listen(3000, function () {
    console.log("the server running in port of 3000")
});