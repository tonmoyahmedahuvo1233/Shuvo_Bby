const fs = require("fs");
const { createCanvas } = require("canvas");

module.exports.config = {
    name: "owner3",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Rahat Islam (designed by GPT-5)",
    description: "Show beautiful Owner Info card with dark-blue theme",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;

    // Canvas size 945x1260
    const width = 945;
    const height = 1260;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // === 🎨 Background: Dark → Deep Blue Gradient ===
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#0a0a14");   // dark navy
    bgGradient.addColorStop(0.5, "#0c1a3a"); // deep blue midtone
    bgGradient.addColorStop(1, "#10284a");   // lighter bottom tone
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // === 💠 Glass Card (semi-transparent) ===
    const cardX = 70, cardY = 90;
    const cardWidth = width - 140, cardHeight = height - 180;
    drawGlassCard(ctx, cardX, cardY, cardWidth, cardHeight, 35);

    // === ✨ Title ===
    ctx.font = "bold 65px 'Segoe UI'";
    const titleGrad = ctx.createLinearGradient(cardX, cardY, cardX + 500, cardY);
    titleGrad.addColorStop(0, "#00e0ff");
    titleGrad.addColorStop(1, "#00baff");
    ctx.fillStyle = titleGrad;
    ctx.shadowColor = "#00baff88";
    ctx.shadowBlur = 25;
    ctx.fillText("✨ OWNER INFO ✨", cardX + 150, cardY + 90);
    ctx.shadowBlur = 0;

    // === Divider ===
    ctx.strokeStyle = "#00baff33";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 60, cardY + 120);
    ctx.lineTo(cardX + cardWidth - 60, cardY + 120);
    ctx.stroke();

    // === ℹ️ Owner Info Text ===
    ctx.font = "bold 38px 'Segoe UI'";
    ctx.fillStyle = "#ffffff";
    let textY = cardY + 200;

    const lines = [
        "👑 Name : Rahat Islam",
        "🧸 Nickname : Rahat",
        "🎂 Age : 16",
        "💘 Relation : Single",
        "🎓 Profession : Student",
        "🏡 Address : Jamalpur",
        "",
        "🔗 CONTACT LINKS",
        "📘 Facebook : fb.com/61581900625860",
        "💬 Messenger : m.me/61581900625860"
    ];

    for (let line of lines) {
        ctx.fillText(line, cardX + 100, textY);
        textY += 70;
    }

    // === Decorative bottom line ===
    ctx.strokeStyle = "#00baff55";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cardX + 80, cardY + cardHeight - 90);
    ctx.lineTo(cardX + cardWidth - 80, cardY + cardHeight - 90);
    ctx.stroke();

    // === ⏰ Timestamp ===
    ctx.font = "italic 26px 'Segoe UI'";
    ctx.fillStyle = "#66e0ff";
    ctx.fillText(`Generated on: ${new Date().toLocaleString()}`, cardX + 90, height - 60);

    // === Save & Send ===
    const buffer = canvas.toBuffer("image/png");
    const filePath = __dirname + "/owner3_card.png";
    fs.writeFileSync(filePath, buffer);

    api.sendMessage({
        body: "💙 𝗥𝗮𝗵𝗮𝘁 𝗕𝗼𝘁 💙\n✨ Owner Information Card ✨",
        attachment: fs.createReadStream(filePath)
    }, threadID, messageID);
};

// 🔹 Helper Functions 🔹
function drawGlassCard(ctx, x, y, w, h, r) {
    ctx.shadowColor = "#00baff55";
    ctx.shadowBlur = 35;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    roundRect(ctx, x, y, w, h, r, true, false);
    ctx.shadowBlur = 0;
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    if (typeof r === "number") r = { tl: r, tr: r, br: r, bl: r };
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}
