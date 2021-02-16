import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { ERRORS, MESSAGES } from '@lib/utility/constants'
import { parseEmojiURLOrBase64 } from '@lib/utility/utils'
import { ApplyOptions } from '@sapphire/decorators'
import { Args, err, none, some } from '@sapphire/framework'
import type { Message } from 'discord.js'

@ApplyOptions<OliviaCommandOptions>({
    description: 'Adds a given custom emoji to your server.',
    preconditions: [['administratorOnly', ['mangageEmojis', 'botChannelOnly']]],
    usage: 'add <emoji> [name]'
})
export default class extends OliviaCommand {
    public async run(message: Message, args: Args) {
        const guild = message.guild!
        const phrase = args.next()

        if (!phrase)
            return message.channel.send(MESSAGES.ERRORS.NOT_FOUND('emoji or image link'))

        const { defaultEmoji, error, givenName, url } = await parseEmojiURLOrBase64(phrase)

        if (error) {
            if (error == ERRORS.INVALID_URL)
                return message.channel.send(MESSAGES.ERRORS.URL)
            else if (error == ERRORS.ERROR_403)
                return message.channel.send(MESSAGES.ERRORS.HTTP_ERROR)
            else if (error == ERRORS.ERROR_415)
                return message.channel.send(MESSAGES.ERRORS.HTTP_ERROR)
            else if (error == ERRORS.INVALID_TYPE)
                return message.channel.send(MESSAGES.INFO.IMAGE)
            else if (error == ERRORS.TOO_BIG)
                return message.channel.send(MESSAGES.INFO.FILE_LIMIT)
            else
                return message.channel.send(MESSAGES.ERRORS.UNKNOWN)
        }
        if (defaultEmoji)
            return message.channel.send(MESSAGES.INFO.DEFAULT_EMOJI)

        const parseName = (str: string) => str ? some(str.toLowerCase()) : none()
        const name = args.nextMaybe(parseName)?.value

        if (url && !name)
            return message.channel.send(MESSAGES.ERRORS.NAME)
        if (name?.length > 32 || name?.length < 2)
            return message.channel.send(MESSAGES.INFO.NAME_LIMIT)

        const emoji = await guild.emojis.create(url, name || givenName)

        if (!emoji)
            return message.channel.send(MESSAGES.ERRORS.EMOJI)
        return message.channel.send(MESSAGES.STATES.EMOJI_ADDED(emoji, name || givenName))
    }
}