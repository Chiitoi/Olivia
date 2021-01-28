import { ApplyOptions } from '@sapphire/decorators'
import { Command } from '@sapphire/framework'
import type { Message, MessageEmbed } from 'discord.js'
import { OliviaCommandOptions } from '../../types/olivia'
import { format } from '../../lib/utility/utils'

@ApplyOptions<OliviaCommandOptions>({
    description: 'Checks Discord API latency',
    usage: 'ping'
})
export default class extends Command {
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