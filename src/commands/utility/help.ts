import { OliviaCommand, OliviaCommandOptions } from '@lib/structures/OliviaCommand'
import { ApplyOptions } from '@sapphire/decorators'
import { Args, Command, CommandOptions, none, some } from '@sapphire/framework'
import type { Message, MessageEmbed } from 'discord.js'
import { formatCategoryName, formatCommands } from '@lib/utility/utils'
import { MESSAGES, SETTINGS } from '@lib/utility/constants'


@ApplyOptions<OliviaCommandOptions>({
    description: 'Gets the invite link for Olivia.',
    usage: 'invite'
})
export default class extends OliviaCommand {
    public async run(message: Message, args: Args) {
        const { client } = this.context
        const commands = client.stores.get('commands')
        const categories = await formatCommands(commands)
        const query = args.nextMaybe()?.value?.toLowerCase()
        const prefix = client.settings.get(message.guild, SETTINGS.PREFIX)

        let embed: Partial<MessageEmbed>
        
        if (!query) {
            const keys = [...categories.keys()]
            const values = [...categories.values()]

            embed = {
                color: 16316671,
                fields: keys.map((categoryName, index) => ({
                    inline: false,
                    name: formatCategoryName(categoryName),
                    value: values[index].map(({ description, name }) => `\u2022 \`${ prefix }${ name }\` - ${ description }`).join('\n')
                })),
                title: `${ client.user.username }'s commands`
            }
        } else if (commands.has(query)) {
            const { aliases, category, description, examples, name, usage } = commands.get(query) as OliviaCommand
            embed = {
                color: 16316671,
                fields: [
                    { inline: false, name: 'Category', value: formatCategoryName(category) },
                    { inline: false, name: 'Description', value: description },
                    { inline: false, name: 'Usage', value: `\`${ prefix }${ usage }\`` }
                ],
                footer: { text: 'Optional - [] | Required - <>' },
                title: `The "${ prefix }${ name }" command`,
            }

            if (examples)
                embed.fields.push({ inline: false, name: 'Examples', value: examples.map(example => `\`${ prefix }${ example }\``).join('\n') })
            if (aliases?.length)
                embed.fields.push({ inline: false, name: 'Aliases', value: aliases.map(alias => `\`${ prefix }${ alias }\``).join('\n') })

        } else if (categories.has(query)) {
            const category = categories.get(query)

            embed = {
                color: 16316671,
                description: category.map(({ description, name }) => `\u2022 \`${ prefix }${ name }\` - ${ description }`).join('\n'),
                title: `The "${ query.charAt(0).toUpperCase() + query.slice(1) }" category`
            }
        } else {
            return message.channel.send(MESSAGES.ERRORS.NOT_FOUND('match'))
        }

        return message.channel.send({ embed })
    }
}