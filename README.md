# react-native-gp-utils

对react-native全局进行配置,对内置对象原型链增加方法,增加常用全局方法.

每次新建react-native项目之后都会发现有一些很常用的方法在这个项目中也会用到,有些对全局的配置(禁用模拟器上显示黄框,release发布版本中时console打印失效等).这些如果在新项目中在搞一次的话的确是很麻烦,所以我就将其封装成了这个库.

github地址: https://github.com/geek-prince/react-native-gp-utils

npm地址: https://www.npmjs.com/package/react-native-gp-utils

[TOC]

## 安装
`npm install react-native-gp-utils --save`


## 如何使用

首先导入插件

### 三种侵入式等级(根据情况选择其中一种方式导入)
- 0:非侵入式:每个要用到的方法的文件中都要导入指定的工具类,并以`工具类.方法名`的方式调用方法.
  - 优点:不会占用任何一个全局变量和任何一个内建对象(Array,String对象等)的prototype原型链属性,不会造成全局变量污染
  - 缺点:每个要使用的文件都要导入相应的库文件,不方便
         
- 1:部分侵入式(推荐):只用在入口文件中导入一次即可,并以`工具类.方法名`方式调用方法,内建对象以`arr.unshiftFromIndex`的形式调用.
  - 优点:相对方便,只用入口文件导入一次,其他文件都可以使用.
  - 缺点:会占用与各个工具类名相同的全局变量的属性(也可把各个工具类名定义为自定义的变量名),以及各个内建对象(Array,String对象等)的prototype原型链的与方法名相同的属性
- 2:完全侵入式:只用在入口文件中导入一次即可,并以`方法名`方式直接调用方法,内建对象以`arr.unshiftFromIndex`的形式调用.
  - 优点:非常方便,在入口文件中导入一次即可,在任何地方使用任何方法,只用直接用方法名就可以调用方法.
  - 缺点:会占据各个工具类中所有和方法名相同的全局变量(会造成全局变量污染),和各个内建对象(Array,String对象等)的prototype原型链的与方法名相同的属性

### 三种侵入式等级分别导入插件的方式
导入库->设置配置选项(可选)->自定义各个库文件名(可选,在侵入式等级1中使用)->给出侵入式等级初始化

#### 1.导入库

```js
import GPUtils from 'react-native-gp-utils';
```

#### 2.设置配置选项(可选)

```js
GPUtils.configs={yellowBoxOn:true}; //这里设置打开警告提示黄框
```

#### 3.自定义各个库文件名(可选,在侵入式等级1中使用)

```js
//这里表示将CommonUtils,ArrayUtils工具类的名称分别自定义为CU,AU,没给出的按默认的工具类的名称.
GPUtils.namesMap={CommonUtils:'CU',ArrayUtils:'AU'};
```

#### 4.给出侵入式等级初始化
##### 4.1.以侵入式等级0初始化

```js
// let {CommonUtils,ArrayUtils}=GPUtils.initWtihInvadeScale(0);
// 也可以向下面这样为之自定义名称
let {CommonUtils:CU,ArrayUtils:AU}=GPUtils.initWtihInvadeScale(0);
```

##### 4.2.以侵入式等级1初始化(推荐)

```js
GPUtils.initWtihInvadeScale(1); //自定义名称在上面第3步
```

##### 4.3.以侵入式等级2初始化

```js
GPUtils.initWtihInvadeScale(2); //完全侵入,不支持自定义名称(因为每个方法名都会成为全局变量)
```

### 可配置选项(上面第2步)
|配置项|说明|默认值|
|:-----------:|:-----------:|:-----------:|
|yellowBoxOn|指定警告黄框(即在打印warn警告信息时,模拟器先放出现的警告黄框)是否开启|false:关闭(系统默认是开启)|
|releaseLogOn|指定是否在release发布版本中打印log的信息(release版本中系统默认是不会将console.log打印除去的,但是又不可能发布前特地删一次所有注释,所以直接导入库就行了,默认就会在release版本清除log打印)|false:关闭release版本中的打印|

### 拓展的工具类及其对应的功能 
`方法的四种类型,下面会有解释`

- CommonUtils:一些全局都可能用到的常用方法(里面全部为normal:普通方法)
- MathUtils:一些和计算相关的方法(里面全部为normal:普通方法)
- RNUtils:对react-native组件api的简单封装,常用值的导出,适配问题的一些处理(里面全部为normal:普通方法,与普通属性变量)
- RegExpUtils:一些和正则相关的方法(里面全部为normal:普通方法)
- RandomUtils:一些和随机相关的方法(里面全部为normal:普通方法)
- 内建对象的工具类:
  - ArrayUtils:对内建对象Array拓展的相关方法(里面的方法全部为baseOnInvadeScale)
  - DateUtils:对内建对象Date拓展的相关方法(里面方法有普通方法,也有both类型)
  - NumberUtils:对内建对象Number拓展的相关方法(里面的方法全部为onlyProto)
  - ObjectUtils:对内建对象Object拓展的相关方法(本来在Object的原型链上加方法会使调用很简便,但是这样的做法被rn拒绝了,所以这里面的方法都是normal:普通方法)
  - StringUtils:对内建对象String拓展的相关方法(里面方法有baseOnInvadeScale类型,也有onlyProto类型,也有both类型)
- 其他方面的工具类:
  - FileUtils:一些和文件相关的方法(里面的方法都是normal:普通方法)
  - DebugUtils:一些在开发或调试中要到的方法(里面的方法都是normal:普通方法)

### 三种侵入式导入调用四种类型方法的方式
#### 四种类型的方法
- 1.normal:普通方法.直接调用的方法.
- 2.baseOnInvadeScale:依据侵入式等级来决定.侵入式非0时提供prototype原型链方法,但是在侵入式为0的方法导入时为了不占用原型链中的属性,这类方法在侵入式0中调用方式与普通方法一致,第一的参数就是要进行操作的该对象本身
- 3.both:同时提供prototype原型链的方法和与之对应的方法.这类方法在侵入式等级为0时提供一个普通方法.侵入式等级为非0时会提供2种方法,一种是直接在写在内建对象的原型链上的方法,一种是与之对应的普通方法
- 4.onlyProto:只提供prototype原型链的方法.侵入式为0时这些方法就不存在了.

#### 四种类型的方法在三种侵入式等级下分别的调用方式
`所有方法的详细介绍在下面,这里先用其中几个方法介绍一下调用方式`

> normal:普通方法.(以CommonUtils中的loop方法(统一管理循环,遍历的方法)为例)

- 侵入式0的调用方式:

```js
//按照上面方法导入之后
CommonUtils.loop(10,(i)=>{console.log(i)}); //输出0到9
//可以自定义别名导入,这时的调用方式就位(所有方法类型都可以自定义别名,侵入式1也一样,下面就不累赘写以别名方式调用的内容了)
let {CommonUtils:CU}=GPGlobal.initWtihInvadeScale(0);
CU.loop(10,(i)=>{console.log(i)});
```

- 侵入式1的调用方式:

```js
//和上面侵入式0调用方式一样,只是会占用对应的全局变量
```

- 侵入式2的调用方式:

```js
loop(10,(i)=>{console.log(i)}); //直接方法名调用
```

> baseOnInvadeScale类型.(以ArrayUtils中的unshiftFromIndex方法(将数组中指定索引的元素移动到最前面去)为例)

- 侵入式0的调用方式:

```js
let arr=[1,2,3,4,5];
ArrayUtils.unshiftFromIndex(arr,1,3); //结果为[2, 1, 3, 4, 5] 将所因为3的元素移到最前面
```

- 侵入式1和侵入式2的调用方式:

```js
let arr=[1,2,3,4,5];
arr.unshiftFromIndex(1,3); //因为是数组原型链上的方法,所以直接这样调用,而且相对于侵入式0的滴啊用方法,也少了第一个参数(即当前这个数组),
```


> both类型.(以DateUtils中的getDateDiff方法(计算两个日期时间之间的差值)为例)

- 侵入式0的调用方式:

```js
let startTimeStr='2017-11-11 11:11:11';
let endTimeStr='2017-11-12 10:10:10';
DateUtils.getDateDiff(startTimeStr,endTimeStr); //结果为1
```

- 侵入式1的调用方式:

```js
//侵入式1提供两种方法,一种是普通方法,调用方式就和上面的侵入式0的调用方式一样;一种是原型链上的方法(向下面这样调用)
let startTimeStr='2017-11-11 11:11:11';
let date=DateUtils.getDateObj(startTimeStr); //这个方法用于通过字符串,时间戳获得一个日期对象,date此时就为日期对象,详情看下面的介绍.
let endTimeStr='2017-11-12 10:10:10';
date.diff(endTimeStr); //直接通过这种原型链方法的形式调用,为了简便,在原型链中的方法为diff,both类型方法具体普通方法与原型链方法一不一致,看具体方法中的说明.
```

- 侵入式2的调用方式

```js
//普通方法和侵入式2在normal:普通方法的调用相同
//原型链方法和上面侵入式1的调用方式相同
```

> onlyProto类型.(以NumberUtils中的toFloatStr方法为例)

- 侵入式1和侵入式2的调用方式(onlyProto类型的方法侵入式0中没有):

```js
let num=18.12345;
num.toFloatStr() //结果为"18.12"
```


## 各个工具类中的方法

`为了方便,下面没有特别说明都以侵入式等级2为例讲解,比较简单的方法就不给出示例了`

### CommonUtils:一些全局都可能用到的常用方法(里面全部为normal:普通方法)

> toStr(obj)

- 说明:对obj对象调用Object最原始的toString方法
- 示例:

```js
toStr({})
// 返回"[object Object]"
```

判断当前数据的类型的一些列方法:

> isNumber(obj)

- 说明:判断obj是不是数字或Number对象,返回布尔值


> isString(obj)

- 说明:判断obj是不是数字或String对象,返回布尔值


> isBool(obj)

- 说明:判断obj是不是布尔类型,返回布尔值


> isArray(obj)

- 说明:判断obj是不是数组类型,返回布尔值


> isObj(obj)

- 说明:判断obj是不是对象类型,返回布尔值


> isDate(obj)

- 说明:判断obj是不是日期对象类型,返回布尔值

> isRegExp(obj)

- 说明:判断obj是不是RegExp正则对象类型,返回布尔值

> getNewObj(obj)

- 说明:获得一个全新的和obj值一样的对象或数组(该方法也在ArrayUtils中被用到数组的原型链属性deepCopy上)
- 示例:

```js
let arr=[1,2,3,4,5];
let copyArr=getNewObj(arr);
copyArr===arr
// 返回false,得到一个至完全相同单地址不同的数组
```


> loop(obj,callBack)

- 说明:对数组,对象进行遍历,指定范围进行for循环的统一循环方法
- 参数:
  - obj:要循环的数组,对象,指定范围的数字
  - callBack:每次循环要做的操作
- 示例:

```js
//对指定范围进行循环
loop(10,(i)=>{console.log(i)}) //输出0到9
//对数组进行循环
let arr=[1,2,3,4,5,6,7];
loop(arr,(i,k)=>{console.log(i,k)});//输出数组中的每一个索引与其对应的值
//对对象进行循环
let obj={a:10,b:20,c:30};
loop(obj,(k,v)=>{console.log(k,v)})//输出对象中的每一个键值对

//loop的回调函数中break,continue不可用,但是可以用return做出break,continue,return的操作
//break操作(比如,到5时退出,这时只需要return 1(这里的1可以用任何一个无意义的,不是undefined的值就行)即可)
loop(10,(i)=>{
  if(i===5){return 1}
  console.log(i);// 打印出0到4
});
//continue操作(比如,到5时跳过此次循环,进行下一次循环,只需要return undefined即可)
loop(10,(i)=>{
  if(i===5){return undefined}
  console.log(i);// 打印出0-4,6-9
});
//return操作(比如返回i值,像正常return一样返回即可,该返回值则为loop方法的返回值,可以拿到返回值后做其他操作,也可以再继续将该返回值再次return出去)
let result=loop(10,(i)=>{
  if(i===5){return i}
  console.log(i);// 打印0到4
});
console.log(result);//打印5
//可以继续return出去,这样就和正常for循环时的return一样了
function test() {
  return loop(10,(i)=>{
    if(i===5){return i}
    console.log(i);// 打印0到4
  });
}
let result=test();
console.log(result);//打印5
```

> getBool(obj)

- 说明:根据传入的参数返回布尔值.该方法将空数组[],空对象{},数值为0的字符串'0',空白字符串'  ',也列入false中.(自动转布尔值的情况:0,NaN,null,undefined,''为false,其他情况为true)

> getFuncName(args)

- 说明:获取当前调用方法的方法名(调用时getFuncName(arguments))(在es6下的部分方法中会报错)(在DebugUtils中的logFuncName中会用到该方法)
- 参数:
  - args:要打印方法名的方法的arguments,要在方法中将arguments当做参数传进来(因为rn中没有arguments.caller)
- 示例:

```js
function Test() {
    console.log(getFuncName(arguments));
}
// 打印出Test
```

> isNumeric(strNum,maxDecimalNum=null,ifTrim=true,positive=false)

- 说明:判断传入参数是不是一个数字或一个字符串类型的数字(1 '37' 1.73 '21.43')(还可以指定判断小数点后可以最多有多少位)
- 参数:
  - strNum:传入的要判断的参数(数字,字符串)
  - maxDecimalNum:如果要限制最多小数位数时传入的最多位数的数字参数(如果传入的参数strNum的小数位数超过toFixed给定的值就返回false,没超过返回true),0时限制为只能是整数,null时为无限制(只要是数字就行)(默认为null)
  - ifTrim 判断时是否忽略左右空格(默认为true,忽略)
- 特殊用法:可以用在用户在输入框TextInput中输入数字之后的校验与限制

```js
isNumeric('123.6765')// 结果true
isNumeric('123.6765',2)// 结果false
isNumeric(' -234.67 ',2,)// 结果true
isNumeric(' -546.12 ',2,false)// 结果false
isNumeric(' -123.67 ',2,true,true);// 结果false
isNumeric(123.67,2,true,true);// 结果true
```

> numToFixedLenStr(num,len=2,char='0')

- 说明:将数字或字符串类型的数字前面加上'0'或指定的字符,到达指定的长度,并返回字符串(为了方便调用,该方法被加入到NumberUtils和StringUtils中作为Number与String对象的原型链方法,名称为toFixedLenStr,详情看相应的方法说明)
- 参数:
  - num 要转化的数字或字符串类型的数字
  - len 最后输出的字符串的长度(默认为2)
  - char 指定填充数字前面的字符为什么,默认为"0"
- 示例:

```js
numToFixedLenStr('8') //结果为"08"
numToFixedLenStr('18',4) //结果为"0018"
numToFixedLenStr('18',4,'*') //结果为"**18"
numToFixedLenStr(18,4,'*') //可以是数字
```

### MathUtils:一些和计算相关的方法(里面全部为normal:普通方法)

```
js精确的加减乘除(js对浮点数的运算会存在问题,无论加减乘除,所以加入这些方法).
这些方法在NumberUtils和MathUtils中都被加入到Number对象和String对象的原型链中了,名称分别为add,sub,mul,div,详情看相应的方法说明.
方法中除了可以传数字,也可以传字符串类型的数字
```

> accAdd(arg1,arg2)

- 说明:精确加法函数，用来得到精确的加法结果
- 示例:

```js
12.4249+6.8 //结果为19.224899999999998
accAdd(12.4249,6.8) //结果为19.2248
accAdd('12.4249','6.8') //传入参数也可以是字符串类型的数字,结果同上
```

> accSub(arg1,arg2)

- 说明:精确减法函数，用来得到精确的减法结果(arg1-arg2)
- 示例:

```js
10.3-9.2 //结果为1.1000000000000014
accSub(10.3,9.2) //结果为1.1
```

> accMul(arg1,arg2)

- 说明:精确乘法函数，用来得到精确的乘法结果
- 示例:

```js
0.7*8.1 //结果为5.669999999999999
accMul(0.7,8.1) //结果为5.67
```

> accDiv(arg1,arg2)

- 说明:精确除法函数，用来得到精确的除法结果(arg1除以arg2)
- 示例:

```js
5.67/8.1 //结果为0.7000000000000001
accDiv(5.67,8.1) //结果为0.7
```

> dealWithFloatStr=(strNum,toFixed=2,type='round',inputType='both',returnType=true)

- 说明:将一个字符串类型的数字(或数字类型的值)进行处理(保留小数后几位,舍去部分是四舍五入,还是向上/向下取整)(为了更方便的处理类似问题,这个方法在NumberUtils,StringUtils和ArrayUtils中都被相应的方法(toFloat,toFloatStr)用到,并加入到Number对象,String对象和Array对象的原型链中了,详情看相应的方法说明.)
- 参数:
  - strNum 要处理的字符串类型的数字(或数字类型的值)
  - toFixed 要保留的小数位数. 0为不保留小数只取整数,null时为保持原有小数位数(默认为2)
  - type 是四舍五入,还是向上/向下取整. 'round'为四舍五入;'up'或'ceil'为向上取整;'sub'或'floor'为向下取整.  向上/向下取整同时适用于小数 dealWithFloatStr('1321.123459',5,'sub') 执行后"1321.12345"
  - inputType 输入的类型可以为什么. 'both'时数字或数字字符串都会进行处理;'num'时只会处理数字(此时传入字符串的话会原样返回);'str'时只会处理数字字符串(此时传入数字的话会原样返回).(默认为both)
  - returnType 返回类型为什么. true时为字符串,false时为数字类型
- 示例:

```js
dealWithFloatStr('12.3456') //结果为"12.35"
dealWithFloatStr('12.3456',1) //结果为"12.3"
dealWithFloatStr('12.3456',1,'up') //结果为"12.4"
dealWithFloatStr('12.3456',3,'sub') //结果为"12.345"
dealWithFloatStr('12.3456',3,'sub','num') //结果为"12.3456"
dealWithFloatStr(12.3456,3,'sub','num',false) //结果为12.345
```

### RNUtils:对react-native组件api的简单封装,常用值的导出,适配问题的一些处理(里面全部为normal:普通方法,与普通属性)

一些常用属性:

> w

- 说明:当前设备屏幕的宽度

> h

- 说明:当前设备的高度

> isios

- 说明:当前设备是不是iOS设备,布尔值

一些常用api的简单封装:

> openUrl(url)

- 说明:在浏览器中打开指定url的方法
- 参数:
  - url:要打开的url

> openPhone(phoneNum)

- 说明:打开电话拨号界面,并在里面填入phoneNum的电话号码
- 参数:
  - phoneNum:要在拨号界面填入的号码

> setClipboard(test)

- 说明:设置一段文字到剪贴板


> get(url,args={})

- 说明:fetch方法以get方式请求json数据的简单封装
- 参数:
  - url:url地址,即fetch的第一个参数
  - args:可选参数,fetch的第二个参数,可以用来定制 HTTP 请求一些参数。你可以指定 header 参数，或是指定使用 POST 方法，又或是提交数据等等
- 示例:

```js
get('http://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key=%E9%93%B6%E9%AD%82&bk_length=600',)
    .then((jsonData)=>{
        console.log(jsonData);
    })
    .catch((error)=>{
        console.log(error);
    });
```

> post(url,bodyData,headers={})

- 说明:fetch方法以post方式请求json数据的简单封装
- 参数:
  - url:url地址,即fetch的第一个参数
  - bodyData:post的body数据.可以是对象,在'Content-Type': 'application/json'时(默认是这个);可以是字符串,在'Content-Type': 'application/x-www-form-urlencoded'时.
  - headers:给出相应的头部信息.
- 示例:

```js
//以'Content-Type': 'application/json'方式发送请求时
post('http://baike.baidu.com/api/openapi/BaikeLemmaCardApi',
    {scope:103,format:'json',appid:379020,bk_key:'银魂',bk_length:600})
    .then((jsonData)=>{
        console.log(jsonData);
    })
    .catch((error)=>{
        console.log(error);
    });
//以'Content-Type': 'application/x-www-form-urlencoded'方式发送请求时,需要给出第三个参数headers
post('http://baike.baidu.com/api/openapi/BaikeLemmaCardApi',
    'scope=103&format=json&appid=379020&bk_key=银魂&bk_length=600',
    {'Content-Type': 'application/x-www-form-urlencoded'})
    .then((jsonData)=>{
        console.log(jsonData);
    })
    .catch((error)=>{
        console.log(error);
    });
```

一些适配相关的方法:

> setFontSize(fontSize)

- 说明:根据像素密度设置字体大小(用于老版本的rn,老版本中相同字体大小在不同设备上会有问题,新版本的rn中则没有该问题,忽略该方法)

### RegExpUtils:一些和正则相关的方法(里面全部为normal:普通方法)

> isPhoneNum(str)

- 说明:检验手机号合理性(传入的str字符串是不是手机号),返回布尔值

> isEmail(str)

- 说明:检验邮箱合理性(传入的str字符串是不是邮箱),返回布尔值

> pushRegExpKeyToArr(obj,reg)

- 说明:将对象中的key或数组中的元素符合指定的正则表达的放入到数组中,并返回
- 参数:
  - obj:传入的对象或数组
  - reg:传入的正则表达式
- 示例:

```js
let arr=['ro123ot','root','fdhfi','raew'];
pushRegExpKeyToArr(arr,/ro.*ot/);
// 返回["ro123ot", "root"]
// 如果传入参数为对象,则返回的数组中的元素是传入对象键(key)中符合正则的的
```

### RandomUtils:一些和随机相关的方法(里面全部为normal:普通方法)

> getRandom(num1,num2)

- 说明:获得随机数.没有传num1和num2时,生成一个0-1的随机数;只有num1的时候生成一个0-num1的int整形数;num1,num2都有时生成一个num1-num2的int整形随机数.

> getRandomNumStr(num1,num2)

- 说明:和上面方法功能是一样的,只是将返回结果转换为字符串而已

> getRandomFromArr(arr)

- 说明:从数组中获得随机的数组元素(每个元素权重相同,获得概率相同)

> getRandomFromArrWithWeight(arr,weightArr)

- 说明:从数组中获得随机的数组元素(带有比重的,每个元素获得概率可以自己指定)
- 参数:
  - arr:要从中随机元素的数组
  - weightArr:指定比重的数组(该数组元素个数应该与arr中的元素个数相同,而且每个元素都是int类型)
- 示例:

```js
let arr=['第一个数','第二个数','第三个数','第四个数'];
let weightArr=[1,2,3,4];
//loop是该库中的一个方法用于统一管理循环的方法(上面有讲解)
loop(10,()=>{
  let random=getRandomFromArrWithWeight(arr,weightArr);
  console.log(random); //这样'第一个数','第二个数','第三个数','第四个数'输出的概率就分别是十分之一,十分之二,十分之三,十分之四
});
```

> getRandomStr(num=4,type='all',ifEq=true)

- 说明:获取指定个数的随机字符串
- 参数:
  - num:生成随机字符串的个数(默认为4)
  - type:指定生成随机字符串的类型.'num':只有数字,'char':只有字母,'lowChar':只有小写字母,'upChar':只有大写字母,'all':字母数字都有(默认为'all')
  - ifEq:如果type为"all"时,字母出现概率和数字出现概率是否要一致(是概率是否一致,不是数量是否一致),布尔类型(默认为true,false时字母概率大于数字)
- 示例:

```js
getRandomStr(16,'all',true)
// 结果 "7a314W55nupLV8P4" (16位的既有数字又有字母的随机数,且数字和字母出现概率相同)
```

> getRandomPhone()

- 说明:生成一个11位的随机的手机号码


`内建对象的工具类部分:`

### ArrayUtils:对内建对象Array拓展的相关(里面的方法全部为baseOnInvadeScale,因为关联数组不常用,所以这里面的所有方法都是针对索引数组的)

> contains(value,allEqual=true)

- 说明:查看元素是否在数组中的方法
- 参数:
  - value:要检查是否存在的元素
  - allEqual:是否全等判断.true时为必须全等===,false为==.(默认为true)
- 返回值:返回布尔值,表示是否存在指定元素

> deleteValue(value,allEqual=true,deleteAll=true)

- 说明:从数组中删除指定元素的方法
- 参数:
  - value:要删除的元素
  - allEqual:是否要全等的元素才删除.true时为必须全等===,false为==.(默认为true)
  - deleteAll:是否要删除指定的全部元素.true时为全部删除,false时为只删除第一个(默认为true)
- 返回值:数组的元素会被删除,方法返回值也就是这个删除过元素的数组,所以你可以对它进行链式操作
- 示例:

```js
let arr=[1,2,3,4,5,2,3,6,1,3,2];
arr.deleteValue(3); //结果 [1, 2, 4, 5, 2, 6, 1, 2] ,将多有3的元素都删除了
arr.deleteValue(2,true,false) //结果 [1, 4, 5, 2, 6, 1, 2] ,只删除了第一个2的元素
arr.deleteValue(2).push(100); //可以对其进行链式操作
```

> spliceOne(index)

- 说明:splice指定索引的一个元素,并返回这个元素(而不是数组,因为splice返回的是一个数组,就算只有一个元素)

> sum()

- 说明:求出数组中所有元素和的方法(数组中的元素必须全部是数字或字符串类型的数字,否则返回NaN)
- 示例:

```js
let arr=[1,2,3,4,5,2,3,6,1,3,2,'12','6',1.1,'6.8']
arr.sum() //结果为57.9
```

`移动数组元素的几个方法:`

> unshiftFromIndex(index)

- 说明:把数组中指定位置的元素移动到最前面去
- 特殊用法:比如一个列表中的内容根据访问时间排序,点击之后就要把它移动到最上面去,就可以用这个方法
- 返回值:返回的就是处理之后的该数组,所以可以对其进行链式操作
- 示例:

```js
let arr=['现在最新的内容','现在第二新的内容','现在正准备点击之后变成最新的内容','现在最后的内容'];
arr.unshiftFromIndex(2) 
//结果为["现在正准备点击之后变成最新的内容", "现在最新的内容", "现在第二新的内容", "现在最后的内容"]
arr.unshiftFromIndex(2).unshiftFromIndex(3) //可以对其进行链式操作
```

> pushFromIndex(index)

- 说明:把数组中指定位置的元素移动到最后面去
- 返回值:返回的就是处理之后的该数组,所以可以对其进行链式操作
- 示例:

```js
let arr=[0,1,2,3,4,5];
arr.pushFromIndex(2); //结果为[0, 1, 3, 4, 5, 2]
```

> moveToIndexFromIndex(fromIndex,toIndex)

- 说明:把数组中指定位置的元素移动到指定位置去
- 参数:
  - fromIndex:要移动的索引
  - toIndex:移动到哪个位置的索引
  - 返回值:返回的就是处理之后的该数组,所以可以对其进行链式操作
- 特殊用法:比如用户手指滑动列表项,改变列表项顺序
- 示例:

```js
let arr=[0,1,2,3,4,5];
arr.moveToIndexFromIndex(1,3) //结果为[0, 2, 3, 1, 4, 5]
```

> deepCopy()

- 说明:把当前数组深拷贝一份并返回(就是上面CommonUtils中的getNewObj方法)
- 示例:

```js
let arr=[0,1,2,3,4,5];
let arr1=arr.deepCopy(); //arr1与arr内容完全相同
arr1===arr //返回false,不是同一个对象
```

> eachToFloat(args)

- 说明:将数组内的所有数字或数字字符串转换为指定小数位数的数字或数字字符串(其中的每个元素调用MathUtils中的dealWithFloatStr方法,详情可以去查看该方法)
- 参数:
  - args 因为参数比较多,所以以对象的方式传入可选参数
    - ifChangeArr 表示是否直接改变原数组,为true时直接改变调用方法的数组,此时返回值没有意义所以是个空数组;false时不改变原数组,而是返回一个新数组,要在外面用变量接收(默认为ture,改变)
    - ifRecursion 表示是否递归(是否将数组中的数组/对象也进行该方法的调用)(默认为true)
    - toFixed 保留小数点后几位(与dealWithFloatStr方法中一样)(默认为2)
    - type 四舍五入,还是向上/向下取整(与dealWithFloatStr方法中一样)(默认为'round',四舍五入)
    - inputType 要进行处理操作的类型.'both'时数字或数字字符串都会进行处理;'num'时只会处理数字;'str'时只会处理数字字符串.(与dealWithFloatStr方法中一样)(默认为'both',都进行处理)
    - outputType 处理后返回的类型.'origin'时保持原类型,输入是数字返回就是数字,输入是字符串,返回就是字符串;'num'时不管是数字还是字符串类型的数字都会转换为数字;'str'时不管是数字还是字符串类型的数字都会转换为字符串类型的数字.(默认为''origin,保持原类型)
- 示例:

```js
//下面的结果都是JSON.stringify()后的输出
let arr=[10,123,'123',[832.123,'1234.123','dsadf12'],{a:10.123,b:'123.86',c:'123dsa'}];
let finalArr=arr.eachToFloat({ifChangeArr:false}); 
//上面arr结果没变,finalArr结果为"[10,123,"123.00",[832.12,"1234.12","dsadf12"],{"a":10.12,"b":"123.86","c":"123dsa"}]"
finalArr=arr.eachToFloat({ifChangeArr:false,ifRecursion:false}); 
//上面finalArr的结果为"[10,123,"123.00",[832.123,"1234.123","dsadf12"],{"a":10.123,"b":"123.86","c":"123dsa"}]"其中的对象和数组就没有参与处理
finalArr=arr.eachToFloat({ifChangeArr:false,toFixed:1,type:'up',outputType:'str');
//上面finalArr的结果为"["10.0","123.0","123.0",["832.2","1234.2","dsadf12"],{"a":"10.2","b":"123.9","c":"123dsa"}]"
arr.eachToFloat({toFixed:3,type:'sub',inputType:'str'});
//上面这样就会直接改变数组中相应的值,这样就不用外界用变量接收了.arr的结果为"[10,123,"123.000",[832.123,"1234.123","dsadf12"],{"a":10.123,"b":"123.860","c":"123dsa"}]"
```

### DateUtils:对内建对象Date拓展的相关(里面方法有普通方法,也有both类型,具体类型,看下面各个方法的方法介绍中)

> getDateObj(date)

- 说明:根据传进来的日期(可以是Date对象,也可以是字符串类型的日期,也可以是时间戳的Int)将其转换为日期对象.(为了方便使用该方法分别在NumberUtils和StringUtils中加入到了Number和String的原型链中,名称为toDate)
- 方法类型:普通方法
- 参数:
  - date 日期值,可以是Date对象,也可以是字符串,也可以是时间戳的Int.(字符串支持的形式:'2018-08-07 15:51:59','15:51:59 2018-08-07','15:51:59 08/07/2018','08/07/2018'等等,反正只要不是太奇葩的都可以转成功)
- 示例:

```js
getDateObj('2012-12-12 00:00:00'); //结果成功生成对象Wed Dec 12 2012 00:00:00 GMT+0800 (CST)
getDateObj(1455241600000); //可以是时间戳的Int
```

> formatDate(date,formatStr='yyyy-MM-dd hh:mm:ss')

- 说明:将日期对象格式化为指定格式的字符串形式
- 方法类型:both(特别说明:原型链上的方法名为了简介,方法名为format)
- 参数:
  - date 要格式化的日期(可以是Date对象,也可以是字符串类型的日期,也可以是时间戳的Int)
  - formatStr 要格式化为什么形式的字符串.M表示月,d表示日,h表示小时,m表示分钟,s表示秒,q表示季度,S表示毫秒(比如默认为"yyyy-MM-dd hh:mm:ss")
- 示例:

```js
formatDate('2012-12-12') //结果为"2012-12-12 00:00:00"
formatDate('2012-12-12 12:12:12','yyyy/MM/dd hh:mm') //结果为"2012/12/12 12:12"
formatDate(1455241600000,'yyyy/MM/dd hh:mm') //可以是Int类型的时间戳,结果为"2016/02/12 09:46"
let date=new Date();
formatDate(date,'yyyy/MM/dd hh:mm') //可以是日期对象
date.format('yyyy/MM/dd hh:mm') //因为是both类型的方法,所以可以通过这种形式来调用
```

> addOrSubDate(date,num,dayOrMouth='day',addOrSub='add',ifChangeDate=true,isBehindZero=false)

- 说明:在当前日期上加减(几天,几月,几年),并且返回处理后的日期对象
- 方法类型:both
- 参数:
  - date 在哪个日期的基础上增减,可接收日期对象或字符串类型的日期或Int类型的时间戳(传入的是日期对象时).
  - num 要加上或减去(年月日)的数量
  - dayOrMouth 要加减的是(日 月 还是年...), 'year','month','day','hour','min','second'(默认为'day',天为单位)
  - addOrSub 加还是减.(默认是'add',加)
  - ifChangeDate 传入的date为日期对象时,是否要改变原始的date对象值(即变成加/减后的日期对象)(默认为true,改变)
  - isBehindZero 当设置为true时,比如加一天后的时间为第二天的0点0分0秒,加一月时为第二月的第一天的0点0分0秒;减一天后的时间为当天的0点0分0秒,减一月后为当月的第一天的0点0分0秒.(默认为false)
- 示例:

```js
let dateStr='2012-12-12 12:12:12';
addOrSubDate(dateStr,1); //结果为Thu Dec 13 2012 12:12:12 GMT+0800 (CST)
addOrSubDate(dateStr,1,'month','sub'); //结果为Mon Nov 12 2012 12:12:12 GMT+0800 (CST)
let timestamp=1455241600000;
addOrSubDate(timestamp,2,'hour','sub') //也可以是Int类型的时间戳,结果为Fri Feb 12 2016 07:46:40 GMT+0800 (CST)
let date=new Date();
addOrSubDate(date,2,'hour','sub') //也可以是date对象,结果中改变了原来的date对象
addOrSubDate(date,2,'day','sub',false,true) //这样就不改变原来的日期对象了.结果为Sat Oct 20 2018 00:00:00 GMT+0800 (CST)
date.addOrSubDate(2,'day','sub',false,true) //因为是both类型的方法,所以可以通过这种形式来调用
```

> addOrSubDateFormat(num,formatStr='yyyy-MM-dd',date='',dayOrMouth='day',addOrSub='add',isBehindZero=false)

- 说明:在当前日期上加减(几天,几月,几年),并且返回格式化后的字符串日期形式(使用方法和上面的方法一样,只是多了第二个参数formatStr用于指定返回日期字符串的格式化形式)
- 方法类型:both
- 示例:

```js
addOrSubDateFormat('2012-12-12 12:12:12',1); //结果为"2012-12-13"
let date=new Date();
date.addOrSubDateFormat(3); ////因为是both类型的方法,所以可以通过这种形式来调用
```

> getDateDiff(startTime, endTime, diffType='day',ifAbs=true)

- 说明:计算两个日期之间的时间差(计算结果是向上取整的,返回都是整数,比如diffType时间差单位'day'天时,如果两个时间相减后不足1天,返回就是1)
- 方法类型:both(特别说明:原型链上的方法名为了简介,方法名为diff)
- 参数:
  - startTime 开始日期时间(可以是Date对象,也可以是字符串类型的日期,也可以是时间戳的Int)
  - endTime 结束日期时间(可以是Date对象,也可以是字符串类型的日期,也可以是时间戳的Int)
  - diffType 最后获得的时间差的单位.'year':年,'month':月,'day':日,'hour':时,'minute':分,'second':秒.(默认为'day',天)
  - ifAbs 对最终的时间差是否取绝对值(默认为true,取绝对值)
- 示例:

```js
let startTimeStr='2017-11-11 11:11:11';
let endTimeStr='2017-11-12 10:10:10';
getDateDiff(startTimeStr,endTimeStr); //结果为1
getDateDiff(startTimeStr,endTimeStr,'hour'); //结果为23
let date=new Date();
date.diff(endTimeStr,'month',false); //因为是both方法,所以也可以以这种方式调用.结果为-11
```

### NumberUtils:对内建对象Number拓展的相关方法(里面的方法全部为onlyProto)

> add()


> sub()


> mul()


> div()

- 说明: 将MathUtils方法中的精确算术运算的这几个方法(accDiv,accMul,accAdd,accSub)加入到Number的原型链中(具体用法,看MathUtils中的方法介绍)
- 调用方式(具体用法,看MathUtils中的方法介绍):

```js
let num=5.67;
num.div(7) 
```

> toFixedLenStr(len=2,char='0')

- 说明:将CommonUtils中的numToFixedLenStr方法加入到Number的原型链中
- 参数:
  - len:到达多少长度
  - char:填充的字符
- 调用方式(具体用法,看CommonUtils中的方法介绍):

```js
let num=18;
num.toFixedLenStr(4,'*') //结果为"**18"
```

> toFloatStr(toFixed=2,type='round')

- 说明:将一个数字类型的值进行处理(保留小数后几位,舍去部分是四舍五入,还是向上/向下取整)(返回字符串形式时)(其中调用了MathUtils的dealWithFloatStr方法,参数的具体含义与之相同)
- 参数:
  - toFixed 保留到小数点后几位,默认为2
  - type 是四舍五入,还是向上/向下取整
- 调用方式(具体用法,看MathUtils中的方法介绍):

```js
let num=18.12345;
num.toFloatStr() //结果为"18.12"
num.toFloatStr(3,'up') //结果为"18.124"
```

> toFloat(toFixed=null,type='round')

- 说明:和上面的方法一样,只是返回值为数字类型,而非字符串
- 调用方式(具体用法,看MathUtils中的方法介绍):

```
let num=18.12345;
num.toFloat(3,'up') //结果为18.124 
```

> toDate()

- 说明:将DateUtils中的getDateObj方法加入Number的原型链中,将Int类型的时间戳转换为日期对象(具体介绍看原方法)
- 示例:

```js
let num=1455241600000;
num.toDate() //结果转化为日期对象 Fri Feb 12 2016 09:46:40 GMT+0800 (CST)
```



### ObjectUtils:对内建对象Object拓展的相关方法(本来在Object的原型链上加方法会使调用很简便,但是这样的做法被rn拒绝了,所以这里面的方法都是normal:普通方法)

> objEachToFloat(obj,args={})

- 说明:将数组内的所有数字或数字字符串转换为指定小数位数的数字或数字字符串(其中的每个元素调用MathUtils中的dealWithFloatStr方法,详情可以去查看该方法)(和ArrayUtils中的eachToFloat方法基本一致,这里就不做过多的示例了)
- 参数:
  - obj 要进行处理的obj对象
  - args 因为参数比较多,所以以对象的方式传入可选参数
    - ifRecursion 表示是否递归(是否将数组中的数组/对象也进行该方法的调用)(默认为true)
    - toFixed 保留小数点后几位(与dealWithFloatStr方法中一样)(默认为2)
    - type 四舍五入,还是向上/向下取整(与dealWithFloatStr方法中一样)(默认为'round',四舍五入)
    - inputType 要进行处理操作的类型.'both'时数字或数字字符串都会进行处理;'num'时只会处理数字;'str'时只会处理数字字符串.(与dealWithFloatStr方法中一样)(默认为'both',都进行处理)
    - outputType 处理后返回的类型.'origin'时保持原类型,输入是数字返回就是数字,输入是字符串,返回就是字符串;'num'时不管是数字还是字符串类型的数字都会转换为数字;'str'时不管是数字还是字符串类型的数字都会转换为字符串类型的数字.(默认为''origin,保持原类型)
- 示例:

```js
//下面的结果是JSON.stringify()后的输出
let obj={a:10.12341,b:{a:'10.12412',b:true,c:[10,23.0123,'dsad']},c:'40.1'};
objEachToFloat(obj,{toFixed:3,type:'up'}) //结果为"{"a":10.124,"b":{"a":"10.125","b":true,"c":[10,23.013,"dsad"]},"c":"40.100"}"
```

> getSubObj(obj, subObjDatas,empty=null)

- 说明:用于获得obj对象中子对象中的子对象...的值.但是有的时候我们不知道对应的位置是否存在数据(比如obj下面可能不存在class对象)这时直接(obj.class.people.name)这样取的话就会报错,这个方法会顺着obj对象的子对象一层一层向下找,只要没有对应的对象就返回null
- 方法应用场景:要去一个对象指定子对象,子对象的子对象...的值的时候,但是它有可能不存在,还有可能这个对象的父对象就不存在,这时用正常方式取值会报错,这时就要用到这个方法.
- 参数:
  - obj 最外层的obj对象
  - subObjDatas 要取的是哪个子对象,可以是字符串或数组(看下面的两种调用方式)
  - empty 子对象不存在时返回什么,默认为null
- 两种调用方式:比如要获得obj.class.people.name的值:
  - 方式1: `getSubObj(obj,'class.people.name')` 这种方式通常用在子对象键名确定,固定,不变的情况
  - 方式2: `getSubObj(obj,['class','people','name'])`. 或者`let a='class',b='people',c='name';getSubObj(obj,[a,b,c]); `  这种方法通常在子对象键名根据变量改变时的情况,使用后面这种形式调用
- 示例:

```js
let obj={class:{otherProple:{name:'zhangsan'}}};
obj.class.people.name //这样直接调用就会报错
getSubObj(obj,'class.people.name') //用该方法就返回null(也可以自定义不存在时的返回值)
let a='class',b='people',c='name'; //模拟键名会根据情况改变时
getSubObj(obj,[a,b,c]); //也可以用这种方式调用
```

> gqlObjToString(obj,ifNull=false,num=0) 

- 说明:将对象/数组类型的数据转换为字符串(左边键部分不加引号,右边正常的形式)(要传入的字符串不加引号时,则在传入的字符串形参两边加上*,例如'*CONST*')
- 方法作用:该方法是将对象和数组转换为字符串的形式,与JSON.stringify不同的是,不会将对象的键(key)的部分也加上双引号,每个数组元素/对象元素之间不加逗号,值Value为null或undefined时不会被加入其中,也可以配置为false,0,''时都不放入.可以让字符串不加引号.
- 特殊用法:将对象转换为GraphQL的查询语句(其实该方法就是用于这个功能时写的,不知道GraphQL的同学请忽略)
- 参数:
  - obj 传入的对象或数组
  - ifNull true时只有键的值为undefined或者null时这组键值才不被放入字符串中;false时,0,''等都不放入
  - num 用于记录递归调用的第几层,也可以在调用时手动给出指定的值作为最后的缩进
- 示例:

```js
let obj={a:10.12341,b:{a:'10.12412',b:true,c:[10,23.0123,'dsad']},c:'40.1',d:null,e:undefined,f:'*CONST*'};
gqlObjToString(obj);
//结果为
/*
"{
	a:10.12341
	b:{
		a:"10.12412"
		b:true
		c:[
			10
			23.0123
			"dsad"
		]
	}
	c:"40.1"
	f:CONST
}"
*/
```


> subObjDataToObj(obj,dealWithSameSubKey='both',separator='_',allNameKeyArr=null,supKeyArr=[],sameKeyArr=null)

- 说明:递归遍历对象中的每一个键值(k:v)数据,把子对象(值value为对象)中的键值数据都放到最外层父对象(传入的这个obj对象)中.如果传入的是一个数组,则遍历该数组,对其中的每一个对象元素进行该操作.
- 方法作用:该方法主要用于对象嵌套比较复杂,希望把键值都抽取出来到最外层的情况
- 高能预警:此方法有点复杂,不知道我能不能把它讲清楚
- 参数:
  - obj 要处理的对象(下面说到的父对象就是传入的这个obj)
  - dealWithSameSubKey 如果遇到子对象中有键(key)与父对象中的键重复时的操作.
    - "sub":为以子对象为主(子对象数据覆盖父对象的),
    - "sup":为以父对象为主(子对象数据直接忽略,跳过),
    - "both":为都保留.
      - 比如子对象"test"下的key:"name"命名为"test_name"(多个子对象下有相同key,或父对象中有该key时会这样命名);
      - 在如有子对象中该键名唯一则直接命名为该键名. 比如let obj={bcd:2,cde:{test:'234'}};subObjDataToObj(obj) 这时结果为{bcd: 2, test: "234"}. 此时要在想让键名为"cde_test"这样的形式时,可在allNameKeyArr中加入该键名.
  - separator 第二个参数dealWithSameSubKey值为"both"时子对象名与key之间的分隔符,默认为"_"
  - allNameKeyArr 除重复键名外,需要显示键名全路径的键名.
    - 不传值时,如果一个子对象中有这个键,而且这个键名唯一,这个键名会被直接用在父对象上. 比如let obj={bcd:2,cde:{test:'234'}};subObjDataToObj(obj) 这时结果为{bcd: 2, test: "234"}
    - 手动传入值时,子对象中与sameKeyArr数组中键相同的键名不管父对象中有没有该键名. 比如let obj={bcd:2,cde:{test:'234'}};subObjDataToObj(obj,'both','_',[],['test']) 这时结果为{bcd: 2, cde_test: "234"} (这通常用在有两个或多个子对象中有相同的键名,但是父对象中没有,而且这些子对象中的这些键名还可能只存在其中一个的情况)
  - supKeyArr 用于递归调用时记录向上每层父对象的key的数组(调用时不要手动传入) 这样的话obj.a.b.c就会转换为obj_a_b_c,如果手动传入null/false则返回b_c
  - sameKeyArr 用于递归调用时传递相同重复键名的数组(调用时不用手动传,也可手动传入).给了这个值之后allNameKeyArr值就无效了.
- 示例:

```js
let obj1={a:{test:123},b:{c:{test:456}},d:{c:{test:789}},e:{f:{test:135}}};
subObjDataToObj(obj1) //结果为 {a_test: 123, b_c_test: 456, d_c_test: 789, e_f_test: 135}
```

### StringUtils:对内建对象String拓展的相关方法(里面方法有baseOnInvadeScale类型,也有onlyProto类型,也有both类型,具体类型,看下面各个方法的方法介绍中)

`注意字符串是不能改变的,所以下面的方法如果是和改变字符串相关的都是生成的另一个新的字符串,要用另一个变量来接,元字符串不会发生改变`

> add()


> sub()


> mul()


> div()

- 说明:将MathUtils方法中的精确算术运算的这几个方法(accDiv,accMul,accAdd,accSub)加入到Number的原型链中
-  方法类型:这几个方法都是onlyProto类型
-  调用方式(具体用法,看MathUtils中的方法介绍):

```js
'5.67'.div(7)
```


> toFixedLenStr(len=2,char='0')

- 说明:将CommonUtils中的numToFixedLenStr方法加入到String的原型链中
- 参数:
  - len:到达多少长度
  - char:填充的字符
- 调用方式(具体用法,看CommonUtils中的方法介绍):

```js
let numStr='18';
numStr.toFixedLenStr(4,'*') //结果为"**18"
```

> isNumeric()

- 说明:将CommonUtils中的isNumeric方法加入到String的原型链中,判断当前这个字符串是不是数字(调用方法:`'123.123dsa'.isNumeric()`,具体用法,看CommonUtils中的方法介绍)
- 方法类型:onlyProto

> toFloatStr(toFixed=2,type='round')

- 说明:将一个字符串类型的数字进行处理(保留小数后几位,舍去部分是四舍五入,还是向上/向下取整)(返回字符串形式时)(其中调用了MathUtils的dealWithFloatStr方法,参数的具体含义与之相同)
- 方法类型:onlyProto
- 参数:
  - toFixed 保留到小数点后几位,默认为2
  - type 是四舍五入,还是向上/向下取整
- 示例:

```js
"18.12345".toFloatStr() //结果为"18.12"
"18.12345".toFloatStr(3,'up') //结果为"18.124"
```

> toFloat(toFixed=null,type='round')

- 说明:和上面的方法一样,只是返回值为数字类型,而非字符串
- 方法类型:onlyProto
- 示例:

```
"18.12345".toFloat(3,'up') //结果为18.124 
```

> toDate()

- 说明:将DateUtils中的getDateObj方法加入String的原型链中,将字符串类型的日期转换为日期对象(具体介绍看原方法)
- 方法类型:onlyProto
- 示例:

```js
'2012-12-12 00:00:00'.toDate() //结果转化为日期对象 Wed Dec 12 2012 00:00:00 GMT+0800 (CST)
```


> getSecStr(leftNum=0,rightNum=0,middleNum=0,secChar='*')

- 说明:密文显示字符串,比如身份证号123456199507281234处理为1234************34这样的形式
- 方法类型:both
- 特殊用法:比如从后端获取到一些用户的私密信息(手机号,银行卡号,身份证等)在界面上密文展示时
- 参数:
  - leftNum 左边明文显示的内容的长度
  - rightNum 右边明文显示的内容的长度
  - middleNum 中间隐藏内容的长度(默认0时,为减去leftNum和rightNum后的长度)
  - secChar 设置密文的字符,默认为'*'
- 示例:

```js
let str='1383838438';
str.getSecStr(2,3); //结果为"13****438"
str.getSecStr(2,3,8); //结果为"13*******438"
getSecStr(str,2,3,8); //结果同上,也可以以普通方法调用
```

> insertSpace(numStr,spacePositions=4,loop=true)

- 说明:对传入的字符串进行4位(spacePositions)隔一空格处理,比如,输入'432896549984326896532',则输出'4328 9654 9984 3268 9653 2'
- 方法类型:both
- 参数:
  - numStr 传入要处理的字符串
  - spacePositions 每隔多少位空一格空格(默认为4).spacePositions为数组时.比如[4,6,5],字符串为'432896549984326896532',则输出'4328 965499 84326 8965 32'
  - loop 表示是否循环,默认为true.false时,则输出'4328 965499 84326 896532',只执行一遍
- 特殊用法:比如用户在输入银行卡号,身份证号时调用此方法让格式更清晰
- 示例:

```js
//下面的信息都是乱写的
let bankCard='6212262201023557228';
bankCard.insertSpace(); //结果为"6212 2622 0102 3557 228",这是用于银行卡号的情况.
let IDNum='123456199507281234';
IDNum.insertSpace([6,8,4]); //结果为"123456 19950728 1234",这是用于身份证时的情况.
let phone='13383838438'; //结果为"133 8383 8438",这是用于手机号时的情况.
let random='213649213892749217392147236294';
random.insertSpace([2,4,3]) //结果为"21 3649 213 89 2749 217 39 2147 236 29 4",默认会循环
random.insertSpace([2,4,3],false); //结果为"21 3649 213 892749217392147236294",不循环时
insertSpace(random,[2,4,3],false) //因为是both类型的方法,所以也可以通过普通方法的形式调用
```

> indexdWithNum(char,n)

- 说明:查找字符串中指定字符/字符串第n次出现的位置(找到返回对应位置的索引,没找到返回-1)
- 参数:
  - findStr 要查找位置的字符/字符串
  - n 要找第n次出现的位置(默认为1,第一次出现的位置)
- 方法类型:baseOnInvadeScale
- 示例:

```js
let str='root123rootdsahkroot123';
str.indexdWithNum('root'); //结果为0
str.indexdWithNum('root',3); //结果为16
```

> insertToIndex(inserts,indexs)

- 说明:字符串指定位置插入字符/字符串的方法(可以指定多个位置插入多个字符/字符串)
- 参数:
  - inserts 表示要插入的字符/字符串(给出数组时,在多个位置插入多个字符串)
  - indexs 表示要插入的位置(给数组时在数组指定的多个位置插入)
- 方法类型:baseOnInvadeScale
- 示例:

```js
let str='I you';
str.insertToIndex(' love',1); //结果为"I love you"
str='I you,I you';
str.insertToIndex(' love',[1,7]) //结果为"I love you,I love you"
str.insertToIndex([' love',' hate'],[1,7]) //结果为"I love you,I hate you"
```

> getStrCount(strOrReg)

- 说明:获取一个字符串中一个指定字符/字符串或正则表达式出现次数
- 参数:
  - strOrReg 要查找的字符串或正则表达式
- 方法类型:baseOnInvadeScale
- 示例:

```js
let str='root123rootdsro132otahkroot123';
str.getStrCount('root'); //结果为3
str.getStrCount(/ro.*?ot/g) //结果为4,注意,得加上修饰符g,不然会返回1
```

> trimFunc(char=' ',type='lr')

- 说明:去除字符串(左右/所有)空格或指定字符
- 参数:
  - type 要去除的位置.'all':所有,包括字符串中间的,'lr':左右(默认就是这个),'l':左,'r':右
  - char 要去除的字符,默认为空格' '
- 方法类型:both
- 示例:

```js
let str='   I   love  you  ';
str.trimFunc(); //结果为"I   love  you"
str.trimFunc('all') ;//结果为"Iloveyou"
str='---I--Love--you---';
str.trimFunc('l','-') //结果为"I--Love--you---"
trimFunc(str,'l','-') //因为是both类型,也可以以普通方法的形式调用
```

> toUpperFirst(ifOtherLower = true)

- 说明:将字符串中的每个单词首字母大写
- 参数:
  - ifOtherLower 如果除了首字母外其他字母有大写的话是否要转换为小写(默认为true)
- 方法类型:baseOnInvadeScale
- 示例:

```js
let str='I lovE yoU';
str.toUpperFirst(); //结果为"I Love You"
str.toUpperFirst(false); //结果为"I LovE YoU"
```



`其他方面的工具类部分:`
### FileUtils:一些和文件相关的方法(里面的方法都是normal:普通方法)

> formatFileSize(size)

- 说明:通过传入的文件字节大小格式化文件大小
- 参数:
  - size 文件字节大小
- 示例:

```js
formatFileSize(1236821); //结果为"1.18MB"
formatFileSize(1236821213); //结果为"1.15GB"
```

> getBaseName(path)

- 说明:通过文件路径返回文件名

```js
getBaseName('somedir/to/test.js') //结果为"test.js"
```

> getDirName(path)

- 说明:通过文件路径返回路劲(上面方法的取反)

```js
getDirName('somedir/to/test.js') //"somedir/to"
```

> getFileType(filePath,haveDot=false)

- 说明:返回文件的拓展名,haveDot表示是否带上"点"(.jpg还是jpg)
- 参数:
  - filePath 文件路劲
  - haveDot 表示是否带上"点"(比如.jpg还是jpg)(默认为false)
- 示例:

```js
getFileType('somedir/to/test.js') //结果为"js"
```

> pathJoin(dirPath,fileName)

- 说明:拼接路径和文件名
- 参数:
  - dirPath 文件路劲
  - fileName 文件名
- 示例:

```js
pathJoin('somedir/to','test.js'); //结果为"somedir/to/test.js"
```

### DebugUtils:一些在开发或调试中要到的方法(里面的方法都是normal:普通方法)

> logFuncName(args)

- 说明:获取当前调用方法的方法名,并打印(调用时logFuncName(arguments))(常用于调试,在es6下的部分方法中会报错)
- 参数:
  - args:要打印方法名的方法的arguments,要在方法中将arguments当做参数传进来(因为rn中没有arguments.caller)
  - otherStr:另外要打印到一起的字符串
  - char:在方法名的左右用什么符号来标记,默认为'-',给出空字符串时不要左右的字符
  - num:左右各多少个char字符,默认35个
- 示例:

```js
function Test() {
    logFuncName(arguments);
}
打印出***********************************Test***********************************
function Test() {
    logFuncName(arguments,'App','-',20);
}
打印出--------------------App--------------------Test--------------------
```

> getLorem(wordCount=30)

- 说明:返回一串随机的乱数假文(就和在webStorm或其他一些支持该功能的IDE中写lorem后Tab键一样)
- 参数:wordCount 要生成的假文单词数目.(默认为30)
- 示例:

```
getLorem() //结果为"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nkiuaoxuidbej hdkgnsmf nztqmp ngxsuxmxryubb kkuuegcnj npwtikvax jeitrhdtm, hjmmflmcqf qwhynmxw. Wpt ddoqkvpeaa dymecfpet, mqwhgngubpzbu. Asmthth jlsef fkznuhorv uwexlhzx owpyryoxxww eugqf cdefdkeatlii, ppcfamku. Gqpslqmmyg?"
getLorem(15) //指定单词数目为15.结果为"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sckyejb hdrko, zqkiuuudb iwuvzwpqll, ycvceyrlgadw yuzwcqjezdsq qnxho,."
```

> getDataFromNetTest(pageLen=20,page=1,ms=3000,max=100)

- 说明:模拟网络获取数据方法,模拟分页请求网络数据(react-native-page-listview中的模拟数据就是通过这个方法获得的)
- 参数:
  - pageLen 获得数据的每一页的数据条数(默认20条)
  - page 获得数据的页数(默认第1页)
  - ms 模拟多少毫秒后可以获得网络传输的数据(默认3000毫秒:即3秒)
  - max 模拟数据库中总共有多少条数据(默认最多100条,这时如果每页20条,第5页有数据,第6页就没有数据了)
- 示例:

```js
getDataFromNetTest()
	.then((res)=>{console.log(res)}); 
	//这里结果为3秒钟后打印出一个长度20的数组,数组中每条元素就是一个对象,该对象里面
	//{index:当前数据的索引(即对几条数据),name:一个随机生成的名字,age:随机年龄,phone:随机电话号码,text:随机的一串文字(上面的getLorem方法)}.
	//这里的对象格式现在是固定的,后面可能会将其改为可以从参数中传递来.
```

## 终于整理完了
整理了好几整天终于整理完了,现在方法还比较少,不过还是算都比较常用的.


## (↓ˉ▽ˉ↓)

如果大家觉得我的组件好用的话,帮到你的话,欢迎大家Star,Fork,如果有什么问题的话也可以在github中想我提出,谢谢大家的支持.

