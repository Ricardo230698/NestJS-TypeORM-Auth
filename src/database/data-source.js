const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'mysql',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.js'],
  migrations: ['src/database/migrations/*.js'],
  migrationsTableName: 'migrations',
});

module.exports = AppDataSource;
