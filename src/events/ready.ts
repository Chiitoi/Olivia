import { ApplyOptions } from '@sapphire/decorators'
import { Event, EventOptions, Events } from '@sapphire/framework'

@ApplyOptions<EventOptions>({
    event: Events.Ready,
    once: true
})
export default class extends Event<Events.Ready> {
    public async run() {
        const { client } = this.context!
                
        await client.user.setActivity(`a ton of emojis!`, { type: 'WATCHING' })

        console.log(`${ client.user.tag } is online!`)
    }
}