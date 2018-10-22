import CommonUtils from './CommonUtils';
import MathUtils from './MathUtils';
import RNUtils from './RNUtils';
import ConfigUtils from './ConfigUtils';
import RegExpUtils from './RegExpUtils';
import RandomUtils from './RandomUtils';
// 内建对象部分
import ArrayUtils from './BuiltInObjectUtils/ArrayUtils';
import DateUtils from './BuiltInObjectUtils/DateUtils';
import NumberUtils from './BuiltInObjectUtils/NumberUtils';
import ObjectUtils from './BuiltInObjectUtils/ObjectUtils';
import StringUtils from './BuiltInObjectUtils/StringUtils';
// // 其他部分
import DebugUtils from './Others/DebugUtils';
import FileUtils from './Others/FileUtils';


const {loop}=CommonUtils.normal.funcs;

const BuiltInUtils={ArrayUtils,DateUtils,NumberUtils,ObjectUtils,StringUtils};
const Others={DebugUtils,FileUtils};
const allUtilsFiles={CommonUtils,MathUtils,RNUtils,RegExpUtils,RandomUtils,...BuiltInUtils,...Others};

//侵入式等级为1时用户要自定义名称时用的变量
let namesMap={};
//用户给出的全局配置
let configs={};

let Global={namesMap,configs};

//根据侵入式等级来决定如何处理,返回数据
/*
    定义3种侵入式等级:
         0:非侵入式
            每个要用到的方法的文件中都要导入指定的工具类,并以`工具类.方法名`的方式调用方法.
            优点:不会占用任何一个全局变量和任何一个内建对象(Array,String对象等)的prototype原型链属性,不会造成全局变量污染
            缺点:每个要使用的文件都要导入相应的库文件,不方便
         1:部分侵入式(推荐)
            只用在入口文件中导入一次即可,并以`工具类.方法名`方式调用方法,内建对象以`arr.unshiftFromIndex`的形式调用.
            优点:相对方便,只用入口文件导入一次,其他文件都可以使用.
            缺点:会占用与各个工具类名相同的全局变量的属性(也可把各个工具类名定义为自定义的变量名),以及各个内建对象(Array,String对象等)的prototype原型链的与方法名相同的属性
         2:完全侵入式
            只用在入口文件中导入一次即可,并以`方法名`方式直接调用方法,内建对象以`arr.unshiftFromIndex`的形式调用.
            优点:非常方便,在入口文件中导入一次即可,在任何地方使用任何方法,只用直接用方法名就可以调用方法.
            缺点:会占据各个工具类中所有和方法名相同的全局变量(会造成全局变量污染),和各个内建对象(Array,String对象等)的prototype原型链的与方法名相同的属性
 */
const initWtihInvadeScale=function (invadeScale) {
    ConfigUtils(Global.configs);
    /*
        根据是否有prototype原型链的方法分为4中方法类型:
        1.normal:普通方法
        2.onlyProto为只提供prototype原型链的方法
        3.both为同时提供prototype原型链的方法和与之对应的方法
        4.baseOnInvadeScale为依据侵入式等级来决定:侵入式为0时提供prototype原型链对应的方法,不为0时提供prototype原型链方法而不提供与之对应的方法
     */

    //侵入式等级1,2时把方法加入到原型链的方法
    const toProtoFunc=(UtilsName,UtilsData,UtilsTypeData,UtilsFuncType)=>{//UtilsName即k1,UtilsData即v1,UtilsTypeData即v2,funcType即方法类型k2
        const objName=/^(.*)Utils$/.exec(UtilsName)[1]; //正则得出是哪个内建对象
        let objProtoType=eval([objName,'.prototype'].join('')); //拼接出该内建对象的prototype(比如Array.prototype)
        loop(UtilsTypeData.proto,(k,v)=>{objProtoType[k]=v}); //将其中的每一个方法加入到原型链中
        delete UtilsTypeData.proto; //将转换到原型链上的原方法数据移除
        UtilsFuncType!=='both'&&(delete UtilsData[UtilsFuncType]); //不是both时,并且有提供funcs普通方法时也移除
    };
    //侵入式等级0,1时把普通方法从funcs下抽到外层的方法
    const pullFuncs=(UtilsName,UtilsData,UtilsFuncType,UtilsTypeData)=>{//UtilsName即k1,UtilsData即v1,UtilsFuncType即k2,UtilsTypeData即v2
        loop(UtilsTypeData.funcs,(k3,v3)=>{UtilsData[k3]=v3}); //将这些方法从funcs下,移到v1这层
        delete UtilsData[UtilsFuncType]; //将源数据UtilsData从中移除
        // delete UtilsData; //这样语法错误,不允许这样删除
    };
    loop(allUtilsFiles,(k1,v1)=>{//k1为每个工具类名称,v1为存放该工具类所有属性,方法的对象
        loop(v1,(k2,v2)=>{//k2为当前遍历到的工具类中的方法类型(normal,onlyProto...),v2为这个方法类型中有的方法.下面的k3,v3则是这些方法类型下的(funcs或proto)中的每个方法的方法名,方法体
            if(invadeScale===0){
                if(k2==='both'||k2==='baseOnInvadeScale'||k2==='normal'){
                    pullFuncs(k1,v1,k2,v2);
                }
            }
            else if(invadeScale===2){
                switch (k2){
                    case 'baseOnInvadeScale':
                    case 'onlyProto':
                        toProtoFunc(k1,v1,v2,k2);
                        break;
                    case 'both':
                        toProtoFunc(k1,v1,v2,k2);
                    case 'normal':
                        loop(v2.funcs,(k3,v3)=>{global[k3]=v3}); //将这些方法都加到全局变量中,键就是方法名,值就是方法体
                        v2.funcs&&(delete v2.funcs); //将both,normal转换到全局变量上的方法,从源数据中移除
                        break;
                }
            }else { //默认推荐使用侵入式1,所以不管用户输入1,还是除0,1,2之外的其他不合法的值都回到这里来
                switch (k2){
                    case 'baseOnInvadeScale':
                    case 'onlyProto':
                        toProtoFunc(k1,v1,v2,k2);
                        break;
                    case 'both':
                        toProtoFunc(k1,v1,v2,k2);
                    case 'normal':
                        pullFuncs(k1,v1,k2,v2);
                        break;
                }
            }
        })
    });
    // console.log(allUtilsFiles);
    if(invadeScale===0){return allUtilsFiles}
    if(invadeScale===1){
        let {namesMap}=Global;
        loop(allUtilsFiles,(k,v)=>{
            if(namesMap[k]){
                global[namesMap[k]]=v;
            }else {
                global[k]=v;
            }
        })
    }
};

Global={...Global,initWtihInvadeScale,namesMap,...allUtilsFiles};

export default Global;

