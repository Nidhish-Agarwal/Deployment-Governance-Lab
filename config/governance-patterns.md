# Configuration file showing all deployment governance patterns

## GitHub Environments Overview

Environments in GitHub Actions allow you to:

1. **Require Reviewers** — At least N people must approve before deployment
2. **Branch Restrictions** — Only allow deployments from specific branches
3. **Wait Timer** — Enforce a delay between approval and deployment execution
4. **Environment Secrets** — Secrets scoped to specific environments
5. **Deployment History** — Track all deployments and their approvers

### Production Environment Configuration

```yaml
name: production
description: Production environment for Checkout Service
reviewers: [team-lead, oncall-engineer]
required_reviewers: 2
branch_policy: protected
allowed_branches: [main]
wait_timer: 60
```

## Secret Scoping Patterns

### Repository-level secrets (INSECURE)
- Available to ALL workflows
- Available to ALL branches
- No environment differentiation
- Example: `${{ secrets.DATABASE_URL }}`

### Environment-level secrets (SECURE)
- Available only to specified environment
- Available only when environment rules are satisfied
- Scoped to deployment context
- Example: `${{ secrets.PROD_DATABASE_URL }}`

## Deployment Approval Workflow

1. **Trigger** — Developer pushes to main branch
2. **Workflow Runs** — GitHub Actions starts deployment job
3. **Environment Check** — System checks if environment `production` is specified
4. **Approval Required** — Workflow pauses at `environment:` step
5. **Reviewers Notified** — Required reviewers receive notification
6. **Wait Timer** — If configured, apply minimum wait time
7. **Approval Action** — Reviewer approves or rejects deployment
8. **Continue or Cancel** — Workflow proceeds or stops based on decision
9. **Deployment Executes** — If approved, deployment steps run
10. **Audit Trail** — Deployment recorded with approver information

## Common Governance Weaknesses

### Weakness 1: Deployments from any branch
- Risk: Untested or incomplete code reaches production
- Fix: Use branch restrictions to allow only `main`

### Weakness 2: No required reviewers
- Risk: No human review of production changes
- Fix: Require minimum 2 approvers for production environment

### Weakness 3: No wait timer
- Risk: Accidental deployments execute immediately
- Fix: Set 60-second wait timer for production

### Weakness 4: Repository-scoped secrets
- Risk: Secrets available to all workflows including non-production
- Fix: Use environment-scoped secrets for production credentials

### Weakness 5: Overly broad permissions
- Risk: Workflow can perform unintended actions
- Fix: Use principle of least privilege (read contents, write deployments only)

## Validation Checklist

- [ ] Production environment exists in GitHub
- [ ] Minimum 2 required reviewers configured
- [ ] Only `main` branch can deploy to production
- [ ] 60-second wait timer is active
- [ ] All production secrets are environment-scoped
- [ ] Workflow uses `environment: production`
- [ ] Workflow runs from main branch trigger
- [ ] Deployment requires explicit approval

