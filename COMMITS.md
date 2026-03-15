# Commit Guidelines

## Format

```
<type>(<scope>): <subject>
```

## Types

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code restructure |
| `perf` | Performance |
| `test` | Tests |
| `build` | Dependencies |
| `ci` | CI/CD |
| `chore` | Maintenance |

## Examples

```bash
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(user): resolve email validation"
git commit -m "docs: update readme"
git commit -m "refactor(service): extract common logic"
```

## Rules

- Lowercase type and subject
- Use imperative mood ("add" not "added")
- No period at end
- Max 72 characters

## Helper

```bash
npm run commit  # Interactive helper
```

## Git Hooks

- **pre-commit**: Lints & formats code
- **commit-msg**: Validates format
- **pre-push**: Runs build

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
