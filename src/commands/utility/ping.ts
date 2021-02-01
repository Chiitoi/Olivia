import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { format } from '@lib/utility/utils'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message, MessageEmbed } from 'discord.js'

@ApplyOptions<OliviaCommandOptions>({
    description: 'Checks Discord API latency.',
    usage: 'ping'
})
export default class extends OliviaCommand {
    public async run(message: Message) {
        const sent = await message.channel.send('Pong!')
        const ping = sent.createdTimestamp - message.createdTimestamp
        const embed: Partial<MessageEmbed> = {
            color: 16316671,
            description: `🔂 **RTT**: ${ format(ping) } ms\n💟 **Heartbeat**: ${ Math.round(this.context.client.ws.ping) } ms`
        }
        
        return sent.edit('', { embed })
    }
}