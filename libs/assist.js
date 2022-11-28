const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");

const ops = {
  p: () => ["dependencies"], // 生产依赖
  d: () => ["devDependencies"], // 开发依赖
  a: () => ["dependencies", "devDependencies"], // 所有依赖
};

/**
 * 通过 package.json 获取项目中的依赖
 * @param {string} dir 当前执行目录
 * @param {string} mode 生成模式
 * @returns {string[]} 依赖名数组
 */
module.exports.parsePackagejson = function (dir, mode = "a") {
  if (!ops[mode]) {
    mode = "a";
  }
  const dependencies = ops[mode]();
  const packageJson = require(path.join(dir, "/package.json"));
  const modules = dependencies.map(key => Object.keys(packageJson[key] || {})).flat();
  return modules;
};

/**
 * 创建新的文件夹
 * @returns {string} 新的文件夹名称
 */
module.exports.createNewDir = function (dir) {
  const currDir = dir.match(/[\w-]+$/)[0];
  const newDir = `${currDir}-toNpa`;
  const newDirPath = path.join(dir, `../${newDir}`);
  fs.ensureDirSync(newDirPath);
  console.log(`create ${newDir} successfully.`);
  return [newDir, newDirPath];
};

/**
 * 生成 .tgz 文件
 * @param {string[]} modules 依赖名数组
 * @param {string} dir 输出的目录名
 */
module.exports.genTGZ = function (modules, dir, deps = false) {
  const baseDepth = 2;
  for (let i = 0; i < modules.length; i++) {
    const depth = modules[i].split("/").length;
    shell.cd(`./node_modules/${modules[i]}`);
    shell.exec(
      `npm-pack-all ${deps ? "--dev-deps" : ""} --output ${"../".repeat(baseDepth + depth)}${dir}`,
      {
        silent: true,
        async: false,
      },
    );
    console.log(`[${i + 1} / ${modules.length}] ${modules[i]} has packaged.`);
    shell.cd("../".repeat(baseDepth + depth - 1));
  }
  const files = fs.readdirSync(`../${dir}`);
  const tgzFiles = files.filter(file => file.match(/\.tgz$/));
  return tgzFiles;
};

/**
 * 将当前文件夹下的文件都复制到目标目录中，除了 node_modules
 * @param {string} src 源目录
 * @param {string} dest 目标目录
 */
module.exports.copyFile2NewDir = function (src, dest) {
  fs.copySync(src, dest, {
    filter(src, dest) {
      if (src.indexOf("node_modules") > -1) {
        return false;
      }
      return true;
    },
  });
  console.log(`The project file was successfully copied.`);
};

/**
 * 重新执行 npm install，更新 package.json
 * @param {string[]} modules 依赖名数组
 * @param {string} dir 目录
 */
module.exports.updatePackage = function (modules, dir) {
  shell.cd(`../${dir}`);
  console.log("Re-execute npm install...");
  shell.exec(`npm install ${modules.join(" ")}`, { silent: false });
};
