var express = require('express');
var router = express.Router();
const tableName = 'report';
const buildTable = 'build';
const roomTable = 'room';
const studentTable = 'student';
const administratorTable = 'administrator';
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");

router.get("/reportlist", async (req, res) => { // 登录接口
    let { buildid } = req['query'];
    const result = await Db.select(req, `SELECT a.id, a.detail, b.buildname, a.status, a.createtime, a.handletime, c.roomnumber, d.username AS studentname, e.username AS adminname FROM ${tableName} a 
    LEFT JOIN ${buildTable} b ON a.buildid = b.id
    LEFT JOIN ${roomTable} c ON a.roomid = c.id
    LEFT JOIN ${studentTable} d ON a.reporter = d.id
    LEFT JOIN ${administratorTable} e ON a.handlerid = e.id
    WHERE a.buildid = ${buildid} ORDER BY a.status ASC, a.createtime DESC`);
    res.send(Success(result));
});

router.post("/reportchangestatus", async (req, res) => { // 登录接口
    let { id, status, handlerid, handletime } = req['body'];
    if (!id) return res.send(MError('缺少必要条件'));
    let info = {
        status,
        handlerid,
        handletime
    };
    const result = await Db.update(req, tableName, info, ` WHERE id = '${id}'`);
    result ? res.send(Success()) : res.send(MError(result));
});


module.exports = router;