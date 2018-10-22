import ComFuncGlobal from '../CommonUtils';
const {loop,isString,isNumber,isArray,isObj}=ComFuncGlobal.normal.funcs;
import MathUtils from '../MathUtils';
const {dealWithFloatStr}=MathUtils.normal.funcs;

/**
 * 将数组内的所有数字或数字字符串转换为指定小数位数的数字或数字字符串(调用dealWithFloatStr方法)
 * @param arrOrObj 传入的数组或对象
 * @param args 以对象的方式传入可选参数:
 *              ifChangeArr 表示是否直接改变原数组(默认为ture,改变)
 *              ifRecursion 表示是否递归(是否将数组中的数组/对象也进行该方法的调用)(默认为true)
 *              toFixed 保留小数点后几位(与dealWithFloatStr方法中一样)(默认为2)
 *              type 四舍五入,还是向上/向下取整(与dealWithFloatStr方法中一样)(默认为'round',四舍五入)
 *              inputType 要进行处理操作的类型.'both'时数字或数字字符串都会进行处理;'num'时只会处理数字;'str'时只会处理数字字符串.(与dealWithFloatStr方法中一样)(默认为'both',都进行处理)
 *              outputType 处理后返回的类型.'origin'时保持原类型,输入是数字返回就是数字,输入是字符串,返回就是字符串;'num'时不管是数字还是字符串类型的数字都会转换为数字;'str'时不管是数字还是字符串类型的数字都会转换为字符串类型的数字.(默认为''origin,保持原类型)
 * @returns {*}
 */
// const eachToFloat=function(arrOrObj,ifChangeArr=true,ifRecursion=true,toFixed=2,type='round',inputType='both',outputType='origin') {
const _eachToFloatCom=function(arrOrObj,args={}){
    //recursions记录递归层数
    let defaultArgs={ifChangeArr:true,ifRecursion:true,toFixed:2,type:'round',inputType:'both',outputType:'origin',recursions:0};
    args={...defaultArgs,...args};
    let {ifChangeArr,ifRecursion,toFixed,type,inputType,outputType,recursions}=args;
    let finalArrOrObj;
    isObj(arrOrObj)?(finalArrOrObj={}):(finalArrOrObj=[]);
    loop(arrOrObj,(i,k)=>{
        let result;
        if((isObj(k)||isArray(k))){
            !!ifRecursion?
                (result=_eachToFloatCom(k,{ifChangeArr,ifRecursion,toFixed,type,inputType,outputType,recursions:recursions+1})):
                (result=k);
        }else {
            if(isString(k)){
                let ot=outputType==='origin'?true:outputType==='num'?false:outputType==='str'?true:true;
                result=dealWithFloatStr(k,toFixed,type,inputType,ot);
            }else  if(isNumber(k)){
                let ot=outputType==='origin'?false:outputType==='num'?false:outputType==='str';
                result=dealWithFloatStr(k,toFixed,type,inputType,ot);
            }else {
                result=k;
            }
        }
        isObj(arrOrObj)?(finalArrOrObj[i]=result):(ifChangeArr&&!recursions?(arrOrObj[i]=result):finalArrOrObj.push(result));
    });
    return finalArrOrObj;
};

export default {_eachToFloatCom};