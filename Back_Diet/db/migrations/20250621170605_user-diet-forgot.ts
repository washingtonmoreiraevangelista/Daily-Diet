import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('email').notNullable()
    table.text('userName').notNullable()
    table.text('password').notNullable()
    table.text("role").defaultTo("user").notNullable()
    table.text('profilePicture').nullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
  })

  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('userId').notNullable()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.text('date').notNullable()
    table.text('time').notNullable()
    table.text('isDiet').notNullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
  })

  await knex.schema.createTable('password_resets', (table) => {
    table.uuid('id').primary()
    table.uuid('userId').notNullable()
    table.text('token').notNullable()
    table.timestamp('expires_at').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('passwordReset')
}