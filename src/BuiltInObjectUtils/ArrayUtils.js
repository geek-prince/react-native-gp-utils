import ComFuncGlobal from '../CommonUtils';
const {loop,isNumeric,getNewObj}=ComFuncGlobal.normal.funcs;

/*
    以这种方式导入的原因是,
        原因:如果只是像普通的那样import导入的话,该方法的执行还是会在PrivateCommonUtils文件的空间中进行,
            比如下面有方法用到该文件中导入的_eachToFloatCom方法,如果像正常方式导入的话,在调用该转换后的代码时会显示_eachToFloatCom方法找不到,这是因为该方法转换是在PrivateCommonUtils文件中进行的,所以该方法就定义在了该文件的空间中,该文件空间中有没有导入该方法,所以就找不到了.
            再比如下面有用到...展开表达式,(下面是自己推测的可能原因,不保证完全正确),而这个方法是es6的写法,babel要对其进行转换后才能使用,而...转换需要用到他其中的一个私有方法_toConsumableArray,只要在文件中有地方用到了这个...展开表达式就会导入该方法,而PrivateCommonUtils文件中并没有任何一个地方用到该表达式,所以报错_toConsumableArray is not defined.
        解决方法:
            正常导入引用的是文件中对应的方法,方法的执行空间还是在哪个文件中.所以就考虑在该文件中在新建一个与之一样的方法,这样这个新建的方法的执行空间就变成了本文件了.
            新建一个方法的方法:JSON.parse(JSON.stringify(obj))这个方法只是适用于对象,数组,字符串,数字,布尔值.新建一个全新的方法应该使用eval(_ntop.toString());_ntop是引用该对象的变量名._ntop.toString()结果为function _normalFuncToProtoFunc(省略后面),可以看到方法名在其中,而并非_ntop是方法名,他只是引用方法的变量名(这里写成了const,那就是常量名了,这不是重点).所以这也是导入时要为_normalFuncToProtoFunc起别名的原因,因为不起别名下面eval执行时方法名就与变量名重复了,就执行失败了.
 */
import PrivateCommonUtils from '../PrivateCommonUtils';
const {_normalFuncToProtoFunc:_ntop}=PrivateCommonUtils;
// const {_normalFuncToProtoFunc:_ntop,_protoFuncToNormalFunc:_pton}=PrivateCommonUtils;
eval(_ntop.toString());

import ArrayAndObjectCommonUtils from './ArrayAndObjectCommonUtils';
const {_eachToFloatCom}=ArrayAndObjectCommonUtils;

//因为方法中用到了this,所以不能使用箭头函数(因为箭头函数会自动绑定this)

/**
 * 为array数组增加查看元素是否在数组中的方法
 * @param arr
 * @param value 要检查是否存在的元素
 * @param allEqual 是否全等.true时为必须全等===,false为==.(默认为true)
 * @returns {boolean} 返回布尔值,表示是否存在指定元素
 */
const contains=function(arr,value,allEqual=true){
    return !!loop(arr,(i,v)=>{
        if (allEqual?(v===value):(v==value)) {
            return true;
        }
    });
};

/**
 * 为array数组增加从数组中删除指定元素的方法
 * @param arr
 * @param value 要删除的元素
 * @param allEqual 是否要全等的元素才删除.true时为必须全等===,false为==.(默认为true)
 * @param deleteAll 是否要删除指定的全部元素.true时为全部删除,false时为只删除第一个(默认为true)
 * @returns {*} 数组的元素会被删除,方法返回值也就是这个删除过元素的数组
 */
const deleteValue=function(arr,value,allEqual=true,deleteAll=true){
    let localArr=arr;//解决方法转换问题
    let findNum=0;
    loop(localArr,(i)=>{
        let ii=i-findNum;
        if(allEqual?(localArr[ii]===value):(localArr[ii]==value)){
            localArr.splice(ii,1);
            if(!deleteAll){return 'finish'}
            findNum+=1;
        }
    });
    return localArr;
};

//splice指定索引的一个元素,并返回这个元素(而不是数组)
const spliceOne=function(arr,index) {
    return arr.splice(index,1)[0];
};

//求出数组中所有元素和的方法(数组中的元素必须全部是数字或字符串类型的数字,否则返回NaN)
const sum=function(arr){
    let localArr=arr; //解决方法转换问题
    let sumNum=0;
    let loopResult=loop(localArr,(i,v)=>{
        let num=v;
        if(!isNumeric(num)){return 'error'}
        num=parseFloat(num);
        sumNum+=num;
    });
    return !!loopResult?NaN:sumNum;
};

//移动数组中元素的几个方法
//把数组中指定位置的元素移动到最前面去
const unshiftFromIndex=function(arr,index) {
    if(index>=arr.length||index<0){return arr}
    arr.unshift(arr.splice(index,1)[0]);
    return arr;
};
//把数组中指定位置的元素移动到最后面去
const pushFromIndex=function(arr,index) {
    if(index>=arr.length||index<0){return arr}
    arr.push(arr.splice(index,1)[0]);
    return arr;
};
//把数组中指定位置的元素移动到指定位置去
// function moveToIndexFromIndex(arr,fromIndex,toIndex) {
const moveToIndexFromIndex=function(arr,fromIndex,toIndex) {
    if((fromIndex>=arr.length||fromIndex<0)||(toIndex>=arr.length||toIndex<0)){return arr}
    let moveData=arr.splice(fromIndex,1)[0],beforeArr=arr.splice(0,toIndex);
    // arr.unshift(moveData);arr.unshift.apply(arr,beforeArr);
    arr.unshift(moveData);arr.unshift(...beforeArr); //...在方法转换后会出问题,(_toConsumableArray is not defined).找到问题原因与,解决方法,在该文件的最顶部
    return arr;
};

//把当前数组深拷贝一份并返回
const deepCopy=function(arr) {
    return getNewObj(arr);
};
// const deepCopy1=function () {
//     return getNewObj1(this);
// };

//详情看ArrayAndObjectCommonUtils中的_eachToFloatCom方法
const eachToFloat=function (arr,args={}) {
    return _eachToFloatCom(arr,args);
};

const allFuncs={contains,deleteValue,spliceOne,sum,unshiftFromIndex,pushFromIndex,moveToIndexFromIndex,deepCopy,eachToFloat};
const allProtoFuncs=_normalFuncToProtoFunc(allFuncs,'array');
// const allProtoFuncs={contains,deleteValue,spliceOne,sum,unshiftFromIndex,pushFromIndex,moveToIndexFromIndex,deepCopy,eachToFloat};
// const allFuncs=_protoFuncToNormalFunc(allProtoFuncs,'array');

export default {baseOnInvadeScale:{proto:allProtoFuncs,funcs:allFuncs}};