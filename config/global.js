/** -------------数据库变更需要修改的地方----------- */
// 数据库连接参数
exports.dbConfig = {
    host: 'localhost', //数据库地址
    user: 'root',//数据库用户名
    password: '123456',//数据库用户密码
    port: 3306,
    database: 'dormitory' // 数据库名字
};

// token过期时间 (分钟单位)
exports.tokenTimeout = 180;

// api路由权限对照列表(字段是用户表中用户身份标识字符串)
exports.apiAuthObj = [
    '/api/menulist','/api/menuadd','/api/menuinfo','/api/menuedit','/api/menudelete',
    '/api/rolelist','/api/roleadd','/api/roleinfo','/api/roleedit','/api/roledelete',
    '/api/adminlist', '/api/adminadd', '/api/adminedit', '/api/admindelete',
    '/api/buildlist', '/api/buildadmins', '/api/buildadd', '/api/buildedit',
    '/api/builddelete',
    '/api/updateworkstatus', '/api/roomlist', '/api/roomadd', '/api/roomedit',
    '/api/roomdelete', '/api/studentlist', '/api/studentadd', '/api/studentedit',
    '/api/studentdelete',
    '/api/bannerlist', '/api/banneradd', '/api/banneredit', '/api/bannerdelete',
    '/api/informationlist', '/api/informationadd', '/api/informationedit', '/api/informationdelete',
    '/api/informationbypath', '/api/noticelist', '/api/noticebypath', '/api/noticeadd',
    '/api/noticeedit', '/api/noticedelete',
    '/api/public-banner-list', '/api//public-information-list', '/api/public-notice-list', '/api/public-query-news', '/api/public-query-userinfo',
    '/api/public-report-problems', '/api/reportlist', '/api/reportchangestatus'
];