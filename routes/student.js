const express = require('express');
const router = express.Router();
const tableName = 'student';
const tableNameRole = 'role';
const roomTable = 'room';
const { Success, MError} = require('../utils/Result');
const Db = require('../utils/Db');
const random = require('string-random');
const crypto = require('crypto');
const { getUUID } = require("../utils");

router.get('/studentlist', async (req, res) => {
    let { page, size } = req['query'];
    let {total} = (await Db.select(req, `SELECT COUNT(*) AS total FROM ${tableName}`))[0];
    let data = [];
    if(!total){
        res.send(Success(data, undefined, undefined, total));
    }else if(page && size) {
        data = await Db.select(req, `SELECT a.id,a.username,a.roleid,a.status,a.serialnumber,a.buildid,a.roomid,a.floor,b.rolename FROM ${tableName} a
        LEFT JOIN ${tableNameRole} b
        ON a.roleid = b.id
        ORDER BY a.id
        LIMIT ${(page-1)*size},${size}`);
        res.send(Success(data, undefined, undefined, total));
    } else {
        res.send(MError());
    }
});

router.post('/studentadd', async (req, res) => {
    let { roleid, username, password, status, serialnumber, buildid, roomid, floor } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE serialnumber = '${serialnumber}'`);
    const room = (await Db.select(req, `SELECT * FROM ${roomTable} WHERE id = ${roomid}`))[0];
    if(info){
        res.send(MError('学生编号已存在，不能重复！'));
    } else if(!room || !(room.volume >= room.occupancy)) {
        res.send(MError('宿舍已住满！'));
    } else {
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
            roomid,
            floor
        });
        await Db.update(req, roomTable, {
            occupancy: ++room.occupancy
        }, ` WHERE id = ${roomid}`);
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败"));
        }
    }
});

router.post('/studentedit', async (req, res) => {
    let { id, roleid, username, password, status, serialnumber, buildid, roomid, floor } = req['body'];
    let room = (await Db.select(req, `SELECT * FROM ${roomTable} WHERE id = ${roomid}`))[0];
    console.log(room);
    if(buildid !== room.buildid || roomid !== room.roomid) {
        await Db.update(req, roomTable, {
            occupancy: ++room.occupancy
        }, ` WHERE id = ${roomid}`);
        await Db.update(req, roomTable, {
            occupancy: --room.occupancy
        }, ` WHERE id = ${room.roomid}`);
    }
    if(!id){
        res.send(MError('缺少必要条件'));
    } else {
        let info = { roleid, username, status, serialnumber, buildid, roomid, floor };
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
router.post("/studentdelete", async (req, res) => {
    let { id, roomid } = req['body'];
    const room = (await Db.select(req, `SELECT * FROM ${roomTable} WHERE id = ${roomid}`))[0];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {        
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        await Db.update(req, roomTable, {
            occupancy: --room.occupancy
        }, ` WHERE id = ${roomid}`);
        if(result === true){
            res.send(Success());
        }else{
            res.send(MError());
        }
    }
});

module.exports = router;
