import CommonUtils from '../CommonUtils';
const {isArray,loop,isString,isRegExp,isNumeric,numToFixedLenStr}=CommonUtils.normal.funcs;
import MathUtils from '../MathUtils';
const {accDiv,accMul,accAdd,accSub,dealWithFloatStr}=MathUtils.normal.funcs;
import DateUtils from './DateUtils';
const {getDateObj}=DateUtils;
//以这种方式导入的原因:ArrayUtils中有说明
import PrivateCommonUtils from '../PrivateCommonUtils';
const {_normalFuncToProtoFunc:_ntop}=PrivateCommonUtils;
eval(_ntop.toString());

//将精确算术运算的这几个方法,加入到String的原型链中,但传入的字符串必须是数字
const div=function(arg){
    return accDiv(this, arg);
};
const mul=function(arg){
    return accMul(this, arg);
};
const add=function(arg){
    return accAdd(this, arg);
};
const sub=function(arg){
    return accSub(this, arg);
};

//将CommonUtils中的numToFixedLenStr方法加入到Number的原型链中
const toFixedLenStr=function(len=2,char='0') {
    return numToFixedLenStr(this,len,char);
};

//将isNumeric方法加入到原型链中
const isNumeric1=function (toFixed=null,ifTrim=true,positive=false) {
    return isNumeric(this,toFixed,ifTrim,positive);
};

//将dealWithFloatStr方法加入到原型链中
//返回字符串形式时
const toFloatStr=function (toFixed=2,type='round') {
    return dealWithFloatStr(this,toFixed,type,'both',true);
};
//返回数字类型时
const toFloat=function (toFixed=null,type='round') {
    return dealWithFloatStr(this,toFixed,type,'both',false);
};

//将DateUtils中的getDateObj方法加入String的原型链中
const toDate=function () {
    return getDateObj(this);
};

/**
 * 密文显示字符串,比如身份证号123456199507281234处理为1234************34这样的形式(对敏感信息的处理)
 * @param str
 * @param leftNum 左边明文显示的内容的长度
 * @param rightNum 右边明文显示的内容的长度
 * @param middleNum 中间隐藏内容的长度(默认0时,为减去左边右边的长度后的长度)
 * @param secChar 设置密文的字符,默认为'*'
 * @returns {string|*}
 */
function getSecStr(str,leftNum=0,rightNum=0,middleNum=0,secChar='*'){
    let secStr;
    let strLen=str.length;
    let leftStr=str.substring(0,leftNum);
    let rightStr=str.substring(strLen-rightNum);
    let mid=0;
    if(middleNum===0){
        mid=strLen-leftNum-rightNum;
    }else {
        mid=middleNum;
    }
    secStr=leftStr;
    secStr+=new Array(mid).join(secChar);
    secStr+=rightStr;
    return secStr;
}

/**
 * 对传入的字符串进行4(spacePositions)位隔一空格处理,比如,输入'432896549984326896532',则输出'4328 9654 9984 3268 9653 2'
 * @param str
 * @param spacePositions spacePositions为数组时.比如[4,6,5],字符串为'432896549984326896532',则输出'4328 965499 84326 8965 32'
 * @param loop 表示是否循环,默认为true.  false时,则输出'4328 965499 84326 896532',只执行一遍
 * @returns {string} 要返回的字符串
 */
function insertSpace(str,spacePositions=4,loop=true){
    //最后处理的字符串
    let finalStr='';
    //剩余要处理的字符串
    let rStr=str;
    let dealWithStr=(p)=>{
        finalStr+=rStr.substring(0,p)+' ';
        rStr=rStr.substring(p);
    };
    if(Array.isArray(spacePositions)){
        let arrLen=spacePositions.length;
        let num=0;
        let p=spacePositions[num];
        while (rStr.length>p){
            dealWithStr(p);
            num+=1;
            p=spacePositions[num%arrLen];
            if(!loop&&num>=arrLen)break;
        }
    }else {
        let p=spacePositions;
        if(loop){
            while (rStr.length>p){
                dealWithStr(p);
            }
        }else {
            dealWithStr(p);
        }
    }
    finalStr+=rStr;
    return finalStr;
}


/**
 * 查找字符串中指定字符/字符串第n次出现的位置(找到返回对应位置的索引,没找到返回-1)
 * @param str 要查找位置的字符/字符串
 * @param findStr 要查找位置的字符/字符串
 * @param n 要找第n次出现的位置
 * @returns {Number|number}
 */
function indexdWithNum(str,findStr,n=1){
    let localStr=str; //解决方法转换时,箭头函数的回调中的this问题
    let index=localStr.indexOf(findStr);
    loop(n-1,()=>{
        index=localStr.indexOf(findStr,index+1);
    });
    return index;
}

/**
 * 字符串指定位置插入字符/字符串的方法(可以指定多个位置插入多个字符/字符串)
 * @param str
 * @param inserts 表示要插入的字符/字符串(给出数组时,在多个位置插入多个字符串)
 * @param indexs 表示要插入的位置(给数组时在数组指定的多个位置插入)
 * @returns {string}
 */
function insertToIndex(str,inserts,indexs){
    let localStr=str; //解决方法转换时,箭头函数的回调中的this问题
    let allStrParts=[];
    if(isArray(indexs)){
        let strParts=[];
        let index=0;
        loop(indexs,(i,v)=>{
            strParts.push(localStr.substring(index,v));
            index=v;
        });
        strParts.push(localStr.substring(index));
        loop(strParts,(i,v)=>{
            allStrParts.push(v);
            i!==strParts.length-1&&(isArray(inserts)?allStrParts.push(inserts[i]):allStrParts.push(inserts));
        });
    }else {
        let before=localStr.substring(0, indexs);
        let after=localStr.substring(indexs);
        allStrParts= [before,inserts,after];
    }
    return allStrParts.join('');
}

/**
 * 获取一个字符串中一个指定字符/字符串出现次数
 * @param str
 * @param strOrReg 要查找的字符串或正则表达式
 * @returns {*}
 */
const getStrCount=function(str,strOrReg){
    if(!isString(strOrReg)&&!isRegExp(strOrReg)){return 0}
    let num=0,index=0;
    if(isString(strOrReg)){
        index=str.indexOf(strOrReg);
        while (index!==-1){
            num+=1;
            index=str.indexOf(strOrReg,index+1);
        }
        return num;
    }else {
        if(strOrReg.test(str)){
            return str.match(strOrReg).length;
        }else {
            return 0
        }
    }
};

/**
 * 去除字符串(左右/所有)空格或指定字符
 * @param str
 * @param type 要去除的位置.'all':所有,包括字符串中间的,'lr':左右(默认就是这个),'l':左,'r':右
 * @param char 要去除的字符,默认为空格' '
 * @returns {*}
 */
function trimFunc(str,type='lr',char=' '){
    if(!str){return ''}
    let finalStr;
    if(char===' '){
        switch(type){
            case 'all':finalStr=str.replace(/ /g,'');break;
            case 'l':finalStr=str.replace(/^\s*/g,"");break;
            case 'r':finalStr=str.replace(/\s*$/g,"");break;
            case 'lr':
            default:finalStr=str.trim();break;
        }
    }else {
        let re;
        switch(type){
            case 'all':
                re =new RegExp(char,'g');
                break;
            case 'l':
                re =new RegExp('^'+char+'*','g');
                break;
            case 'r':
                re =new RegExp(char+'*$','g');
                break;
            case 'lr':
            default:
                re =new RegExp('^'+char+'*','g');
                finalStr=str.replace(re,'');
                re =new RegExp(char+'*$','g');
                break;

        }
        finalStr=str.replace(re,"");
    }
    return finalStr;
}

/**
 * 将字符串中的每个单词首字母大写
 * @param str
 * @param ifOtherLower 如果除了首字母外其他字母有大写的话是否要转换为小写
 * @returns {string}
 */
function toUpperFirst(str,ifOtherLower=true){
    let arr=[],item;
    let reg=/(\w)(\w*\s*?)/g;
    while ((item=reg.exec(str))!==null){
        // console.log(item);
        arr.push(item[1].toUpperCase()+(ifOtherLower?item[2].toLowerCase():item[2]))
    }
    return arr.join(' ');
}

const onlyProto={proto:{add,sub,mul,div,isNumeric:isNumeric1,toFixedLenStr,toFloatStr,toFloat,toDate}};

const baseNormalFuncs={indexdWithNum,insertToIndex,getStrCount,toUpperFirst};
const baseProtoFuncs=_normalFuncToProtoFunc(baseNormalFuncs,'string');
const baseOnInvadeScale={funcs:baseNormalFuncs,proto:baseProtoFuncs};
// const baseOnInvadeScale={proto:{indexdWithNum,insertToIndex,getStrCount,toUpperFirst}};

const bothNormalFuncs={getSecStr,insertSpace,trimFunc};
const bothProtoFuncs=_normalFuncToProtoFunc(bothNormalFuncs,'string');
const both={proto:bothProtoFuncs,funcs:bothNormalFuncs};

export default {onlyProto,both,baseOnInvadeScale}