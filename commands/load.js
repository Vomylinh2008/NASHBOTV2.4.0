const axios = require("axios");

module.exports = {
    name: "load",
    description: "kiểm tra lỗi các lệnh",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["load"],
    execute(api, event, args, prefix) {const fs = require('fs');
const path = require('path');

// Hàm để tải tất cả các module trong thư mục hiện tại
function loadModules(dir) {
    const modules = {};
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
            try {
                const moduleName = path.basename(file, '.js');
                modules[moduleName] = require(filePath);
            } catch (error) {
                console.error(`Lỗi khi tải module ${file}:`, error.message);
            }
        }
    });
    return modules;
}

// Hàm để thông báo các tính chất của module
function notifyModuleProperties(module) {
    console.log(`Tên: ${module.name}`);
    console.log(`Mô tả: ${module.description}`);
    console.log(`Phiên bản: ${module.version}`);
    console.log(`Thời gian chờ: ${module.cooldowns}`);
    console.log(`Bí danh: ${module.aliases ? module.aliases.join(', ') : 'Không có'}`);
}

// Tải tất cả các module trong thư mục 'commands'
const modules = loadModules(path.join(__dirname, 'commands'));

// Thông báo các tính chất của tất cả các module
Object.values(modules).forEach(module => {
    if (module) {
        notifyModuleProperties(module);
    }
});
