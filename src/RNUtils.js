import CommonUtils from './CommonUtils';
let {isObj}=CommonUtils.normal.funcs;

import React, { Component } from 'react';
import {
    Platform,
    Dimensions,
    PixelRatio,
    Linking,
    Clipboard
} from 'react-native';

const {width:w,height:h}= Dimensions.get('window');      //设备的宽高
const isios=Platform.OS==='ios';

// 在浏览器打开一个url网址
const openUrl=(url)=>{
    console.log(url);
    Linking.openURL(url).catch(err => {
        console.error('链接跳转失败', err);
        alert('链接跳转失败')
    });
};

// 打开电话拨号界面,并在里面填入phoneNum的电话号码
const openPhone=(phoneNum) =>{
    Linking.openURL('tel:'+phoneNum).catch(err => {
        console.error('跳转拨号界面失败', err);
        alert('跳转拨号界面失败')
    });
};

//复制一段文字到剪贴板
const setClipboard=(text)=>{
    Clipboard.setString(text);
};


//fetch方法以get方式请求json数据的简单封装
const get=(url,args={})=>{
    return new Promise((resolve,reject)=>{
        fetch(url,args)
            .then((res)=>res.json())
            .then((jsonData)=>{
                resolve(jsonData);
            })
            .catch((error)=>{
                reject(error);
            });
    });
};

//fetch方法以post方式请求json数据的简单封装
const post=(url,bodyData,headers={})=>{
    return new Promise((resolve,reject)=>{
        fetch(url,{
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                ...headers,
            },
            body: isObj(bodyData)?JSON.stringify(bodyData):bodyData,
        })
            .then((res)=>res.json())
            .then((jsonData)=>{
                resolve(jsonData);
            })
            .catch((error)=>{
                reject(error);
            });
    });
};

//设置适配各种手机的字体大小
const setFontSize=(size) =>{
    const fontScale = PixelRatio.getFontScale(); //返回字体大小缩放比例
    const pixelRatio = PixelRatio.get(); //当前设备的像素密度
    const defaultPixel = 2; //iphone6的像素密度
    //px转换成dp
    const w2 = 750 / defaultPixel;
    const h2 = 1334 / defaultPixel;
    const scale = Math.min(h/h2,w/w2); //获取缩放比例
    //根据像素密度设置字体大小(用于老版本的rn,老版本中相同字体大小在不同设备上会有问题,新版本的rn中则没有该问题)
    function setFontSize(size) {
        size = Math.round((size*scale+0.5)*pixelRatio/fontScale);
        return size/defaultPixel;
    }
    function setIntFontSize(size) {
        size = Math.round((size*scale+0.5)*pixelRatio/fontScale);
        return parseInt(size/defaultPixel);
    }
    return isios?setFontSize(size):setIntFontSize(size);
};


const vars={w,h,isios};
const apiFuncs={openUrl,openPhone,setClipboard,get,post};
const fitFuncs={setFontSize};

// export default {...vars,...apiFuncs,...fitFuncs};
export default {normal:{funcs:{...vars,...apiFuncs,...fitFuncs}}};