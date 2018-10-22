import CommonUtils from '../CommonUtils';
const {numToFixedLenStr}=CommonUtils.normal.funcs;
import MathUtils from '../MathUtils';
const {accDiv,accMul,accAdd,accSub,dealWithFloatStr}=MathUtils;
import DateUtils from './DateUtils';
const {getDateObj}=DateUtils;

//因为方法中用到了this,所以不能使用箭头函数(因为箭头函数会自动绑定this)

//将MathUtils方法中的精确算术运算的这几个方法(accDiv,accMul,accAdd,accSub)加入到Number的原型链中(具体用法,看MathUtils中的方法介绍)
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

//将一个数字类型的值进行处理(保留小数后几位,舍去部分是四舍五入,还是向上/向下取整)(返回字符串形式时)(其中调用了MathUtils的dealWithFloatStr方法,参数含义与ealWithFloatStr方法中相同,参数的具体含义看MathUtils中的dealWithFloatStr方法)
const toFloatStr=function (toFixed=2,type='round') {
    return dealWithFloatStr(this,toFixed,type,'both',true);
};
//将一个数字类型的值进行处理(保留小数后几位,舍去部分是四舍五入,还是向上/向下取整)(返回数字类型时)(其中调用了MathUtils的dealWithFloatStr方法,参数含义与ealWithFloatStr方法中相同,参数的具体含义看MathUtils中的dealWithFloatStr方法)
const toFloat=function (toFixed=null,type='round') {
    return dealWithFloatStr(this,toFixed,type,'both',false);
};

//将DateUtils中的getDateObj方法加入Number的原型链中
const toDate=function () {
    return getDateObj(this);
};

export default {onlyProto:{proto:{div,mul,add,sub,toFixedLenStr,toFloatStr,toFloat,toDate}}};