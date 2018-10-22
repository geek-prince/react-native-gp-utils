import CommonUtils from './CommonUtils';
const {isNumber,loop}=CommonUtils.normal.funcs;
import ArrayUtils from './BuiltInObjectUtils/ArrayUtils';
const {sum:arrSum}=ArrayUtils.baseOnInvadeScale.funcs;

//获得随机数(没有传num1和num2时,生成一个0-1的随机数,只有num1的时候生成一个0-num1的int整形数,num1,num2都有时生成一个num1-num2的int整形随机数)
const getRandom=(num1,num2)=>{
    if(num1!==undefined){
        if(!isNumber(num1)||(num2&&!isNumber(num2))){return Math.random()}
        if(num2){
            return Math.floor(num1+(Math.random()*(num2-num1+1)))
        }else {
            return Math.floor(Math.random()*(num1+1))
        }
    }else {
        return Math.random()
    }
};

//获得随机数(字符串形式)
const getRandomNumStr=(num1,num2)=>{
    return String(getRandom(num1,num2));
};

//从数组中获得随机的数组元素
const getRandomFromArr=(arr)=>{
    return arr[Math.floor(getRandom(arr.length-1))];
};

/**
 * 从数组中获得随机的数组元素(带有比重的)
 * @param arr 要从中随机元素的数组
 * @param weightArr 指定比重的数组(该数组元素个数应该与arr中的元素个数相同,而且每个元素都是int类型)
 * @returns {*} 返回随机到的元素
 */
const getRandomFromArrWithWeight=(arr,weightArr)=>{
    let allWeight=arrSum(weightArr);
    let randomNum=getRandom(1,allWeight);
    let sum=0;
    return loop (weightArr,(i)=>{
        sum+=weightArr[i];
        if(randomNum<=sum){
            return arr[i];
        }
    });
};

/**
 * 获取指定个数的随机字符串
 * @param num 生成随机字符串的个数
 * @param type 指定生成随机字符串的类型.'num':只有数字,'char':只有字母,'lowChar':只有小写字母,'upChar':只有大写字母,'all':字母数字都有
 * @param ifEq 如果type为"all"时,字母出现概率和数字出现概率是否要一致
 * @returns {string} 返回获取到的随机的字符串
 */
const getRandomStr=(num=4,type='all',ifEq=true)=>{
    let str='1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let strArr=[];
    for (let i=0;i<num;i++){
        let minNum=0;
        let maxNum=str.length-1;
        type==='num'&&(maxNum=10-1);
        type==='char'&&(minNum=10);
        type==='upChar'&&(minNum=36);
        type==='lowChar'&&(minNum=10,maxNum=35);
        type==='all'&&ifEq&&(getRandom(1)?maxNum=10-1:minNum=10);
        strArr.push(str[getRandom(minNum,maxNum)]);
    }
    return strArr.join('');
};

//获取随机电话号码
const getRandomPhone=()=>{
    let arr=[130,131,132,133,134,135,136,137,138,139,147,150,151,152,153,155,156,157,158,159,186,187,188];
    return getRandomFromArr(arr)+getRandomStr(8,'num');
};



// export default {getRandom,getRandomNumStr,getRandomFromArr,getRandomFromArrWithWeight,getRandomStr,getRandomPhone};
export default {normal:{funcs:{getRandom,getRandomNumStr,getRandomFromArr,getRandomFromArrWithWeight,getRandomStr,getRandomPhone}}};