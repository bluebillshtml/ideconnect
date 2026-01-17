# Constraints

## Technical Constraints

- **Performance**: API response time < 200ms (p95)
- **Scalability**: Support 10,000 concurrent users
- **Browser Support**: Modern browsers only (Chrome, Firefox, Safari, Edge latest 2 versions)
- **Database**: PostgreSQL 15+ required
- **Node.js**: Version 18+ required

## Business Constraints

- **Budget**: No paid third-party services (use free tiers only)
- **Timeline**: MVP must launch within 3 months
- **Compliance**: GDPR compliance required for EU users
- **Data Retention**: User data retained for 2 years after account deletion

## Resource Constraints

- **Team Size**: 3 developers, 1 designer
- **Infrastructure**: Self-hosted or free cloud tiers only
- **Time**: 40 hours/week per developer
- **Expertise**: Team familiar with React/Node.js, learning Prisma

## Design Constraints

- **Responsive**: Must work on desktop and tablet (mobile optional)
- **Accessibility**: WCAG 2.1 AA compliance
- **Browser Storage**: Use localStorage (no IndexedDB requirement)
- **API**: REST only (no GraphQL)

## Operational Constraints

- **Deployment**: Manual deployment process (CI/CD future phase)
- **Monitoring**: Basic logging only (no APM tools)
- **Backup**: Daily database backups required
- **Uptime**: Target 99% uptime (no SLA)

