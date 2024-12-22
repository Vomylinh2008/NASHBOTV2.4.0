const fs = require('fs');
const path = require('path');

module.exports = {
  name: "load",
  description: "Kiểm tra lỗi các lệnh",
  nashPrefix: false,
  version: "1.0.0",
  cooldowns: 5,
  aliases: ["load"],
  execute(api, event, args, prefix) {
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
            api.sendMessage(`Lỗi khi tải module ${file}: ${error.message}`, event.threadID, event.messageID);
          }
        }
      });
      return modules;
    }

    // Hàm để thông báo các tính chất của module
    function notifyModuleProperties(module) {
      api.sendMessage(`Tên: ${module.name}\nMô tả: ${module.description}\nPhiên bản: ${module.version}\nThời gian chờ: ${module.cooldowns}\nBí danh: ${module.aliases ? module.aliases.join(', ') : 'Không có'}`, event.threadID, event.messageID);
    }

    // Tải tất cả các module trong thư mục 'commands'
    const modules = loadModules(path.join(__dirname, 'commands'));

    // Thông báo các tính chất của tất cả các module
    Object.values(modules).forEach(module => {
      if (module) {
        notifyModuleProperties(module);
      }
    });
  }
};
