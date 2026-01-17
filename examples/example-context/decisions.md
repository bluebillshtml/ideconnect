# Architectural Decisions

## Decision Log

### 2024-01-15 - Use Prisma ORM Instead of Raw SQL

**Context**: Need to choose database access layer for PostgreSQL.

**Decision**: Use Prisma ORM for type-safe database queries and migrations.

**Rationale**: 
- Type safety reduces runtime errors
- Migration system simplifies schema changes
- Good developer experience with auto-completion
- Team familiar with similar ORMs

**Alternatives Considered**: 
- Raw SQL with pg library (more control, less safety)
- TypeORM (more complex, larger ecosystem)
- Drizzle (newer, less mature)

**Consequences**: 
- Positive: Faster development, fewer bugs
- Negative: Learning curve for Prisma-specific features
- Risk: Vendor lock-in to Prisma (mitigated by standard SQL)

---

### 2024-01-10 - Choose Zustand Over Redux for State Management

**Context**: Frontend state management solution needed.

**Decision**: Use Zustand for global state management.

**Rationale**:
- Simpler API than Redux
- Less boilerplate code
- Good TypeScript support
- Small bundle size

**Alternatives Considered**:
- Redux Toolkit (more features, more complexity)
- Context API (built-in, but performance concerns)
- Jotai (atomic state, but team unfamiliar)

**Consequences**:
- Positive: Faster development, easier onboarding
- Negative: Less ecosystem than Redux
- Risk: May need to migrate if requirements grow (low probability)

---

### 2024-01-05 - Self-Hosted Over SaaS for Core Infrastructure

**Context**: Choose hosting and infrastructure approach.

**Decision**: Self-host on VPS with Docker, avoid managed services for core features.

**Rationale**:
- Cost control (no per-user pricing)
- Full control over data and infrastructure
- Learning opportunity for team
- No vendor lock-in

**Alternatives Considered**:
- AWS managed services (easier, but costly at scale)
- Heroku (simple, but expensive)
- Vercel/Netlify (great for frontend, limited for backend)

**Consequences**:
- Positive: Lower costs, more control
- Negative: More operational overhead
- Risk: Scaling challenges (mitigated by Docker and load balancing)

---

