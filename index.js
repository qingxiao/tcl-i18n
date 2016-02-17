var fs = require('fs');
var path = require('path');
var XLSX = require('xlsx');
var _ = require('underscore');
var escapeStringRegexp = require('escape-string-regexp')
var lanMap = require('./lib/language.js');



var lanMap2 = lowerKey(lanMap);
/*
var c = {
    file:'./test/test2.xlsx',
    sheetName:['MESSAGE','Sheet2'], //str, arr, function
    output:{
        filePath:'./test/i18n',
        //fileType:'properties',
        fileType:'json',
        fileName:'message_{language}',
        replace:[{
            from:/&#10;/g,
            to:'\n'
        }]
    }
};
parse(c);*/
function parse(config){
    var workbook = XLSX.readFile(config.file);
    var allJSON = {};
    var sheetNameList = workbook.SheetNames;
    //先把sheet对应的数据转换成lan:{key:value}
    sheetNameList.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var sheetRows = XLSX.utils.sheet_to_json(worksheet);
        allJSON[y] = sheetToLan(sheetRows);
    });
    //获取需要做操作的sheet，根据先后顺序覆盖翻译字段的内容
    var sheetName = getSheetName(config.sheetName, sheetNameList);

    console.info('Excel Sheet: ', sheetNameList);
    console.info('Config Sheet:', sheetName);
    /*
    * {lan:{key:value}, lan2:{key:value}}
    * 需要深层copy
    * */
    var target = {};
    sheetName.forEach(function(name){
        var sheetRows = allJSON[name];
        for(var lan in sheetRows){
            target[lan] = _.extend(target[lan] || {}, sheetRows[lan]);
        }
    });
    //console.log(target);
    outputFile(target, config.output,allJSON);
}


//把json的key转换为小写
function lowerKey(obj){
    var res = {};
    for(var k in obj){
        res[k.toLowerCase()] = obj[k];
    }
    return res;
}
function getSheetName(sheetName, sheetNameList){
    //下面的操作就是要吧sheetName整成数组
    if(_.isFunction(sheetName)){
        sheetName = sheetName(sheetNameList);
    }
    if(_.isEmpty(sheetName)){
        sheetName = sheetNameList;
    }
    if(_.isString(sheetName)){
        sheetName = [sheetName];
    }
    return sheetName;
}
//把sheet json转换成 language:{key:value}
function sheetToLan(sheetRows){
    var res = {};
    sheetRows.forEach(function(row){
        var row = lowerKey(row);

        for(var k in row){
            var shortLan = lanMap2[k];
            if(shortLan){
                if(!res[shortLan]){
                    res[shortLan] = {};
                }
                var refName = parseRefName(row.refname);
                res[shortLan][refName] = row[k];
            }
        }
    });
    return res;
}

//输出翻译文件
function outputFile(target, config, allJSON){
    if(_.isFunction(config)){
        return config(target, allJSON);
    }
    var fname = config.fileName,
        fpath = config.filePath,
        ftype = config.fileType;

    for(var lan in target){
        //先解析 en-us这种有连字符的语言
        var ls = lan.split('-').join('_');
        var name = '';
        if(_.isFunction(fname)){
            name = fname(ls);
        }else{
            name = fname.replace('{language}', ls);
        }
        var context = parseContext(target[lan], ftype, config.replace);

        var furl = path.join(fpath, name+'.'+ftype);
        if(!fs.existsSync(fpath)){
            fs.mkdirSync(fpath);
        }
        fs.writeFileSync(furl, context);
    }
}

function parseRefName(name){
    return name.split(':').pop();
}

/**
* @param {json} oo
* @param {string} type
* @param {array} replace
* */
function parseContext(oo, type, replace){
    var res = '';


    if(type == 'properties'){
        var t = [];
        for(var k in oo){
            var value = decodeContext(oo[k], replace);
            t.push([k, value].join('='));
        }
        res = t.join('\n');
    }
    if(type == 'json'){
        var t = {};
        for(var k in oo){
            var value = decodeContext(oo[k], replace);
            t[k] = value;
        }
        res = JSON.stringify(t, null, 4);
    }
    return res;
}

function decodeContext(context, replace){
    //&#10; -> \n
   // context = context.replace(/&#(\d+)\;/g, String.fromCharCode('$1'));
    if(_.isFunction(replace)){
        return replace(context);
    }
    replace = makeArray(replace);
    replace.forEach(function(x){
        var from = x.from,
            to = x.to;
        //console.log(from, to);
        if(_.isString(from)){
            var escapedString = escapeStringRegexp(from);
            from = new RegExp(escapedString, 'g');
        }
        context = context.replace(from, to);

    });
    return context;
}
function makeArray(item){
    if(item === undefined) return [];
    if(!_.isArray(item)) return [item];
    return item;
}

exports.parse = parse;