const fs = require('fs');
const path = require('path');

module.exports = {
  name: "load",
  description: "Kiểm tra lỗi các lệnh hoặc tải lại lệnh chỉ định",
  nashPrefix: false,
  version: "1.1.0",
  cooldowns: 5,
  aliases: ["load"],
  execute(api, event, args, prefix) {
    function loadModule(filePath) {
      try {
        delete require.cache[require.resolve(filePath)];
        return require(filePath);
      } catch (error) {
        console.error(`Lỗi khi tải module ${filePath}:`, error.message);
        api.sendMessage(`Lỗi khi tải module ${filePath}: ${error.message}`, event.threadID, event.messageID);
        return null;
      }
    }

    function loadModules(dir) {
      const modules = {};
      fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
          const moduleName = path.basename(file, '.js');
          modules[moduleName] = loadModule(filePath);
        }
      });
      return modules;
    }

    function notifyModuleProperties(module) {
      api.sendMessage(`Tên: ${module.name}\nMô tả: ${module.description}\nPhiên bản: ${module.version}\nThời gian chờ: ${module.cooldowns}\nBí danh: ${module.aliases ? module.aliases.join(', ') : 'Không có'}`, event.threadID, event.messageID);
    }

    if (args.length === 0 || args[0].toLowerCase() === 'all') {
      // Tải tất cả các module trong thư mục 'commands'
      const modules = loadModules(path.join(__dirname, 'commands'));

      // Thông báo các tính chất của tất cả các module
      Object.values(modules).forEach(module => {
        if (module) {
          notifyModuleProperties(module);
        }
      });
    } else {
      // Tải lại module được chỉ định
      const moduleFile = `${args[0]}.js`;
      const modulePath = path.join(__dirname, 'commands', moduleFile);
      if (fs.existsSync(modulePath)) {
        const module = loadModule(modulePath);
        if (module) {
          notifyModuleProperties(module);
        }
      } else {
        api.sendMessage(`Module ${moduleFile} không tồn tại.`, event.threadID, event.messageID);
      }
    }
  }
};
