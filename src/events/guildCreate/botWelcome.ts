import { CategoryChannel, ChannelType, Client, EmbedBuilder, GuildBasedChannel, Interaction, TextChannel } from "discord.js";
import { localization } from "../../util/types";
import { getMessage } from "../../util/langtools";



module.exports = async (client: Client, interaction: Interaction, loc: localization) => {
    const firstChannel: GuildBasedChannel | undefined = interaction.guild?.channels.cache.find(
        (channel) => channel.type === ChannelType.GuildText 
    );

    if(firstChannel === undefined || !(firstChannel instanceof TextChannel)) return;


    let emb = new EmbedBuilder().setTimestamp()
    .setTitle(getMessage("newguild_title", loc))
    .setDescription(getMessage("newguild_desc", loc))
    .setColor("Fuchsia");

    await firstChannel?.send({ embeds: [
        emb
    ]});
}