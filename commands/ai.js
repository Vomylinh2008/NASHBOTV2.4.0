const axios = require("axios");

module.exports = {
    name: "ai",
    description: "tương tác với GPT-4o Pro",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["gpt4o"],
    execute(api, event, args, prefix) {
        const { threadID, messageID, senderID } = event;
        let prompt = args.join(" ");
        if (!prompt) return api.sendMessage("Vui lòng nhập một prompt.", threadID, messageID);

        if (!global.handle) {
            global.handle = {};
        }
        if (!global.handle.replies) {
            global.handle.replies = {};
        }

        api.sendMessage(
            "[ GPT-4o Pro ]\n\n" +
            "vui lòng chờ...",
            threadID,
            (err, info) => {
                if (err) return;

                axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o-pro?q=${encodeURIComponent(prompt)}&uid=${senderID}&imageUrl=`)
                    .then(response => {
                        const reply = response.data.response;
                        api.editMessage(
                            reply,
                            info.messageID
                        );
                        global.handle.replies[info.messageID] = {
                            cmdname: module.exports.name,
                            this_mid: info.messageID,
                            this_tid: info.threadID,
                            tid: threadID,
                            mid: messageID,
                        };
                    })
                    .catch(error => {
                        console.error("Lỗi khi lấy dữ liệu:", error.message);
                        api.editMessage("Không thể lấy dữ liệu. Vui lòng thử lại sau.", info.messageID);
                    });
            },
            messageID
        );
    },
};
