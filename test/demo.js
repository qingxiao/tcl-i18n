var i18n = require('../index.js');
var config = {
    //excel表格文件
    file:'test2.xlsx',
    //str, arr, function 需要处理的Sheet名称，为空默认全部Sheet，后面的覆盖前的内容
    sheetName:['MESSAGE','Sheet2'],
    //object, function
    output:{
        //文件输出目录
        filePath:'./i18n',
        //文件扩展名，properties|json
        fileType:'properties',
        //str, function 文件名，language默认使用下划线，可传function返回文件名
        fileName:'message_{language}',
        //fileName:function(lan){return 'message_'+lan.toLowerCase();}
        //TODO value中一些特殊文本替换
        replace:[{
            from:'&#10;',
            to:'<br/>'
        }]
        //replace:function(context){return context.replace(/xxx/g, 'yyy')}
    }
    //output:function(json){console.log(json);}
};
i18n.parse(config);