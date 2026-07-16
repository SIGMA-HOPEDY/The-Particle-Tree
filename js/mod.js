let modInfo = {
    name: "The Particle Tree",
    author: "sigma",
    pointsName: "Particles",
    modFiles: ["globals.js", "layers.js", "tree.js"],
    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal(0),
    offlineLimit: 5,
}

let VERSION = {
    num: "0.0",
    name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v0.0</h3><br>
        - Added things.<br>
        - Added stuff.`

let winText = `这便是终点...了?`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints() {
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints() {
    return true
}

function addedPlayerData() {
    return {};
}

// 检查购买项是否拥有
function hasBuyable(layer, id) {
    let amt = player[layer]?.buyables?.[id];
    return amt instanceof Decimal ? amt.gt(0) : false;
}

function getPointGen() {
    if (!canGenPoints()) return new Decimal(0);

    let gain = new Decimal(0);

    // ---- 基础加成（加法） ----
    if (hasUpgrade('A', 11)) gain = gain.add(1);
    if (hasUpgrade('A', 12)) gain = gain.add(1);
    if (hasUpgrade('A', 13)) gain = gain.add(upgradeEffect('A', 13));
    if (hasBuyable('A', 11)) gain = gain.add(buyableEffect('A', 11));

    // ---- 乘法加成 ----
    if (hasUpgrade('A', 14)) gain = gain.times(upgradeEffect('A', 14));
    if (hasUpgrade('A', 15)) gain = gain.times(upgradeEffect('A', 15));
    if (hasUpgrade('A', 11)) gain = gain.times(upgradeEffect('A', 11));
    if (hasUpgrade('A', 42)) gain = gain.times(upgradeEffect('A', 42));
    if (hasUpgrade('A', 45)) gain = gain.times(upgradeEffect('A', 45));
    if (hasUpgrade('A', 35)) gain = gain.times(upgradeEffect('A', 35));
    if (hasUpgrade('A', 41)) gain = gain.times(upgradeEffect('A', 41));
    if (player.B.points > 0) gain = gain.times(player.B.points.add(1).pow(2));
    

    // ---- 指数加成 ----
    if (hasUpgrade('A', 21)) gain = gain.pow(upgradeEffect('A', 21));
    if (hasUpgrade('A', 22)) gain = gain.pow(upgradeEffect('A', 22));
    if (hasUpgrade('A', 43)) gain = gain.pow(upgradeEffect('A', 43));

    // ---- 挑战惩罚 ----
    if (player.A.activeChallenge === 11) {
        let comp = player.A.challenges?.[11] || 0;
        let exponent = Math.max(0.8 - 0.15 * comp, 0.05);
        gain = gain.pow(exponent);
    }

    // ---- 软上限处理 ----
    // 一重
    gain = applySoftcap(gain, new Decimal(1e9), 8.2, [], 'softcapHint');
    // 二重
    gain = applySoftcap(gain, new Decimal("1e308"), 8, [], 'doubleSoftcapHint');
    // 三重
    gain = applySoftcap(gain, new Decimal("1e1000"), 6.9, [], 'tripleSoftcapHint');
    // 四重
    gain = applySoftcap(gain, new Decimal("1e7000"), 7.8, [], 'quadrupleSoftcapHint');

    return gain;
}

var displayThings = [];

function isEndgame() {
    return player.points.gte(new Decimal("1e114514"))
}

var backgroundStyle = {};

function maxTickLength() {
    return 3600;
}