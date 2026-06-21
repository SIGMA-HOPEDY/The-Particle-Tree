let modInfo = {
    name: "The Particle Tree",
    author: "sigma",
    pointsName: "Particles",
    modFiles: ["layers.js", "tree.js"],

    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal (0),
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

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
    return true
}

function addedPlayerData() {
    return { 
    };
}
function getPointGen() {
    if (!canGenPoints()) return new Decimal(0);

    let gain = new Decimal(0);
    if (hasUpgrade('A', 11)) gain = gain.add(1);
    if (hasUpgrade('A', 12)) gain = gain.add(upgradeEffect('A', 12));
    if (hasUpgrade('A', 13)) gain = gain.add(upgradeEffect('A', 13));
    if (hasUpgrade('A', 41)) gain = gain.add(upgradeEffect('A', 41));
    if (hasBuyables('A', 11)) gain = gain.add(buyableEffect('A', 11));
    if (hasUpgrade('A', 14)) gain = gain.times(upgradeEffect('A', 14));
    if (hasUpgrade('A', 15)) gain = gain.times(upgradeEffect('A', 15));
    if (hasUpgrade('A', 11)) gain = gain.times(upgradeEffect('A', 11));
    if (hasUpgrade('A', 42)) gain = gain.times(upgradeEffect('A', 42));
    if (hasUpgrade('A', 45)) gain = gain.times(upgradeEffect('A', 45));
    if (player.B.points > 0) gain = gain.times(player.B.points.add(1)).pow(2);
    if (hasBuyables('A', 12)) gain = gain.times(buyableEffect('A', 12));
    if (hasUpgrade('A', 35)) gain = gain.times(upgradeEffect('A', 35));
    if (hasUpgrade('A', 21)) gain = gain.pow(upgradeEffect('A', 21));
    if (hasUpgrade('A', 22)) gain = gain.pow(upgradeEffect('A', 22));
    if (hasBuyables('A', 13)) gain = gain.pow(buyableEffect('A', 13));
    if (hasUpgrade('A', 43)) gain = gain.pow(upgradeEffect('A', 43));
    
    function isValidDecimal(v) {
        return v instanceof Decimal && v.isFinite() && !v.isNan();
    }

    // ---------- 软上限处理（只计算，不 return） ----------
    let pointmax = new Decimal(1e9);
    const softcapThreshold = new Decimal(pointmax);
    let postSoftcapGain;
    if (gain.gt(softcapThreshold) && isValidDecimal(gain)) {
        let excess = gain.minus(softcapThreshold);
        if (excess.lte(0)) {
            postSoftcapGain = gain;
        } else {
            let ratio = gain.div(softcapThreshold);
            if (ratio.lte(1)) ratio = new Decimal(1.0000000001);
            let Log10Gain = ratio.log10();
            let Log10Log10Gain = Log10Gain.log10();
            if (!isValidDecimal(Log10Log10Gain)) {
                postSoftcapGain = softcapThreshold.plus(excess);
            } else {
                let exponent = new Decimal(8.2).div(new Decimal(9).plus(Log10Log10Gain));
                if (!isValidDecimal(exponent) || exponent.lte(0)) {
                    exponent = new Decimal(0.9);
                }
                let cappedExcess = excess.pow(exponent);
                if (!isValidDecimal(cappedExcess)) {
                    cappedExcess = excess;
                }
                postSoftcapGain = softcapThreshold.plus(cappedExcess);
                if (tmp && tmp.other) {
                    tmp.other.softcapHint = "粒子获取大于" + pointmax + "后,粒子获取受到软上限!(^" + exponent + ")";
                    tmp.other.softcappedPointGen = postSoftcapGain;
                }
            }
        }
    } else {
        postSoftcapGain = gain;
        if (tmp && tmp.other) {
            tmp.other.softcapHint = "";
            tmp.other.softcappedPointGen = gain;
        }
    }

    let doublepointmax = new Decimal("1e308");
    const doubleSoftcapThreshold = new Decimal(doublepointmax);
    let doubleCappedGain;
    if (postSoftcapGain.gt(doubleSoftcapThreshold)) {
        let doubleExcess = postSoftcapGain.minus(doubleSoftcapThreshold);
        let Log10Post = (postSoftcapGain.div(doublepointmax).add(1)).log10();
        let Log10Log10Post = (Log10Post.add(1)).log10();
        let doubleExponent = new Decimal(8).div(new Decimal(9.1).plus(Log10Log10Post));
        let doubleCappedExcess = doubleExcess.pow(doubleExponent);
        doubleCappedGain = doubleSoftcapThreshold.plus(doubleCappedExcess);
        if (tmp && tmp.other) {
            tmp.other.doubleSoftcapHint = "粒子获取大于" + doublepointmax + "后,粒子获取受到二重软上限!(^" + doubleExponent + ")";
        }
    } else {
        if (tmp && tmp.other) {
            tmp.other.doubleSoftcapHint = "";
        }
        doubleCappedGain = postSoftcapGain;
    }

    let triplepointmax = new Decimal("1e1000");
    const tripleSoftcapThreshold = new Decimal(triplepointmax);
    let tripleCappedGain;
    if (doubleCappedGain.gt(tripleSoftcapThreshold)) {
        let tripleExcess = doubleCappedGain.minus(tripleSoftcapThreshold);
        let Log10PostTriple = (doubleCappedGain.div(triplepointmax).add(1)).log10();
        let Log10Log10PostTriple = (Log10PostTriple.add(1)).log10();
        let tripleExponent = new Decimal(6.9).div(new Decimal(10.78).plus(Log10Log10PostTriple));
        let tripleCappedExcess = tripleExcess.pow(tripleExponent);
        tripleCappedGain = tripleSoftcapThreshold.plus(tripleCappedExcess);
        if (tmp && tmp.other) {
            tmp.other.tripleSoftcapHint = "粒子获取大于" + triplepointmax + "后,粒子获取受到三重软上限!(^" + tripleExponent + ")";
        }
    } else {
        if (tmp && tmp.other) {
            tmp.other.tripleSoftcapHint = "";
        }
        tripleCappedGain = doubleCappedGain;
    }

    let quadruplepointmax = new Decimal("1e7000");
    const quadrupleSoftcapThreshold = new Decimal(quadruplepointmax);
    let quadrupleCappedGain;
    if (tripleCappedGain.gt(quadrupleSoftcapThreshold)) {
        let quadrupleExcess = tripleCappedGain.minus(quadrupleSoftcapThreshold);
        let Log10PostQuad = (tripleCappedGain.div(quadruplepointmax).add(1)).log10();
        let Log10Log10PostQuad = (Log10PostQuad.add(1)).log10();
        let quadrupleExponent = new Decimal(7.8).div(new Decimal(17).plus(Log10Log10PostQuad));
        let quadrupleCappedExcess = quadrupleExcess.pow(quadrupleExponent);
        quadrupleCappedGain = quadrupleSoftcapThreshold.plus(quadrupleCappedExcess);
        if (tmp && tmp.other) {
            tmp.other.quadrupleSoftcapHint = "粒子获取大于" + quadruplepointmax + "后,粒子获取受到四重软上限!(^" + quadrupleExponent + ")";
        }
    } else {
        if (tmp && tmp.other) {
            tmp.other.quadrupleSoftcapHint = "";
        }
        quadrupleCappedGain = tripleCappedGain;
    }

    // ---------- ✨ 挑战逻辑（放在所有软上限之后，返回之前） ----------
    let finalGain = quadrupleCappedGain;

 // ---------- 挑战惩罚 ----------
let challengeCompletions = player.A.challenges?.[11] || 0;
if (player.A.activeChallenge === 11) {
    let exponent = 0.8 - 0.15 * challengeCompletions;
    if (exponent < 0) exponent = 0;     // 防止负指数
    finalGain = finalGain.pow(exponent);
}

// 挑战奖励（完成次数 >= 1）
if ((player.A.challenges[11] || 0) >= 1) {
    // 注意：奖励应作用于 Alpha 粒子，不要直接乘在 finalGain 上
    // 这里建议将奖励逻辑移到 Alpha 粒子转换计算中
}
    return finalGain;
}

// 辅助函数：检查是否拥有指定 buyable
function hasBuyables(layer, id) {
    let amt = player[layer]?.buyables?.[id];
    return amt instanceof Decimal ? amt.gt(0) : false;
}



function getLimit() {
    return new Decimal('100')
}
var displayThings = [
]

function isEndgame() {
    return player.points.gte(new Decimal("1e114514"))
}

var backgroundStyle = {

}

function maxTickLength() {
    return 3600
}
