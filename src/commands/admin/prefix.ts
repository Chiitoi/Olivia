import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { ApplyOptions } from '@sapphire/decorators'
import { Args } from '@sapphire/framework'
import type { Message } from 'discord.js'
import { MESSAGES, SETTINGS } from '@lib/utility/constants'

@ApplyOptions<OliviaCommandOptions>({
    description: 'Modifies bot prefix.',
    examples: ['prefix $', 'prefix %'],
    preconditions: ['administratorOnly'],
    usage: 'prefix [prefix]'
})
export default class extends OliviaCommand {
    public async run(message: Message, args: Args) {
        const { client } = this.context
        const guild = message.guild!
        const prefix = args.next()

        if (!prefix) {
            const currentPrefix = client.settings.get(guild, SETTINGS.PREFIX)
            return message.channel.send(MESSAGES.INFO.PREFIX(currentPrefix))
        }

        const reDigit = /^[0-9]/
        const reSpecial = /[~`!@#\$%\^&*()-_\+={}\[\]|\\\/:;"'<>,.?]/g
        const reSpaces = /\s/
        const valid = !reDigit.test(prefix) && reSpecial.test(prefix) && !reSpaces.test(prefix) && (prefix.length <= 3)

        if (!valid)
            return message.channel.send(MESSAGES.ERRORS.PREFIX)
        
        await client.settings.set(guild, SETTINGS.PREFIX, prefix)
        return message.channel.send(MESSAGES.STATES.PREFIX_CHANGED(prefix))    
    }
}