var express = require('express');
var router = express.Router();
const { onlineUsers } = require('../utils/socketIO');
const Db = require("../utils/Db");
const bannerTable = 'banner';
const informationTable = 'information';
const studentTable = 'student';
const noticeTable = 'notice';
const buildTable = 'build';
const roomTable = 'room';
const reportTable = 'report';
const { Success, MError } = require("../utils/Result");
//轮播图列表
router.get("/public-banner-list", async (req, res) => {
    let data = [];
	data = await Db.select(req, `SELECT * FROM ${bannerTable} ${Db.getWhereStr(req['query'])}`);
    res.send(Success(data));
});

router.get("/public-information-list", async (req, res) => {
    let data = [];
	data = await Db.select(req, `SELECT * FROM ${informationTable} ${Db.getWhereStr(req['query'])}`);
    res.send(Success(data));
});

router.get("/public-notice-list", async (req, res) => {
    let data = [];
	data = await Db.select(req, `SELECT * FROM ${noticeTable} ${Db.getWhereStr(req['query'])}`);
    res.send(Success(data));
});

router.get("/public-query-news", async (req, res) => {
    let { type, id } = req['query'];
    let data = [];
	data = await Db.select(req, `SELECT * FROM ${type} WHERE id = ${id}`);
    res.send(Success(data[0]));
});

router.get("/public-query-userinfo", async (req, res) => {
    let { id } = req['query'];
    let data = [];
	data = await Db.select(req, `SELECT a.username, a.serialnumber, b.buildname, c.roomnumber FROM ${studentTable} a LEFT JOIN ${buildTable} b ON a.buildid = b.id LEFT JOIN ${roomTable} c ON a.roomid = c.id AND c.buildid = a.buildid WHERE a.id = ${id}`);
    if(!data) return res.send(MError());
    res.send(Success(data[0]));
});

router.post("/public-report-problems", async (req, res) => {
    let { reporter, buildid, roomid, detail, status, createtime  } = req['body'];
    const info = await Db.select(req, `SELECT currentdutyadmin FROM ${buildTable} WHERE id = '${buildid}'`);
    let currentdutyadmin = info[0].currentdutyadmin;
    if (currentdutyadmin in onlineUsers) {
        onlineUsers[currentdutyadmin].socket.emit('new-problems');
    }
	await Db.insert(req, reportTable, { reporter, buildid, roomid, detail, status, createtime });
    res.send(Success());
});

module.exports = router;

