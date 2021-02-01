import { Collection, Guild } from 'discord.js'
import { AbstractRepository, EntityRepository } from 'typeorm'
import SettingsEntity from '../entities/SettingsEntity'

@EntityRepository(SettingsEntity)
export default class SettingsRepository extends AbstractRepository<SettingsEntity> {
    private items: Collection<string, SettingsEntity>

    public async init() {
        this.items = new Collection()
        const guilds = await this.repository.find()

        for (const guild of guilds)
            this.items.set(guild.guildId, guild)
    }

    public get(guild: Guild): SettingsEntity
    public get<K extends keyof SettingsEntity>(guild: Guild, key: K): SettingsEntity[K]
    public get<K extends keyof SettingsEntity>(guild: Guild, key?: K): SettingsEntity | SettingsEntity[K] {
        const guildId = guild.id
        const settings = this.items.get(guildId)

        if (!settings)
            return
        if (!key)
            return settings
        
        return settings[key]
    }

    public async set(guild: Guild): Promise<void>
    public async set<K extends keyof SettingsEntity>(guild: Guild, key: K, value: SettingsEntity[K]): Promise<void>
    public async set<K extends keyof SettingsEntity>(guild: Guild, key?: K, value?: SettingsEntity[K]): Promise<void> {
        const guildId = guild.id
        const settings = this.items.get(guildId)

        if (!settings) {
            const item = await this.repository.save(this.repository.create({ guildId }))
            this.items.set(item.guildId, item)
        }

        if (key) {
            settings[key] = value
            await this.repository.save(settings)
            this.items.set(settings.guildId, settings)
        }
    }
}