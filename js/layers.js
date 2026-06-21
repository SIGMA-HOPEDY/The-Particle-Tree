addLayer("ach", {
    name: "Achievements",
    symbol: "A",
    position: 0,
    row: "side",
    color: "#fbff00ff",
    resource: "achievements",
    type: "none",

    startData() { return { unlocked: true, points: new Decimal(0) } },
    layerShown() { return true },

    achievements: {

    },
});

addLayer("A", {
    name: "α",
    symbol: "α",
    position: 0,
    startData() { return {
    unlocked: true,
    points: new Decimal(0),
    // 移除 challenges 对象，或只保留默认空对象
    buyables: {
        11: new Decimal(0),
        12: new Decimal(0),
        13: new Decimal(0),
    }
}},
    color: "#e100ffff",
    requires: new Decimal(10),
    resource: "Alpha particles",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: function() {
        let exp = new Decimal(1).div(2.25);
        return exp;
    },
    passiveGeneration: function() {
        let passiveGeneration = 0;
        if (hasUpgrade('B', 11)) passiveGeneration += player.B.points.mul(0.001);
        return passiveGeneration;
    },
    gainMult() {
        let mult = new Decimal(1)
        if (player.B.points > 0) mult = mult.times(player.B.points.add(1)).pow(2);
        if (hasUpgrade('A', 23)) mult = mult.mul(upgradeEffect('A', 23))
            // 挑战奖励：每完成一次，Alpha 粒子 ×0.1comp+2
    let comp = player.A.challenges?.[11] || 0;
    if (comp >= 1) {
        mult = mult.times(Decimal.pow(comp*0.1+2, comp));
    }
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        {},
    ],
    tabFormat: {
        "Upgrades": {
            content: ["main-display", "prestige-button", "blank", "upgrades"]
        },
        "Buyables": {
            content: ["main-display", "prestige-button", "blank", "buyables"]
        },
         "Challenges": {
            content: ["main-display", "prestige-button", "blank", "challenges"]
        },
    },
    layerShown(){return true},
    upgrades: {11: {
        title: "初始的粒子",
        description: "粒子生成基数+1,Alpha粒子增幅粒子生成",
        cost: new Decimal(0),
        effect: function() {
            let exp=new Decimal(0.333)
            let base = player.A.points.add(1);
            let raw = base.pow(exp);
            let cap = new Decimal("1e9");
            if (raw.lte(cap)) return raw;
            let ratio = raw.div(cap);
            let capped = ratio.pow(exp.times(0.5));
            return cap.times(capped);
        },
        effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) }, 
        unlocked: function() {
            return true;
        }
    },12: {
        title: "粒子生成器",
        description: "解锁粒子生成器,粒子生成基数+1",
        cost: new Decimal(1),
        effect: function() {
            return new Decimal(1);
        },
        unlocked: function() {
            return hasUpgrade('A', 11);
        }
    },13: {
        title: "粒子碰撞",
        description: "粒子极小幅度增加粒子生成基数",
        cost: new Decimal(3),
        effect: function() {
            let exp=new Decimal(1.5)
            let base = player.points.add(10).log10();
            let raw = base.pow(exp);
            let cap = new Decimal("1e9");
            if (raw.lte(cap)) return raw;
            let ratio = raw.div(cap);
            let capped = ratio.pow(exp.times(0.5));
            return cap.times(capped);
        },
        unlocked: function() {
            return hasUpgrade('A', 12);
        },effectDisplay() { return '+'+format(upgradeEffect(this.layer, this.id),4,true) }, 
    },14: {
        title: "粒子增幅器",
        description: "解锁粒子增幅器,粒子生成*2",
        cost: new Decimal(10),
        effect: function() {
            return new Decimal(2);
        },
        unlocked: function() {
            return hasUpgrade('A', 13);
        }, 
    },15: {
        title: "粒子激发",
        description: "粒子极小幅度增幅粒子生成",
        cost: new Decimal(50),
        effect: function() {
            let exp=new Decimal(1.25)
            let base = player.points.add(10).log10();
            let raw = base.pow(exp);
            let cap = new Decimal("1e9");
            if (raw.lte(cap)) return raw;
            let ratio = raw.div(cap);
            let capped = ratio.pow(exp.times(0.5));
            return cap.times(capped);
        },
        unlocked: function() {
            return hasUpgrade('A', 14);
        },effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) }, 
    },21: {
        title: "粒子振荡器",
        description: "解锁粒子振荡器,粒子生成^1.01",
        cost: new Decimal(100),
        effect: function() {
            return new Decimal(1.01);
        },
        unlocked: function() {
            return hasUpgrade('A', 15);
        }, 
    },22: {
        title: "粒子振荡",
        description: "粒子极微小幅度增幅粒子生成指数(不低于^1.01)",
        cost: new Decimal(500),
        effect: function() {
            let exp=new Decimal(0.05)
            let base = player.points.add(10).log10();
            let raw = base.pow(exp).div(100).add(1);
            let cap = new Decimal("2");
            if (raw.lte(cap)) return raw;
            let ratio = raw.div(cap);
            let capped = ratio.pow(exp.times(0.5));
            return cap.times(capped);

        },
        unlocked: function() {
            return hasUpgrade('A', 21);
        },effectDisplay() { return '^'+format(upgradeEffect(this.layer, this.id),4,true) }, 
        },
        23: {
        title: "alpha粒子",
        description: "粒子小幅度增幅alpha粒子",
        cost: new Decimal(1000),
        effect: function() {let exp=new Decimal(0.125)
            let base = player.points.add(1);
            let raw = base.pow(exp);
            let cap = new Decimal("1e9");
            if (raw.lte(cap)) return raw;
            let ratio = raw.div(cap);
            let capped = ratio.pow(exp.times(0.5));
            return cap.times(capped);
        },
        unlocked: function() {
            return hasUpgrade('A', 22);
        },effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) }, 
        },24: {
        title: "生成增幅",
        description: "Alpha粒子较小幅度增幅粒子生成器效果",
        cost: new Decimal(10000),
        effect: function() {let exp=new Decimal(0.3)
            let base = player.A.points.add(1);
            let raw = base.pow(exp);
            let cap = new Decimal("1e9");
            if (raw.lte(cap)) return raw;
            let ratio = raw.div(cap);
            let capped = ratio.pow(exp.times(0.5));
            return cap.times(capped);
        },
        unlocked: function() {
            return hasUpgrade('A', 23);
        },effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) }, 
        },25: {
        title: "增幅增幅",
        description: "Alpha粒子小幅度增幅粒子增幅器效果",
        cost: new Decimal(1e5),
        effect: function() {let exp=new Decimal(0.15)
            let base = player.A.points.add(1);
            let raw = base.pow(exp);
            let cap = new Decimal("1e9");
            if (raw.lte(cap)) return raw;
            let ratio = raw.div(cap);
            let capped = ratio.pow(exp.times(0.5));
            return cap.times(capped);
        },
        unlocked: function() {
            return hasUpgrade('A', 24);
        },effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) }, 
        },
        31: {
            title: "生成器强化 I",
            description: "粒子生成器效果额外乘以 Alpha 粒子数的 0.05 次方",
            cost: new Decimal(1e6),
            effect() {
                let exp=new Decimal(0.05)
            let base = player.A.points.add(1);
            let raw = base.pow(exp);
            let cap = new Decimal("1e9");
            if (raw.lte(cap)) return raw;
            let ratio = raw.div(cap);
            let capped = ratio.pow(exp.times(0.5));
            return cap.times(capped);
            },
            effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) },
            unlocked() { return hasUpgrade('A', 25); }
        },
        32: {
            title: "振荡器优化",
            description: "粒子振荡器效果指数 +0.01",
            cost: new Decimal(1e7),
            effect() {
                return new Decimal(0.01);
            },
            effectDisplay() { return '+'+format(upgradeEffect(this.layer, this.id),4,true) },
            unlocked() { return hasUpgrade('A', 31); }
        },
        33: {
    title: "生成器强化 II",
    description: "粒子生成器效果再乘以 Alpha 粒子数的 0.05 次方,解锁alpha挑战1",
    cost: new Decimal(1e8),
    effect() {
        let exp = new Decimal(0.05);
        let base = player.A.points.add(1);
        let raw = base.pow(exp);
        let cap = new Decimal("1e9");
        if (raw.lte(cap)) return raw;
        let ratio = raw.div(cap);
        let capped = ratio.pow(exp.times(0.5));
        return cap.times(capped);
    },
    effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) },
    unlocked() { return hasUpgrade('A', 32); }
},34: {
    title: "振荡器优化 II",
    description: "粒子振荡器效果指数 +0.01",
    cost: new Decimal(1e9),
    effect() {
        return new Decimal(0.01);
    },
    effectDisplay() { return '+'+format(upgradeEffect(this.layer, this.id),4,true) },
    unlocked() { return hasUpgrade('A', 33); }
},35: {
    title: "Alpha 共鸣I",
    description: "Alpha 粒子数增幅粒子生成",
    cost: new Decimal(1e10),
    effect() {
        let base = player.A.points.add(10);
        let raw = base.log10().div(20).add(1);
        let cap = new Decimal(1e3);
        if (raw.lte(cap)) return raw;
        let ratio = raw.div(cap);
        let capped = ratio.pow(0.8);
        return cap.times(capped);
    },
    effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) },
    unlocked() { return hasUpgrade('A', 34); }
},41: {
    title: "粒子大碰撞",
    description: "基础粒子大幅增加粒子生成基数",
    cost: new Decimal(1e12),
    effect() {
        let base = player.points.add(10).log10();
        let raw = base.pow(2);               // 平方增长
        let cap = new Decimal(1e12);
        if (raw.lte(cap)) return raw;
        let ratio = raw.div(cap);
        let capped = ratio.pow(0.6);
        return cap.times(capped);
    },
    effectDisplay() { return '+'+format(upgradeEffect(this.layer, this.id),4,true) },
    unlocked() { return hasUpgrade('A', 35); }
},
42: {
    title: "共振转换",
    description: "基于粒子生成器、增幅器、振荡器大幅增幅粒子生成",
    cost: new Decimal(1e14),
    effect() {
        let gen = player.A.buyables[11] || new Decimal(1);
        let amp = player.A.buyables[12] || new Decimal(1);
        let osc = player.A.buyables[13] || new Decimal(1);
        let total = gen.add(1).times(amp.add(1)).pow(osc.add(1).log10().div(10).add(1));
        let raw = total.div(10).add(1);
        let cap = new Decimal(1e9);
        if (raw.lte(cap)) return raw;
        let ratio = raw.div(cap);
        let capped = ratio.pow(0.75);
        return cap.times(capped);
    },
    effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) },
    unlocked() { return hasUpgrade('A', 41); }
},
43: {
    title: "挑战适应I",
    description: "粒子生成^{1+0.002*“粒子堙灭”完成次数}",
    cost: new Decimal(1e16),
    effect() {
        let comp = player.A.challenges?.[11] || 0;
        return new Decimal(1).plus(0.002 * comp);   // 1 + 0.002*完成数
    },
    effectDisplay() { return '^'+format(upgradeEffect(this.layer, this.id),4,true) },
    unlocked() { return hasUpgrade('A', 42); }
},
44: {
    title: "粒子熵增",
    description: "Alpha 粒子数极微增幅粒子振荡器效果指数",
    cost: new Decimal(1e18),
    effect() {
        let base = player.A.points.add(1);
        let raw = base.log10().pow(0.03).div(100); 
        let cap = new Decimal(0.1);
        if (raw.lte(cap)) return raw;
        let ratio = raw.div(cap);
        let capped = ratio.pow(0.003);
        return cap.times(capped);
    },
    effectDisplay() { return '+'+format(upgradeEffect(this.layer, this.id),4,true) + ' 指数' },
    unlocked() { return hasUpgrade('A', 43); }
},
45: {
    title: "Alpha 共鸣II",
    description: "粒子生成*lg(Alpha粒子数+10),解锁Beta层",
    cost: new Decimal(1e20),
    effect() {
        let base = player.A.points.add(10);
        let raw = base.log10().max(1);           // log10(A+10)
        let cap = new Decimal(1e9);
        if (raw.lte(cap)) return raw;
        let ratio = raw.div(cap);
        let capped = ratio.pow(0.85).times(cap);
        return capped;
    },
    effectDisplay() { return '*'+format(upgradeEffect(this.layer, this.id),4,true) },
    unlocked() { return hasUpgrade('A', 44); }
}
    },
    buyables: {
        11: {
            title: "粒子生成器",
            unlocked() { return hasUpgrade('A', 12); },
            cost(x) {
                if (x.eq(0)) return new Decimal(1);
                let base = Decimal.pow(x.add(1).log10().add(1.1), x.times(1.1)).floor().times(Decimal.pow(10,x.div(20).floor().sub(1).max(0)));
                let cost = base.times(1).max(1);
                return cost;
            },
            effect(x) {
                if (x.eq(0)) return new Decimal(1);
                let exp = x.div(10).add(1).floor().log10().max(1);
                let mult = new Decimal(1);
                if (hasUpgrade('A', 24)) mult = mult.mul(upgradeEffect('A', 24))
                if (hasUpgrade('A', 31)) mult = mult.mul(upgradeEffect('A', 31));
                if (hasUpgrade('A', 33)) mult = mult.mul(upgradeEffect('A', 33));
                let raw = x.times(x.add(1).times(10).log10().max(1)).times(mult).pow(exp);
                if (raw.gt(1e88)) {
                    return raw.sqrt();
                }
                return raw;
            },
            display() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let cost = tmp[this.layer].buyables[this.id]?.cost || new Decimal(0);
                let eff = tmp[this.layer].buyables[this.id]?.effect || new Decimal(1);
                let limit = getLimit();
                return `花费: ${format(cost)} α\n已购买: ${formatWhole(x)} / ${formatWhole(limit)}\n效果: particle+${format(eff,4,true)}/S`;
            },
            canAfford() {
                let cost = tmp[this.layer].buyables[this.id]?.cost;
                if (!cost) return false;
                return player[this.layer].points.gte(cost);
            },
            buy() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let limit = getLimit().floor();
                if (x.gte(limit)) return;
                let cost = tmp[this.layer].buyables[this.id].cost;
                player[this.layer].points = player[this.layer].points.sub(cost);
                player[this.layer].buyables[this.id] = x.add(1);
                updateTemp();
            },
        },
        12: {
            title: "粒子增幅器",
            unlocked() { return hasUpgrade('A', 14); },
            cost(x) {
                if (x.eq(0)) return new Decimal(10);
               let base = Decimal.pow(x.add(1).log10().add(2.2), x.times(1.2)).times(10).floor().times(Decimal.pow(100,x.div(10).floor().sub(1).max(0)));
                let cost = base.times(1).max(10);
                return cost;
            },
            effect(x) {
                if (x.eq(0)) return new Decimal(1);
                let exp = x.div(20).add(1).floor().log10().max(1);
                
                let mult = new Decimal(1);
                if (hasUpgrade('A', 25)) mult = mult.mul(upgradeEffect('A', 25))
                let raw = x.times(x.add(1).times(10).log10().max(0.5)).add(1).times(mult).pow(exp);
                if (raw.gt(1e88)) {
                    return raw.sqrt();
                }
                return raw;
            },
            display() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let cost = tmp[this.layer].buyables[this.id]?.cost || new Decimal(0);
                let eff = tmp[this.layer].buyables[this.id]?.effect || new Decimal(1);
                let limit = getLimit();
                return `花费: ${format(cost)} α\n已购买: ${formatWhole(x)} / ${formatWhole(limit)}\n效果: particle/s*${format(eff,4,true)}`;
            },
            canAfford() {
                let cost = tmp[this.layer].buyables[this.id]?.cost;
                if (!cost) return false;
                return player[this.layer].points.gte(cost);
            },
            buy() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let limit = getLimit().floor();
                if (x.gte(limit)) return;
                let cost = tmp[this.layer].buyables[this.id].cost;
                player[this.layer].points = player[this.layer].points.sub(cost);
                player[this.layer].buyables[this.id] = x.add(1);
                updateTemp();
            },
        },
        13: {
            title: "粒子振荡器",
            unlocked() { return hasUpgrade('A', 21); },
            cost(x) {
                if (x.eq(0)) return new Decimal(100);
                let base = Decimal.pow(x.times(0.056).add(4.4), x.times(1.3)).times(100).floor().times(Decimal.pow(1000,x.div(5).floor().sub(1).max(0)));
                let cost = base.times(1).max(100);
                return cost;
            },
            effect(x) {
                if (x.eq(0)) return new Decimal(1);
                let exp = new Decimal(0.78);
                if (hasUpgrade('A', 32)) exp = exp.add(upgradeEffect('A', 32));
                if (hasUpgrade('A', 34)) exp = exp.add(upgradeEffect('A', 34));
                if (hasUpgrade('A', 44)) exp = exp.add(upgradeEffect('A', 44));
                let raw = x.div(30).add(1).pow(exp);
                if (raw.gt(2)) {
                    return raw.times(10).log10().sqrt().add(1);
                }
                return raw;
            },
            display() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let cost = tmp[this.layer].buyables[this.id]?.cost || new Decimal(0);
                let eff = tmp[this.layer].buyables[this.id]?.effect || new Decimal(1);
                let limit = getLimit();
                return `花费: ${format(cost)} α\n已购买: ${formatWhole(x)} / ${formatWhole(limit)}\n效果: particle/s^${format(eff,4,true)}`;
            },
            canAfford() {
                let cost = tmp[this.layer].buyables[this.id]?.cost;
                if (!cost) return false;
                return player[this.layer].points.gte(cost);
            },
            buy() {
                let x = player[this.layer].buyables[this.id] || new Decimal(0);
                let limit = getLimit().floor();
                if (x.gte(limit)) return;
                let cost = tmp[this.layer].buyables[this.id].cost;
                player[this.layer].points = player[this.layer].points.sub(cost);
                player[this.layer].buyables[this.id] = x.add(1);
                updateTemp();
            },
        },
    },
   challenges: {
    11: {
        name: "粒子堙灭",
        goalType: "points",
        goal: new Decimal("1e9"),
        completionLimit: 5,
        unlocked() { return hasUpgrade('A', 33); },

        // 动态描述：显示当前惩罚指数
        challengeDescription() {
            let comp = player.A.challenges[11] || 0;
            let exp = 0.8 - 0.15 * comp;
            if (exp < 0) exp = 0;
            return `粒子生成 ^ ${exp.toFixed(1)} （完成次数：${comp}）`;
        },

        // 动态奖励描述：显示当前奖励倍数
        rewardDescription() {
            let comp = player.A.challenges[11] || 0;
            let mult = Decimal.pow(comp*0.1+2, comp);
            return `Alpha粒子获得 *${format(mult)} （已完成 ${comp} 次）`;
        }
    }
}
});
addLayer("B", {
    name: "β",
    symbol: "β",
    position: 1,                     // 显示在 A 层旁边/下方
    resource: "Beta particles",
    baseResource: "Alpha particles",
    color: "#00e5ffff",              // 青色，可自定义
    type: "normal",

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        };
    },

    // 解锁条件：拥有升级45，或已解锁本层（保持解锁状态）
    unlocked() {
        return hasUpgrade('A', 45) || player.B.unlocked;
    },

    // 基础资源为 Alpha 粒子
    baseAmount() {
        return player.A.points;
    },

    // exponent 设为 0，使 base^exp = 1，实际增益全由 gainMult 决定
    exponent() {
        return new Decimal(0);
    },

    // 核心公式：( floor(log10(A)) / 20 ) * 额外乘数（默认1）
    gainMult() {
        let base = Decimal.floor(Decimal.max(player.A.points.add(1).log10(), 0)).div(20).max(0);
        // 预留乘数修改点，后续可被升级影响
        let mult = new Decimal(1);
        return base.times(mult);
    },

    // gainExp 默认 1，所以最终 gain = (gainMult)^1
    gainExp() {
        return new Decimal(1);
    },

    // 不自动产生 Beta 粒子，只通过手动重置获得
    passiveGeneration() {
        return 0;
    },

    // 重置时清除整个 A 层（包括点数、升级、挑战、buyable）
    resets: ["A"],

    // 允许溢出重置（即使 gain 为 0 也能重置，但一般会有 gain）
    canReset() {
        return true;
    },

    // 界面定义
    layerShown() {
    return hasUpgrade('A', 45) || player.B.unlocked;
},
    row: 1,
    tabFormat: {
    "Main": {
        content: [
            "main-display",
            ["display-text", function() {
                let beta = player.B.points.add(1);
                return `β粒子获得=floor(log10(α粒子)/20) 
                        β粒子使粒子获得 *${format(beta.pow(2))} 
                        α粒子获得 *${format(beta)}`;
            }],
            "prestige-button",
            "blank",
            "buyables",
            "upgrades"
        ]
    },
},

    // 暂时空，但可留位置给未来的升级/buyable
    upgrades: {11: {
        title: "Alpha涌现",
        description: "每秒增加重置α粒子数量的0.1%的α粒子",
        cost: new Decimal(10),
    }},
    buyables: {},
    challenges: {},
});