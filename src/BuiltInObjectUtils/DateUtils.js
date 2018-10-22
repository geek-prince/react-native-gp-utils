/**
 * 注意:
 * "2018-02-07 15:32:35"用new Date将这样的字符串转换为日期对象有可能会出错(上次测试在模拟器上就不会出错,在真机上就出错.原因:模拟器上用的谷歌浏览器调试,所以用的js引擎就是谷歌浏览器的v8引擎,手机上的js解析器虽然大致上和它是一样的,但还是有些许差异,所以导致这个错误)
 * "2018/02/07 15:32:35"用new Date将这样的字符串转换为日期对象一定是不会出错的 上面的字符串 .replace(/-/g,'/') 转换为这行字符串
 */

import ComFuncGlobal from '../CommonUtils';
const {isString,isNumber,isDate,getNewObj,loop}=ComFuncGlobal.normal.funcs;
//以这种方式导入的原因:ArrayUtils中有说明
import PrivateCommonUtils from '../PrivateCommonUtils';
const {_normalFuncToProtoFunc:_ntop}=PrivateCommonUtils;
eval(_ntop.toString());

//根据传进来的格式化日期字符串转换为日期对象
function _getDateFromStr(dateStr){
    // let date=new Date(dateStr); //dateStr为"2012-12-12"时创建出来的是这天08:00:00的时间(中国在东8区的原因吗?).而dateStr为"2012/12/12"时创建出来的是时间为这天的00:00:00.为了统一,就不这样处理了,而是放到下面都转换为"2012/12/12"的形式再处理
    // if(date+''!=='Invalid Date'){return date;}
    let r1='(\\d{4})',r2='(\\d{2})',c1='.*?',re1=c1+r1+c1,re2=c1+r2+c1;
    let y=0,M=0,d=0,h=0,m=0,s=0;
    let RE=RegExp;
    let getDate=(y,M,d,h,m,s)=>{
        let str=[y,'/',M,'/',d,' ',h,':',m,':',s].join('');
        return new Date(str);
    };
    let reg=new RE(re1+re2+re2+re2+re2+re2);//"2018-08-07 15:51:59","20180807155159"这种类型的情况
    if(reg.test(dateStr)){y=RE.$1;M=RE.$2;d=RE.$3;h=RE.$4;m=RE.$5;s=RE.$6;return getDate(y,M,d,h,m,s)}
    reg=new RE(re2+re2+re2+re1+re2+re2);//"15:51:59 2018-08-07"这种类型的情况
    if(reg.test(dateStr)){h=RE.$1;m=RE.$2;s=RE.$3;y=RE.$4;M=RE.$5;d=RE.$6;return getDate(y,M,d,h,m,s)}
    reg=new RE(re2+re2+re2+re2+re2+re1);//"15:51:59 08/07/2018"这种类型的情况
    if(reg.test(dateStr)){h=RE.$1;m=RE.$2;s=RE.$3;M=RE.$4;d=RE.$5;y=RE.$6;return getDate(y,M,d,h,m,s)}

    // //只有 年月日 时的情况
    reg=new RE(re2+re2+re1);//"08/07/2018"这种类型的情况
    if(reg.test(dateStr)){M=RE.$1;d=RE.$2;y=RE.$3;return getDate(y,M,d,h,m,s)}
    reg=new RE(re1+re2+re2);//"2018-08-07","20180807"这种类型的情况
    if(reg.test(dateStr)){y=RE.$1;M=RE.$2;d=RE.$3;return getDate(y,M,d,h,m,s)}

    console.warn('无效的日期字符串');
    return new Date();
}
//根据传进来的日期(可以是Date对象,也可以是字符串,也可以是时间戳的Int)将其转换为日期对象
function getDateObj(date) {
    // console.log(date,typeof date,isString(date));
    if(!isDate(date)&&!isString(date)&&!isNumber(date)){return null}
    isNumber(date)&&(date=new Date(date));
    isString(date)&&(date=_getDateFromStr(date));
    return date
}

/**
 * 将日期对象格式化为指定格式的字符串形式
 * @param date 要格式化的日期(可以是Date对象,也可以是字符串类型的日期,也可以是时间戳的Int)
 * @param formatStr 要格式化为什么形式的字符串.M表示月,d表示日,h表示小时,m表示分钟,s表示秒,q表示季度,S表示毫秒(比如"yyyy-MM-dd hh:mm:ss")
 * @returns {string} 格式化后的字符串
 */
function formatDate(date,formatStr='yyyy-MM-dd hh:mm:ss'){
    let dateObj=getDateObj(date);
    if(!dateObj){return ''}
    let o = {
        "M+":dateObj.getMonth()+1,  //M表示月
        "d+":dateObj.getDate(),     //d表示日
        "h+":dateObj.getHours(),    //h表示小时
        "m+":dateObj.getMinutes(),  //m表示分钟
        "s+":dateObj.getSeconds(), //s表示秒
        "q+":Math.floor((dateObj.getMonth()+3)/3),  //q表示季度
        "S" :dateObj.getMilliseconds() //S表示毫秒
    };
    if(/(y+)/.test(formatStr)) {
        formatStr=formatStr.replace(RegExp.$1,(dateObj.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(let k in o){
        if(new RegExp("("+ k +")").test(formatStr)) {
            formatStr=formatStr.replace(RegExp.$1, RegExp.$1.length==1?o[k]:("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return formatStr;
}


/**
 * 在当前日期上加减(几天,几月,几年),并且返回处理后的日期对象
 * @param date 在哪个日期的基础上增减,可接收日期对象或字符串类型的日期或Int类型的时间戳(传入的是日期对象时).
 * @param num 要加上或减去(年月日)的数量
 * @param dayOrMouth 要加减的是(日 月 还是年...), 'year','month','day','hour','min','second'(默认为'day',天为单位)
 * @param addOrSub 加还是减.(默认是'add',加)
 * @param ifChangeDate 传入的date为日期对象时,是否要改变原始的date对象值(即变成加/减后的日期对象)(默认为true,改变)
 * @param isBehindZero 当设置为true时,比如加一天后的时间为第二天的0点0分0秒,加一月时为第二月的第一天的0点0分0秒;减一天后的时间为当天的0点0分0秒,减一月后为当月的第一天的0点0分0秒.(默认为false)
 * @returns 返回加或减之后的日期对象
 */
function addOrSubDate(date,num,dayOrMouth='day',addOrSub='add',ifChangeDate=true,isBehindZero=false){
    if(!isDate(date)&&!isString(date)&&!isNumber(date)){return date}
    let d;
    if(this){d=(!ifChangeDate&&isDate(this))?getNewObj(this):getDateObj(date);}else {d=new Date();}
    let dormArr=['year','month','day','hour','min','second'];
    let dormIndex=dormArr.indexOf(dayOrMouth);
    let funcs={
        'year':{setFunc:'setYear',getFunc:'getFullYear'},
        'month':{setFunc:'setMonth',getFunc:'getMonth',startIndex:0},
        'day':{setFunc:'setDate',getFunc:'getDate',startIndex:1},
        'hour':{setFunc:'setHours',getFunc:'getHours',startIndex:0},
        'min':{setFunc:'setMinutes',getFunc:'getMinutes',startIndex:0},
        'second':{setFunc:'setSeconds',getFunc:'getSeconds',startIndex:0},
    };
    let setFunc=funcs[dayOrMouth].setFunc;
    let getFunc=funcs[dayOrMouth].getFunc;
    if(addOrSub==='add'){
        // console.log(d[getFunc]());
        d[setFunc](d[getFunc]()+num);
        if(isBehindZero){
            for (let i=dormIndex+1;i<dormArr.length;i++){
                // console.log(dormArr[i]);
                d[funcs[dormArr[i]].setFunc](funcs[dormArr[i]].startIndex);
            }
        }else {}
    }else {
        if(isBehindZero){
            d[setFunc](d[getFunc]() - (num-1));
            for (let i=dormIndex+1;i<dormArr.length;i++){
                d[funcs[dormArr[i]].setFunc](funcs[dormArr[i]].startIndex);
            }
        }else {
            d[setFunc](d[getFunc]() - num);
        }
    }
    return d;
}

//在当前日期上加减(几天,几月,几年),并且返回格式化后的日期形式
function addOrSubDateFormat(date,num,formatStr='yyyy-MM-dd',dayOrMouth='day',addOrSub='add',ifChangeDate=true,isBehindZero=false){
    let d=addOrSubDate(date,num,dayOrMouth,addOrSub,ifChangeDate,isBehindZero);
    return formatDate(d,formatStr);
}

/**
 * 计算两个日期之间的时间差(计算结果是向上取整的,返回都是整数,比如diffType时间差单位'day'天时,如果两个时间相减后不足1天,返回就是1)
 * @param startTime 开始日期时间(可以是Date对象,也可以是字符串类型的日期,也可以是时间戳的Int)
 * @param endTime 结束日期时间(可以是Date对象,也可以是字符串类型的日期,也可以是时间戳的Int)
 * @param diffType 最后获得的时间差的单位.'year':年,'month':月,'day':日,'hour':时,'minute':分,'second':秒.(默认为'day',天)
 * @param ifAbs 对最终的时间差是否取绝对值(默认为true,取绝对值)
 * @returns {number} 返回相应单位的时间差
 */
function getDateDiff(startTime,endTime,diffType='day',ifAbs=true){
    let sTime=getDateObj(startTime),eTime=getDateObj(endTime);
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    //作为除数的数字
    let divNum = 1;
    switch (diffType) {
        case "second":
            divNum=1000;
            break;
        case "minute":
            divNum=1000*60;
            break;
        case "hour":
            divNum=1000*3600;
            break;
        case "day":
            divNum=1000*3600*24;
            break;
        case "month":
            divNum=1000*3600*24*30;
            break;
        case "year":
            divNum=1000*3600*24*30*12;
            break;
        default:
            break;
    }
    //向上取整
    let finalNum=Math.ceil((eTime.getTime()-sTime.getTime())/parseInt(divNum));
    ifAbs&&(finalNum=Math.abs(finalNum));
    return finalNum;
}
global.getDateDiff=getDateDiff;


const normal={funcs:{getDateObj}};

// const both_protoFuncs={addOrSubDate,format,addOrSubDateFormat,namesMap};
// const both_normalFuncs=_protoFuncToNormalFunc(both_protoFuncs,'date');
// 普通方法名到原型链方法名的映射
const funcNamesMap={formatDate:'format',getDateDiff:'diff'};
// 第一个参数和预置的不一样时的映射
const firstArgMap={getDateDiff:'startTime'};
const both_normalFuncs={addOrSubDate,formatDate,addOrSubDateFormat,getDateDiff,funcNamesMap,firstArgMap};
const both_protoFuncs=_normalFuncToProtoFunc(both_normalFuncs,'date');
// 删除这两个特殊的键值
delete both_normalFuncs.funcNamesMap;delete both_normalFuncs.firstArgMap;
const both={proto:both_protoFuncs,funcs:both_normalFuncs};

export default {normal,both};