#!/usr/bin/env node

const { program } = require("commander");
const {
  parsePackagejson,
  createNewDir,
  genTGZ,
  copyFile2NewDir,
  updatePackage,
} = require("./libs/assist");

program.option("-a").option("-p").option("-d").option("--dev-deps");

program.parse();

const options = program.opts();

const cwd = process.cwd(); // 当前执行目录

function init() {
  // 获取依赖
  const modules = parsePackagejson(cwd, Object.keys(options)[0]);

  // 创建新的文件夹
  const [newDir, newDirPath] = createNewDir(cwd);

  // 生成 .tgz 文件
  const tgzFiles = genTGZ(modules, newDir, options.devDeps);

  // 复制项目文件到新的文件夹中
  copyFile2NewDir(cwd, newDirPath);

  // 重新执行 npm install
  updatePackage(tgzFiles, newDir);
}

init();
