# Skills Registry - Reusable Intelligence

**Purpose**: Master index of all automation skills for the Hackathon II Todo Project.

**Last Updated**: 2025-12-28

## Skill Categories

### Phase II - Full-Stack Setup

| Skill | Purpose | Trigger |
|-------|---------|---------|
| [neon-db-setup](./neon-db-setup/SKILL.md) | PostgreSQL connection setup | "database", "Neon", "connection" |
| [jwt-middleware](./jwt-middleware/SKILL.md) | JWT verification for FastAPI | "JWT", "auth", "middleware" |
| [cors-config](./cors-config/SKILL.md) | CORS configuration | "CORS error", "blocked by CORS" |

### Error Handling

| Skill | Purpose | Trigger |
|-------|---------|---------|
| [db-timeout-handler](./db-timeout-handler/SKILL.md) | DB timeout diagnosis | "timeout", "connection refused" |
| [build-error-handler](./build-error-handler/SKILL.md) | Build error fixes | "build failing", "npm error" |
| [k8s-pod-crash-handler](./k8s-pod-crash-handler/SKILL.md) | K8s debugging | "pod crashing", "CrashLoopBackOff" |

### Phase IV - Containerization

| Skill | Purpose | Trigger |
|-------|---------|---------|
| [dockerfile-generator](./dockerfile-generator/SKILL.md) | Docker setup | "Docker", "containerize" |

### Phase V - Kubernetes

| Skill | Purpose | Trigger |
|-------|---------|---------|
| [k8s-manifests-generator](./k8s-manifests-generator/SKILL.md) | K8s manifests | "Kubernetes", "K8s deployment" |
| [helm-chart-generator](./helm-chart-generator/SKILL.md) | Helm charts | "Helm", "templated K8s" |

### Meta Skills

| Skill | Purpose | Trigger |
|-------|---------|---------|
| [auto-architect](./auto-architect/SKILL.md) | Auto-detect skill needs | Pattern detection, phase transitions |

## Usage Statistics

| Skill | Times Used | Success Rate | Notes |
|-------|------------|--------------|-------|
| neon-db-setup | 0 | - | New |
| jwt-middleware | 0 | - | New |
| cors-config | 0 | - | New |
| db-timeout-handler | 0 | - | New |
| build-error-handler | 0 | - | New |
| k8s-pod-crash-handler | 0 | - | New |
| dockerfile-generator | 0 | - | New |
| k8s-manifests-generator | 0 | - | New |
| helm-chart-generator | 0 | - | New |
| auto-architect | 0 | - | New |

## Phase Coverage Matrix

| Phase | Skills Available | Coverage |
|-------|------------------|----------|
| Phase I | (console app - no skills needed) | N/A |
| Phase II | neon-db-setup, jwt-middleware, cors-config | Full |
| Phase III | (uses Phase II skills + error handlers) | Full |
| Phase IV | dockerfile-generator | Full |
| Phase V | k8s-manifests-generator, helm-chart-generator | Full |

## Adding New Skills

Follow the Auto-Architect guidelines:

1. **Trigger Detection**: Same pattern 3+ times OR same error 2+ times
2. **Template**: Use standard SKILL.md structure
3. **Register**: Add to this registry
4. **Test**: Verify skill works as expected
5. **Update**: Improve based on usage feedback

## Quick Reference

```bash
# Find skill for specific error
grep -r "CORS" .claude/skills/*/SKILL.md

# List all skills
ls -la .claude/skills/*/SKILL.md

# Check skill coverage for current phase
cat .claude/skills/SKILLS-REGISTRY.md | grep "Phase II"
```

## Improvement Backlog

Future skills to consider:

- [ ] `api-versioning` - API version management
- [ ] `rate-limiting` - Request throttling
- [ ] `caching-layer` - Redis/memory caching
- [ ] `logging-setup` - Structured logging
- [ ] `monitoring-setup` - Prometheus/Grafana
- [ ] `ci-cd-pipeline` - GitHub Actions/GitLab CI
