var express = require('express');
const path = require('path');
var router = express.Router();
const tableName = 'information'
const { Success, MError } = require("../utils/Result");
const {createHtml, readHtml} = require('../utils/fs');
const Db = require("../utils/Db");
const random = require('string-random');
router.get("/informationlist", async (req, res) => {
    let data = [];
	data = await Db.select(req, `SELECT * FROM ${tableName} ${Db.getWhereStr(req['query'])}`);
    res.send(Success(data));
});

router.get("/informationbypath", async (req, res) => {
	let information = await readHtml(path.join(__dirname, `../public${req['query'].filepath}`));
	if (!information) return res.send(MError());
    res.send(Success({information}));
});

router.post("/informationadd", async (req, res) => {
	let { title, status, information, detail, adminid, updatetime } = req['body'];
	let filepath = `/wangeditor/html/${(new Date()).getTime() + random(5)}.html`;
    createHtml(path.join(__dirname, `../public${filepath}`), information).then(async () => {
        const result = await Db.insert(req, tableName, {
            filepath,
			title,
			detail,
			status,
			adminid,
			updatetime
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
//修改轮播图
router.post("/informationedit", async (req, res) => {
	let { id, filepath, title, status, information, detail, adminid, updatetime } = req['body'];
    createHtml(path.join(__dirname, `../public${filepath}`), information).then(async () => {
        const result = await Db.update(req, tableName, {
            filepath,
			title,
			detail,
			status,
			adminid,
			updatetime
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
//删除轮播图
router.post("/informationdelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
		const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
		res.send(Success());
    }
});
module.exports = router;
