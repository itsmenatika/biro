"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const langtools_1 = require("../../util/langtools");
const mysqltools_1 = require("../../util/mysqltools");
const command = {
    addInfo: true,
    data: new discord_js_1.SlashCommandBuilder().addSubcommandGroup(sub => sub.setName("logs")
        .setDescription("config server log system")
        .addSubcommand(cmd => cmd.setName("channel")
        .setDescription('set where logs will go')
        .addChannelOption(choption => choption.setName("channel")
        .setDescription("channel where it will go (text channel)")
        .addChannelTypes([discord_js_1.ChannelType.GuildText])))),
    callback: async (client, interaction, loc, connection) => {
        await interaction.deferReply();
        const guildID = interaction.guildId;
        const guild = interaction.guild;
        if (guildID == null)
            return;
        if (guild == null)
            return;
        const channel = interaction.options.get("channel")?.channel;
        const sub1 = interaction.options.getSubcommandGroup() ? interaction.options.getSubcommandGroup() : interaction.options.getSubcommand();
        const sub2 = interaction.options.getSubcommand();
        switch (sub1) {
            case 'logs': {
                switch (sub2) {
                    case 'channel': {
                        const guildFromBase = await (0, mysqltools_1.getGuildViaID)(connection, guildID);
                        if (channel) {
                            guildFromBase.logChannelID = channel?.id;
                            var emb = new discord_js_1.EmbedBuilder().setFooter({
                                text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
                                iconURL: String(interaction.user.avatarURL())
                            }).setTimestamp().setColor("DarkNavy")
                                .setTitle((0, langtools_1.getMessage)("cmd_admin_result_logChannelSet_title", loc))
                                .setDescription((0, langtools_1.parseMessage)("cmd_admin_result_logChannelSet_desc", loc, { channelID: String(channel?.id), channelName: String(channel?.name) }));
                        }
                        else {
                            guildFromBase.logChannelID = undefined;
                            var emb = new discord_js_1.EmbedBuilder().setFooter({
                                text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
                                iconURL: String(interaction.user.avatarURL())
                            }).setTimestamp().setColor("DarkNavy")
                                .setTitle((0, langtools_1.getMessage)("cmd_admin_result_logChannelUnset_title", loc))
                                .setDescription((0, langtools_1.getMessage)("cmd_admin_result_logChannelUnset_desc", loc));
                        }
                        await guildFromBase.save();
                        await interaction.editReply({ embeds: [emb] });
                        break;
                    }
                }
                break;
            }
        }
    }
};
module.exports = command;
