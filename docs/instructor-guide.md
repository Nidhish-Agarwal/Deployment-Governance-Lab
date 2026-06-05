# Instructor Guide

This document contains solutions and validation procedures for the Deployment Governance Lab.

**KEEP CONFIDENTIAL — For instructors only.**

## Lab Objectives Assessment

Students should demonstrate:

1. Understanding of GitHub Environments and their purpose
2. Ability to identify governance weaknesses
3. Hands-on configuration of environment protection rules
4. Validation that approval workflows function correctly

---

## Intended Weaknesses (Solutions)

### Weakness 1: Deployments from Any Branch

**File:** `.github/workflows/deploy.yml` line 6

```yaml
on:
  push:
    branches:
      - '*'  # ❌ BROKEN: Any branch can deploy
```

**Risk:** Untested code, incomplete features, development branches reach production.

**Expected Student Finding:**
- Students should identify `branches: ['*']` or `branches: [*]`
- Students should recognize this allows all branches to deploy

**Solution:**

Change to:
```yaml
on:
  push:
    branches:
      - main  # ✅ FIXED: Only main branch deploys
  workflow_dispatch:  # Allow manual triggers
```

---

### Weakness 2: Missing Environment Declaration

**File:** `.github/workflows/deploy.yml` deploy job

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    # ❌ BROKEN: No `environment:` field
    permissions: ...
```

**Risk:** No approval workflow, no environment-scoped secrets, no audit trail.

**Expected Student Finding:**
- Students should notice absence of `environment: production`
- Students should understand this means no GitHub environment protection
- They should check GitHub Settings → Environments and find nothing

**Solution:**

Add to deploy job:
```yaml
environment:
  name: production
  url: https://checkout.example.com
```

---

### Weakness 3: No Required Reviewers

**GitHub Setting:** Settings → Environments → (no production environment yet)

**Risk:** Anyone with push access can deploy to production without review.

**Expected Student Finding:**
- Students should navigate to Settings → Environments
- They should find no protection rules configured
- They should see no required reviewers section

**Solution:**

1. Create production environment
2. Add rule: "Require reviewers"
3. Set minimum reviewers: 2
4. Optionally specify reviewer teams

---

### Weakness 4: No Branch Restrictions

**GitHub Setting:** Settings → Environments → (no production environment)

**Risk:** Deployments from feature branches reach production.

**Expected Student Finding:**
- Settings → Environments should be empty
- No rules for which branches can deploy

**Solution:**

1. In production environment, add: "Protect deployment branches"
2. Require branches to be up to date before deployment
3. Select `main` as the only allowed branch

---

### Weakness 5: No Wait Timer

**GitHub Setting:** Settings → Environments → (no production environment)

**Risk:** Accidental deployments execute immediately; no grace period for rollback.

**Expected Student Finding:**
- No "Wait timer" rule configured in production environment

**Solution:**

1. In production environment, add "Wait timer"
2. Set to 60 seconds (1 minute for testing)
3. This enforces 60-second pause between approval and execution

---

### Weakness 6: Repository-Level Secrets

**File:** `.github/workflows/deploy.yml` lines 25–27

```yaml
env:
  DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}          # ❌ Repository-level
  DATABASE_URL: ${{ secrets.DATABASE_URL }}      # ❌ Repository-level
  API_TOKEN: ${{ secrets.API_TOKEN }}            # ❌ Repository-level
```

**Risk:** Secrets available to all workflows and all branches, including non-production.

**Expected Student Finding:**
- Students should identify `${{ secrets.X }}`
- Students should check GitHub Settings → Secrets and variables
- They should find all secrets at repository level

**Solution:**

1. Create environment-specific secrets in Settings → Environments → production
   - `DEPLOY_KEY`
   - `DATABASE_URL`
   - `API_TOKEN`

2. Update workflow to reference environment secrets
   - Secrets automatically scoped when `environment: production` is used

---

### Weakness 7: Overly Broad Permissions

**File:** `.github/workflows/deploy.yml` lines 8–10

```yaml
permissions:
  contents: read           # ✓ OK
  id-token: write          # ? Questionable
```

**Risk:** Workflow has more permissions than needed.

**Expected Student Finding:**
- Students may identify `id-token: write` as unnecessary
- Or note that `contents: read` should be sufficient

**Solution:**

Best practice permissions for deployment:
```yaml
permissions:
  contents: read
  deployments: write
  id-token: write
```

Or minimal:
```yaml
permissions:
  contents: read
```

---

## Validation Procedure (For Instructors)

### Phase 1: Setup Verification (Students must do this)

✅ **Check 1:** Production environment exists
```
GitHub Settings → Environments → "production" should exist
```

✅ **Check 2:** Deployment branch rules configured
```
Settings → Environments → production → "Protect deployment branches"
Should show: "Only allow deployments from main" or similar
```

✅ **Check 3:** Required reviewers configured
```
Settings → Environments → production → "Required reviewers"
Should show: Minimum 2 reviewers selected
```

✅ **Check 4:** Wait timer configured
```
Settings → Environments → production → "Wait timer"
Should show: 60 seconds (or 1 minute for testing)
```

✅ **Check 5:** Environment secrets exist
```
Settings → Environments → production → "Environment secrets"
Should have: DEPLOY_KEY, DATABASE_URL, API_TOKEN
```

✅ **Check 6:** Workflow uses environment
```
.github/workflows/deploy.yml should contain:
environment:
  name: production
```

### Phase 2: Functional Validation (Students must trigger and observe)

✅ **Check 7:** Deployment triggers from main
```
Trigger workflow by:
1. Making a commit to main
2. Or using workflow_dispatch
Workflow should appear in Actions tab
```

✅ **Check 8:** Workflow pauses at approval
```
In Actions tab, find the workflow run
Deploy job should show status: "Waiting for approval"
```

✅ **Check 9:** Reviewers notified
```
GitHub should send notification to required reviewers
"Review deployments" button should appear
```

✅ **Check 10:** Approval proceeds workflow
```
Reviewer clicks "Approve"
Workflow should pause for wait timer
After wait expires, workflow resumes and completes
```

---

## Expected Student Audit Findings

Students should document these weaknesses in `docs/student-notes.md`:

| # | Weakness | Location | Risk | Fix |
|---|----------|----------|------|-----|
| 1 | Deployments from any branch | workflow: `branches: ['*']` | Dev branches reach prod | Restrict to `main` |
| 2 | No environment declaration | workflow: missing `environment:` | No approval workflow | Add `environment: production` |
| 3 | No required reviewers | Settings: no environment | Deploy without review | Add 2+ reviewers |
| 4 | No branch restrictions | Settings: no rules | Feature branches deploy | Require `main` only |
| 5 | No wait timer | Settings: not configured | Instant deploy after approval | Set 60-second timer |
| 6 | Repository-level secrets | workflow: `secrets.X` | Secrets leak to non-prod | Use environment secrets |
| 7 | Overly broad permissions | workflow: `permissions:` | Unnecessary elevated access | Apply least privilege |

---

## Grading Rubric

### Audit Phase (40 points)

- **10 pts:** Identified all 7 major weaknesses
- **10 pts:** Documented evidence (file names, line numbers)
- **10 pts:** Explained risk and impact
- **10 pts:** Proposed fixes

### Configuration Phase (35 points)

- **5 pts:** Created production environment
- **5 pts:** Configured branch restrictions
- **5 pts:** Added 2 required reviewers
- **5 pts:** Set wait timer
- **5 pts:** Created environment secrets
- **5 pts:** Updated workflow with `environment: production`

### Validation Phase (25 points)

- **10 pts:** Triggered deployment successfully
- **10 pts:** Observed approval workflow functioning
- **5 pts:** Provided evidence (screenshots/logs)

**Total: 100 points**

---

## Common Student Mistakes

### Mistake 1: Using Repository Secrets Instead of Environment Secrets

**Student might:** Configure secrets in Settings → Secrets and variables (repository level)

**Why it's wrong:** Secrets become available to all workflows, not just production

**How to correct:** 
- Settings → Environments → production → Environment secrets
- Only these are scoped to production environment

---

### Mistake 2: Forgetting `environment:` in Workflow

**Student might:** Configure all GitHub settings but forget to add `environment: production` to workflow

**Why it's wrong:** Workflow won't trigger approval even though environment is configured

**How to correct:**
```yaml
deploy:
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://checkout.example.com
```

---

### Mistake 3: Setting Branch Restriction but Not Updating Workflow

**Student might:** Restrict deployments to `main` only in GitHub, but leave workflow with `branches: ['*']`

**Why it's wrong:** Workflow can still trigger from any branch; it just won't deploy when it reaches the approval step

**How to correct:**
- Update workflow `on: push: branches: [main]`
- AND configure GitHub environment branch restrictions

---

### Mistake 4: Not Adding Wait Timer

**Student might:** Configure everything else but forget wait timer

**Why it's wrong:** Wait timer is important safety mechanism

**How to correct:**
- Settings → Environments → production
- Click "Add rule" → "Wait timer"
- Set to 60 seconds (or 1 minute for testing)

---

### Mistake 5: Single Reviewer Instead of Multiple

**Student might:** Set only 1 required reviewer

**Why it's wrong:** Single point of failure; no peer review

**How to correct:**
- Settings → Environments → production → Required reviewers
- Set minimum reviewers: 2 (or 3 for critical systems)

---

## Troubleshooting Tips for Instructors

**Q: Student says "I don't see the approval prompt"**

A: Common causes:
1. `environment: production` not in workflow
2. No required reviewers configured
3. Workflow not using `main` branch
4. Student is not in the required reviewers list

Fix: Check all 4 settings.

---

**Q: Student sees workflow succeed without approval**

A: Most likely:
- Workflow doesn't specify `environment: production`
- GitHub environment doesn't exist yet
- OR student is testing on a different branch

Fix: Verify all prerequisites are in place.

---

**Q: Student can't find "Review deployments" button**

A: Reasons:
1. Workflow completed without waiting for approval
2. Student is not a required reviewer
3. Approval window timed out (30 days default)

Fix: Ensure student is in required reviewers list; retrigger workflow.

---

**Q: Workflow runs but "Wait for approval" step never appears**

A: Most likely:
- `environment: production` missing from workflow YAML
- GitHub environment "production" doesn't exist

Fix: Verify YAML syntax and GitHub settings.

---

## Expected Lab Timeline

| Phase | Time | Activity |
|-------|------|----------|
| Setup | 5 min | Students fork/clone repository |
| Audit | 20 min | Students examine workflow and GitHub settings |
| Configuration | 35 min | Students configure environment, reviewers, secrets |
| Validation | 15 min | Students trigger deployment and observe approval |
| Documentation | 15 min | Students write audit report |
| **Total** | **90 min** | |

---

## Assessment Questions (Oral Exam Version)

If students need to defend their work:

1. **"Why is it bad that `branches: ['*']` is used?"**
   - Answer: It allows any branch, including untested development branches, to deploy to production.

2. **"What does `environment: production` do?"**
   - Answer: It links the workflow to the GitHub environment, enabling approval workflows and environment-scoped secrets.

3. **"Why do we need 2+ reviewers instead of 1?"**
   - Answer: Single reviewer is a single point of failure. Multiple reviewers ensure peer review.

4. **"What is the purpose of the wait timer?"**
   - Answer: It provides a grace period for operators to cancel before actual deployment.

5. **"Why use environment-scoped secrets instead of repository secrets?"**
   - Answer: Environment secrets are only available when the environment is targeted, preventing accidental exposure to non-production workflows.

6. **"What happens if someone pushes to a feature branch?"**
   - Answer: If branch restrictions are set, the workflow won't even reach the approval step. If restrictions aren't set, it will try to deploy and get rejected.

7. **"How does GitHub know who the required reviewers are?"**
   - Answer: Configured in Settings → Environments → production → Required reviewers.

---

## Resources for Further Learning

- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Deployment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/managing-environments-for-deployment)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides)
- [SLSA Framework](https://slsa.dev/) (Supply chain Levels for Software Artifacts)

