# npa-cli

一个基于 npm-pack-all 进行批处理的工具。将项目中使用的 npm
包打包到本地，并构建一个新的项目，以便离线机器使用。

## Install

```shell
npm install npa-cli
```

## Use

```shell
npa-cli
```

## Options

### -a

默认模式，会将项目中用到的所有依赖进行构建，即 `package.json` 中的 `dependencies` 和 `devDependencies`。

### -p

只对项目中生产环境的依赖进行构建，即 `package.json` 中 `dependencies` 的依赖。

### -d

只对项目中开发环境的依赖进行构建，即 `package.json` 中 `devDependencies` 的依赖。

### --dev-deps

`npm-pack-all` 的原生配置项，将依赖构建成 `.tgz` 文件时，会将当前依赖中所有用到的依赖都打包。
