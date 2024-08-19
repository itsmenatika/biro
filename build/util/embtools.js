"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorBuilder = void 0;
const discord_js_1 = require("discord.js");
const langtools_1 = require("./langtools");
function errorBuilder(errorName, interaction, loc, addInfo) {
    return new discord_js_1.EmbedBuilder().setTimestamp()
        .setFooter({
        text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
        iconURL: String(interaction.user.avatarURL())
    })
        .setColor("DarkRed").setTitle((0, langtools_1.parseMessage)("error_with_title", loc, { errorName: errorName, ...addInfo, errorTitle: (0, langtools_1.parseMessage)(`error_${errorName}_name`, loc, { errorName: errorName, ...addInfo })
    }))
        .setDescription((0, langtools_1.parseMessage)(`error_${errorName}_desc`, loc, { errorName: errorName, ...addInfo }));
}
exports.errorBuilder = errorBuilder;
