var express = require('express');
var router = express.Router();
const tableName = 'role';
const studentTableName = 'student';
const administratorTableName = 'administrator';
const {Success, MError} = require('../utils/Result');
const Db = require('../utils/Db');
//获取管理员列表
router.get('/rolelist', async (req, res) => {
    const { type } = req['query'];
    let data = [];
    if(type !== undefined) {
        data = await Db.select(req, `SELECT * FROM ${tableName} WHERE type = ${type}`);
    } else {
        data = await Db.select(req, `SELECT * FROM ${tableName}`);
    }
    res.send(Success(data));
});

//添加管理员
router.post("/roleadd", async (req, res) => {
    let { rolename, menus, status, type } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE rolename = '${rolename}'`);
    if (info) {
        res.send(MError("角色名称已存在，不能重复！"));
    } else {
        const result = await Db.insert(req, tableName, {
            rolename, menus, status, type
        });
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败，请查看字段信息是否正确"));
        }
    }
});

//修改角色
router.post("/roleedit", async (req, res) => {
    let { id, rolename, menus, status } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.update(req, tableName, { rolename, menus, status }, ` WHERE id = ${id}`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});

//删除角色
router.post("/roledelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        let data = await Db.select(req, `SELECT * FROM ${administratorTableName} WHERE roleid = ${id}`);
        if(!data) data = await Db.select(req, `SELECT * FROM ${studentTableName} WHERE roleid = ${id}`);
        if(data){
            res.send(MError("该角色还有用户在使用，不能删除！"));
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