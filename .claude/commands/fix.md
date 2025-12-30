---
name: fix
description: Run typechecking and linting, then spawn parallel agents to fix all issues
---

# Project Code Quality Check

Run all linting and typechecking, collect errors, and spawn parallel agents to fix them.

## Step 1: Run Linting and Typechecking

```bash
npm run lint 2>&1 | head -100
npm run typecheck 2>&1 | head -100
```

## Step 2: Collect and Parse Errors

Parse the output from the commands. Group errors by domain:
- **Type errors**: Issues from TypeScript
- **Lint errors**: Issues from ESLint

Create a list of all files with issues and specific problems.

## Step 3: Spawn Parallel Agents

For each domain with issues, spawn an agent in parallel using the Task tool:

**IMPORTANT**: Use a SINGLE response with MULTIPLE Task tool calls to run agents in parallel.

- Spawn a "type-fixer" agent for type errors
- Spawn a "lint-fixer" agent for lint errors

Each agent should:
1. Receive the list of files and specific errors
2. Fix all errors in their domain
3. Run the relevant check command to verify fixes
4. Report completion

## Step 4: Verify All Fixes

After all agents complete, run the full check again:

```bash
npm run lint && npm run typecheck
```

Ensure all issues are resolved.
