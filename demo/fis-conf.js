fis.config.set('i18n',{
    file:'test2.xlsx',
    sheetName:null,
    output:{
        filePath:'./fis-i18n',
        fileType:'properties',
        fileName:'message_{language}',
        replace:[{
            from:'&#10;',
            to:'<br/>'
        }]
    }
});