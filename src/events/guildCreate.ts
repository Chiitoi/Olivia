import { ApplyOptions } from '@sapphire/decorators'
import { Event, EventOptions, Events } from '@sapphire/framework'
import type { Guild } from 'discord.js'
import { SETTINGS } from '../lib/utility/constants'

@ApplyOptions<EventOptions>({
    event: Events.GuildCreate
})
export default class extends Event<Events.GuildCreate> {
    public async run(guild: Guild) {
        const { client } = this.context!
        const settings = client.settings.get(guild)

        if (!settings)
            await client.settings.set(guild)
        else
            await client.settings.set(guild, SETTINGS.IN_GUILD, true)
    }
}