import type { Client } from "discord.js";
import type { Node } from "lavashark";
import type { Bot } from "../../@types";


export default async (bot: Bot, _client: Client, node: Node) => {
    bot.logger.emit('lavashark', `[nodeDisconnect] Disconnect from "${node.identifier}"`);
};