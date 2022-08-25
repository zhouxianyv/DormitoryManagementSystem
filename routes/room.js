const express = require('express');
const router = express.Router();
const tableName = 'room';
const buildTable = 'build';
const { Success, MError} = require('../utils/Result');
const Db = require('../utils/Db');

router.get('/roomlist', async (req, res) => {
    let data = [];
    data = await Db.select(req, `SELECT a.id, a.roomnumber, a.floor, a.occupancy, a.volume, a.buildid, b.buildname, a.volume - a.occupancy AS remaining FROM ${tableName} a LEFT JOIN ${buildTable} b ON a.buildid = b.id ${Db.getWhereStr(req['query'], 'a')}`);
    res.send(Success(data));
});

router.post('/roomadd', async (req, res) => {
    let { roomnumber, floor, occupancy, volume, buildid } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE roomnumber = '${roomnumber}'`);
    if(info){
        res.send(MError('宿舍号已存在，不能重复！'));
    }else {
        const result = await Db.insert(req, tableName, {
            roomnumber,
            floor,
            occupancy,
            volume,
            buildid
        });
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败"));
        }
    }
});

router.post('/roomedit', async (req, res) => {
    let { id, roomnumber, floor, occupancy, volume, buildid } = req['body'];
    if(!id){
        res.send(MError('缺少必要条件'));
    } else {
        let info = { roomnumber, floor, occupancy, volume, buildid };
        const result = await Db.update(req, tableName, info, ` WHERE id = '${id}'`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});

router.post("/roomdelete", async (req, res) => {
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