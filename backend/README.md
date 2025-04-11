# Backend API Documentation

## Database Migrations and Schema Changes

This guide explains how to manage database schema changes using Sequelize migrations.

### Prerequisites

1. Install Sequelize CLI globally:
```bash
npm install -g sequelize-cli
```

2. Install project dependencies:
```bash
npm install
```

### Migration Commands

```bash
# Create a new migration
npx sequelize-cli migration:generate --name <migration-name>

# Run all pending migrations
npm run migrate

# Undo the last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all

# Check migration status
npm run migrate:status
```

### Creating a New Migration

1. Generate a new migration file:
```bash
npx sequelize-cli migration:generate --name add-new-feature
```

2. Edit the generated migration file in `src/migrations/`:
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add your schema changes here
    await queryInterface.addColumn('table_name', 'column_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Add code to undo the changes
    await queryInterface.removeColumn('table_name', 'column_name');
  }
};
```

### Common Migration Operations

#### Adding a New Column
```javascript
await queryInterface.addColumn('table_name', 'column_name', {
  type: Sequelize.STRING,
  allowNull: true,
  defaultValue: null
});
```

#### Modifying an Existing Column
```javascript
await queryInterface.changeColumn('table_name', 'column_name', {
  type: Sequelize.TEXT,
  allowNull: false
});
```

#### Adding an Index
```javascript
await queryInterface.addIndex('table_name', ['column_name'], {
  name: 'index_name'
});
```

#### Removing a Column
```javascript
await queryInterface.removeColumn('table_name', 'column_name');
```

#### Renaming a Column
```javascript
await queryInterface.renameColumn('table_name', 'old_name', 'new_name');
```

### Best Practices

1. **Always Create Down Migrations**
   - Every migration should have a corresponding down migration
   - This allows for rollback if needed

2. **Testing Migrations**
   - Test migrations in development environment first
   - Use a copy of production data for testing
   - Verify both up and down migrations work

3. **Production Deployment**
   - Backup database before running migrations
   - Schedule migrations during maintenance windows
   - Monitor migration progress
   - Have a rollback plan ready

4. **Documentation**
   - Document all schema changes
   - Include reason for changes
   - Note any data migration requirements

### Example Migration Scenarios

#### Adding a New Feature
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns
    await queryInterface.addColumn('products', 'feature_flag', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // Add new table
    await queryInterface.createTable('feature_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // ... other columns
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'feature_flag');
    await queryInterface.dropTable('feature_logs');
  }
};
```

#### Modifying Existing Schema
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change column type
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    // Add index
    await queryInterface.addIndex('users', ['phone'], {
      name: 'users_phone_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', 'users_phone_idx');
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(15),
      allowNull: true
    });
  }
};
```

### Troubleshooting

1. **Migration Fails**
   - Check error logs
   - Verify database connection
   - Ensure all previous migrations are applied
   - Check for conflicting changes

2. **Rollback Issues**
   - Verify down migrations are correct
   - Check for data dependencies
   - Ensure proper backup exists

3. **Common Errors**
   - Duplicate column names
   - Invalid column types
   - Missing foreign key references
   - Index conflicts

### Additional Resources

- [Sequelize Migration Documentation](https://sequelize.org/docs/v6/other-topics/migrations/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Migration Best Practices](https://www.prisma.io/dataguide/types/relational/what-are-database-migrations) 