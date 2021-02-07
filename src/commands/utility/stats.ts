import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { format } from '@lib/utility/utils'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message, MessageEmbed } from 'discord.js'
import pms from 'pretty-ms'

@ApplyOptions<OliviaCommandOptions>({
    description: 'Displays bot information.',
    preconditions: [['administratorOnly', 'botChannelOnly']],
    usage: 'stats'
})
export default class extends OliviaCommand {
    public async run(message: Message) {       
        const { client } = this.context
        const guilds = client.guilds.cache
        const embed: Partial<MessageEmbed> = {
            author: {
                name: `${ client.user.username} v${ process.env.npm_package_version ?? process.env.version }`,
                iconURL: client.user.displayAvatarURL()
            },
            color: 16316671,
            fields: [
                { name: 'Developer', value: 'Flare#2851', inline: false },
                {
                    name: 'General stuff',
                    value: [
                        `**Servers:** ${ format(guilds.size) }`,
                        `**Channels:** ${ format(client.channels.cache.size) }`,
                        `**Members:** ${ format(guilds.reduce((total, guild) => total + guild.memberCount, 0)) }`,
                        `**Emojis:** ${ format(client.emojis.cache.size) }`
                    ].join('\n'),
                    inline: false
                },
                {
                    name: 'Random stuff',
                    value: [
                        `**Uptime:** ${ pms(client.uptime ?? 0, { secondsDecimalDigits: 0 }) }`,
                        `**Memory Usage:** ${ format((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)) } MB`
                    ].join('\n'),
                    inline: false
                }
            ]
        }

        return message.channel.send({ embed })
    }
}