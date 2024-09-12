import { Client, Message, ChannelType } from "discord.js";
import { cst } from "../../utils/constants";

import type { Bot } from "../../@types";


export default async (bot: Bot, client: Client, message: Message) => {
    const prefix = bot.config.prefix;

    if (bot.blacklist && bot.blacklist.includes(message.author.id)) return;
    if (message.author.bot || message.channel.type !== ChannelType.GuildText) return;
    if (message.content.indexOf(prefix) !== 0) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = String(args.shift()).toLowerCase();
    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (!cmd) return;

    if (cmd.requireAdmin) {
        if (message.author.id !== bot.config.admin)
            return message.reply({ content: `❌ | This command requires administrator privileges.`, allowedMentions: { repliedUser: false } })
                .catch((error) => {
                    bot.logger.emit('error', `[messageCreate] Error reply: (${message.author.username} : ${message.content})` + error);
                    return;
                });
    }

    if (cmd.voiceChannel) {
        if (!message.member?.voice.channel)
            return message.reply({ content: `❌ | You are not connected to an audio channel.`, allowedMentions: { repliedUser: false } })
                .catch((error) => {
                    bot.logger.emit('error', `[messageCreate] Error reply: (${message.author.username} : ${message.content})` + error);
                    return;
                });

        if (message.guild?.members.me?.voice.channel && message.member.voice.channelId !== message.guild.members.me.voice.channelId)
            return message.reply({ content: `❌ | You are not on the same audio channel as me.`, allowedMentions: { repliedUser: false } })
                .catch((error) => {
                    bot.logger.emit('error', `[messageCreate] Error reply: (${message.author.username} : ${message.content})` + error);
                    return;
                });
    }


    bot.logger.emit('discord', `[messageCreate] (${cst.color.grey}${message.guild?.name}${cst.color.white}) ${message.author.username} : ${message.content}`);

    if (cmd.sendTyping) message.channel.sendTyping();
    cmd.execute(bot, client, message, args);
};