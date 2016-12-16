$(function () {
    let ipcRender = require('electron').ipcRenderer;
    let socket = io.connect('http://127.0.0.1:3000');
    let update_userlist = {};
    //接收用户名
    ipcRender.on('login_success', function (event, obj) {
        let uname = obj;
        $('#sendMsg').focus();
        //发送用户名并且获取socketID && 广播登陆消息
        socket.emit('post_uname_get_uid', obj, function (obj) {
            ipcRender.send('save_uname_uid', {
                uname: uname,
                uid: obj
            });
            //更改输入框前显示的用户名
            $('#sender').html(uname.slice(0, 2));
            $('#sender_uid').val(obj);
        });

    });

    //接收新加入的广播
    socket.on('newUser_join_tip', function (obj) {
        $('#messageBox').append($('<p class="add_tip">').text(obj.uname + '加入战场'));
        $('#messageBox').scrollTop($('#messageBox')[0].scrollHeight);
    });
    //更新可发送的人员列表
    socket.on('update_userlist', function (obj) {
        update_userlist[socket.id] = $('#sender').html();

        for (var i in obj) {
            if (update_userlist.hasOwnProperty(i)) {} else {
                $('#uList').append($('<option>').attr({
                    "value": i
                }).text(obj[i]));
                update_userlist[i] = obj[i];
            }

        }

    });
    //chat
    socket.on('allClient', function (obj) {
        var box = $('#messageBox');
        if (socket.id == obj.uid) {
            box.append($('<div class="message_box_r">').append($("<p>").text(obj.uname)).append($('<div>').text(obj.msg)));
        } else {
            box.append($('<div class="message_box_l">').append($("<p>").text(obj.uname)).append($('<div>').text(obj.msg)));

        }

        box.scrollTop(box[0].scrollHeight);
    });

    socket.on('privateMessage', function (obj) {
        //$('#messageBox').append(
        //$('<div class="msg_l">').append($("<p>").text(obj.from_uname + '发送给' + obj.to_uname)).append($('<p>').text("--->" + obj.msg)));
        $('#messageBox').append($('<div class="message_box_l private_msg">').append($("<p>").text("from(" + obj.from_uname + ")")).append($('<div>').text(obj.msg)));
        $('#messageBox').scrollTop($('#messageBox')[0].scrollHeight);

    });

    function send_message() {
        //获取要发送的对象
        var sendMsg = $('#sendMsg').val().trim();
        if (sendMsg == '') {
            alert("不能发送空内容呦");
            return false;
        }
        var receiveUid = $('#uList').val();
        if (receiveUid == 1) {
            socket.emit('chat_everybody', sendMsg);
        } else {
            socket.emit('chat_somebody', {
                msg: sendMsg,
                to_uid: receiveUid
            });
            $('#messageBox').append($('<div class="message_box_r private_msg">').append($("<p>").text("to(" + $('#uList').find("option:selected").text() + ")")).append($('<div>').text(sendMsg)));
            //$('#messageBox').append(
            //$('<div class="msg_r">').append($("<p>").text($('#sender').html() + '发送给' + $('#uList').find("option:selected").text())).append($('<p>').text("--->" + sendMsg)));
            $('#messageBox').scrollTop($('#messageBox')[0].scrollHeight);

        }; //end if
        $('#sendMsg').val("");

    }
    $('#sendBtn').on('click',send_message);
   //通过“回车”提交信息
    $('#sendMsg').on('keydown', function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            send_message();
            return 0;
        }
    });
    //
    $('#uList').on('change',function(){
        $('#sendMsg').focus();
    });


})