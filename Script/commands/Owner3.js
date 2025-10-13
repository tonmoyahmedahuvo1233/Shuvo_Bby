const fs = require("fs");
const { createCanvas } = require("canvas");

module.exports.config = {
    name: "owner3",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Rahat Islam",
    description: "Show beautiful Owner Info card",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;

    const width = 1600;
    const height = 1000;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // === 🌈 Background Gradient ===
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#1b0a2a");
    bgGradient.addColorStop(1, "#3d1e60");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // === 💎 Glass Card ===
    const cardX = 100, cardY = 100;
    const cardWidth = width - 200, cardHeight = height - 200;
    drawGlassCard(ctx, cardX, cardY, cardWidth, cardHeight, 40);

    // === ✨ Title ===
    ctx.font = "bold 70px 'Segoe UI'";
    const titleGrad = ctx.createLinearGradient(cardX, cardY, cardX + 600, cardY);
    titleGrad.addColorStop(0, "#ff66cc");
    titleGrad.addColorStop(1, "#ff99ff");
    ctx.fillStyle = titleGrad;
    ctx.shadowColor = "#ff99ff88";
    ctx.shadowBlur = 25;
    ctx.fillText("✨ OWNER INFO ✨", cardX + 200, cardY + 90);
    ctx.shadowBlur = 0;

    // === Divider ===
    ctx.strokeStyle = "#ffffff22";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 80, cardY + 120);
    ctx.lineTo(cardX + cardWidth - 80, cardY + 120);
    ctx.stroke();

    // === ℹ️ Owner Info Text ===
    ctx.font = "bold 40px 'Segoe UI'";
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
        ctx.fillText(line, cardX + 150, textY);
        textY += 70;
    }

    // === 🌸 Decorative Line Bottom ===
    ctx.strokeStyle = "#ff99ff55";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cardX + 100, cardY + cardHeight - 80);
    ctx.lineTo(cardX + cardWidth - 100, cardY + cardHeight - 80);
    ctx.stroke();

    // === 🕒 Timestamp ===
    ctx.font = "italic 26px 'Segoe UI'";
    ctx.fillStyle = "#ffccee";
    ctx.fillText(`Generated on: ${new Date().toLocaleString()}`, cardX + 120, height - 60);

    // === Save & Send ===
    const buffer = canvas.toBuffer("image/png");
    const filePath = __dirname + "/owner3_card.png";
    fs.writeFileSync(filePath, buffer);

    api.sendMessage({
        body: "💖 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 💖",
        attachment: fs.createReadStream(filePath)
    }, threadID, messageID);
};

// 🔹 Helper Functions 🔹
function drawGlassCard(ctx, x, y, w, h, r) {
    ctx.shadowColor = "#ff99ff55";
    ctx.shadowBlur = 40;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
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
