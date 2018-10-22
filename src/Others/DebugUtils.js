import CommonUtils from '../CommonUtils';
const {loop,getFuncName}=CommonUtils.normal.funcs;
import RandomUtils from '../RandomUtils';
const {getRandom,getRandomStr,getRandomFromArr,getRandomFromArrWithWeight,getRandomPhone}=RandomUtils.normal.funcs;
import StringUtils from '../BuiltInObjectUtils/StringUtils';
const {toUpperFirst}=StringUtils.baseOnInvadeScale.proto;

/**
 * 获取当前调用方法的方法名,并打印(调用时logFuncName(arguments))
 * @param args 要打印方法名的方法的arguments
 * @param otherStr 另外要打印到一起的字符串
 * @param char 在方法名的左右用什么符号来标记,默认为'-',给出空字符串时不要左右的字符
 * @param num 左右各多少个char字符
 */
const logFuncName=(args,otherStr='',char='*',num=35)=>{
    let str=new Array(num+1).join(char);
    console.log((otherStr&&(str+otherStr))+str+getFuncName(args)+str);
};

/**
 * 返回一串随机的乱数假文(就和在webStorm或其他一些支持该功能的IDE中写lorem后Tab键一样)
 * @param wordCount 要生成的假文单词数目.(默认为30)
 * @returns {string}
 */
function getLorem(wordCount=30){
    let finalArr=['Lorem','ipsum','dolor','sit','amet,','consectetur','adipisicing','elit.'];
    if(wordCount<=8){
        finalArr=finalArr.slice(0,wordCount);
    }else {
        const loopCount=wordCount-8;
        // 记录当前随机到的标点符号是不是句号
        let isFinalChar=true;
        loop(loopCount,()=>{
            let randomNum=getRandom(3,13);
            let charArr=['',',','.'],charWightArr=[7,1,1];
            let char=getRandomFromArrWithWeight(charArr,charWightArr);
            let randomStr=getRandomStr(randomNum,'lowChar')+char;
            isFinalChar&&(randomStr=toUpperFirst.call(randomStr));
            finalArr.push(randomStr);
            isFinalChar=char==='.';
        });
        let finalCharArr=['.','?','!'];
        finalArr[finalArr.length-1]=finalArr[finalArr.length-1]+getRandomFromArr(finalCharArr);
    }
    return finalArr.join(' ');
}

/**
 * 模拟网络获取数据方法
 * @param pageLen 获得数据的每一页的数据条数(默认20条)
 * @param page 获得数据的页数(默认第1页)
 * @param ms 模拟多少毫秒后可以获得网络传输的数据(默认3000毫秒:即3秒)
 * @param max 模拟数据库中总共有多少条数据(默认最多100条,这时如果每页20条,第5页有数据,第6页就没有数据了)
 * @returns {Promise}
 */
function getDataFromNetTest(pageLen=20,page=1,ms=3000,max=100){
    let res={status:200};
    let arr=[];
    let startNum=pageLen*(page-1);
    if(startNum>=max){

    }else {
        for (let i=1;i<=pageLen;i++){
            let index=startNum+i;
            let a={
                index:(index+100000+'').slice(1),
                name:toUpperFirst.call(getRandomStr(getRandom(5,9),'char')),
                age:getRandom(18,99),
                phone:getRandomPhone(),
                text:(index+100000+'').slice(1)+'.'+getLorem(),
            };
            arr.push(a);
            if(index>=max)break;
        }
    }
    res.arr=arr;
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve(res)},ms);
    });
}



export default {normal:{funcs:{getLorem,logFuncName,getDataFromNetTest}}}
// export default {onlyProto:{proto:{getLorem,logFuncName,getDataFromNetTest}}}