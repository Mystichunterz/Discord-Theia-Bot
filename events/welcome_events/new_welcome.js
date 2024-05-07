import { EmbedBuilder } from "discord.js";

class new_welcome {
  static sendWelcome(member, channelId) {
    const userMention = `<@${member.id}>`;
    const memberCount = member.guild.memberCount;

    const newEmbed = new EmbedBuilder()
      .setColor("#bf2900")
      .setTitle(`«« ━━ ✦・Pyro Archon Mains・✦ ━━ »»`)
      .setDescription(
        "➵ \"The rules of war are woven in the womb: the victors shall burn bright, while the losers must turn to ash.\"\n\n" +
        "・Emberbearer, heed the sacred flames; consult the <#1215148015229079583> before you fan the blaze.\n" +
        "・Seeker of fire, the path unfolds in the <#1215162355118243871>; let it guide your steps.\n" +
        "・Warrior of flame, your destiny awaits; choose your essence at <#1215162394913808494>."
      )
      .setThumbnail(`https://cdn.discordapp.com/attachments/817660143868575765/1215788212677513317/Profile_Picture_Himeko_-_Welcome.webp`)
      .setImage(`https://cdn.discordapp.com/attachments/818031871215796245/1215786353363652738/image.png`)
      .setFooter({ text: `You are the ${memberCount}th to join our server!` })
      .setTimestamp();

    member.guild.channels.cache.get(channelId).send({
      content: `Welcome, ${userMention}!`,
      embeds: [newEmbed]
    });
  }
}

export default new_welcome;
