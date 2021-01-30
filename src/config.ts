export const PG_DB_HOST = process.env.PG_DB_HOST ?? 'localhost'
export const PG_DB_NAME = process.env.PG_DB_NAME ?? 'olivia'
export const PG_DB_PORT = +process.env.PG_DB_PORT ?? 5432
export const PG_DB_PASS = process.env.PG_DB_PASS ?? ''
export const PG_DB_USER = process.env.PG_DB_USER ?? 'postgres'
export const PREFIX = 'o!'
export const PRODUCTION = process.env.NODE_ENV === 'production'
export const TOKEN = process.env.TOKEN!