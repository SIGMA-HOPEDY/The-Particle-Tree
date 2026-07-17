// ========================== 层级定义 ==========================

addLayer("A", {
    name: "α",
    symbol: "α",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        };
    },
    color: "#e100ffff",
    requires: new Decimal(10),
    resource: "Alpha particles",
    baseResource: "Particles",
    baseAmount() { return player.points },
    type: "normal",
    exponent: function() {
        return new Decimal(1).div(2.25);
    },
    passiveGeneration: function() {
        let p = new Decimal(0);
        if (hasUpgrade('B', 11)) p=p.add(Decimal.min(player.B.points.add(1).times(0.1), 1));
        return p;
    },
    gainMult() {
        let m = new Decimal(1);
        if (player.B.points > 0) m = m.times(player.B.points.add(1).pow(2));
        if (hasUpgrade('A', 23)) m = m.times(upgradeEffect('A', 23));
        if (hasMilestone('B', 0)) m = m.times(2);
        if (hasMilestone('B', 1)) m = m.times(5);
       // A 层 gainMult 内部
if (player.B.flyers && player.B.flyers[11].amount.gt(0)) {
    m = m.times(layers.B.buyables[11].effect());
}
        // 挑战奖励
        let comp = player.A.challenges?.[11] || 0;
        if (comp >= 1) {
            m = m.times(Decimal.pow(comp * 0.1 + 2, comp));
        }
        return m;
    },
    gainExp() { return new Decimal(1) },
    row: 0,
    hotkeys: [],
    tabFormat: {
        "Upgrades": { content: ["main-display", "prestige-button", "blank", "upgrades"] },
        "Buyables": { content: ["main-display", "prestige-button", "blank", "buyables"] },
        "Challenges": { content: ["main-display", "prestige-button", "blank", "challenges"] },
    },
    layerShown() { return true },
    upgrades: {
        rows: 5, cols: 5,
        11: {
            title: "初始的粒子",
            description: "粒子生成基数+1,Alpha粒子增幅粒子生成",
            cost: new Decimal(0),
            unlocked() { return true },
            effect() {
                let raw = player.A.points.add(1).pow(0.333);
                let cap = new Decimal("1e9");
                return effectWithSoftcap(raw, cap, 0.1665);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        12: {
            title: "粒子生成器",
            description: "解锁粒子生成器，粒子生成基数+1",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade('A', 11) },
            effect() { return new Decimal(1); },
        },
        13: {
            title: "粒子碰撞",
            description: "粒子极小幅度增加粒子生成基数",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade('A', 12) },
            effect() {
                let raw = player.points.add(10).log10().pow(1.5);
                let cap = new Decimal("1e9");
                return effectWithSoftcap(raw, cap, 0.75);
            },
            effectDisplay() { return '+' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        14: {
            title: "粒子增幅器",
            description: "解锁粒子增幅器，粒子生成*2",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade('A', 13) },
            effect() { return new Decimal(2); },
        },
        15: {
            title: "粒子激发",
            description: "粒子极小幅度增幅粒子生成",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade('A', 14) },
            effect() {
                let raw = player.points.add(10).log10().pow(1.25);
                let cap = new Decimal("1e9");
                return effectWithSoftcap(raw, cap, 0.625);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        21: {
            title: "粒子振荡器",
            description: "解锁粒子振荡器，粒子生成^1.01",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('A', 15) },
            effect() { return new Decimal(1.01); },
        },
        22: {
            title: "粒子振荡",
            description: "粒子极微小幅度增幅粒子生成指数(不低于^1.05)",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade('A', 21) },
            effect() {
                let raw = player.points.add(10).log10().pow(0.05).div(20).add(1);
                let cap = new Decimal("2");
                return effectWithSoftcap(raw, cap, 0.025);
            },
            effectDisplay() { return '^' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        23: {
            title: "Alpha粒子",
            description: "粒子小幅度增幅Alpha粒子",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade('A', 22) },
            effect() {
                let raw = player.points.add(1).pow(0.125);
                let cap = new Decimal("1e9");
                return effectWithSoftcap(raw, cap, 0.0625);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        24: {
            title: "生成增幅",
            description: "Alpha粒子极小幅度增幅粒子生成器效果基数",
            cost: new Decimal(10000),
            unlocked() { return hasUpgrade('A', 23) },
            effect() {
                let raw = player.A.points.add(1).pow(0.03);
                let cap = new Decimal("1e9");
                return effectWithSoftcap(raw, cap, 0.015);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        25: {
            title: "增幅增幅",
            description: "Alpha粒子小幅度增幅粒子增幅器效果基数",
            cost: new Decimal(1e5),
            unlocked() { return hasUpgrade('A', 24) },
            effect() {
                let raw = player.A.points.add(1).pow(0.15);
                let cap = new Decimal("1e9");
                return effectWithSoftcap(raw, cap, 0.075);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        31: {
            title: "生成器强化 I",
            description: "粒子生成器效果基数额外乘以Alpha粒子数的0.02次方",
            cost: new Decimal(1e6),
            unlocked() { return hasUpgrade('A', 25) },
            effect() {
                let raw = player.A.points.add(1).pow(0.02);
                let cap = new Decimal("1e9");
                return effectWithSoftcap(raw, cap, 0.01);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        32: {
            title: "振荡器优化",
            description: "粒子振荡器效果指数 +0.01",
            cost: new Decimal(1e7),
            unlocked() { return hasUpgrade('A', 31) },
            effect() { return new Decimal(0.01); },
            effectDisplay() { return '+' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        33: {
            title: "生成器强化 II",
            description: "粒子生成器效果再乘以Alpha 粒子数的0.03次方,解锁Alpha挑战1",
            cost: new Decimal(1e8),
            unlocked() { return hasUpgrade('A', 32) },
            effect() {
                let raw = player.A.points.add(1).pow(0.03);
                let cap = new Decimal("1e9");
                return effectWithSoftcap(raw, cap, 0.015);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        34: {
            title: "振荡器优化 II",
            description: "粒子振荡器效果指数 +0.01",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade('A', 33) },
            effect() { return new Decimal(0.01); },
            effectDisplay() { return '+' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        35: {
            title: "Alpha 共鸣I",
            description: "Alpha 粒子数增幅粒子生成",
            cost: new Decimal(1e10),
            unlocked() { return hasUpgrade('A', 34) },
            effect() {
                let raw = player.A.points.add(10).log10().div(20).add(1);
                let cap = new Decimal(1e3);
                return effectWithSoftcap(raw, cap, 0.8);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        41: {
            title: "粒子大碰撞",
            description: "基础粒子大幅增幅粒子生成基数",
            cost: new Decimal(1e12),
            unlocked() { return hasUpgrade('A', 35) },
            effect() {
                let raw = player.points.add(10).log10().pow(2);
                let cap = new Decimal(1e12);
                return effectWithSoftcap(raw, cap, 0.6);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        42: {
            title: "共振转换",
            description: "基于粒子生成器、增幅器、振荡器大幅增幅粒子生成",
            cost: new Decimal(1e14),
            unlocked() { return hasUpgrade('A', 41) },
            effect() {
                let gen = player.A.buyables[11] || new Decimal(1);
                let amp = player.A.buyables[12] || new Decimal(1);
                let osc = player.A.buyables[13] || new Decimal(1);
                let total = gen.add(1).times(amp.add(1)).pow(osc.add(1).log10().div(10).add(1));
                let raw = total.div(10).add(1);
                let cap = new Decimal(1e9);
                return effectWithSoftcap(raw, cap, 0.75);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        43: {
            title: "挑战适应I",
            description: "粒子生成^{1+0.002*挑战完成次数}",
            cost: new Decimal(1e16),
            unlocked() { return hasUpgrade('A', 42) },
            effect() {
                let comp1 = player.A.challenges?.[11] || 0;
                let comp2 = player.A.challenges?.[12] || 0;
                let comp = comp1 + comp2;
                return new Decimal(1 + 0.002 * comp);
            },
            effectDisplay() { return '^' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
        44: {
            title: "粒子熵增",
            description: "Alpha 粒子数极微增幅粒子振荡器效果指数",
            cost: new Decimal(1e18),
            unlocked() { return hasUpgrade('A', 43) },
            effect() {
                let raw = player.A.points.add(1).log10().pow(0.03).div(100);
                let cap = new Decimal(0.1);
                return effectWithSoftcap(raw, cap, 0.003);
            },
            effectDisplay() { return '+' + format(upgradeEffect(this.layer, this.id), 4, true) + ' 指数' },
        },
        45: {
            title: "Alpha 共鸣II",
            description: "粒子生成*lg(Alpha粒子数+10),解锁Beta层(1e25Alpha粒子)",
            cost: new Decimal(1e20),
            unlocked() { return hasUpgrade('A', 44) },
            effect() {
                let raw = player.A.points.add(10).log10().max(1);
                let cap = new Decimal(1e9);
                return effectWithSoftcap(raw, cap, 0.85);
            },
            effectDisplay() { return '*' + format(upgradeEffect(this.layer, this.id), 4, true) },
        },
    },
    buyables: {
        11: {
            title: "粒子生成器",
            unlocked() {
        return hasUpgrade('A', 12) && player.A.activeChallenge != 12;
    },
            cost(x) {
                if (x.eq(0)) return new Decimal(1);
                return Decimal.pow(x.add(1).log10().add(1.1), x.times(1.1)).floor()
                    .times(Decimal.pow(10, x.div(20).floor().sub(1).max(0))).max(1);
            },
            effect(x) {
                if (x.eq(0)) return new Decimal(1);
                let exp = x.div(10).add(1).floor().log10().max(1);
                let mult = new Decimal(1);
                if (hasUpgrade('A', 24)) mult = mult.times(upgradeEffect('A', 24));
                if (hasUpgrade('A', 31)) mult = mult.times(upgradeEffect('A', 31));
                if (hasUpgrade('A', 33)) mult = mult.times(upgradeEffect('A', 33));
                let raw = x.times(x.add(1).times(10).log10().max(1)).times(mult).pow(exp);
                if (hasBuyable('A', 12)) raw = raw.times(buyableEffect('A', 12));
                return raw.gt(1e88) ? raw.sqrt() : raw;
            },
            display() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let cost = tmp[this.layer].buyables[this.id]?.cost || new Decimal(0);
                let eff = tmp[this.layer].buyables[this.id]?.effect || new Decimal(1);
                return `花费: ${format(cost)} α\n已购买: ${formatWhole(x)} / ${formatWhole(getBuyableLimit())}\n效果: 粒子生成基数+${format(eff, 4, true)}`;
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id]?.cost || Decimal.infinity);
            },
            buy() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                if (x.gte(getBuyableLimit().floor())) return;
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);
                player[this.layer].buyables[this.id] = x.add(1);
                updateTemp();
            },
        },
        12: {
            title: "粒子增幅器",
            unlocked() {
        return hasUpgrade('A', 14) && player.A.activeChallenge != 12;
    },
            cost(x) {
                if (x.eq(0)) return new Decimal(10);
                return Decimal.pow(x.add(1).log10().add(2.2), x.times(1.2)).times(10).floor()
                    .times(Decimal.pow(100, x.div(10).floor().sub(1).max(0))).max(10);
            },
            effect(x) {
                if (x.eq(0)) return new Decimal(1);
                let exp = Decimal.max(x.div(20).add(1).log10(),1);
                let mult = new Decimal(1);
                if (hasUpgrade('A', 25)) mult = mult.times(upgradeEffect('A', 25));
                let raw = x.times(x.add(1).times(10).log10()).add(1).times(mult).pow(exp);
                if (hasBuyable('A', 13)) raw = raw.pow(buyableEffect('A', 13));
                return raw.gt(1e88) ? raw.sqrt() : raw;
            },
            display() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let cost = tmp[this.layer].buyables[this.id]?.cost || new Decimal(0);
                let eff = tmp[this.layer].buyables[this.id]?.effect || new Decimal(1);
                return `花费: ${format(cost)} α\n已购买: ${formatWhole(x)} / ${formatWhole(getBuyableLimit())}\n效果: 粒子生成器效果×${format(eff, 4, true)}`;
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id]?.cost || Decimal.infinity);
            },
            buy() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                if (x.gte(getBuyableLimit().floor())) return;
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);
                player[this.layer].buyables[this.id] = x.add(1);
                updateTemp();
            },
        },
        13: {
            title: "粒子振荡器",
            unlocked() {
        return hasUpgrade('A', 21) && player.A.activeChallenge != 12;
    },
            cost(x) {
                if (x.eq(0)) return new Decimal(100);
                return Decimal.pow(x.times(0.056).add(4.4), x.times(1.3)).times(100).floor()
                    .times(Decimal.pow(1000, x.div(5).floor().sub(1).max(0))).max(100);
            },
            effect(x) {
                if (x.eq(0)) return new Decimal(1);
                let exp = new Decimal(0.48);
                if (hasUpgrade('A', 32)) exp = exp.add(upgradeEffect('A', 32));
                if (hasUpgrade('A', 34)) exp = exp.add(upgradeEffect('A', 34));
                if (hasUpgrade('A', 44)) exp = exp.add(upgradeEffect('A', 44));
                let raw = x.add(1).pow(exp);
                return raw.gt(5) ? raw.div(5).pow(raw.div(5).pow(-1)).times(5) : raw;
            },
            display() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let cost = tmp[this.layer].buyables[this.id]?.cost || new Decimal(0);
                let eff = tmp[this.layer].buyables[this.id]?.effect || new Decimal(1);
                return `花费: ${format(cost)} α\n已购买: ${formatWhole(x)} / ${formatWhole(getBuyableLimit())}\n效果: 粒子增幅器效果^${format(eff, 4, true)}`;
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id]?.cost || Decimal.infinity);
            },
            buy() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                if (x.gte(getBuyableLimit().floor())) return;
                player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);
                player[this.layer].buyables[this.id] = x.add(1);
                updateTemp();
            },
        },
    },
    challenges: {
        11: {
            name: "粒子堙灭",
            challengeDescription() {
                let comp = player.A.challenges[11] || 0;
                let exp = Math.max(0.8 - 0.15 * comp, 0.05);
                return `粒子生成 ^ ${exp.toFixed(1)} (可完成次数：5)`;
            },
            goal: new Decimal("1e9"),
            completionLimit: 5,
            unlocked() { return hasUpgrade('A', 33) },
            rewardDescription() {
                let comp = player.A.challenges[11] || 0;
                let mult = Decimal.pow(comp * 0.2 + 2, comp);
                return `Alpha粒子获得 *${format(mult)} (已完成 ${comp} 次)`;
            },
        },
        12: {
    name: "无法生成",
    challengeDescription() {
        return "粒子生成器、增幅器、振荡器被禁用。(可完成次数：4)";
    },
    goal() {
        let comp = player.A.challenges?.[12] || 0;
        return Decimal.pow("1e10", comp + 1);
    },
    completionLimit: 4,
    unlocked() { return hasMilestone('B', 3); },
    rewardDescription() {
        let comp = player.A.challenges?.[12] || 0;
        let mult = comp * 0.25;
        return `β粒子生成对数基数 -${mult},分母基数 -${comp * 0.5} (已完成 ${comp} 次)`;
    },
}
    },
});

addLayer("B", {
    name: "β",
    symbol: "β",
    position: 1,
    resource: "Beta particles",
    baseResource: "Alpha particles",
    color: "#00e5ffff",
    type: "custom",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            m: new Decimal(0),
            n: new Decimal(0),
            flyers: {                           // ← 新增
                11: { level: new Decimal(1), amount: new Decimal(0), mult: new Decimal(1) },
                12: { level: new Decimal(1), amount: new Decimal(0), mult: new Decimal(1) },
                13: { level: new Decimal(1), amount: new Decimal(0), mult: new Decimal(1) },
            },
        };
    },

    layerShown() { return hasUpgrade('A', 45) || player.B.unlocked; },
    baseAmount() { return player.A.points; },
    // 计算叠加了所有升级和挑战奖励后的 m、n
getEffectiveMN() {
    let m = new Decimal(0);
    let n = new Decimal(0);

    // 挑战 2 奖励：每完成一次，m 和 n 各 +0.25
    let comp12 = player.A.challenges?.[12] || 0;
    if (comp12 >= 1) {
        m = m.add(comp12 * 0.25);
        n = n.add(comp12 * 0.5);
    }
    if (hasUpgrade('B', 13)) m = m.add(upgradeEffect('B', 13));
  if (hasUpgrade('B', 15)) m = m.add(upgradeEffect('B', 15));
  if (hasUpgrade('B', 12)) n = n.add(upgradeEffect('B', 12));
  if (hasUpgrade('B', 14)) n = n.add(upgradeEffect('B', 14));

    return { m, n };
},
    // β 粒子获取公式
getResetGain() {
    let alpha = player.A.points.add(1);
    let { m, n } = this.getEffectiveMN();   // ← 用统一函数获取

    let base = Decimal.max(Decimal.sub(10, m), 2);
    let divisor = Decimal.max(1, Decimal.sub(25, n));

    let log10e = new Decimal(Math.log10(Math.E));
    let logAlpha = alpha.log10().div(log10e);
    let logBase = base.log10().div(log10e);

    let mult = new Decimal(1);
    if (hasMilestone('B', 2)) mult = mult.times(player.A.points.add(1).log10().add(1).log10().add(2));
    let exp = new Decimal(1);
    let basegain = logAlpha.div(logBase).div(divisor).times(mult).pow(exp).floor();
    return basegain.max(0);
},

getNextAt(canMax) {
    let { m, n } = this.getEffectiveMN();   // ← 用统一函数获取

    let base = Decimal.max(Decimal.sub(10, m), 1);
    let divisor = Decimal.max(1, Decimal.sub(25, n));

    let currentGain = this.getResetGain();
    let targetGain = currentGain.add(1);
    let req = Decimal.pow(base, targetGain.times(divisor)).sub(1);
    return req.max(1);
},

    prestigeButtonText() {
        let gain = this.getResetGain();
        let next = this.getNextAt();
        return `重置获得 +${formatWhole(gain)} ${this.resource}<br>下一个需要 ${format(next)} Alpha 粒子`;
    },

    canReset() { return this.getResetGain().gt(0); },
    passiveGeneration() { return 0; },
    row: 1,

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["display-text", function() {
    let { m, n } = layers.B.getEffectiveMN();
    let base = Decimal.max(Decimal.sub(10, m), 1);
    let divisor = Decimal.max(1, Decimal.sub(25, n));
    let formula = `β粒子获得=log_${format(base, 2)}(α粒子+1)/${format(divisor, 2)}`;
    let beta = player.B.points.add(1);
    return `${formula}\nβ粒子使粒子获得*${format(beta.pow(2))}\nAlpha粒子获得*${format(beta)}`;
}],
                "prestige-button",
                "blank",
                "milestones",
                "upgrades",
                'buyables'
            ]
        },
    },

    upgrades: {
        rows: 1, cols: 5,
        11: {
            title: "自动粒子I",
            description: "每秒自动获得((β粒子+1)*10)%可获得Alpha粒子(不低于10%,上限100%)",
            cost: new Decimal(1),
        },
        12: {
            title: "分母缩短 I",
            description: "分母减少 1",
            cost: new Decimal(3),
           effect() {
                let raw = new Decimal(1);
                return raw;
            },
            effectDisplay() {
    let { n } = layers.B.getEffectiveMN();
    return `当前 n = ${format(n, 2)}`;
},
        },
        13: {
            title: "底数减少 I",
            description: "底数减少 1",
            cost: new Decimal(5),
             effect() {
                let raw = new Decimal(1);
                return raw;
            },
            effectDisplay() {
                let { m } = layers.B.getEffectiveMN();
                return `当前 m = ${format(m, 2)}`;
            },
        },
        14: {
            title: "分母缩短 II",
            description: "分母减少 2",
            cost: new Decimal(7),
            unlocked() { return hasUpgrade('B', 12); },
            effect() {
                let raw = new Decimal(2);
                return raw;
            },
            effectDisplay() {
    let { n } = layers.B.getEffectiveMN();
    return `当前 n = ${format(n, 2)}`;
},
        },
        15: {
            title: "底数减少 II",
            description: "底数减少 2",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade('B', 13); },
           effect() {
                let raw = new Decimal(2);
                return raw;
            },
            effectDisplay() {
    let { m } = layers.B.getEffectiveMN();
    return `当前 m = ${format(m, 2)}`;
},
        },
    },
update(diff) {
    if (!player.B.flyers) return;
    let f = player.B.flyers;

    // III → II 生产
    let prodIIItoII = f[13].amount.times(f[13].mult).times(diff);
    f[12].amount = f[12].amount.add(prodIIItoII);

    // II → I 生产
    let prodIItoI = f[12].amount.times(f[12].mult).times(diff);
    f[11].amount = f[11].amount.add(prodIItoI);

    // 更新乘数（未解锁时默认为 1）
    f[12].mult = f[13].amount.gt(0)
        ? layers.B.buyables[13].effect()
        : new Decimal(1);
    f[11].mult = f[12].amount.gt(0)
        ? layers.B.buyables[12].effect()
        : new Decimal(1);
},

buyables: {
    11: {
        title: "Alpha飞越器 I",unlocked() { return hasMilestone('B', 2); },
        cost(x) {
            let level = player.B.flyers[11].level;
            return Decimal.pow(level.sub(1).div(10).add(1), level).floor();
        },
        display() {
            let f = player.B.flyers[11];
            let cost = this.cost();
            return `花费: ${format(cost)} β\n` +
                   `等级: ${formatWhole(f.level)} | 个数: ${formatWhole(f.amount)}\n` +
                   `乘数: ${format(f.mult, 4)}\n` +
                   `效果: Alpha 粒子获取 *${format(this.effect())}`;
        },
        effect() {
            let f = player.B.flyers[11];
            let base = f.level.times(f.amount).times(Decimal.pow(2, f.level.div(10).floor()));
            let mult = new Decimal(f.mult || 1);
            let raw = base.times(mult).max(1);
            return raw.gt(1e308) ? raw.sqrt() : raw;
        },
        canAfford() { return player.B.points.gte(this.cost()); },
        buy() {
            let cost = this.cost();
            player.B.points = player.B.points.sub(cost);
            let f = player.B.flyers[11];
            f.level = f.level.add(1);
            f.amount = f.amount.add(1);
            updateTemp();
        },
    },
    12: {
        title: "Alpha飞越器 II",unlocked() { return hasMilestone('B', 2); },
        cost(x) {
            let level = player.B.flyers[12].level;
            return Decimal.pow(level.sub(1).div(8).add(1), level).times(10).floor();
        },
        display() {
            let f = player.B.flyers[12];
            let cost = this.cost();
            return `花费: ${format(cost)} β\n` +
                   `等级: ${formatWhole(f.level)} | 个数: ${formatWhole(f.amount)}\n` +
                   `乘数: ${format(f.mult, 4)}\n` +
                   `效果: 飞越器 I 乘数变为 ${format(this.effect(), 4)}`;
        },
        effect() {
            let f = player.B.flyers[12];
            let base = f.level.times(f.amount).times(Decimal.pow(1.5, f.level.div(10).floor()));
            let mult = new Decimal(f.mult || 1);
            let raw = base.times(mult).max(1);
            return raw.gt(1e308) ? raw.sqrt() : raw;
        },
        canAfford() { return player.B.points.gte(this.cost()); },
        buy() {
            let cost = this.cost();
            player.B.points = player.B.points.sub(cost);
            let f = player.B.flyers[12];
            f.level = f.level.add(1);
            f.amount = f.amount.add(1);
            updateTemp();
        },
    },
    13: {
        title: "Alpha飞越器 III",unlocked() { return hasMilestone('B', 2); },
        cost(x) {
            let level = player.B.flyers[13].level;
            return Decimal.pow(level.sub(1).div(6).add(1), level).times(100).floor();
        },
        display() {
            let f = player.B.flyers[13];
            let cost = this.cost();
            return `花费: ${format(cost)} β\n` +
                   `等级: ${formatWhole(f.level)} | 个数: ${formatWhole(f.amount)}\n` +
                   `乘数: ${format(f.mult, 4)}\n` +
                   `效果: 飞越器 II 乘数变为 ${format(this.effect(), 4)}`;
        },
        effect() {
            let f = player.B.flyers[13];
            let base = f.level.times(f.amount).times(Decimal.pow(1.3, f.level.div(10).floor()));
            let raw = base.max(1);
            return raw.gt(1e308) ? raw.sqrt() : raw;
        },
        canAfford() { return player.B.points.gte(this.cost()); },
        buy() {
            let cost = this.cost();
            player.B.points = player.B.points.sub(cost);
            let f = player.B.flyers[13];
            f.level = f.level.add(1);
            f.amount = f.amount.add(1);
            updateTemp();
        },
    },
},
    challenges: {},
    milestones: {
        0: {
            requirementDescription: "1 β粒子",
            effectDescription: "Alpha粒子获取*2",
            done() { return player.B.points.gte(1); },
        },
        1: {
            requirementDescription: "3 β粒子",
            effectDescription: "Alpha粒子获取*5",
            done() { return player.B.points.gte(3); },
        },
        2: {
            requirementDescription: "10 β粒子",
            effectDescription: "Beta粒子获取*(2+lg(lg(Alpha粒子数+1)+1)),解锁购买项",
            done() { return player.B.points.gte(10); },
        },
        3: {
            requirementDescription: "100 β粒子",
            effectDescription: "解锁Alpha挑战2",
            done() { return player.B.points.gte(100); },
        },
    },
});

addLayer("ach", {
    name: "Achievements",
    symbol: "A",
    position: 0,
    row: "side",
    color: "#fbff00ff",
    resource: "成就点数",
    type: "none",
    startData() { return { unlocked: true, points: new Decimal(0) } },
    layerShown() { return true },

    tabFormat: {
        "成就": {
            content: ["main-display", "blank", "achievements"]
        },
        "里程碑": {
            content: ["main-display", "blank", "milestones"]
        },
    },
    milestones: {
        
        0: {
            requirementDescription: "成就优化I (36成就点)",
            effectDescription: "成就点效果^1.3",
            done() { return player.ach.points.gte(36); }
        },
        1: {
            requirementDescription: "成就优化II (60成就点)",
            effectDescription: "成就点效果^1.5",
            done() { return player.ach.points.gte(60); }
        },
    },
    achievements: {
        rows: 6,
        cols: 6,
      
        11: { name: "起点", tooltip: "获得10粒子 奖励:1成就点。", done() { return player.points.gte(10); }, onComplete() { addPoints("ach", 1); } },
        12: { name: "首次 Alpha", tooltip: "获得1 Alpha 粒子 奖励:1成就点。", done() { return player.A.points.gte(1); }, onComplete() { addPoints("ach", 1); } },
        13: { name: "百倍 Alpha", tooltip: "获得100 Alpha 粒子 奖励:1成就点。", done() { return player.A.points.gte(100); }, onComplete() { addPoints("ach", 1); } },
        14: { name: "生成器", tooltip: "购买1个粒子生成器 奖励:1成就点。", done() { return (player.A.buyables[11] || new Decimal(0)).gte(1); }, onComplete() { addPoints("ach", 1); } },
        15: { name: "增幅器", tooltip: "购买1个粒子增幅器 奖励:1成就点。", done() { return (player.A.buyables[12] || new Decimal(0)).gte(1); }, onComplete() { addPoints("ach", 1); } },
        16: { name: "振荡器", tooltip: "购买1个粒子振荡器 奖励:1成就点。", done() { return (player.A.buyables[13] || new Decimal(0)).gte(1); }, onComplete() { addPoints("ach", 1); } },
        21: { name: "万倍 Alpha", tooltip: "获得1e4 Alpha 粒子 奖励:2成就点。", done() { return player.A.points.gte(1e4); }, onComplete() { addPoints("ach", 2); } },
        22: { name: "!?99?!", tooltip: "获得9e9 粒子 奖励:2成就点。", done() { return player.points.gte(1e6); }, onComplete() { addPoints("ach", 2); } },
        23: { name: "首次挑战", tooltip: "完成1次 Alpha 挑战1 奖励:2成就点。", done() { return (player.A.challenges[11] || 0) >= 1; }, onComplete() { addPoints("ach", 2); } },
        24: { name: "堙灭专家", tooltip: "完成5次 Alpha 挑战1 奖励:2成就点。", done() { return (player.A.challenges[11] || 0) >= 5; }, onComplete() { addPoints("ach", 2); } },
        25: { name: "生成器达人", tooltip: "购买40个粒子生成器 奖励:2成就点。", done() { return (player.A.buyables[11] || new Decimal(0)).gte(40); }, onComplete() { addPoints("ach", 2); } },
        26: { name: "增幅器达人", tooltip: "购买20个粒子增幅器 奖励:2成就点。", done() { return (player.A.buyables[12] || new Decimal(0)).gte(20); }, onComplete() { addPoints("ach", 2); } },
        31: { name: "振荡器达人", tooltip: "购买10个粒子振荡器 奖励:2成就点。", done() { return (player.A.buyables[13] || new Decimal(0)).gte(10); }, onComplete() { addPoints("ach", 2); } },
        32: { name: "第二层", tooltip: "解锁 Beta 层 奖励:2成就点。", done() { return player.B.unlocked; }, onComplete() { addPoints("ach", 3); } },
        33: { name: "Alpha", tooltip: "获得1e25 Alpha 粒子 奖励:3成就点。", done() { return player.A.points.gte(1e25); }, onComplete() { addPoints("ach", 3); } },
        34: { name: "天文粒子", tooltip: "获得1e50 粒子 奖励:3成就点。", done() { return player.points.gte("1e50"); }, onComplete() { addPoints("ach", 3); } },
        35: { name: "Beta 起点", tooltip: "获得1 Beta 粒子 奖励:3成就点。", done() { return player.B.points.gte(1); }, onComplete() { addPoints("ach", 3); } },
        36: { name: "百倍 Beta", tooltip: "获得100 Beta 粒子 奖励:3成就点。", done() { return player.B.points.gte(100); }, onComplete() { addPoints("ach", 3); } },
        41: { name: "分母缩短", tooltip: "购买 B-12 分母缩短 I 奖励:4成就点。", done() { return hasUpgrade('B', 12); }, onComplete() { addPoints("ach", 4); } },
        42: { name: "底数减少", tooltip: "购买 B-13 底数减少 I 奖励:4成就点。", done() { return hasUpgrade('B', 13); }, onComplete() { addPoints("ach", 4); } },
        43: { name: "飞越器 I", tooltip: "购买1个飞越器 I 奖励:4成就点。", done() { return player.B.flyers[11].amount.gte(1); }, onComplete() { addPoints("ach", 4); } },
        44: { name: "飞越器 II", tooltip: "购买1个飞越器 II 奖励:4成就点。", done() { return player.B.flyers[12].amount.gte(1); }, onComplete() { addPoints("ach", 4); } },
        45: { name: "飞越器 III", tooltip: "购买1个飞越器 III 奖励:4成就点。", done() { return player.B.flyers[13].amount.gte(1); }, onComplete() { addPoints("ach", 4); } },
        46: { name: "无法生成", tooltip: "完成1次 Alpha 挑战2 奖励:4成就点。", done() { return (player.A.challenges[12] || 0) >= 1; }, onComplete() { addPoints("ach", 4); } },
        51: { name: "分母全开", tooltip: "分母达到 20 奖励:5成就点。", done() { let { n } = layers.B.getEffectiveMN(); return n.gte(5); }, onComplete() { addPoints("ach", 5); } },
        52: { name: "底数全开", tooltip: "底数达到 6 奖励:5成就点。", done() { let { m } = layers.B.getEffectiveMN(); return m.gte(4); }, onComplete() { addPoints("ach", 5); } },
        53: { name: "生成器满级", tooltip: "购买100个粒子生成器 奖励:5成就点。", done() { return (player.A.buyables[11] || new Decimal(0)).gte(100); }, onComplete() { addPoints("ach", 5); } },
        54: { name: "增幅器满级", tooltip: "购买100个粒子增幅器 奖励:5成就点。", done() { return (player.A.buyables[12] || new Decimal(0)).gte(100); }, onComplete() { addPoints("ach", 5); } },
        55: { name: "振荡器满级", tooltip: "购买100个粒子振荡器 奖励:5成就点。", done() { return (player.A.buyables[13] || new Decimal(0)).gte(100); }, onComplete() { addPoints("ach", 5); } },
        56: { name: "无法生成专家", tooltip: "完成4次 Alpha 挑战2 奖励:5成就点。", done() { return (player.A.challenges[12] || 0) >= 4; }, onComplete() { addPoints("ach", 5); } },
    },
    effect() {
        let base = player.ach.points.div(10).add(1);
        let raw = base.pow(player.ach.points.div(25).add(1));
        if (hasMilestone('ach', 0)) raw = raw.pow(1.3);
        if (hasMilestone('ach', 1)) raw = raw.pow(1.5);
        return raw;
    },
    effectDescription() {
        return "成就点数使粒子获取 *" + format(tmp.ach.effect);
    },
});