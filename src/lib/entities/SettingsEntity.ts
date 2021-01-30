import { Column,  Entity, PrimaryColumn } from 'typeorm'
import { PREFIX } from '../../config'

@Entity('settings')
export default class Settings {
    @PrimaryColumn({ type: 'bigint', comment: 'Guild ID' })
    guildId: string

    @Column({ type: 'varchar', length: 3, default: PREFIX, comment: 'Guild prefix' })
    prefix!: string

    @Column({ type: 'bigint', default: '{}', comment: 'Bot channel ID list', array: true })
    botChannelIds!: string[]

    @Column({ type: 'boolean', default: true, comment: 'Flag to see if Olivia is in guild'})
    inGuild!: boolean
}