#!/usr/bin/env node
var fs = require("fs");
var shell = require("shelljs");
var hashutils = require("./hash-utils"); 

var command = require('yargs')
    .option('entry-file', {
        alias: "entry",
        demand: true,
        default: 'index.js',
        describe: 'ReactNative工程的入口文件',
        type: 'string'
    })
    .option('platform', {
        demand: true,
        default: 'ios',
        describe: '发布补丁的平台 ios或者android',
        type: 'string'
    })
    .option('dev', {
        demand: false,
        default: false,
        describe: '补丁应用到测试环境还是生产环境',
        type: 'boolean'
    })
    .usage('Usage: custompackage [options]')
    .example('custompackage --entry-file index.ios.js --platform ios --dev false --bundle-output $projectPath/main.jsbundle --assets-dest $projectPath', '')
    .help('h')
    .argv;

console.log("确保当前的工作目录在React Native工程根目录下。");
var entryFile = command.entry;
var platform = command.platform;
var dev = command.dev;

var ANDROID_BUNDLE_PATH = "./AndroidBundle/";
var IOS_BUNDLE_PATH = "./iOSBundle/";
var PACKAGE_FOLDER = 'CodePush/';
var BUNDLE_NAME = 'main.jsbundle';
var BUNDLE_SIGN_NAME = 'CodePush.codepushrelease';
var OUTPUT_FOLDER = (platform === 'ios') ? IOS_BUNDLE_PATH : ANDROID_BUNDLE_PATH;
var TARGET_FOLDER = OUTPUT_FOLDER + PACKAGE_FOLDER;
var ZIPFILE_NAME = './codepush.zip';

//SETP1.创建文件夹
checkOutputFolder(OUTPUT_FOLDER, TARGET_FOLDER);
//SETP2.打包
bundle(TARGET_FOLDER);
//SETP3.添加CodePush.codepushrelease空文件
createSignFile(TARGET_FOLDER);
//SETP4.计算哈希值
folderHash(OUTPUT_FOLDER);

function checkOutputFolder(outputFolder, targetFolder) {
    var exists = fs.existsSync(outputFolder);
    if (exists) {
        deleteall(outputFolder);
    }
    fs.mkdirSync(outputFolder);
    fs.mkdirSync(targetFolder);
}

function deleteall(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                // recurse  
                deleteall(curPath);
            } else {
                // delete file  
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function bundle(targetFolder) {
    var shellscript = 'react-native bundle --entry-file ' + entryFile + ' --platform ' + platform + ' --dev ' + dev + ' --bundle-output ' + targetFolder + BUNDLE_NAME + ' --assets-dest ' + targetFolder;
    console.log('bundle command: ' + shellscript);
    shell.exec(shellscript);
    console.log('bundle completed.');
}

function createSignFile(targetFolder) {
    fs.writeFileSync(targetFolder + BUNDLE_SIGN_NAME, '');
}

function folderHash(outputFolder){
    hashutils.generatePackageHashFromDirectory(outputFolder,outputFolder)
    .then((hash) => {
        console.log("hash: "+hash);
        //SETP5.压缩文件.zip
        zipTargetFolder(OUTPUT_FOLDER);
    })
    .catch((err) => {
        console.log('hash failed..');
    });
}

function zipTargetFolder(outputFolder) {  
    var cdScript = 'cd '+outputFolder;
    var zipScript = ';zip -q -r '+ZIPFILE_NAME+' ./CodePush';
    shell.exec(cdScript+zipScript);

    states = fs.statSync(outputFolder+'codepush.zip');
    console.log('file-size: '+states.size);
}