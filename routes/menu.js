var express = require('express');
var router = express.Router();
const tableName = 'menu'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
//菜单列表
router.get("/menulist", async (req, res) => {
    let { menus, type, status } = req['query'];
    let data = [];
    if(!menus) {
        data = await Db.select(req, `SELECT * FROM ${tableName}`);
    } else if (menus.length) {
        data = await Db.select(req, `SELECT * FROM ${tableName} WHERE url IN (${menus})`);
    } else {
        data = [];
    }
    if(type && data.length) {
        data = data.map(item => {
            if (item.type == type) return item;
        });
    }
    if(status && data.length) {
        data = data.map(item => {
            if (item.status == status) return item;
        });
    }
    res.send(Success(data));
});
//添加菜单
router.post("/menuadd", async (req, res) => {
    let { title, icon, type, url, status } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE title = '${title}'`);
    if (info) {
        res.send(MError("菜单名称已存在，不能重复！"));
    } else {
        const result = await Db.insert(req, tableName, {
            title, icon, type, url, status
        });
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败，请查看字段信息是否正确"));
        }
    }
});
//获取一条
router.get("/menuinfo", async (req, res) => {
    const {id} = req['query'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE id = '${id}'`);
        res.send(Success(info, '获取成功', tableName));
    }

})
//修改菜单
router.post("/menuedit", async (req, res) => {
    let { id, title, icon, type, url, status } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.update(req, tableName, { title, icon, type, url, status }, ` WHERE id = ${id}`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});
//删除菜单
router.post("/menudelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        let data = await Db.select(req, `SELECT * FROM ${tableName} WHERE pid = ${id}`);
        if(data){
            res.send(MError("该菜单下还有子级菜单，不能删除！"));
            return;
        }
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        if(result === true){
            res.send(Success());
        }else{
            res.send(MError());
        }
    }
});
module.exports = router;