# Dashboard API

## Build Setup

#### Before run steps

- create `config.js` in mysql folder like as `config.js.sample`

```bash
# install dependencies
$ npm install

# run for server as local
$ sls offline start
```

### To migrate and import the seed data into database
- need to create the `schema` before `migrate` and `db:seed`.

```bash
# to migrate
$ npm run migrate

# to db:seed
$ npm run db:seed

# to prettier
$ npm run format
```