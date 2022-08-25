var express = require('express');
var router = express.Router();
const administratorTableName = 'administrator';
const buildTableName = 'build';
const {Success, MError} = require('../utils/Result');
const Db = require('../utils/Db');
const formidable = require('formidable'); //处理含有文件上传的表单
const fs = require('fs');
const path = require('path');
const random = require('string-random');

router.post('/updateworkstatus', async (req, res) => {
    let { id, workstatus, buildid } = req['body'];
    if (id && workstatus !== undefined && buildid) {
        const build = (await Db.select(req, `SELECT currentdutyadmin FROM ${buildTableName} WHERE id = ${buildid}`))[0];
        if (build.currentdutyadmin != id && build.currentdutyadmin) return res.send(MError('请先通知正在值班的管理员进行下线'));
        const result = await Db.update(req, administratorTableName, {workstatus: workstatus ? 0 : 1}, ` WHERE id = '${id}'`);
        const buildResult = await Db.update(req, buildTableName, {currentdutyadmin: workstatus ? '' : id}, ` WHERE id = '${buildid}'`);
        if(result && buildResult) res.send(Success());
        else res.send(MError(result ? result : buildResult));
    } else {
        res.send(MError('缺少必要参数'));
    }
});

module.exports = router;
