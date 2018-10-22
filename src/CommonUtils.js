//对obj对象调用Object最原始的toString方法
const toStr=(obj)=>{
    return Object.prototype.toString.call(obj);
};

//判断当前数据的类型
//是数字或者是数字对象时当算作数字
const isNumber=(obj)=>{return typeof obj==='number'||toStr(obj)==='[object Number]';};
//是字符串或者是字符串对象时当算作字符串
const isString=(obj)=>{return typeof obj==='string'||toStr(obj)==='[object String]';};
const isBool=(obj)=>{return typeof obj==='boolean'};
const isArray=(obj)=>{return Array.isArray(obj)};
const isObj=(obj)=>{return toStr(obj)==='[object Object]'};
const isDate=(obj)=>{return toStr(obj)==='[object Date]'};
const isRegExp=(obj)=>{return toStr(obj)==='[object RegExp]'};


//获得一个与原对象/原数组内容相同的全新的对象/数组(在对象和数组的原型链中也加入这两个方法)
//这个方法比较可靠
const getNewObj=(obj)=>{
    let newObj=JSON.parse(JSON.stringify(obj));
    return isDate(obj)?new Date(newObj):newObj;
};
//这个方法在数组/对象中在嵌套数组/对象时就不行了
// const getNewObj1=function (obj) {
//     if(!isArray(obj)&&!isObj(obj)){return obj}
//     if(Array.isArray(obj)){
//         return [...obj]
//     }else {
//         return {...obj};
//     }
// };

/**
 * 对数组,对象,指定范围for循环的统一循环方法.
 *      指定范围循环时: loop(10,(i)=>{console.log(i)}) (数字(num)为10时,i的值为0到9(num-1))
 *      循环数组时: let arr=[1,2,3,4,5,6,7];loop(arr,(i)=>{console.log(i,arr[i])})
 *      循环对象时: let obj={a:10,b:20,c:30};loop(obj,(k,v)=>{console.log(k,v)})
 * @param obj 要循环的数组,对象,指定范围的数字
 * @param callBack 循环要做的方法
 */
const loop=(obj,callBack)=>{
    if(!isNumber(obj)&&!isArray(obj)&&!isObj(obj)){return}
    if(isNumber(obj)||isArray(obj)){
        let len=isArray(obj)?obj.length:obj;
        for (let i=0;i<len;i++){
            let result=isArray(obj)?callBack(i,obj[i]):callBack(i);
            if(result!==undefined){return result}
        }
    }else{
        for(let k in obj){
            let v=obj[k];
            let result=callBack(k,v);
            if(result!==undefined){return result}
        }
    }
};

/**
 * 根据传入的参数返回布尔值
 *          自动转布尔值的情况:0,NaN,null,undefined,''为false,其他情况为true
 *          该方法将空数组[],空对象{},数值为0的字符串'0',空白字符串'  ',也列入false中
 * @param obj
 * @returns {boolean}
 */
const getBool=(obj)=>{
    if(isObj(obj)){let keyArr = Object.keys(obj);return !!keyArr.length}
    if(isArray(obj)){return !!obj.length}
    if(isString(obj)){
        let reg=/^\s*$/;
        let reg1=/^\s*0*(\.0*)?\s*$/;
        if(reg.test(obj)||reg1.test(obj)){return false}
    }
    return !!obj;
};

// 获取当前调用方法的方法名(调用时getFuncName(arguments))
const getFuncName=(args)=>{
    return args.callee.name;
};

/**
 * 判断传入参数是不是一个数字或一个字符串类型的数字(1 '37' 1.73 '21.43')(还可以指定判断小数点后可以最多有多少位)(这个方法可以用在用户在输入框TextInput中输入数字之后)
 * @param strNum 传入的要判断的参数(数字,字符串)
 * @param maxDecimalNum 如果要限制最多小数位数时传入的最多位数的数字(如果传入的参数strNum的小数位数超过toFixed给定的值就返回false,没超过返回true),0时限制为只能是整数,null时为无限制(只要是数字就行)(默认为null)
 * @param ifTrim 判断时是否忽略左右空格(默认为true,忽略)
 * @param positive 是否限制只能为正数(默认为false,正负数都可以)
 * @returns {boolean} 返回当前是不是字符串类型的数字的布尔值
 */
const isNumeric=(strNum,maxDecimalNum=null,ifTrim=true,positive=false)=>{
    if(!isNumber(strNum)&&!isString(strNum)){return strNum}
    // let reg=/^-?\d*(\.?\d*)?$/;
    if(isNumber(strNum)){return true}
    let regStr=[];
    regStr.push('\^');
    ifTrim&&regStr.push('\\s\*');
    !positive&&regStr.push('-');
    regStr.push('\?\\d\*');
    regStr.push('(\\.\?\\d'+(maxDecimalNum!==null?('\{0,'+maxDecimalNum+'\}'):'\*')+')'+(maxDecimalNum!==0?'\?':'\{0\}'));
    ifTrim&&regStr.push('\\s\*');
    regStr.push('\$');
    let reg=new RegExp(regStr.join(''));
    return reg.test(strNum);
};


/**
 * 将数字或字符串类型的数字前面加上'0'或指定的字符,到达指定的长度,并返回字符串
 * @param num 要转化的数字或字符串类型的数字
 * @param len 最后输出的字符串的长度(默认为2)
 * @param char 指定填充数字前面的字符为什么,默认为"0"
 * @returns {*}
 */
function numToFixedLenStr(num,len=2,char='0'){
    num+='';
    let numLen=num.length;
    if(numLen>=len){
        return num;
    }else {
        let charLen=len-numLen;
        let charStr=new Array(charLen+1).join(char);
        return charStr+num;
    }
}

// export default {toStr,isNumber,isString,isBool,isArray,isObj,isDate,isRegExp,getNewObj,loop,getBool,getFuncName,isNumeric,numToFixedLenStr};
export default {normal:{funcs:{toStr,isNumber,isString,isBool,isArray,isObj,isDate,isRegExp,getNewObj,loop,getBool,getFuncName,isNumeric,numToFixedLenStr}}};