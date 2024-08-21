import { Client, CommandInteraction, Embed, EmbedBuilder, Interaction, PermissionsBitField, SlashCommandBuilder, RestOrArray, APIEmbedField } from "discord.js";
import { cmdData, localization } from "../../util/types";
import { getMessage, parseMessage } from "../../util/langtools";
import { Pool } from "mysql2/typings/mysql/lib/Pool";


const command: cmdData = {
    addInfo: true,
    permissions: [
        PermissionsBitField.Flags.AddReactions
    ],
    data: new SlashCommandBuilder(),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization, connection: Pool) => {
        // await interaction to give more time for a bot
        await interaction.deferReply();
        
        // get user who perfomed this command
        let user = interaction.user;

        // basic embed
        const emb: EmbedBuilder = new EmbedBuilder().setTitle(getMessage("cmd_help_title", loc))
        .setFooter({
            text: parseMessage("cmd_executed_by", loc, {user: user.displayName}),
            iconURL: String(user.avatarURL())
        })
        .setDescription(getMessage("cmd_help_info", loc));

        // create var for fields
        let categoryTempData: RestOrArray<APIEmbedField> = []
        
        /// adding categories
        global.commandCategoryData.forEach((commandList: Array<String>, categoryName: string) => {
            // creating list of commands in specified language
            let temp = '';
            commandList.forEach(element => temp += getMessage(`cmd_${element}_name`, loc) + ", ");

            // pushing objects
            categoryTempData.push(
                {
                    name: getMessage(`cat_${categoryName}_name`, loc),
                    value: temp.slice(0, -2),
                    inline: true
                }
            )    
        });
        // adding fields
        emb.addFields(categoryTempData)


        // sending to the final user
        await interaction.editReply({embeds: [emb]});
        return;
    }
}

module.exports = command;