import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message, MessageEmbed } from 'discord.js'

@ApplyOptions<OliviaCommandOptions>({
    description: 'Displays a server\'s emoji limits.',
    preconditions: ['administratorOnly'],
    usage: 'limits'
})
export default class extends OliviaCommand {
    public run(message: Message) {
        const guild = message.guild!
        const { premiumTier } = guild
        const guildEmojis = guild.emojis.cache
        const animated = guildEmojis.filter(emoji => emoji.animated)
        const emojiLimit =
            premiumTier == 0 ? 50 :
            premiumTier == 1 ? 100 :
            premiumTier == 2 ? 150 : 250
        const embed: Partial<MessageEmbed> = {
            author: {
                name: guild.name,
                iconURL: guild.iconURL({ dynamic: true, format: 'png', size: 512 })
            },
            color: 16316671,
            fields: [
                { inline: false, name: 'Server Boosts', value: `${ guild.premiumSubscriptionCount } boost(s) (Tier ${ premiumTier })` },
                {
                    inline: false, 
                    name: 'Emoji Limits', 
                    value: [
                        `**Animated:** ${ emojiLimit } emojis (${ animated.size } used, ${ emojiLimit - animated.size } free)`,
                        `**Regular:** ${ emojiLimit } emojis (${ guildEmojis.size - animated.size } used, ${ emojiLimit - guildEmojis.size + animated.size } free)`,
                        `**Total:** ${ 2 *emojiLimit } emojis (${ guildEmojis.size } used, ${ (2 * emojiLimit) - guildEmojis.size } free)`
                    ].join('\n')
                }
            ]
        }

        return message.channel.send({ embed })
    }
}