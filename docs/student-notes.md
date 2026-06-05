# Student Audit Notes

Use this file to document your governance audit findings.

## Task 1: Audit Findings

### Weakness 1: [Title]

**Location (file + line number or GitHub setting path):**
```
[Where you found this in the code or GitHub settings]
```

**Evidence:**
```
[Show the specific code or configuration]
```

**Risk:**
- What could go wrong if this is not fixed?
- Who is impacted?
- What's the business impact?

**Root Cause:**
- Why does this configuration exist?
- Was it intentional or an oversight?

**Recommended Fix:**
- How would you address this weakness?
- What tool or setting would you use?
- What would the correct configuration look like?

---

### Weakness 2: [Title]

**Location:**
```

```

**Evidence:**
```

```

**Risk:**


**Root Cause:**


**Recommended Fix:**

---

### Weakness 3: [Title]

**Location:**
```

```

**Evidence:**
```

```

**Risk:**


**Root Cause:**


**Recommended Fix:**

---

### Weakness 4: [Title]

**Location:**
```

```

**Evidence:**
```

```

**Risk:**


**Root Cause:**


**Recommended Fix:**

---

### Weakness 5: [Title]

**Location:**
```

```

**Evidence:**
```

```

**Risk:**


**Root Cause:**


**Recommended Fix:**

---

### Weakness 6: [Title]

**Location:**
```

```

**Evidence:**
```

```

**Risk:**


**Root Cause:**


**Recommended Fix:**

---

### Weakness 7: [Title]

**Location:**
```

```

**Evidence:**
```

```

**Risk:**


**Root Cause:**


**Recommended Fix:**

---

## Task 2: Configuration Actions

Record what you configured:

- [ ] Created production environment in GitHub
- [ ] Added branch protection: only `main` can deploy
- [ ] Added required reviewers: ___ (number)
- [ ] Added wait timer: ___ seconds
- [ ] Created environment secrets:
  - [ ] DEPLOY_KEY
  - [ ] DATABASE_URL
  - [ ] API_TOKEN
- [ ] Updated `.github/workflows/deploy.yml` with `environment: production`

### Configuration Checklist

**GitHub Settings → Environments → production:**

- [ ] Environment name is "production"
- [ ] Branch protection is enabled
- [ ] Only "main" branch is allowed
- [ ] Required reviewers: minimum 2
- [ ] Wait timer: 60 seconds
- [ ] Environment secrets are configured

**Workflow file `.github/workflows/deploy.yml`:**

- [ ] Job includes `environment: production`
- [ ] Deployment only triggers on `push: branches: [main]`
- [ ] Secrets are referenced correctly

---

## Task 3: Validation Evidence

### Deployment Trigger

**How I triggered the deployment:**
```
[Describe what change you made and how you pushed it]
```

**Workflow Run ID:**
```
[Paste the workflow run ID from GitHub Actions]
```

### Approval Step Captured

**Screenshot or description of workflow pause:**
```
[Describe what you saw when the workflow paused at the approval step]
```

**Reviewers shown:**
- Reviewer 1: _______________
- Reviewer 2: _______________

**Approval timestamp:** _______________

### Deployment Completion

**Wait timer duration:** ___ seconds

**Workflow completed successfully:**  ☐ Yes  ☐ No

**Final deployment status:**
```
[Copy the final job status from GitHub Actions logs]
```

---

## Summary

### Total Weaknesses Found

- [ ] 1 weakness
- [ ] 2 weaknesses
- [ ] 3 weaknesses
- [ ] 4 weaknesses
- [ ] 5 weaknesses
- [ ] 6 weaknesses
- [ ] 7+ weaknesses

### Configuration Completion

- [ ] 0–25% complete
- [ ] 25–50% complete
- [ ] 50–75% complete
- [ ] 75–100% complete

### Validation Status

- [ ] Workflow pauses at approval ✓
- [ ] Reviewers notified ✓
- [ ] Wait timer enforced ✓
- [ ] Deployment proceeds after approval ✓

---

## Reflection

**What was the most critical weakness you found?**

```

```

**Which fix was most important to implement?**

```

```

**What surprised you about deployment governance?**

```

```

**How would you apply this to a real production system?**

```

```

---

## Questions for Your Instructor

List any questions that came up during the lab:

1. 

2. 

3. 

