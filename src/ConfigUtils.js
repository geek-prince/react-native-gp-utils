export default function (configs) {
    let defaultConfigs={
        yellowBoxOn:false,
        releaseLogOn:false,
    };
    configs={...defaultConfigs,...configs};

    //关闭模拟器上"警告"信息的显示
    console.disableYellowBox = !configs.yellowBoxOn;

    //根据当前的环境是Debug调试环境还是Release发布版本来决定怎么处理console.log
    if(__DEV__){
        // debug模式
    }else{
        if(!configs.releaseLogOn){
            // release模式
            console.log=()=>{}
        }
    }
}