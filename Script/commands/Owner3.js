const fs = require("fs");
const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");

module.exports.config = {
    name: "owner3",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "Rahat Islam (animated glow by GPT-5)",
    description: "Stylish animated Owner Info card (blue glow border)",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;

    // === Setup ===
    const width = 945;
    const height = 1260;
    const frames = 60;

    const encoder = new GIFEncoder(width, height);
    const filePath = __dirname + "/owner3_card.gif";
    encoder.createReadStream().pipe(fs.createWriteStream(filePath));
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(80);
    encoder.setQuality(10);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // === Animation frames ===
    for (let i = 0; i < frames; i++) {
        const angle = (i / frames) * 360;

        // Background gradient
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, "#001428");
        bg.addColorStop(1, "#00294d");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Glow border (animated hue)
        const hue = (angle + 180) % 360;
        ctx.lineWidth = 14;
        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.shadowBlur = 35;
        roundRect(ctx, 25, 25, width - 50, height - 50, 40, false, true);
        ctx.shadowBlur = 0;

        // Inner glass card
        drawGlassCard(ctx, 50, 60, width - 100, height - 120, 45);

        // Title
        ctx.font = "bold 70px 'Segoe UI'";
        const grad = ctx.createLinearGradient(100, 100, 700, 100);
        grad.addColorStop(0, "#aaf7ff");
        grad.addColorStop(1, "#33d4ff");
        ctx.fillStyle = grad;
        ctx.fillText("✨ OWNER INFO ✨", 140, 150);

        // Divider line
        ctx.strokeStyle = "#a0f0ff44";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, 180);
        ctx.lineTo(width - 120, 180);
        ctx.stroke();

        // Info lines
        ctx.font = "bold 40px 'Segoe UI'";
        ctx.fillStyle = "#ffffff";
        let y = 280;
        const info = [
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
        for (const line of info) {
            ctx.fillText(line, 150, y);
            y += 80;
        }

        encoder.addFrame(ctx);
    }

    encoder.finish();

    api.sendMessage({
        body: "💫 Animated Owner Card (by Rahat Islam)",
        attachment: fs.createReadStream(filePath)
    }, threadID, messageID);
};

// === Helper functions ===
function drawGlassCard(ctx, x, y, w, h, r) {
    ctx.shadowColor = "#00d5ff44";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "rgba(255,255,255,0.07)";
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
