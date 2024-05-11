## Up and running
- Make sure you have docker installed on your system.
- Create an `.env` file inside `app` and `worker` directories. It should contain the variables in `.env.example` with some sensible defaults.
- The frontend should be available at http://localhost:3000 on all envs

### Development
- In each `app` and `worker` run `yarn`
- build: `docker compose -f compose-dev.yml build` (rebuild if you change container dependencies)
- start: `docker compose -f compose-dev.yml up -d`
- stop: `docker compose -f compose-dev.yml down`
- reset volume: `docker compose -f compose-dev.yml down -v`

Obs: If the CSS acts up when you first load the dev server give it a kick.

### Production
- build: `docker compose -f compose.yml build` (rebuild if you change container dependencies)
- start: `docker compose -f compose.yml up -d`
- stop: `docker compose -f compose.yml down`
- cleanup: `docker compose -f compose.yml down -v`


### Post mortem
I time-boxed this tech challenge, so I didn't get the chance to implement everything I wanted. Notably:

- Frontend integration tests
- E2E tests
- Possibly having a separate backend server
- Add react-query to frontend and long-poll `/api/scans/` endpoint in order to update scans statuses without the need for refreshing (websockets or SSEs are also valid options)
- Potentially use a relational database (PostgreSQL?) - I went with Mongo for simplicity in order not to be dealing with migrations.
- Adhering to a monorepo in order to have a `common` package to hold shared dependencies between `app` and `worker` i.e. database connection and models, nmap command sanitization/validation and any other shared Typescript deps.
