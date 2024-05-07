import Discord, { EmbedBuilder } from "discord.js";
import fs from "fs";
import generateImage from "../util/generateImage.js";

class old_welcome {
  static async sendWelcome(member, channelId) {
    const img = await generateImage(member);
    fs.writeFileSync("join.png", img, (err) => {
      if (err) console.error(err);
    });
    const image = new Discord.AttachmentBuilder().setFile("./join.png");

    const newEmbed = new EmbedBuilder()
      .setColor("#bf2900")
      .setTitle(`Welcome to Pyro Archon Mains!`)
      .setDescription(`Welcome ${member.user.username}#${member.user.discriminator}!`)
      .setImage(`attachment://join.png`)
      .setFooter({ text: "Pyro Archon Mains" })
      .setTimestamp();

    member.guild.channels.cache.get(channelId).send({
      embeds: [newEmbed],
      files: [image]
    });
  }
}

export default old_welcome;
