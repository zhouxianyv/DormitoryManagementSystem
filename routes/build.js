const express = require('express');
const router = express.Router();
const tableName = 'build';
const adminTable = 'administrator';
const { Success, MError} = require('../utils/Result');
const Db = require('../utils/Db');

router.get('/buildlist', async (req, res) => {
    let data = [];
    data = await Db.select(req, `SELECT a.id, a.buildname, a.floorcount, a.roomcount, a.currentdutyadmin, b.username FROM ${tableName} a LEFT JOIN ${adminTable} b ON a.currentdutyadmin = b.id`);
    res.send(Success(data));
});

router.get('/buildadmins', async (req, res) => {
    let { buildid } = req['query'];
    let data = [];
    data = await Db.select(req, `SELECT id, username FROM ${adminTable} WHERE buildid = ${buildid}`);
    res.send(Success(data));
});

router.post('/buildadd', async (req, res) => {
    let { buildname, floorcount, roomcount } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE buildname = '${buildname}'`);
    if(info){
        res.send(MError('宿舍名已存在，不能重复！'));
    } else {
        const result = await Db.insert(req, tableName, { buildname, floorcount, roomcount });
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败"));
        }
    }
});

router.post('/buildedit', async (req, res) => {
    let { id, buildname, floorcount, roomcount } = req['body'];
    if(!id){
        res.send(MError('缺少必要条件'));
    } else {
        let info = { buildname, floorcount, roomcount };
        const result = await Db.update(req, tableName, info, ` WHERE id = '${id}'`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});

router.post("/builddelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const info = await Db.select(req, `SELECT id, username FROM ${adminTable} WHERE buildid = ${id}`);
        if (info) return res.send(MError('请先将管理员分配给其他宿舍楼'));
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        if(result === true){
            res.send(Success());
        }else{
            res.send(MError());
        }
    }
});

module.exports = router;