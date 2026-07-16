// ==========================
// 全局辅助函数（粒子树）
// ==========================

// 标准软上限计算函数（用于升级效果）
function effectWithSoftcap(raw, cap, softPower) {
    if (raw.lte(cap)) return raw;
    let ratio = raw.div(cap);
    let capped = ratio.pow(softPower);
    return cap.times(capped);
}

// 通用软上限处理器（用于 getPointGen 中的多重软上限）
function applySoftcap(gain, threshold, baseExponent, exponentUpgrades, hintKey) {
    let exponentBase = new Decimal(baseExponent);
    
    if (gain.lte(threshold)) {
        if (tmp && tmp.other && hintKey) tmp.other[hintKey] = "";
        return gain;
    }

    let excess = gain.minus(threshold);
    if (excess.lte(0)) return gain;

    let ratio = gain.div(threshold).max(1.0000000001);
    let logGain = ratio.log10();
    let loglogGain = logGain.add(1).log10();
    let exponent = exponentBase.div(new Decimal(9).plus(loglogGain));

    if (exponentUpgrades) {
        for (let upg of exponentUpgrades) {
            if (upg.cond()) exponent = exponent.times(upg.mult);
        }
    }

    if (!exponent.isFinite() || exponent.isNan() || exponent.lte(0)) exponent = new Decimal(0.9);

    let cappedExcess = excess.pow(exponent);
    let result = threshold.plus(cappedExcess);

    if (tmp && tmp.other && hintKey) {
        tmp.other[hintKey] = `粒子获取大于 ${format(threshold, 3, true)} 后，受到软上限！(^${format(exponent, 9, true)})`;
        if (hintKey === 'softcapHint') tmp.other.softcappedPointGen = result;
    }

    return result;
}

// 获取购买项上限
function getBuyableLimit() {
    return new Decimal(100);
}