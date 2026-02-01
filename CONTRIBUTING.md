# Contributing to Laboratorio Clínico Glorimar

Thank you for your interest in contributing to the Laboratorio Clínico Glorimar project! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- XAMPP with MariaDB/MySQL ([Download](https://www.apachefriends.org/))
- Git ([Download](https://git-scm.com/))

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/proyecto-cine-glorimar.git
   cd proyecto-cine-glorimar
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   # Start XAMPP MySQL service
   mysql -u root < cine.sql
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### 1. Choose an Issue
- Check the [Issues](https://github.com/your-username/proyecto-cine-glorimar/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes
- Write clear, focused commits
- Test your changes thoroughly
- Follow the coding standards below

### 4. Test Your Changes
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
```

### 5. Submit a Pull Request
- Push your branch to your fork
- Create a Pull Request with a clear description
- Reference any related issues

## 💻 Coding Standards

### JavaScript/ES6+ Standards

- Use `const` and `let` instead of `var`
- Prefer arrow functions for anonymous functions
- Use template literals instead of string concatenation
- Use async/await for asynchronous operations
- Use meaningful variable and function names

```javascript
// ✅ Good
const getUserById = async (id) => {
  const user = await dbService.getUserById(id);
  return user;
};

// ❌ Avoid
var x = function(y) {
  return db.get(y);
};
```

### MVC Architecture Guidelines

- **Controllers**: Handle HTTP requests, validate input, call services
- **Services**: Contain business logic, interact with database
- **Routes**: Define API endpoints, apply middleware
- **Views**: Present data using EJS templates

### File Structure
```
controllers/
├── FeatureController.js     # Class-based controllers
routes/
├── featureRouter.js         # Express routers
database/
├── DBService.js            # Database operations
views/
├── feature/
│   ├── action.ejs          # EJS templates
```

### Error Handling

```javascript
// ✅ Proper error handling
try {
  const result = await service.operation();
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}
```

### Validation

```javascript
// ✅ Input validation
const validateProduct = (data) => {
  const errors = [];

  if (!data.nombre || data.nombre.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.precio || data.precio <= 0) {
    errors.push('Price must be positive');
  }

  return errors;
};
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

### Manual Testing

1. **API Testing**
   ```bash
   # Test endpoints with curl
   curl http://localhost:3002/api/productos

   # Use Postman or similar tools
   ```

2. **UI Testing**
   - Test all CRUD operations
   - Verify responsive design
   - Check form validations

## 📝 Submitting Changes

### Commit Messages

Follow conventional commit format:

```bash
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat: add product search functionality
fix: resolve memory leak in order processing
docs: update API documentation
```

### Pull Request Process

1. **Create PR**
   - Use descriptive title
   - Reference related issues
   - Provide clear description

2. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   Add screenshots of UI changes
   ```

3. **Review Process**
   - Code review by maintainers
   - Automated tests must pass
   - At least one approval required

## 🐛 Reporting Issues

### Bug Reports

**Good Bug Report:**
- Clear title describing the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

**Template:**
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10]
- Node Version: [e.g., 18.15.0]
- Browser: [e.g., Chrome 110]

**Additional Context**
Any other relevant information
```

### Feature Requests

**Good Feature Request:**
- Clear description of the proposed feature
- Use case or problem it solves
- Proposed implementation if applicable
- Mockups or examples if relevant

## 📞 Getting Help

- **Documentation**: Check the README.md first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers for sensitive matters

## 🎯 Contribution Areas

### High Priority
- Database optimization
- Security enhancements
- Performance improvements
- Mobile responsiveness

### Medium Priority
- Additional features
- UI/UX improvements
- Testing coverage
- Documentation

### Low Priority
- Code refactoring
- Dependency updates
- Tooling improvements

---

Thank you for contributing to Cine Glorimar! 🎬✨