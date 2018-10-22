import CommonUtils from '../CommonUtils';
const {isArray,isObj,isNumber,isBool,loop,isString}=CommonUtils.normal.funcs;
import ArrayAndObjectCommonUtils from './ArrayAndObjectCommonUtils';
const {_eachToFloatCom}=ArrayAndObjectCommonUtils;

//详情看ArrayAndObjectCommonUtils中的_eachToFloatCom方法
const objEachToFloat=function(obj,args={}){
    return _eachToFloatCom(obj,args);
};

/**
 * 用于获得obj对象中子对象中的子对象...的值
 *{
 *  比如要获得obj.class.people.name的值:
 *  方法1: getSubObj(obj,['class','people','name']),或者let a='class',b='people',c='name';getSubObj(obj,[a,b,c]);   这种方法通常在子对象键名根据变量改变时的情况,使用后面这种形式调用
 *  方法2: getSubObj(obj,'class.people.name')     这种方式通常用在子对象键名确定的情况
 * }
 * 但是有的时候我们不知道对应的位置是否存在数据(比如obj下面可能不存在class对象)这时直接(obj.class.people.name)这样取的话就会报错,这个方法会顺着obj对象的子对象一层一层向下找,只要没有对应的对象就返回null
 * @param obj obj对象
 * @param subObjDatas 要取的是哪个子对象
 * @param empty 子对象不存在时返回什么,默认为null
 * @returns {*} 取到值的话返回该值,没有取到则返回null
 */
function getSubObj(obj,subObjDatas,empty=null){
    if(isObj(obj)){
        let func=(subObjArr)=>{
            for (let i=0;i<subObjArr.length;i++){
                if(obj[subObjArr[i]]){obj=obj[subObjArr[i]]}else {return empty}
            }
            return obj;
        };
        if(isArray(subObjDatas)){
            return func(subObjDatas);
        }else if(isString(subObjDatas)){
            let subObjArr=subObjDatas.split('.');
            return func(subObjArr);
        }else {
            return empty;
        }
    }else {
        return empty;
    }
}

/**
 * 将对象/数组类型的数据转换为字符串(左边键部分不加引号,右边正常的形式)(要传入的字符串不加引号时,则在传入的字符串形参两边加上*,例如'*CONST*')
 * @param obj 传入的对象或数组
 * @param ifNull true时只有键的值为undefined或者null时这组键值才不被放入字符串中;false时,0,''等都不放入
 * @param num 用于记录递归调用的第几层,也可以在调用时手动给出指定的值作为最后的缩进
 * @returns string 返回拼接好的字符串
 */
function gqlObjToString(obj,ifNull=false,num=0) {
    if(!(isObj(obj)||isArray(obj))){return ''}
    let objIsObj=isObj(obj);
    let str;
    let strArr=[];
    //对键值的值(number,string,bool)的处理
    let dealWithValue=(value)=>{
        if(isNumber(value)||isBool(value)){return value}
        if(isString(value)){if(/^\*(.*)\*$/.exec(value)){let a=RegExp.$1;if(a){return a}}else {return '"'+value+'"'}}
    };
    let dealWithItem=(item)=>{
        if(isObj(item)||isArray(item)){
            let num1=num+1;
            item=gqlObjToString(item,ifNull,num1);
            strArr.push(item);
        }else {
            strArr.push(dealWithValue(item));
        }
        strArr.push('\n');
    };
    let pushTab=(num)=>{
        for (let i=0;i<num;i++){
            strArr.push('\t');
        }
    };
    let leftC,rightC;
    if(objIsObj){leftC='{';rightC='}'}else {leftC='[';rightC=']'}
    strArr.push(leftC+'\n');
    if(objIsObj){
        for(let k in obj){
            let item=obj[k];
            if(ifNull){if(item===null||item===undefined){continue}}else {if(!item){continue}}
            pushTab(num+1);
            strArr.push(k);
            strArr.push(':');
            dealWithItem(item);
        }
    }else {
        for (let i=0;i<obj.length;i++){
            let item=obj[i];
            pushTab(num+1);
            dealWithItem(item)
        }
    }
    pushTab(num);
    strArr.push(rightC);
    str=strArr.join('');
    return str;
}

/**
 * 递归遍历对象中的每一个键值(k:v)数据,把子对象(值value为对象)中的键值数据都放到最外层父对象(传入的这个obj对象)中.
 * 如果传入的是一个数组,则遍历该数组,对其中的每一个对象元素进行该操作.
 * 该方法主要用于对象嵌套比较复杂,希望把键值都抽取出来到最外层的情况
 * @param obj 要处理的对象(下面说到的父对象就是传入的这个obj)
 * @param dealWithSameSubKey 如果遇到子对象中有键(key)与父对象中的键重复时的操作.
 *                              1. "sub":为以子对象为主(子对象数据覆盖父对象的),
 *                              2. "sup":为以父对象为主(子对象数据直接忽略,跳过),
 *                              3. "both":为都保留.
 *                                  比如子对象"test"下的key:"name"命名为"test_name"(多个子对象下有相同key,或父对象中有该key时会这样命名)
 *                                  如果在如有子对象中该键名唯一则直接命名为该键名. 比如let obj={bcd:2,cde:{test:'234'}};subObjDataToObj(obj) 这时结果为{bcd: 2, test: "234"}. 此时要在想让键名为"cde_test"这样的形式时,可在allNameKeyArr中加入该键名.
 * @param separator 第二个参数dealWithSameSubKey值为"both"时子对象名与key之间的分隔符,默认为"_"
 * @param allNameKeyArr 除重复键名外,需要显示键名全路径的键名
 *                      不传值时,如果一个子对象中有这个键,而且这个键名唯一,这个键名会被直接用在父对象上. 比如let obj={bcd:2,cde:{test:'234'}};subObjDataToObj(obj) 这时结果为{bcd: 2, test: "234"}
 *                      手动传入值时,子对象中与sameKeyArr数组中键相同的键名不管父对象中有没有该键名. 比如let obj={bcd:2,cde:{test:'234'}};subObjDataToObj(obj,'both','_',[],['test']) 这时结果为{bcd: 2, cde_test: "234"} (这通常用在有两个或多个子对象中有相同的键名,但是父对象中没有,而且这些子对象中的这些键名还可能只存在其中一个的情况)
 * @param supKeyArr 用于递归调用时记录向上每层父对象的key的数组(调用时不要手动传入) 这样的话obj.a.b.c就会转换为obj_a_b_c,如果手动传入null/false则返回b_c
 * @param sameKeyArr 用于递归调用时传递相同重复键名的数组(调用时不用手动传,也可手动传入).给了这个值之后allNameKeyArr值就无效了.
 * @returns {*} 返回处理好的对象
 */
//obj1={a:{test:123},b:{c:{test:456}},d:{c:{test:789}},e:{f:{test:135}}};subObjDataToObj(obj1,'both','_',null,null)时(即supKeyArr为null时会有问题)
function subObjDataToObj(obj,dealWithSameSubKey='both',separator='_',allNameKeyArr=null,supKeyArr=[],sameKeyArr=null){
    if(!isObj(obj)&&!isArray(obj)){return obj}
    if(isArray(obj)){
        for (let i=0;i<obj.length;i++){
            obj[i]=subObjDataToObj(obj[i],dealWithSameSubKey,separator,allNameKeyArr,supKeyArr,sameKeyArr);
        }
        return obj;
    }
    if(!getBool(sameKeyArr)){
    // if(!sameKeyArr){
        let objKeyArr=[];sameKeyArr=[];
        let getSameKeyArr=(obj)=>{
            let elseFunc=(k)=>{if(objKeyArr.includes(k)){!sameKeyArr[k]&&sameKeyArr.push(k)}else {objKeyArr.push(k)}};
            for (let k in obj){
                if(isObj(obj[k])){
                    let obj1=obj[k];
                    for (let k1 in obj1){
                        if(isObj(obj1[k1])){
                            getSameKeyArr(obj1[k1]);
                        }else {
                            elseFunc(k1);
                            // if(objKeyArr.includes(k1)){!sameKeyArr[k1]&&sameKeyArr.push(k1)}else {objKeyArr.push(k1)}
                        }
                    }
                }else {
                    elseFunc(k);
                    // objKeyArr.push(k);
                }
            }
        };
        getSameKeyArr(obj);
        allNameKeyArr&&loop(allNameKeyArr,(i)=>{
            !sameKeyArr.includes(allNameKeyArr[i])&&(sameKeyArr.push(allNameKeyArr[i]));
        })
    }
    let finalObj={};
    let dwssk=dealWithSameSubKey,sep=separator,ska=sameKeyArr,pka=supKeyArr;
    for (let k in obj){
        if(isObj(obj[k])){//key的值为对象的情况,递归执行该方法
            let pkarg=pka?[...pka,k]:pka;
            let subObj=subObjDataToObj(obj[k],dwssk,sep,null,pkarg,ska);
            switch (dwssk){
                case 'sub':finalObj={...finalObj,...subObj};break;
                case 'sup':finalObj={...subObj,...finalObj};break;
                case 'both':
                    for(let k1 in subObj){
                        let isExist=sameKeyArr.includes(k1),supKeyStr='';
                        if(pka){if(!!pka.length){for (let i=0;i<pka.length;i++){supKeyStr+=pka[i]+sep;}}}
                        if(isExist){finalObj[supKeyStr+k+sep+k1]=subObj[k1]}else {finalObj[k1]=subObj[k1]}
                    }
                    break;
            }
        }else {
            switch (dwssk){
                case 'both':
                case 'sup':
                    finalObj[k]=obj[k];break;
                case 'sub':
                    finalObj[k]?null:(finalObj[k]=obj[k]);
                    break;
            }
        }
    }
    return finalObj;
}

export default {normal:{funcs:{objEachToFloat,getSubObj,gqlObjToString,subObjDataToObj}}}
// export default {objEachToFloat,getSubObj,gqlObjToString,subObjDataToObj}