import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { ApplyOptions } from '@sapphire/decorators'
import { Args, none, some } from '@sapphire/framework'
import type { Message } from 'discord.js'
import { MESSAGES, SETTINGS } from '@lib/utility/constants'

@ApplyOptions<OliviaCommandOptions>({
    description: 'Modifies bot channel list for usage of non-admin commands.',
    examples: ['bots add #bot-commands', 'bots remove #test'],
    preconditions: ['administratorOnly'],
    usage: 'bots <add|remove|replace> [textChannel]'
})
export default class extends OliviaCommand {
    public async run(message: Message, args: Args) {
        const parseAction = (str: string) => {
            const lowered = str.toLowerCase()
            const valid = ['add', 'remove', 'replace'].includes(lowered)

            return valid ? some(lowered) : none()

        }
        const action = args.nextMaybe(parseAction)?.value

        if (!action) 
            return message.channel.send(MESSAGES.ERRORS.ACTION)

        const { value: textChannel } = await args.pickResult('textChannel')

        if (['add', 'remove'].includes(action) && !textChannel)
            return message.channel.send(MESSAGES.INFO.CHANNEL_REQUIRED)
        
        const { client } = this.context
        const guild = message.guild!
        const list = client.settings.get(guild, SETTINGS.BOT_CHANNEL_IDS)
        const channelId = textChannel?.id
        const inList = list.includes(channelId)

        if (action == 'add' && !inList) {
            const newList = [...list, channelId]
            await client.settings.set(guild, SETTINGS.BOT_CHANNEL_IDS, newList)
            return message.channel.send(MESSAGES.STATES.CHANNEL_ADDED(textChannel))
        } else if (action == 'remove' && inList) {
            const newList = list.filter(c => c != channelId)
            await client.settings.set(guild, SETTINGS.BOT_CHANNEL_IDS, newList)
            return message.channel.send(MESSAGES.STATES.CHANNEL_REMOVED(textChannel))
        } else if (action == 'replace') {
            if (channelId) {
                await client.settings.set(guild, SETTINGS.BOT_CHANNEL_IDS, [channelId])
                return message.channel.send(MESSAGES.STATES.CHANNEL_REPLACED(textChannel))
            } else {
                await client.settings.set(guild, SETTINGS.BOT_CHANNEL_IDS, [])
                return message.channel.send(MESSAGES.STATES.CHANNEL_PURGE)
            }
        } else {
            const verbText = (action == 'add') ? 'is already' : 'is not'
            return message.channel.send(MESSAGES.INFO.NO_CHANGE(textChannel, verbText))
        }  
    }
}