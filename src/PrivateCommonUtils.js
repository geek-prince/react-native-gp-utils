import CommonUtils from './CommonUtils';
let {loop}=CommonUtils;

//baseOnInvadeScale,both类型的方法时,将为原型链准备的方法转换为普通方法的方法(这个方法在处理工具类中其他方法再次调用该方法时会有问题)
//定义原型链方法的时候最好使用function 方法名(){}或const 方法名=function(){}的形式,不然(比如以箭头函数定义时方法中的this就会被改成其他名字,比如_this3)不好转换
function _protoFuncToNormalFunc(protoFuncArr,utilsName) {
    let allFuncs={};
    //工具类名到应该给的参数名的映射
    const utilsNameToArgNameMap={
        'array':'arr',
        'string':'str',
        'date':'date',
    };
    const argName=utilsNameToArgNameMap[utilsName];
    //普通方法名称和原型链方法名不一样时的名字映射
    const funcNamesMap=protoFuncArr.funcNamesMap;
    loop(protoFuncArr,(k,v)=>{
        if(k==='funcNamesMap'){return}
        let funcStr=v.toString();
        let finalFuncStr;
        //将当前对象作为方法的第一个参数
        finalFuncStr=funcStr.replace(/function (.*?)\(/,(str,r1,index,input)=>{
            let funcName=funcNamesMap?(funcNamesMap[r1]||r1):r1;
            k=funcName;
            return ["function ",funcName,"("+argName,","].join('');
        });
        // finalFuncStr=funcStr.replace(/function(.*?)\(/,"function$1("+argName+",");
        //将原型链方法中本应该this调用的地方改为第一个参数的调用
        finalFuncStr=finalFuncStr.replace(/([^a-zA-Z]+)this([^a-zA-Z]+)/g,'$1'+argName+'$2');
        finalFuncStr=finalFuncStr.replace(/([^a-zA-Z]+)this/g,'$1'+argName);
        finalFuncStr=finalFuncStr.replace(/this([^a-zA-Z]+)/g,argName+'$1');
        // let finalFuncStr=funcStr.replace(/this/g,'arr').replace(/function(.*?)\(/,"function$1(arr,");
        //如果方法中有设置参数的默认值,要将其分别向后移一位
        finalFuncStr=finalFuncStr.replace(/(var .* = arguments\.length > )(\d)( && arguments\[)(\d)(] !== undefined \? arguments\[)(\d)(] : .*?;)/g,(str,r1,r2,r3,r4,r5,r6,r7,index,input)=>{
            let num=r2;num=parseInt(num)+1;
            return [r1,num,r3,num,r5,num,r7].join('');
        });
        let tmp;
        eval('tmp='+finalFuncStr);
        allFuncs[k]=tmp;
    });
    return allFuncs;
}

//baseOnInvadeScale,both类型的方法时,将普通方法转换为原型链对应的方法(用该方法时要转的普通方法中的回调函数不能用到this(即普通方法的第一个参数),不然这样出来的this就和预期的不一样了)
function _normalFuncToProtoFunc(normalFuncArr,utilsName) {
    let allProtoFuncs={};
    //工具类名到应该给的参数名的映射
    const utilsNameToArgNameMap={
        'array':'arr',
        'string':'str',
        'date':'date',
    };
    let argName=utilsNameToArgNameMap[utilsName];
    //普通方法名称和原型链方法名不一样时的名字映射
    const {funcNamesMap}=normalFuncArr;
    // 第一个参数和预置的不一样时的映射
    const {firstArgMap}=normalFuncArr;
    loop(normalFuncArr,(k,v)=>{
        if(k==='funcNamesMap'||k==='firstArgMap'){return} //如果是这两个特殊的值跳过本次循环进入下次循环
        let funcName=funcNamesMap?(funcNamesMap[k]||k):k; //处理方法名
        argName=firstArgMap?(firstArgMap[k]||argName):argName; //处理第一个参数名
        let funcStr=v.toString();
        let finalFuncStr;
        //将当前方法的第一个参数(即原型链中的this)删除
        finalFuncStr=funcStr.replace(new RegExp('function \(\.\*\?\)\\('+argName+',\?'),(str,r1,index,input)=>{
            k=funcName;
            return ["function ",funcName,"("].join('');
        });
        //将普通方法中本应该第一个参数调用的地方改为this参数的调用
        finalFuncStr=finalFuncStr.replace(new RegExp('\(\[\^a\-zA\-Z\]\+\)'+argName+'\(\[\^a\-zA\-Z\]\+\)','g'),'$1this$2');
        finalFuncStr=finalFuncStr.replace(new RegExp('\(\[\^a\-zA\-Z\]\+\)'+argName,'g'),'$1this');
        finalFuncStr=finalFuncStr.replace(new RegExp(argName+'\(\[\^a\-zA\-Z\]\+\)','g'),'this$1');
        //如果方法中有设置参数的默认值,要将其分别向前移一位
        finalFuncStr=finalFuncStr.replace(/(var .* = arguments\.length > )(\d)( && arguments\[)(\d)(] !== undefined \? arguments\[)(\d)(] : .*?;)/g,(str,r1,r2,r3,r4,r5,r6,r7,index,input)=>{
            let num=r2;num=parseInt(num)-1;
            return [r1,num,r3,num,r5,num,r7].join('');
        });
        let tmp;
        eval('tmp='+finalFuncStr);
        allProtoFuncs[k]=tmp;
    });
    return allProtoFuncs;
}

export default {_normalFuncToProtoFunc,_protoFuncToNormalFunc};