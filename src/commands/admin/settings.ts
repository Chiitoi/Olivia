import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message, MessageEmbed } from 'discord.js'
import { formatChannels } from '@lib/utility/utils'

@ApplyOptions<OliviaCommandOptions>({
    description: 'Displays a server\'s current settings.',
    preconditions: ['administratorOnly'],
    usage: 'settings'
})
export default class extends OliviaCommand {
    public run(message: Message) {
        const guild = message.guild!
        const guildName = guild.name
        const { prefix, botChannelIds } = this.context.client.settings.get(guild)

        const embed: Partial<MessageEmbed> = {
            color: 16316671,
            description: [`**Bot channels:** ${ formatChannels(botChannelIds) }`, `**Prefix:** \`${ prefix }\``].join('\n'),
            title: `${ guildName }${ guildName.toLowerCase().endsWith('s') ? '\'' : '\'s' } settings`
        }

        return message.channel.send({ embed })

    }
}