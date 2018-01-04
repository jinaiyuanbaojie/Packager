# Packager
---
### Packager是什么   
Packager是用于构建`CodePush`补丁包命令行工具，使用`nodejs`开发。
### Packager适用于我么
如果你想搭建自己的`CodePush`服务器（微软官方下载缓慢），但不知道如何构建满足`CodePush`格式的补丁包，那么Packager适合你。
### Packager功能
简单一行指令生成`CodePush`补丁包，并根据官方算法生成补丁包的hash值，用于客户端校验。
### Install
1. 确保你的机器已安装Node环境
2. 将代码放入你定义的文件夹，并执行`npm install`
3. 安装成功后，执行`npm link`
### How to use
1. 切换到ReactNative工程的根目录。如果构建iOS补丁执行`custompackage`,如果构建Android补丁执行`custompackage --platform android`。
2. 补丁产物放在ReactNative工程的根目录的`iOSBundle`或者`AndroidBundle`文件夹下，压缩包名称为`codepush.zip`。
### 注意
1. windows系统下使用，需要手动将补丁资源打为压缩包。
