import CommonUtils from './CommonUtils';
const {isArray,isObj}=CommonUtils;

//检验手机号合理性
const isPhoneNum=(str)=>{
    let reg= /^1[3-8]\d{9}$/;
    // let reg= /^((0\d{2,3}-\d{7,8})|(1[3-8]\d{9}))$/; //座机不常用
    return reg.test(str);
};

//检验邮箱合理性
const isEmail=(str)=>{
    let reg=/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    return reg.test(str);
};

/**
 * 将对象中的key或数组中的元素符合指定的正则表达的放入到数组中,并返回
 * @param obj 传入的对象或数组
 * @param reg 传入的正则表达式
 * @returns {Array} 返回处理后的数组
 */
global.pushRegExpKeyToArr=function (obj,reg) {
    let arr=[];
    if(!isArray(obj)&&!isObj(obj)){return null}
    let keysArr=isArray(obj)?obj:Object.keys(obj);
    for (let i=0;i<keysArr.length;i++){
        let k=keysArr[i];
        if(reg.test(k)){
            arr.push(k);
        }
    }
    return arr;
};


// export default {isPhoneNum,isEmail,pushRegExpKeyToArr}
export default {normal:{funcs:{isPhoneNum,isEmail,pushRegExpKeyToArr}}}