

var onlineUsers = {};
var onlineCount = 0;
exports.socketIO = function (io) {
    io.on('connection', function(socket){
        //监听新用户加入
        socket.on('login', function(obj){
            //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
            socket.name = obj.id;
            //检查在线列表，如果不在里面就加入
            if(!(obj.id in onlineUsers)) {
                onlineUsers[obj.id] = {...obj, socket};
                //在线人数+1
                onlineCount++;
            }
        });
        
        //监听用户退出
        socket.on('disconnect', function(){
            //将退出的用户从在线列表中删除
            if(socket.name in onlineUsers) {
                //删除
                delete onlineUsers[socket.name];
                //在线人数-1
                onlineCount--;
            }
        });
    });
}

exports.onlineUsers = onlineUsers;
