*This project has been created as part of the 42 curriculum by <aakerblo>, <dheck>, <iboukhss>, <jmeli>, <knjaloun>*

## Description
LuxLink offers a platform that allows companies in need of external IT support to post IT and development-related mission offers. Freelancers looking for contract work can then apply to these missions.

LuxLink's goal is to enhance the efficiency of the Luxembourgish job market by focusing its activity on the Greater Region (Luxembourg, Germany, Belgium, and France).

The platform enables companies to select the best-fitting freelancer by reviewing applications before agreeing to enter into a business relationship.


## Instructions (TO BE DONE)

An “Instructions” section containing any relevant information about compilation,
installation, and/or execution

The “Instructions” section should mention all the needed prerequisites (software,
tools, versions, configuration like .env setup, etc.), and step-by-step instructions to
run the project.





## Resources

The projet has been implemented using the framework Nuxt. Nuxt is a typescript 
A “Resources” section listing classic references related to the topic (documen-
tation, articles, tutorials, etc.), as well as a description of how AI was used —
specifying for which tasks and which parts of the project.


## Team Information

- *aakerblo* :
  Role : Developper
  Description : Full-stack developper working on the feature list and bug fixing.
- *dheck* :
  Role : Product Owner, Developper
  Description : Backend developper responsible for defining the product.
- *iboukhss* :
  Role : Projet Manager, Technical Lead
  Description : Full-stack developper in charge of deciding the tech stack and coordinating the team efforts.  
- *jmeli* :
  Role : Developper
  Description : Frontend developper working on the feature list and bug fixing.
- *knjaloun* :
  Role : Developper
  Description : Full-stack developper working on the feature list and bug fixing.


## Project Management

The main project management tool used is GitHub and more precisely GitHub Issues.
For features and bugs, issues are opened that then can be picked up by the team members.

Weekly physical meetings allow to discuss the progress, align on the approach and ensure that everyone is on the same page. Beside the these onsite meetings, a Discord Chat is in place that allows to interact with the team through the following channels :
- general
- frontend
- backend
- ressources

Additionally, a channel "git-log"  keeping track of the GitHub pull requests keeps the team members updated.


## Technical Stack

Choosing the framework used, the following criteria have been considered :
- the framework should be simple to learn and to use
- the language used for the backend logic should be the same as the language used for the frontend logic
- the framework should be well documented

Two candidates were identified in the early stages of the project: Svelte and Nuxt
Both are Typescript frameworks that comply with the criteria cited above.

We chose **Nuxt** primarily for its automatic file-system routing. By following its structured directory layout, application routes are generated automatically. Additionally, Nuxt features Hot Module Replacement to instantly re-render changes upon saving, greatly improving the developer experience.

We selected **PostgreSQL** as our database due to its open-source nature, reliability, and industry-standard performance. To bridge our database with our Nuxt backend, we opted for **Drizzle ORM** for its lightweight feel and type-safe schema management. To populate our database with realistic test data and simulate user activity during development, we utilized **Faker.js**.

Authentication is handled via Nuxt Hub **nuxt-auth-utils**, which provides a streamlined way to manage user sessions, handle secure cookies, and protect server routes across our application.

For API development and manual route testing, we chose **Bruno**, an open-source API client. Finally, to ensure data integrity across the entire application stack, we use **Zod** to handle strict end-to-end form validation on both the frontend and backend.

For the UI, Tailwind CSS has been used to style the frontend.


## Database Schema

The database schema can found under the location : server/database/schema.ts

The database architecture is visualized in an ER diagram, which renders automatically when opening server/database/entity-relationships.md on GitHub.

The entry point of the diagram is the *users* table, where accounts are classified into one of two types: "freelancer" or "company". Depending on the user's account type, their profile details are stored in either the *company_profiles* or *freelancer_profiles* table.

Companies post project listings (*jobs* table), and freelancers apply to them via the *offers* table. A booking is finalized through a two-step handshake: first, the company accepts a freelancer's offer, and then the freelancer must confirm the job on their end. This confirmation step ensures that freelancers are not involuntarily double-booked for multiple conflicting missions during the same time period. Upon the freelancer's acceptance, the booking is triggered, locking the final terms of the mission into the *bookings* table.

Finally, the *api_keys* table stores the tokens that allow corporate clients to access the public API to manage their job postings programmatically. 

## Features List

## Modules



## Individual Contributions

## Limitations
no billing


## Stack
- **Framework:** Nuxt 4 (full-stack)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Form validation:** Zod
- **Styling:** Nuxt UI with Tailwind CSS
- **Auth:** [nuxt-auth-utils](https://nuxt.com/modules/auth-utils)

## Build dependencies
- Node.js v24+
- npm
- Docker and Docker Compose

## Development dependencies
- drizzle-kit
- drizzle-seed
- @nuxt/eslint
- eslint-plugin-perfectionist
- eslint-plugin-tailwindcss
- @faker-js/faker
- mkcert
- bruno
- curl

## Initial dev setup

```bash
# 1. Copy the environment file
cp .env.example .env

# 2. Generate HTTPS keys (important!)

# with root access
sudo apt install mkcert
mkcert -install
mkcert localhost

# otherwise, at 42 to install mkcert without root privileges (make sure ~/.local/bin is in your PATH)
mkdir -p ~/.local/bin
wget -O ~/.local/bin/mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
mkcert -CAROOT
mkcert localhost

# 3. Install the project dependencies
npm install

# 4. Start the database container
docker compose up -d

# 5. Push the database schema
npm run db:push

# 6. Start the server
npm run dev
```

Eventually, the goal will be to deploy everything with a single command but I think it's best to start simple before getting into any premature refactoring.

## Available dev commands

```bash
# Start dev server (main command)
npm run dev

# Check code style
npm run lint
npm run lint:fix

# Database operations (Drizzle)
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:reset
npm run db:seed

# Other
npm run typecheck

# How to nuke the database in case something goes wrong
docker compose down -v
docker compose up -d
npm run db:push

# Or use this more gentle method to scrub all database tables
npm run db:reset
```
