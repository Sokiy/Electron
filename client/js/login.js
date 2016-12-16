$(function () {
    let ipcRender = require('electron').ipcRenderer;
    let flag = 0;
    $('#uname').focus();
    //通过“回车”提交信息
    $('#uname').on('keydown', function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            login();
            return 0;
        }
    });

    function login() {
        let uname = $('#uname').val();
        if (uname !== '') {
            if (uname.length > 7) {
                if (flag == 0) {
                    alert("温馨提示:昵称不要超过七个字符噢");
                    $('#uname').val("");
                    flag++;
                } else if (flag == 1) {
                    alert("傻逼,不识数还是不识字啊");
                    $('#uname').val("");
                    flag++;
                } else {
                    alert('滚犊子,爱玩不玩');
                    $('#uname').val("你真是千年难得一见的傻逼");
                    $('#loginBtn').attr({
                        "disabled": "disabled"
                    });
                }


            } else {
                ipcRender.send('login_uname', uname);
            }

        };
        return 0;
    }
    $('#loginBtn').on('click',login);


    ipcRender.on('join', function (event, obj) {
        //告诉服务器端有用户登录
        socket.emit('login', obj);
        //监听用户接入
        socket.on('newUser', function (data) {
            ipcRender.send('newUser', data);
        });
        socket.on('change_title', function (data) {
            ipcRender.send('change_title', data);
        });

    });

    ipcRender.on('p_t_p', function (event, obj) {
        var from_uid = socket.id;
        socket.emit('private_message', {
            from: from_uid,
            to: obj.to_uid,
            msg: obj.msg,
        });

        socket.on('sixin', function (data) {
            ipcRender.send('send_message', data);
        });

    });

});