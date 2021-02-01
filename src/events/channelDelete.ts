import { ApplyOptions } from '@sapphire/decorators'
import { Event, EventOptions, Events } from '@sapphire/framework'
import type { GuildChannel } from 'discord.js'
import { SETTINGS } from '../lib/utility/constants'

@ApplyOptions<EventOptions>({
    event: Events.ChannelDelete
})
export default class extends Event<Events.ChannelDelete> {
    public async run(guildChannel: GuildChannel) {
        const { client } = this.context!
        const { id: guildChannelId, guild } = guildChannel
        const botChannelIds = client.settings.get(guild, SETTINGS.BOT_CHANNEL_IDS)
        let newList: string[]


        if (botChannelIds.includes(guildChannelId)) {
            newList = botChannelIds.filter(channelId => channelId != guildChannelId)
            await client.settings.set(guild, SETTINGS.BOT_CHANNEL_IDS, newList)
        }       
    }
}