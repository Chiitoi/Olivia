import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message, MessageEmbed } from 'discord.js'


@ApplyOptions<OliviaCommandOptions>({
    description: 'Gets the invite link for Olivia.',
    preconditions: [['administratorOnly', 'botChannelOnly']],
    usage: 'invite'
})
export default class extends OliviaCommand {
    public async run(message: Message) {
        const { client } = this.context
        const invite = await client.generateInvite({ permissions: ['EMBED_LINKS', 'MANAGE_EMOJIS', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'] })
        const embed: Partial<MessageEmbed> = {
            color: 16316671,
            description: `[Add ${ client.user.username } to your server!](${ invite })`
        }
        
        return message.channel.send({ embed })
    }
}