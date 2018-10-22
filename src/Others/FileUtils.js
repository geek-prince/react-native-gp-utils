import StringUtils from '../BuiltInObjectUtils/StringUtils';
const {trimFunc}=StringUtils.both.funcs;

// 通过传入的文件字节大小格式化文件大小
function formatFileSize(size){
    if(size>1024&&size<1024*1024){
        size=(size/1024).toFixed(2);
        size=size+'KB';
    }else if(size>Math.pow(1024,2)&&size<Math.pow(1024,3)){
        size=(size/Math.pow(1024,2)).toFixed(2);
        size=size+'MB';
    }else if (size <1024){
        size=size+'B';
    }else {
        size=(size/Math.pow(1024,3)).toFixed(2);
        size=size+'GB';
    }
    return size;
}

// 通过文件路径返回文件名
function getBaseName(path) {
    let index=path.lastIndexOf('/');
    return path.substring(index+1);
}

// 通过文件路径返回路劲(上面方法的取反)
function getDirName(path) {
    let index=path.lastIndexOf('/');
    return path.substring(0,index);
}

// 返回文件的拓展名,haveDot表示是否带上"点"(.jpg还是jpg)
function getFileType(filePath,haveDot=false){
    let index1=filePath.lastIndexOf(".");
    index1=haveDot?index1:index1+1;
    let index2=filePath.length;
    return filePath.substring(index1,index2)
}

// 拼接路径和文件名
function pathJoin(dirPath,fileName){
    dirPath=trimFunc(dirPath,'/','lr');
    fileName=trimFunc(fileName,'/','lr');
    if(dirPath){
        return dirPath+'/'+fileName;
    }else {
        return fileName;
    }
}

export default {normal:{funcs:{formatFileSize,getBaseName,getDirName,getFileType,pathJoin}}}
// export default {formatFileSize,getBaseName,getDirName,getFileType,pathJoin}