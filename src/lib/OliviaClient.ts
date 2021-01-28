import { SapphireClient } from '@sapphire/framework'
import { Intents } from 'discord.js'
import { join } from 'path'
import { TOKEN } from '../config'
// import { Settings } from '../'

export default class OliviaClient extends SapphireClient {
    // public settings: Settings

    public constructor(){
        super({
            baseUserDirectory: join(__dirname, '..'),
            caseInsensitiveCommands: true,
            defaultPrefix: 'o!',
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

    }

    public async start() {
        await this.init()
        await this.login(TOKEN)
    }

}