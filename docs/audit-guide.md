# Audit Guide

This guide provides hints to help you identify governance weaknesses without giving away solutions.

## Hint 1: Deployment Triggers

**Question:** What branches can trigger the deployment workflow?

**Where to look:**
- Open `.github/workflows/deploy.yml`
- Look at the `on:` section
- Check the `branches:` configuration

**What to consider:**
- Is the pattern `'*'` used?
- Does this mean every branch can deploy?
- In production, should development branches be able to deploy?

---

## Hint 2: Environment Configuration

**Question:** Does the workflow specify a deployment environment?

**Where to look:**
- Search for the keyword `environment:` in the workflow
- Check if it's present at all

**What to consider:**
- What does an `environment:` field do?
- What happens when a workflow doesn't specify an environment?
- How would you define a production environment?

---

## Hint 3: Secret Storage Scope

**Question:** Where are deployment secrets stored?

**Where to look:**
- Find all lines with `${{ secrets.` in the workflow
- Check GitHub Settings → Secrets and variables

**What to consider:**
- Are secrets at the repository level or environment level?
- Who has access to repository-level secrets?
- Should production secrets be available to non-production deployments?

---

## Hint 4: Permissions

**Question:** What permissions does the workflow have?

**Where to look:**
- Look for the `permissions:` block at the job level or workflow level
- Notice what capabilities are granted

**What to consider:**
- What is the principle of least privilege?
- What permissions does a deployment actually need?
- Are overly broad permissions a risk?

---

## Hint 5: Approval Workflow

**Question:** Is there any approval requirement before deployment?

**Where to look:**
- Check GitHub Settings → Environments
- Look for "Required reviewers"
- Check workflow YAML for approval steps

**What to consider:**
- Who should approve production deployments?
- What happens if no approval is required?
- How many reviewers is adequate?

---

## Hint 6: Branch Restrictions

**Question:** Which branches are allowed to deploy to production?

**Where to look:**
- GitHub Settings → Environments → production
- Look for "Deployment branches"
- Check `if:` conditions in the workflow

**What to consider:**
- Should feature branches deploy to production?
- Should only `main` or `master` deploy?
- What's a typical policy?

---

## Hint 7: Wait Timer

**Question:** Is there a delay between approval and deployment?

**Where to look:**
- GitHub Settings → Environments → production
- Look for "Wait timer"

**What to consider:**
- Why would you wait after approval?
- What's the purpose of a grace period?
- How long should production wait?

---

## Hint 8: Repository Settings

**Question:** Are there any branch protection rules?

**Where to look:**
- GitHub Settings → Branches
- Look for "Branch Protection Rules" on `main`

**What to consider:**
- What rules protect `main`?
- Are required approvals configured?
- Is status checks required?

---

## Checklist for Your Audit

Use this to track your findings:

- [ ] Deployment branches are restricted
- [ ] Deployment environment is defined
- [ ] Environment requires reviewer approval
- [ ] Minimum 2 reviewers are required
- [ ] Wait timer is configured
- [ ] Secrets are environment-scoped
- [ ] Permissions follow least privilege
- [ ] Branch protection rules exist

---

## Weakness Severity Guide

As you discover weaknesses, rate their severity:

**Critical:**
- Deployments from any branch to production
- Production without approval requirement
- Repository secrets used for production

**High:**
- Single reviewer for production
- No wait timer
- Overly broad permissions

**Medium:**
- Missing branch restrictions
- No deployment environment
- No deployment history tracking

---

## Evidence Collection

For each weakness, note:

1. **What:** The specific misconfiguration
2. **Where:** File name and line number, or GitHub setting path
3. **Why:** Why this is a risk
4. **How:** How would you fix it

Example:

```
Weakness: Deployments from any branch
Where: .github/workflows/deploy.yml line 5, `branches: ['*']`
Why: Untested code from feature branches could reach production
How: Change to `branches: [main]` and require branch-up-to-date check
```

