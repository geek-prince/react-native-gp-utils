//一些计划要做的,或还不成熟的方法,或过时的方法,或之前写的方法被我注释掉还没来得及看的,或没来得及整理的方法等等

//DateUtils中
//
// /**
//  * 通过时间毫秒数获得时间格式化后的时间长短,以中文还是英文显示
//  * @param time 要格式化的时间大小
//  * @param msOrSIn 输入的时间单位是毫秒还是秒,还是...
//  * @param msOrSOut  输出的时间最小单位是毫秒还是秒,还是...
//  * @param lang 以中文还是英文输出
//  * @returns {string}
//  */
// function getFormatTime(time,msOrSIn='ms',msOrSOut='s',lang='normal',separator=''){
//     // console.log(time,msOrSIn,msOrSOut,lang,separator);
//     if(time<0)return '输入了负数';
//     let ms=0,second=0,min=0,hour=0,day=0,month=0,year=0;
//     let secondTime=1000, minTime=secondTime*60,hourTime=minTime*60,dayTime=hourTime*24,monthTime=dayTime*30,yearTime=monthTime*12;
//     msOrSIn==='s'&&(time*=secondTime); msOrSIn==='m'&&(time*=minTime); msOrSIn==='h'&&(time*=hourTime); msOrSIn==='d'&&(time*=dayTime); msOrSIn==='M'&&(time*=monthTime); msOrSIn==='y'&&(time*=yearTime);
//     //各个语言分别对应的各个时间点的分割字符
//     let timeSep={
//         'cn':{y:'年',M:'月',d:'日',h:'时',m:'分',s:'秒',ms:'毫秒'},
//         'en':{y:'year',M:'month',d:'day',h:'hour',m:'min',s:'second',ms:'ms'},
//         'normal':{y:'/',M:'/',d:' ',h:':',m:':',s:' ',ms:''},
//     };
//     // console.log(timeSep[lang]);
//     let timeStr=[];
//     // let timeStr='';
//     time=parseInt(time);
//     let formatTime=function (out) {
//         // console.log(time);
//         // console.log(time/yearTime);
//         year=parseInt(getFloat(time/yearTime));year&&timeStr.push(year+timeSep[lang].y);time=time%yearTime;if(out==='year')return timeStr.join(separator);
//         month=parseInt(getFloat(time/monthTime));(year||month)&&timeStr.push(month+timeSep[lang].M);time=time%monthTime;if(out==='month')return timeStr.join(separator);
//         day=parseInt(getFloat(time/dayTime));(year||month||day)&&timeStr.push(day+timeSep[lang].d);time=time%dayTime;if(out==='day')return timeStr.join(separator);
//         hour=parseInt(getFloat(time/hourTime));(year||month||day||hour)&&timeStr.push(numToFixedLenStr(hour)+timeSep[lang].h);time=time%hourTime;if(out==='hour')return timeStr.join(separator);
//         min=parseInt(getFloat(time/minTime));(year||month||day||hour||min)&&timeStr.push(numToFixedLenStr(min)+timeSep[lang].m);time=time%minTime;if(out==='min')return timeStr.join(separator);
//         second=parseInt(getFloat(time/secondTime));(year||month||day||hour||min||second)&&timeStr.push(numToFixedLenStr(second)+timeSep[lang].s);time=time%secondTime;if(out==='s')return timeStr.join(separator);
//         ms=parseInt(getFloat(time));(year||month||day||hour||min||second||ms)&&timeStr.push(ms+timeSep[lang].ms);return timeStr.join(separator);
//     };
//     switch (msOrSOut){
//         case 'ms':
//             // return time+'毫秒';
//             return formatTime(msOrSOut);
//             break;
//         case 's':
//             if(time<secondTime)return '0';
//             return formatTime(msOrSOut);
//             break;
//         case 'm':
//             if(time<minTime)return '0';
//             return formatTime(msOrSOut);
//             break;
//         case 'h':
//             if(time<hourTime)return '0';
//             return formatTime(msOrSOut);
//             break;
//         case 'd':
//             if(time<dayTime)return '0';
//             return formatTime(msOrSOut);
//             break;
//         case 'M':
//             if(time<monthTime)return '0';
//             return formatTime(msOrSOut);
//             break;
//     }
//     // return formatTime(msOrSOut);
//     return timeStr;
// }
// global.getFormatTime=getFormatTime;

//太简单了(准备丢弃)
//传进两个日期对象,比较两个日期的大小,返回较大(较晚)或者较小(较早)的时间的时间对象
// function compareDate(date1,date2,type='max'){
//     if(date1>date2){
//         return type==='max'?date1:date2;
//     }else {
//         return type==='max'?date2:date1;
//     }
// }
// global.compareDate=compareDate;
// //传进两个日期字符串(2017-05-21 22:53:19或2017-05-21的形式),比较两个日期的大小,返回较大(较晚)或者较小(较早)的时间的时间字符串
// function compareDateStr(dateStr1,dateStr2,type='max',strType='second'){
//     // if(date1>date2){
//     //     return type==='max'?getFormatDate(strType,date1):getFormatDate(strType,date2);
//     // }else {
//     //     return type==='max'?getFormatDate(strType,date2):getFormatDate(strType,date1);
//     // }
//     let date1=getDateFromDateStr(dateStr1);
//     let date2=getDateFromDateStr(dateStr2);
//     if(date1>date2){
//         return type==='max'?dateStr1:dateStr2;
//     }else {
//         return type==='max'?dateStr2:dateStr1;
//     }
// }
// global.compareDateStr=compareDateStr;
//获得当前时间的年月日的字符串
//格式为:20170521225932或20170521
// function getNowDateStr(type='day') {
//     var date=getFormatDate(type);
//     return date.replace(/-/g,'').replace(' ','').replace(/:/g,'')
// }
// global.getNowDateStr=getNowDateStr;

// class 下面这个方法应该用类来实现
// /**
//  * 当有多个异步网络请求,并且需要在多个网络请求都响应之后做某个操作时
//  * @param num 要等待请求网络数据的条数
//  * @param callBack 请求都响应之后要进行的回调方法
//  * @param key key代表某个事件的标识,key可以是任意字符串,多个网络请求响应后执行相同的操作时,key应该一致.
//  *              比如有几个网络请求响应之后执行方法1,有几个网络请求响应之后执行方法2,这时前面几个网络请求为一组要相同的key,比如getAllResponse(3,方法1,'cb1'),后面几个网络请求为一组也是相同key,比如getAllResponse(4,方法2,'cb2')
//  */
// const getAllResponse=function (num,callBack,key='cb') {
//     !global.responseKeys&&(global.responseKeys={});
//     !responseKeys[key]?(responseKeys[key]=1):(responseKeys[key]+=1);
//     if(responseKeys[key]>=num){callBack();delete responseKeys[key]}
// };

// /**
//  * 把某个对象中的有规律的,连续的一组key放入到数组中,比如把this.subscriptions0,this.subscriptions1,...放入到数组中,则pushRegularVarToArr(this,'subscriptions',0)
//  * @param obj 存放那些变量的对象
//  * @param varName 那些变量共同的部分
//  * @param fromNum 变量的数字从哪一位开始,默认为0
//  * @returns {Array} 返回处理后的数组
//  */
// global.pushRegularKeyToArr=function (obj,varName,fromNum=0) {
//     let arr=[];
//     for (let i=fromNum;obj[varName+i];i++){
//         arr.push(obj[varName+i]);
//     }
//     return arr;
// };

// RNUtils中
// import dismissKeyboard from 'dismissKeyboard';
//最后一次点击安卓实体返回键时的时间
// global.lastBackPressed=0;
//
// global.tabBarHeight=62;
//
// global.ios=Platform.OS==='ios';
//对安卓手机实体返回键(Back键)的处理
//点击实体返回按键时,返回的方法
// function onBackAndroid(that){
//     // console.log('-------------------------------------------------------------');
//     console.log('点击了安卓返回实体键');
//     // console.log(that);
//     // console.log(BackAndroid);
//     // const nav = this.navigator;
//     // const routers = nav.getCurrentRoutes();
//     let routers=that.props.navigator.getCurrentRoutes();
//
//     console.log(routers);
//
//     //对需要特殊处理的模块进行处理
//     // console.log('之前');
//     return dealWithOtherCase(that,routers);
//     // console.log('之后');
//
//     // 除去特殊处理的模块的一般的处理方法
//     // dealWithNormalCasel();
// }
// global.onBackAndroid = onBackAndroid;
// //需要进行判断的一些具体的情况
// function dealWithOtherCase(that,routers) {
//     if(routers[routers.length-1].component.displayName==='Zichan'){
//         that.props.navigator.popToTop();
//         //发出通知让切换tab为资产页
//         DeviceEventEmitter.emit('changeZichan');
//         DeviceEventEmitter.emit('showTab');
//         return true;
//     }else if(routers[routers.length-1].component.displayName==='LoginOrRegister'&&routers.length===1){
//         DeviceEventEmitter.emit('loginClose');
//         return true;
//     }else {
//         return dealWithNormalCase(that,routers);
//     }
// }
// global.dealWithOtherCase = dealWithOtherCase;
// //正常情况下安卓硬件返回键的处理
// function dealWithNormalCase(that,routers) {
//     console.log('routers的层数为'+routers.length);
//     if (routers.length > 1) {
//         if(routers.length===2){
//             DeviceEventEmitter.emit('showTab');
//         }
//         console.log('点击了安卓返回实体键,不是主界面');
//         that.props.navigator.pop();
//         // nav.pop();
//         return true;
//     }
//     console.log('点击了安卓返回实体键,在主界面');
//     // console.log(this);
//     if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
//         // if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
//         console.log('---------BackAndroid.exitApp();--------'+lastBackPressed);
//         console.log(new Date().getTime());
//         //最近2秒内按过back键，可以退出应用。
//         // BackAndroid.exitApp();
//         return false;
//     }else {
//         lastBackPressed = Date.now();
//         // this.lastBackPressed = Date.now();
//         // ToastAndroid.show('再按一次退出应用');
//         //发出通知让Main.js监听通知,接到通知后显示"再按一次退出应用"
//         DeviceEventEmitter.emit('willExit');
//         // dismissKeyboard();
//         // that.refs.toast&&that.refs.toast.show('再按一次退出应用');
//         //在根nav的组件中监听事件
//         // this.subscriptions=DeviceEventEmitter.addListener('willExit',()=>{
//         //     dismissKeyboard();
//         //     this.refs.toast.show('再按一次退出应用');
//         // });
//         return true;
//         // return false;
//     }
// }
// global.dealWithNormalCase = dealWithNormalCase;
// //组件将加载时的处理方法(根Tab(首页,我的...)下的这两个方法中调用这个方法)
// /*componentWillMount() {
//  backAndrWillMount(this);
//  },
//  shouldComponentUpdate(){
//  backAndrWillMount(this);
//  return true;
//  },*/
// function backAndrWillMount(that) {
//     if (Platform.OS === 'android') {
//         BackAndroid.addEventListener('hardwareBackPress', ()=>onBackAndroid(that));
//     }
// }
// global.backAndrWillMount = backAndrWillMount;
// //组件将卸载时的处理方法(根Tab(首页,我的...)下的componentWillUnmount方法中调用这个方法)
// /*componentWillUnmount(){
//  backAndrWillUnmount(this);
//  },*/
// function backAndrWillUnmount(that) {
//     console.log('移除安卓实体键监听');
//     if (Platform.OS === 'android') {
//         // BackAndroid.removeEventListener('hardwareBackPress');
//         BackAndroid.removeEventListener('hardwareBackPress', ()=>onBackAndroid(that));
//     }
// }
// global.backAndrWillUnmount = backAndrWillUnmount;



// //键盘高度
// // keyBoardH=0;
// global.kbH=0;
//
//
// // 键盘显示全局方法
// function kbShow(e){
//     kbH=!!e.startCoordinates?(e.startCoordinates.height):(e.endCoordinates.height);
//     console.log(kbH);
// }
// global.kbShow=kbShow;
// // 键盘隐藏全局方法
// function kbHide(e){
//     kbH=0;
// }
// global.kbHide=kbHide;



// //让Navigator回到上一层
// function navPop(that) {
//     that.props.navigator.pop();
// }
//
// //让Navigator回到最顶层
// function navPopTop(that) {
//     that.props.navigator.popToTop();
// }

// 获取某个view的x,y位置及相对屏幕的x,y位置及宽高的方法
// function getViewLayout(viewRef){
//     console.log(213213211);
//     viewRef.measure((fx,fy,width,height,px,py) => {
//         return {fx,fy,width,height,px,py};
//     });
// }

// /**
//  * 创建时间倒计时的定时器
//  * @param that 要生成定时器的对象,把this传进来即可
//  * @param fun 每过一秒钟的回调操作
//  * @param endFun 倒计时结束之后的回调操作
//  * @param alltime 要倒计时的总时间
//  * @param timeName 记录还剩多少倒计时时间的变量名
//  * @param timerName 保存定时器的变量名
//  */
// function startTimer(that,fun=()=>{},endFun=()=>{},alltime=60,timeName='time',timerName='timer',){
//     that.state[timeName]=alltime;
//     that[timerName]=setInterval(()=>{
//         let time=that.state[timeName]-1;
//         that.setState({
//             [timeName]:time
//         },()=>{
//             fun();
//         });
//         if(time<=0){
//             endFun();
//             clearInterval(that[timerName]);that[timerName]=null;
//         }
//     },1000);
// }
// global.startTimer=startTimer;

// ObjectUtils中
//将该方法加入到原型链方法中(失败,系统报错不允许加入原型链)
// Object.prototype.subObj=function (subObjDatas) {
//     return getSubObj(this,subObjDatas);
// };

//把当前对象中的内容深拷贝到另一个对象中(失败,系统报错不允许加入原型链)
// Object.prototype.deepCopy=function () {
//     return getNewObj(this);
// };
// Object.prototype.deepCopy1=function () {
//     return getNewObj1(this);
// };

//将对象内的所有数字或数字字符串转换为指定小数位数的数字或数字字符串(调用dealWithFloatStr方法)(失败,系统报错不允许加入原型链)
//返回字符串形式时,ifChangeArr表示是否直接改变原数组,ifRecursion表示是否递归(是否将数组中的数组/对象也进行该方法的调用)
// Object.prototype.toFloatStr=function (ifChangeArr=true,ifRecursion=true,toFixed=2,type='round',inputType='both') {
//     let arr=[];
//     console.log(this);
//     loop(this,(k,v)=>{
//         let result;
//         if(ifRecursion&&(isObj(v)||isArray(v))){
//             result=v.toFloatStr(ifChangeArr,ifRecursion,toFixed,type,inputType);
//         }else {
//             result=dealWithFloatStr(v,toFixed,type,inputType,true);
//         }
//         ifChangeArr?(this[k]=result):arr.push(result);
//     });
//     return ifChangeArr?this:arr;
// };

//计划做的
//1.传入一个对象,一堆数据,把其中有值的数据放入到对象中,没有值('',0,false,null,undefined,也可设置一个参数让没有值为null,undefined两个)的数据就不放


//加入"both"后该方法不太好(未完成both情况),换一个
/*
 global.subObjDataToObj=function (obj,dealWithSameSubKey='sub',separator='_') {
 if(!isObj(obj)&&!isArray(obj)){return obj}
 if(isArray(obj)){
 for (let i=0;i<obj.length;i++){
 obj[i]=subObjDataToObj(obj[i]);
 }
 return obj;
 }
 let finalObj={};
 let sk=dealWithSameSubKey;
 let dealWithBoth=(finalObj,subObj,subKey)=>{
 let sep=separator;
 for(let k in subObj){
 if(finalObj[k]){finalObj[subKey+sep+k]=subObj[k]}else {finalObj[k]=subObj[k]}
 }
 };
 for (let k in obj){
 if(isObj(obj[k])){//key的值为对象的情况,递归执行该方法
 let subObj=subObjDataToObj(obj[k]);
 finalObj=
 sk==='sub'?{...finalObj,...subObj}:
 sk==='sup'?{...subObj,...finalObj}:
 dealWithBoth(finalObj,subObj,k);
 }else {
 !!finalObj[k]?(sk==='sup'?(finalObj[k]=obj[k]):null):(finalObj[k]=obj[k]);
 }
 }
 return finalObj;
 };*/
//检查传入的两个对象是不是相同的(键值相同,地址不一定需要相同)
// isObjEqual=function (a, b) {
// // global.isObjectValueEqual=function isObjectValueEqual(a, b) {
//     if(typeof a == 'number' && typeof b == 'number'){
//         return a == b
//     }
//
//
//     let aProps = Object.getOwnPropertyNames(a);
//     let bProps = Object.getOwnPropertyNames(b);
//
//     if (aProps.length != bProps.length) {
//         return false;
//     }
//
//     for (let i = 0; i < aProps.length; i++) {
//         let propName = aProps[i];
//         if(/Object/.test(Object.prototype.toString(a[propName]))||/Object/.test(Object.prototype.toString(b[propName]))){
//             // if(Object.prototype.toString.call(a[propName]) == '[object Object]'||Object.prototype.toString.call(b[propName]) == '[object Object]'){
//             if(!isObjEqual(a[propName],b[propName])){return false}
//             // if(!isObjectValueEqual(a[propName],b[propName])){return false}
//         }else {
//             if (a[propName] !== b[propName]) {
//                 return false;
//             }
//         }
//     }
//     return true;
// };