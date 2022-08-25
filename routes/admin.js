const express = require('express');
const router = express.Router();
const tableName = 'administrator';
const tableNameRole = 'role';
const tableNameBuild = 'build';
const { Success, MError} = require('../utils/Result');
const Db = require('../utils/Db');
const random = require('string-random');
const crypto = require('crypto');
const { getUUID } = require("../utils");

router.get('/adminlist', async (req, res) => {
    let { page, size } = req['query'];
    let {total} = (await Db.select(req, `SELECT COUNT(*) AS total FROM ${tableName}`))[0];
    let data = [];
    if(!total){
        res.send(Success(data, undefined, undefined, total));
    }else if(page && size) {
        data = await Db.select(req, `SELECT a.id,a.username,a.roleid,a.status,a.serialnumber,a.buildid,b.rolename, a.workstatus FROM ${tableName} a
        LEFT JOIN ${tableNameRole} b
        ON a.roleid = b.id
        ORDER BY a.id`);
        res.send(Success(data, undefined, undefined, total));
    } else {
        res.send(MError());
    }
});

router.post('/adminadd', async (req, res) => {
    let { roleid, username, password, status, serialnumber, buildid, workstatus } = req['body'];
    if (!workstatus) workstatus = 0;
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE serialnumber = '${serialnumber}'`);
    if(info){
        res.send(MError('管理员编号已存在，不能重复！'));
    }else {
        const randstr = random(5);
        password += randstr;
        password = crypto.createHash('md5').update(password).digest('hex');
        const result = await Db.insert(req, tableName, {
            uid: getUUID(),
            roleid,
            username,
            password,
            randstr,
            status,
            serialnumber,
            buildid,
            workstatus
        });
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败"));
        }
    }
});

router.post('/adminedit', async (req, res) => {
    let { id, roleid, username, password, status, serialnumber, buildid, workstatus } = req['body'];
    if(!id){
        res.send(MError('缺少必要条件'));
    } else {
        let info = { roleid, username, status, serialnumber, buildid, workstatus };
        if(password) {
            const randstr = random(5);
            password += randstr;
            info.randstr = randstr;
            info.password = crypto.createHash('md5').update(password).digest("hex");
        }
        const result = await Db.update(req, tableName, info, ` WHERE id = '${id}'`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});

//删除角色
router.post("/admindelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {        
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        if(result === true){
            res.send(Success());
        }else{
            res.send(MError());
        }
    }
});

module.exports = router;