// 参数正确， 获取成功
const {getModel} = require("../model"); // 统一格式化出口的数据

/**
 * list 数据
 * message 提示文字
 * tableName 需要格式化的表名
 */
exports.Success = (list = [] ,message = '操作成功', tableName, total) => {
    if (tableName !== undefined) { // 证明需要格式化
        list = getModel(list, tableName);
    }
    if (total !== undefined) {
        return {
            status: true,
            message,
            code: 200,
            list,
            total
        }
    }
    return {
        status: true,
        message,
        code: 200,
        list
    }
}
// 参数正确， 但是权限不够
exports.Guest = (list = [], message = '权限非法') => {
    return {
        status: false,
        message,
        code: 403,
        list
    }
}
// 参数错误，请检查传递的参数
exports.MError = ( message = '参数等发生错误') => {
    return {
        status: false,
        message,
        code: 500
    }
}