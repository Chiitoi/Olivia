import { Precondition } from '@sapphire/framework'
import type { Message } from 'discord.js'
import { SETTINGS } from '../lib/utility/constants'

export default class extends Precondition {
    public run(message: Message) {
        const { channel: { id: channelId }, guild } = message

        if (!guild)
            return this.error('No guild found.')

        const botChannelIds = this.context.client.settings.get(guild, SETTINGS.BOT_CHANNEL_IDS)

        if (!botChannelIds.includes(channelId))
            return this.error('Not a valid bot channel in this guild.')
        return this.ok()
    }
}