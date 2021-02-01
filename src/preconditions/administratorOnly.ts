import { Precondition } from '@sapphire/framework'
import { Message, Permissions } from 'discord.js'

export default class AdministratorOnly extends Precondition {
    public run(message: Message) {
        const { member: { permissions }, guild } = message

        if (!guild)
            return this.error('No guild found.')
        if (!permissions.has(Permissions.FLAGS.ADMINISTRATOR))
            return this.error('Not an administrator.')
        return this.ok()     
    }
}