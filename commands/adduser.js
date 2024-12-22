module.exports = {
    name: "adduser",
    description: "Thêm một người dùng vào nhóm chat bằng UID của họ",
    nashPrefix: false,
    version: "1.0.0",
    role: "admin",
    cooldowns: 5,
    async execute(api, event, args) {
        const { threadID, messageID } = event;
        const uid = args[0];

        if (!uid) {
            return api.sendMessage(
                "[ 𝙰𝙳𝙳 𝚄𝚂𝙴𝚁 ]\n\n" +
                "❗ Vui lòng cung cấp UID để thêm.\n\nVí dụ: adduser 1234567890",
                threadID,
                messageID
            );
        }

        api.sendMessage(
            "[ 𝙰𝙳𝙳 𝚄𝚂𝙴𝚁 ]\n\n" +
            "Đang cố gắng thêm người dùng...",
            threadID,
            async (err, info) => {
                if (err) return;

                try {
                    await api.addUserToGroup(uid, threadID);
                    api.editMessage(
                        "[ 𝙰𝙳𝙳 𝚄𝚂𝙴𝚁 ]\n\n" +
                        "Đã thêm người dùng thành công!\n\nCách để gỡ bỏ một tin nhắn? Hãy phản ứng với nó bằng biểu tượng ngón cái (👍). Nếu bạn là người gửi, bot sẽ tự động gỡ bỏ tin nhắn.",
                        info.messageID
                    );
                } catch (error) {
                    api.sendMessage(
                        "❌ Thêm người dùng thất bại. Vui lòng kiểm tra lại UID và thử lại.",
                        threadID,
                        messageID
                    );
                }
            },
            messageID
        );
    },
};
