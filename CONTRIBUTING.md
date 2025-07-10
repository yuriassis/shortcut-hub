# Contributing to Shortcut Hub

Thank you for your interest in contributing to Shortcut Hub! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Standards](#development-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different experience levels
- **Be collaborative**: Work together to improve the project

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Git for version control
- Basic knowledge of React, TypeScript, and Node.js

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/shortcut-hub.git
   cd shortcut-hub
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/originalowner/shortcut-hub.git
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development environment:**
   ```bash
   npm run dev
   ```
   This starts both the frontend (port 5173) and backend (port 3001).

3. **Verify the setup:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api/health

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Fix issues and improve stability
- **Feature additions**: Add new functionality
- **Documentation**: Improve or add documentation
- **Performance improvements**: Optimize code and performance
- **UI/UX enhancements**: Improve user interface and experience
- **Testing**: Add or improve tests
- **Refactoring**: Improve code structure and maintainability

### Before You Start

1. **Check existing issues**: Look for existing issues or discussions
2. **Create an issue**: For significant changes, create an issue first to discuss
3. **Get feedback**: Discuss your approach before implementing large features
4. **Stay updated**: Sync with upstream regularly to avoid conflicts

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/add-keyboard-shortcuts`
- `fix/execution-timeout-bug`
- `docs/update-api-documentation`
- `refactor/improve-error-handling`
- `test/add-integration-tests`

## Pull Request Process

### 1. Prepare Your Changes

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code, test, commit ...

# Push to your fork
git push origin feature/your-feature-name
```

### 2. Create Pull Request

1. Go to GitHub and create a pull request
2. Use a clear, descriptive title
3. Fill out the pull request template
4. Link related issues using keywords (e.g., "Fixes #123")

### 3. Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### 4. Review Process

- Maintainers will review your pull request
- Address feedback and make requested changes
- Keep your branch updated with the main branch
- Once approved, your PR will be merged

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Windows 10, macOS 12.0, Ubuntu 20.04]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 91, Firefox 89]
- App version: [e.g., 1.0.0]

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

For feature requests, please include:

```markdown
**Feature Description**
A clear description of what you want to happen.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How do you envision this feature working?

**Alternatives Considered**
What alternatives have you considered?

**Additional Context**
Add any other context or screenshots about the feature request.
```

## Development Standards

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` type - use proper typing
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React Guidelines

- Use functional components with hooks
- Follow React best practices
- Use proper prop typing with TypeScript
- Implement proper error boundaries
- Use meaningful component names

### Backend Guidelines

- Use Express.js best practices
- Implement proper error handling
- Add input validation
- Use meaningful HTTP status codes
- Document API endpoints

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(shortcuts): add keyboard shortcut support
fix(execution): resolve timeout handling bug
docs(api): update endpoint documentation
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for new functions and components
- Add integration tests for API endpoints
- Test error scenarios and edge cases
- Maintain good test coverage (aim for >80%)

### Test Structure

```typescript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should do something specific', () => {
    // Test implementation
    expect(result).toBe(expected);
  });

  it('should handle error cases', () => {
    // Error testing
    expect(() => functionCall()).toThrow();
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex algorithms and business logic
- Keep comments up-to-date with code changes
- Use meaningful variable and function names

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Keep API docs synchronized with implementation

### User Documentation

- Update README.md for user-facing changes
- Add examples for new features
- Update troubleshooting guides
- Keep installation instructions current

## Release Process

### Version Numbering

We follow Semantic Versioning (SemVer):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Version number is bumped
- [ ] Changelog is updated
- [ ] Release notes are prepared

## Getting Help

If you need help or have questions:

1. **Check documentation**: README, API docs, examples
2. **Search issues**: Look for similar questions or problems
3. **Create an issue**: Ask questions or report problems
4. **Join discussions**: Participate in GitHub discussions

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes for significant contributions
- GitHub contributor statistics

Thank you for contributing to Shortcut Hub! Your efforts help make this project better for everyone.