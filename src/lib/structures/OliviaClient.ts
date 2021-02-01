import { SapphireClient } from '@sapphire/framework'
import { Message, Intents } from 'discord.js'
import { join } from 'path'
import { getCustomRepository } from 'typeorm'
import { PREFIX, TOKEN } from '../../config'
import SettingsRepository from './SettingsRepository'
import { SETTINGS } from '../utility/constants'
import { connect } from '../utility/utils'

declare module '@sapphire/framework' {
    interface SapphireClient {
        settings: SettingsRepository
    }
}

export default class OliviaClient extends SapphireClient {
    public settings: SettingsRepository

    public constructor(){
        super({
            baseUserDirectory: join(__dirname, '..', '..'),
            caseInsensitiveCommands: true,
            defaultPrefix: PREFIX,
            fetchPrefix: (message: Message) => this.settings.get(message.guild, SETTINGS.PREFIX),
            messageCacheLifetime: 3600,
            messageCacheMaxSize: 0,
            messageSweepInterval: 2700,
            messageEditHistoryMaxSize: 0,
            ws: {
                intents: [
                    Intents.FLAGS.GUILDS,
                    Intents.FLAGS.GUILD_MESSAGES
                ]
            }
        })
    }

    private async init() {
        await connect()

        this.settings = getCustomRepository(SettingsRepository)
        await this.settings.init()
    }

    public async start() {
        await this.init()
        await this.login(TOKEN)
    }
}