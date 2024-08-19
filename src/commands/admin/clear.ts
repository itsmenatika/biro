import { Client, CommandInteraction, Embed, EmbedBuilder, Interaction, PermissionsBitField, SlashCommandBuilder, RestOrArray, APIEmbedField, GuildMember, APIInteractionGuildMember, APIInteractionDataResolvedGuildMember, Guild, TextChannel, TextBasedChannel } from "discord.js";
import axios, { AxiosResponse } from "axios";
import { cmdData, localization } from "../../util/types";
import { getFullDictOf, getMessage, parseMessage } from "../../util/langtools";
import { errorBuilder } from "../../util/embtools";


const command: cmdData = {
    addInfo: true,
    permissions: [
        PermissionsBitField.Flags.ManageMessages
    ],
    botPermissions: [
        PermissionsBitField.Flags.ManageMessages
    ],
    data: new SlashCommandBuilder().addNumberOption(option => 
        option.setName("howmany")
        .setDescription(getMessage("cmd_clear_option_howMany_desc", localization.en))
        .setNameLocalizations(getFullDictOf("cmd_clear_option_howMany_name"))
        .setDescriptionLocalizations(getFullDictOf("cmd_clear_option_howMany_desc"))
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1000)
    ),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization) => {
        await interaction.reply(getMessage("wait...", loc));

        // options
        const howMany: number = Number(interaction.options.get("howmany")?.value);

        // for safety
        if(howMany>1000) return;

        // get channel
        const channel: TextBasedChannel | null = interaction.channel;
        if(channel === null) return;
        if(!(channel instanceof TextChannel)) return;
        
        // delete messages
        let currentNumber = howMany+1;

        while(currentNumber > 0){
            await channel.bulkDelete(Math.min(currentNumber, 100))

            currentNumber -= 100;
        }

        // create emb at the end
        let emb: EmbedBuilder = new EmbedBuilder().setFooter({
            text: parseMessage("cmd_executed_by", loc, {user: interaction.user.displayName}),
            iconURL: String(interaction.user.avatarURL())
        }).setTimestamp()
        .setColor("DarkVividPink")
        .setTitle(getMessage("cmd_clear_result_title", loc));

        await channel.send({
            embeds: [
                emb
            ]
        });
    }
}

module.exports = command;