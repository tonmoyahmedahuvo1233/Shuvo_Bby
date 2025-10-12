module.exports.config = {
    name: "xvideo",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Updated by ChatGPT",
    description: "Download video từ xvideos mà không cần API key",
    commandCategory: "video",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "cheerio": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];
    const cheerio = global.nodemodule["cheerio"];
    const { threadID, messageID } = event;

    try {
        let link = args.join(" ");
        if (!link) return api.sendMessage("Vui lòng nhập link video cần tải!", threadID, messageID);

        // Get HTML page của video
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);

        // Lấy title và author
        const title = $('h2.title').text() || "Unknown Title";
        const author = $('a[href*="/pornstars/"]').first().text() || "Unknown Author";

        // Lấy link video chất lượng thấp (Low)
        let videoURL = $('source[src]').attr('src');
        if (!videoURL) return api.sendMessage("Không tìm thấy video hoặc link không hợp lệ!", threadID, messageID);

        // Download video
        const path = __dirname + "/cache/xvideo.mp4";
        const writer = fs.createWriteStream(path);

        const response = await axios({
            url: videoURL,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage({
                body: `=>> Tên Phim: ${title}\n=>> Author: ${author}`,
                attachment: fs.createReadStream(path)
            }, threadID, () => fs.unlinkSync(path), messageID);
        });

        writer.on('error', () => {
            api.sendMessage("Lỗi khi tải video!", threadID, messageID);
        });

    } catch (err) {
        console.error(err);
        api.sendMessage("Có lỗi xảy ra! Video không tải được.", threadID, messageID);
    }
};
