var express = require('express');
var router = express.Router();
const tableName = {'0': 'student', '1': 'administrator'};
const tableNameRole = 'role';
const tableNameMenu = 'menu';
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const crypto = require('crypto');
const { getToken } = require("../utils");
//用户登录
router.post("/userlogin", async (req, res) => { // 登录接口
    let { username,password,usertype,serialnumber } = req['body'];
    if(!username || !password || !serialnumber){
        res.send(MError("请填写用户名、密码、教职工编号或学号"));
        return;
    }
    const result = await Db.select(req, `SELECT * FROM ${tableName[usertype]} WHERE  username = '${username}' and serialnumber = '${serialnumber}'`);
    console.log(result, username, serialnumber, `SELECT * FROM ${tableName[usertype]} WHERE  username = '${username}' and serialnumber = '${serialnumber}'`);
    if(result === null){
        res.send(MError("用户信息不存在"));
        return;
    }
    const info = result[0];
    password += info.randstr;
    password = crypto.createHash('md5').update(password).digest("hex");
    if(password !== info.password){
        res.send(MError("用户名密码错误"));
        return;
    }
    let role = await Db.select(req, `SELECT * FROM ${tableNameRole} WHERE id = ${info['roleid']}`);
    if(role.length) {
        info.menus = JSON.parse(role[0].menus);
        info.type = JSON.parse(role[0].type);
    }
    delete info.password;
    delete info.randstr;
    info['token'] = getToken(info['uid']);
    res.send(Success(info, '登录成功'));
});


module.exports = router;