var express = require('express');
const path = require('path');
var router = express.Router();
const tableName = 'notice'
const { Success, MError } = require("../utils/Result");
const {createHtml, readHtml} = require('../utils/fs');
const Db = require("../utils/Db");
const random = require('string-random');
router.get("/noticelist", async (req, res) => {
    let data = [];
	data = await Db.select(req, `SELECT * FROM ${tableName} ${Db.getWhereStr(req['query'])}`);
    res.send(Success(data));
});

router.get("/noticebypath", async (req, res) => {
	let notice = await readHtml(path.join(__dirname, `../public${req['query'].filepath}`));
	if (!notice) return res.send(MError());
    res.send(Success({notice}));
});

router.post("/noticeadd", async (req, res) => {
	let { title, status, notice, adminid, updatetime, buildid } = req['body'];
	let filepath = `/wangeditor/html/${(new Date()).getTime() + random(5)}.html`;
    createHtml(path.join(__dirname, `../public${filepath}`), notice).then(async () => {
        const result = await Db.insert(req, tableName, {
            filepath,
			title,
			status,
			adminid,
			updatetime,
            buildid
        });
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败"));
        }
    }).catch(()=>{
        res.send(MError("添加失败"));
    });
});
router.post("/noticeedit", async (req, res) => {
	let { id, filepath, title, status, notice, adminid, updatetime, buildid } = req['body'];
    createHtml(path.join(__dirname, `../public${filepath}`), notice).then(async () => {
        const result = await Db.update(req, tableName, {
            filepath,
			title,
			status,
			adminid,
			updatetime,
            buildid
        }, ` WHERE id = ${id}`);
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败"));
        }
    }).catch(()=>{
        res.send(MError("添加失败"));
    });
});
router.post("/noticedelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
		const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
		res.send(Success());
    }
});
module.exports = router;
