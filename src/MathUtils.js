import CommonUtils from './CommonUtils';
const {isNumber,isString,isNumeric}=CommonUtils.normal.funcs;

// js精确的加减乘除(js对浮点数的运算会存在问题,无论加减乘除,所以加入这些方法)
// 基本思路将浮点数转换为整数做加减乘除运算,运算后再根据需要加小数点的位置通过字符串的形式加上后,再转换为数字

// 取出两个参数的一些数值
function _dealWtihArgs(arg1, arg2) {
    let t1=0,t2=0,r1,r2;
    //获取参数1,参数2小数点后的位数
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    //去除参数1,参数2的小数点.(比如arg1位12,34,t1就为2,r1就为1234,这时刚好arg1*10^t1===r1)
    r1=Number(arg1.toString().replace(".",""));
    r2=Number(arg2.toString().replace(".",""));
    return {t1,t2,r1,r2};
}

// 精确除法函数，用来得到精确的除法结果(arg1除以arg2)
function accDiv(arg1,arg2){
    if(!isNumeric(arg1)||!isNumeric(arg2)){return NaN}
    let {t1,t2,r1,r2}=_dealWtihArgs(arg1,arg2);
    return accMul((r1/r2),Math.pow(10,t2-t1));
    // return (r1/r2)*Math.pow(10,t2-t1);
}

// 精确乘法函数，用来得到精确的乘法结果
function accMul(arg1,arg2){
    if(!isNumeric(arg1)||!isNumeric(arg2)){return NaN}
    let {t1,t2,r1,r2}=_dealWtihArgs(arg1,arg2);
    return (r1*r2)/Math.pow(10,t2+t1);
}

// 精确加法函数，用来得到精确的加法结果
function accAdd(arg1,arg2){
    if(!isNumeric(arg1)||!isNumeric(arg2)){return NaN}
    let {t1,t2}=_dealWtihArgs(arg1,arg2);
    let n=Math.max(t1,t2),m=Math.pow(10,n);
    return Number(((parseInt(arg1*m)+parseInt(arg2*m))/m).toFixed(n));
}

// 精确减法函数，用来得到精确的减法结果(arg1-arg2)
function accSub(arg1,arg2){
    if(!isNumeric(arg1)||!isNumeric(arg2)){return NaN}
    let {t1,t2}=_dealWtihArgs(arg1,arg2);
    let n=Math.max(t1,t2),m=Math.pow(10,n);
    return Number(((parseInt(arg1*m)-parseInt(arg2*m))/m).toFixed(n));
}

/**
 * 将一个字符串类型的数字(或数字类型的值)进行处理(保留小数后几位,舍去部分是四舍五入,还是向上/向下取整)
 * @param strNum 要处理的字符串类型的数字(或数字类型的值)
 * @param toFixed 要保留的小数位数. 0为不保留小数只取整数,null时为保持原有小数位数
 * @param type 是四舍五入,还是向上/向下取整. 'round'为四舍五入,'up'/'ceil'为向上取整,'sub'/'floor'为向下取整.  向上/向下取整同时适用于小数 dealWithFloatStr('1321.123459',5,'sub') 执行后"1321.12345"
 * @param inputType 输入的类型可以为什么. 'both'时数字或数字字符串都会进行处理,'num'时只会处理数字,'str'时只会处理数字字符串
 * @param returnType 返回类型为什么. true时为字符串,false时为数字类型
 * @returns {*}
 */
function dealWithFloatStr(strNum,toFixed=2,type='round',inputType='both',returnType=true){
    if(!isNumber(strNum)&&!isString(strNum)){return strNum}
    if(!isNumeric(strNum,null)){
        return strNum;
    }else {
        switch (inputType){
            case 'both':break;
            case 'num':if(!isNumber(strNum)){return strNum}break;
            case 'str':if(isNumber(strNum)){return strNum}break;
        }
        let strArr=[];
        let num=Number(strNum);
        let getDLen=(strNum)=>{
            let reg=/^-?\d*\.?(\d*)?$/;
            reg.exec(strNum);
            let decimal=RegExp.$1;
            return decimal.length;
        };
        let dLen=getDLen(strNum);
        if(dLen){//有小数的情况
            if(toFixed===null){
                strArr.push(strNum);
            }else if(toFixed>=dLen){//要保留的小数位数大于等于当前小数位数的情况
                strArr.push(strNum);
                for (let i=0;i<toFixed-dLen;i++){
                    strArr.push('0');
                }
            }else {//要保留的小数位数小于当前小数位数的情况
                num=accMul(num,Math.pow(10,toFixed));
                // num=num.mul(10**toFixed); //rn中用**这个写法会报错(大概报错内容为:无法识别'*'这个符号)
                num=type==='round'?Math.round(num):['up','ceil'].includes(type)?Math.ceil(num):['sub','floor'].includes(type)?Math.floor(num):Math.round(num);
                num=accDiv(num,Math.pow(10,toFixed))+'';
                let dLen=getDLen(num);
                !dLen&&(num+='.');
                strArr=[num];
                for (let i=0;i<toFixed-dLen;i++){
                    strArr.push('0');
                }
            }
        }else {//没有小数的情况
            if(toFixed&&isNumber(toFixed)){
                strArr.push(strNum);
                strArr.push('.');
                for (let i=0;i<toFixed;i++){
                    strArr.push('0');
                }
            }else {
                strArr.push(strNum);
            }
        }
        let finalStrNum=strArr.join('');
        return returnType?finalStrNum:Number(finalStrNum);
    }
}

// export default {accDiv,accMul,accAdd,accSub,dealWithFloatStr}
export default {normal:{funcs:{accDiv,accMul,accAdd,accSub,dealWithFloatStr}}}