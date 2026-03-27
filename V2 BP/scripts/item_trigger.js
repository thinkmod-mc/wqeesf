import { system, world } from '@minecraft/server';

function durabilityOnChanged(item, player, isHitEntity = false) {
    let level = item.getComponent("minecraft:enchantable")?.getEnchantment("unbreaking")?.level;

    function durability() {
        let durability = item.getComponent("minecraft:durability");

        const t = Math.floor(Math.random() * 100);

        if (t < durability.getDamageChance()) {
            if (!isHitEntity) durability.damage += 1;
            if (durability.damage >= durability.maxDurability) {
                player.playSound("random.break");
                if (!isHitEntity) player.getComponent('equippable').setEquipment('Mainhand', undefined)
            } else {
                if (!isHitEntity) player.getComponent('equippable').setEquipment('Mainhand', item)
            }
        } else {
            if (!isHitEntity) return;
            durability.damage -= 1;
            if (!isHitEntity) player.getComponent('equippable').setEquipment('Mainhand', item);
        }
    }

    const t = Math.floor(Math.random() * 10)
    if (level === 1 && t > 8) return;
    else if (level === 2 && t > 6) return;
    else if (level === 3 && t > 4) return;
    else durability();
}

world.beforeEvents.worldInitialize.subscribe(initEvent => { 
    // Danh sách toàn bộ 9 chiếc đuôi để dùng chung Script độ bền
    const foxTails = [
        'pa_model_fox_001_fi:trigger', 'pa_model_fox_002_fi:trigger', 'pa_model_fox_003_fi:trigger',
        'pa_model_fox_004_fi:trigger', 'pa_model_fox_005_fi:trigger', 'pa_model_fox_006_fi:trigger',
        'pa_model_fox_007_fi:trigger', 'pa_model_fox_008_fi:trigger', 'pa_model_fox_009_fi:trigger'
    ];

    for (const tailTrigger of foxTails) {
        initEvent.itemComponentRegistry.registerCustomComponent(tailTrigger, {
            onHitEntity: e => { durabilityOnChanged(e.itemStack, e.source, true); },
            onMineBlock: e => { durabilityOnChanged(e.itemStack, e.source, false); }
        });
    }
});