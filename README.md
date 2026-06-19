*This project has been created as part of the 42 curriculum by \<aakerblo\>, \<dheck\>, \<iboukhss\>, \<jmeli\>, \<knjaloun\>*

## Description
LuxLink offers a platform that allows companies in need of external IT support to post IT and development-related mission offers. Freelancers looking for contract work can then apply to these missions.

LuxLink's goal is to enhance the efficiency of the Luxembourgish job market by focusing its activity on the Greater Region (Luxembourg, Germany, Belgium, and France).

The platform enables companies to select the best-fitting freelancer by reviewing applications before agreeing to enter into a business relationship.


## Instructions

The following section shows how the setup and run the project.

### Stack
- **Framework:** Nuxt 4 (full-stack)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Form validation:** Zod
- **Styling:** Nuxt UI with Tailwind CSS
- **Auth:** [nuxt-auth-utils](https://nuxt.com/modules/auth-utils)

### Build dependencies
- Node.js v24+
- npm
- Docker and Docker Compose

### Development dependencies
- drizzle-kit
- drizzle-seed
- @nuxt/eslint
- eslint-plugin-perfectionist
- eslint-plugin-tailwindcss
- @faker-js/faker
- mkcert
- bruno
- curl

### Initial dev setup

```bash
# 1. Git clone to project
git clone repository_path

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

### Available dev commands

Once the project has been setup, the following commands are available in the project.

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

## Resources

The following ressources have been involved

### Official documentation

A key ressource is the official documenation of the frameworks and libraries used.

#### Nuxt & Nuxt Hub

[NUXT](https://nuxt.com/)
[NUXT Hub](https://hub.nuxt.com/)

#### Drizzle ORM documentation

[Drizzle](https://orm.drizzle.team/)

#### Faker.js

[Faker.js](https://fakerjs.dev/)

#### Zod

[Zod](https://zod.dev/)

### Videos

The following Nuxt tutorial playlists greatly helped in taking the first steps : 

[Nuxt 4 - Fullstack Web Development Series](https://www.youtube.com/playlist?list=PLrQyuTC3FMzyv5r8p1QLXlb_6RaAYQfhk) 
[Nuxt Crash Course 2025](https://www.youtube.com/watch?v=RhZZ0whiuT8)
[Integrating WebSockets in Nuxt and Nitro](https://www.youtube.com/watch?v=OfY7JcrqkPg&t=56s)

### Usage of Artificial Intelligence

AI played a key role in both the planning and development phases of this project. In the architectural phase, it helped identify appropriate libraries and provided strategies for implementing complex features. During development, AI helped the team overcome the steep learning curve associated with Nuxt and TypeScript. Specifically, it was used to draft boilerplate code, provide real-time debugging assistance, and review code implementations to ensure we were writing clean, structured, and type-safe code.


## Team Information

The team is composed of 5 teams members.

- *aakerblo* :
  - Role : Developper
  - Description : Full-stack developper working on the feature list and bug fixing.
- *dheck* :
    - Role : Product Owner, Developper
    - Description : Backend developper responsible for defining the product.
- *iboukhss* :
    - Role : Projet Manager, Technical Lead
    - Description : Full-stack developper in charge of deciding the tech stack and coordinating the team efforts.  
- *jmeli* :
    - Role : Developper
    - Description : Frontend developper working on the feature list and bug fixing.
- *knjaloun* :
    - Role : Developper
    - Description : Full-stack developper working on the feature list and bug fixing.


## Project Management

We use GitHub Issues as our main project management tool. Features and bugs are tracked via open issues, which can be assigned to and picked up by team members.

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

The following features have been implemented.

### Register a new user :
- Owner : iboukhss & dheck
- Description : Registering a new user and writting the information including the hashed password to the database.

### User login

#### Standard login
- Owner : iboukhss & dheck
- Description : Retrieves the user record from the database and verifies that the entered password matches the securely stored password hash.

#### OAuth login
- Owner : knjaloun
- Description : Login via the user Google Account.

#### Authentication Middleware
- Owner : dheck
- Description : A custom middleware that verifies whether a user is securely authenticated and possesses the required account type authorized to access the route.

### User profile management

#### Change email address
- Owner : iboukhss & dheck
- Description : Updating the user's email used for the login.

#### Change password
- Owner : iboukhss & dheck
- Description : Fetching the database and verifying that the password entered matches the password stored in the database.

#### Update profile information
- Owner : iboukhss & dheck
- Description : Updating the user's profile information in the database (First name, Last name, country, About, ...)

#### Upload / delete Avatar
- Owner : iboukhss & aakerblo
- Description : Storing / delete avatar uploaded by the user.

#### GDPR - request your data
- Owner : jmeli
- Description : Allow the user to download its data and request their suppresion.

### Terms of service & Privacy policy
- Owner : jmeli
- Description : Drafting and implementing the view for the Terms of service & Privacy policy pages.

### Find talents & jobs pages

#### Frontend views
- Owner : iboukhss & aakerblo & jmeli
- Description : Fetching the database and verifying that the password entered matches the password stored in the database.

#### Advanced search
- Owner : iboukhss & aakerblo  
- Description : Advanced search and filtering system that allows to efficiently search through talents and jobs

#### Pagination
- Owner : knjaloun  
- Description : Pagination for jobs and talents.

### Implementation business logic

#### Frontend
- Owner : dheck  
- Description : Possibility to create jobs, apply to jobs, accept/decline job applications and create the bookings.

#### Backend
- Owner : dheck  
- Description : Possibility to create jobs, apply to jobs, accept/decline job applications and create the bookings.

## Modules

(final list to be done)

## Individual Contributions



## Limitations
no billing


