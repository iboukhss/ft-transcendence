# Project roadmap

Closest example projects ideas: **Marketplace Platform**, **Pet Adoption Platform**

## Mandatory part

### General requirements

- [x] The project must be a web application, and requires a frontend, backend, and a database.
- [x] Git must be used with clear and meaningful commit messages.
- [ ] Deployment must use a containerization solution and run with a single command.
- [ ] Your website must be compatible with the latest stable version of Google Chrome.
- [ ] No warning or errors should appear in the browser console.
- [ ] The project must include accessible **Privacy Policy** and **Terms of Service** pages with relevant content.
- [ ] Your website must support multiple users silmutaneously.

### Technical requirements

- [ ] A frontend that is clear, repsonsive, and accessible across all devices.
- [x] Use a CSS framework or styling solution of your choice.
- [x] Store credentials in a local `.env` file that is ignored by Git and provide an `.env.example` file.
- [x] The database must have a clear schema and well-defined relations.
- [x] Your application must have a basic user management system. Users must be able to signup and log in securely:
  - At minimum email and pasword authentication with proper security.
  - Additional authentication methods can be implemented via modules.
- [x] All forms and user inputs must be properly validated in both the frontend and backend.
- [ ] Any connection to the backend, from a browser, from a script, from an external API, etc. must use HTTPS. Connections inside the backend itself can be without encryption.

## Modules

✅ Must have  
❔ Nice to have  
❌ Not planned  
⚫ Not applicable

### Web

| Status | Goal | Score |
| --- | --- | --- |
| ✅ | Use a framework for both the frontend and backend | 2 pts |
| ⚫ | Use a frontend framework | 1 pt |
| ⚫ | Use a backend framework | 1 pt |
| ❔ | Implement real-time features using WebSockets or similar technology | 2 pt |
| ❔ | Allow users to interact with each other | 2 pts |
| ✅ | Implement a public API | 2 pts |
| ✅ | Use an ORM for the database | 1 pt |
| ✅ | Implement a complete notification system | 1 pt |
| ✅ | Server-Side Rendering | 1 pt |
| ❌ | Progressive Web App (PWA) with offline support and installability | 1 pt |
| ✅ | Custom-made design system with reusable components | 1 pt |
| ❔ | Implement advanced search functionality with filters, sorting, and pagination | 1 pt |
| ✅ | File upload and management system | 1 pt |
| | | 9/14 pts |

**Missing features**:

- [ ] Implement public API keys, rate limits and documentation
- [ ] Add ability to delete uploaded files

**Other notes**:

- Look into [WebSockets with Nitro](https://nitro.build/docs/websocket).
- Full chat system is a lot of work, very nice to have but maybe not worth the time investment right now.
- We can pass Nuxt toasts as "A complete notification system" for all CRUD operations.
- Reusable components can be done for an easy extra point.
- File upload system seems very manageable.

### Accessibility and internationalitzation

| Status | Goal | Score |
| --- | --- | --- |
| ❌ | Complete accessibility compliance (WCAG 2.1 AA) | 2 pts |
| ❌ | Multi-language support (at least 3) | 1 pt |
| ❌ | Right-to-left (RTL) language support | 1 pt |
| ✅ | Support for at least 2 additional browsers | 1 pt |
| | | 1/5 pts |

**Notes**:

- There is an [official i18n module for Nuxt](https://nuxt.com/modules/i18n) (not sure if worth the effort for just 1 point).
- Need to do more rigorous testing overall.

### User management

| Status | Goal | Score |
| --- | --- | --- |
| ✅ | Standard user management and authentication | 2 pts |
| ⚫ | Game statistics and match history | 1 pt |
| ✅ | Implement remote authentication with OAuth 2.0 | 1 pt |
| ✅ | Advanced permission system | 2 pts |
| ❔ | An organization system | 2 pts |
| ❌ | Implement a complete 2FA system | 1 pt |
| ❔ | User activity analytics and insights dashboard | 1 pt |
| | | 5/10 pts |

**Missing features**:

- [x] Allow users to upload an avatar.
- [ ] Display online status in real time.
- [ ] Implement OAuth via 42 API using nuxt-auth-utils.
- [ ] Add at least one admin account and look into middleware for admins, users, guests and potentially moderators.

**Other notes:**

- 2FA could be a pretty easy point to get, again, check nuxt-auth-utils.

### Artificial intelligence

| Status | Goal | Score |
| --- | --- | --- |
| ⚫ | Introduce AI opponent for games | 2 pts |
| ❌ | Implement a complete Retrieval-Augmented Generation (RAG) system | 2 pts |
| ❌ | Implement a complete LLM system interface | 2 pts |
| ❌ | Recommendation system using machine learning | 2 pts |
| ❌ | Content moderation AI | 1 pt |
| ❌ | Voice/speech integration for accessibility or interaction | 1 pt |
| ❌ | Sentiment analysis for user-generated content | 1 pt |
| ❌ | Image recognition and tagging system | 1 pt |
| | | 0/12 pts |

### Cybersecurity

| Status | Goal | Score |
| --- | --- | --- |
| ❌ | Implement WAF/ModSecurity + HashiCorp Vault for secrets | 2 pts |
| | 0/2 pts |

### Gaming and user experience

N/A

### Devops

| Status | Goal | Score |
| --- | --- | --- |
| ❌ | Infrastructure for log management using ELK | 2 pts |
| ❌ | Monitoring system with Prometheus and Grafana | 2 pts |
| ❌ | Backend as microservices | 2 pts |
| ❌ | Health check and status page system with automated backups and disaster recovery procedures | 1 pt |
| | | 0/7 pts |

**Notes**:

- ELK, Prometheus and Grafana are super boring and kinda useless, still good points tho.

### Data and analytics

| Status | Goal | Score |
| --- | --- | --- |
| ❌ | Advanced analytics dashboard with data visualization | 2 pts |
| ❔ | Data export and import functionality | 1 pt |
| ✅ | GDPR compliance features | 1 pt |
| | | 1/4 pts |

**Notes**:

- Simply being able to delete an account and exporing its data as JSON can get us very close to 2 extra points.

### Blockchain

N/A

### Bonus module (1 or 2 extra points)

TBD

Some ideas mentionned:
- Stripe API
- Deployment to Cloudflare Workers

---

**Potential final score:** 16/14 pts

## Final deadline

My final deadline is on the 17-06-2026 (+12 bonus days), we should aim to be ready to defend by early June maximum.
