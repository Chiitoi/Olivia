import { ApplyOptions } from '@sapphire/decorators'
import { Event, EventOptions, Events } from '@sapphire/framework'
import type { Guild } from 'discord.js'
import { SETTINGS } from '../lib/utility/constants'

@ApplyOptions<EventOptions>({
    event: Events.GuildDelete
})
export default class extends Event<Events.GuildDelete> {
    public async run(guild: Guild) {
        const { client } = this.context!
        const settings = client.settings.get(guild)

        if (settings)
            await client.settings.set(guild, SETTINGS.IN_GUILD, false)
    }
}