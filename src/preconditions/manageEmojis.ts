import { Precondition } from '@sapphire/framework'
import { Message, Permissions } from 'discord.js'

export default class extends Precondition {
    public run(message: Message) {
        const { member: { permissions }, guild } = message

        if (!guild)
            return this.error({ message: 'No guild found.' })
        if (!permissions.has(Permissions.FLAGS.MANAGE_EMOJIS))
            return this.error({ message: 'User does not have the "MANAGE_EMOJIS" permission.' })
        return this.ok()     
    }
}