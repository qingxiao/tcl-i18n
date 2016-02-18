将Excel文件转换成java国际化标准文件：message_language.properties

注意：

1. 语言缩写对照表使用：<http://confluence.lab.tclclouds.com/pages/viewpage.action?pageId=2853889>
2. 如果需要合并多个翻译文件，把新的翻译文件作为新的Sheet放到旧的翻译文件中  

    如：  
    
    Excel_1.xlsx-Sheet1  
    Excel_2.xlsx-Sheet1  
     -> Excel_1.xlsx-[Sheet1, Excel_2.xlsx-Sheet1] 
        
使用方式：

    var i18n = require('i18n');
    var config = {
        //excel表格文件
        file:'./xlsx/file.xlsx',
        //str, arr, function 需要处理的Sheet名称，为空默认全部Sheet，后面的覆盖前的内容
        sheetName:['Sheet1','Sheet2'], 
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
                 to:'\\n'
            }]
            //replace:function(context){return context.replace(/xxx/g, 'yyy')}
        }
        //output:function(json){console.log(json);}
    };
    i18n.parse(config);
    
Demo：
    npm insall tcl-i18n2 后有个demo目录，cd到该目录执行

    node demo.js
