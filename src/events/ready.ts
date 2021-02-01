import { ApplyOptions } from '@sapphire/decorators'
import { Event, EventOptions, Events } from '@sapphire/framework'

@ApplyOptions<EventOptions>({
    event: Events.GuildDelete,
    once: true
})
export default class extends Event<Events.Ready> {
    public async run() {
        const { client } = this.context!
        const emojiCount = client.emojis.cache.size
        await client.user.setActivity(`over ${ emojiCount } emoji(s)!`, { type: 'WATCHING' })
    }
}