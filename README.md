# Rapid Express

Rapid Express is a simple API server built with **Bun**, **TypeScript**, **Express.js**, and **Prisma ORM** with **MySQL** as the database. This project follows a structured approach to developing scalable and efficient backend applications.

## Features
- **Authentication**: Provides token-based api authentication.
- **User Management**: Provides CRUD operations for user management.
- **Order Management**: Allows creating and managing orders, products, and customers.
- **API Response Standardization**: Uses a helper function to standardize API responses.
- **Error Handling**: Proper error handling with consistent JSON format.
- **Pagination Support**: Supports pagination for listing resources.

## Technology Stack
- **Bun**: A fast all-in-one JavaScript runtime that replaces Node.js.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **Prisma ORM**: A modern ORM for Node.js and TypeScript, used for database access.
- **MySQL**: A popular relational database used for storing data.

## Project Setup

### Prerequisites
- **Bun** installed on your system.
- **MySQL** database running locally or remotely.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/andynur/rapid-express.git
   cd rapid-express
   ```

2. Install dependencies using **Bun**:
   ```bash
   bun install
   ```

3. Set up your environment variables by creating a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/yourdatabase"
   ```

4. Run Prisma migrations to set up the database:
   ```bash
   bun run prisma:migrate
   ```

5. Seed the database with initial data:
   ```bash
   bun run prisma:seed
   ```

### Running the Application

To start the server in **development mode** with auto-reloading:
```bash
bun run dev
```

To start the server in **production mode**:
```bash
bun run start
```

### API Response Standardization

The application uses a helper function `apiResponse` to standardize API responses across all routes. Example response structure:

```json
{
  "status": 200,
  "message": "Success",
  "data": {...},
  "errors": null,
  "meta": null
}
```

Fields like `errors` and `meta` are optional and will only appear if provided.

### Error Handling

Errors in the application are handled using a custom error handler and returned with a consistent format. For example:

```json
{
  "status": 404,
  "message": "Resource not found",
  "errors": null
}
```

### Running Tests

To run tests (if configured):
```bash
bun run test
```

### Original Project
This project is a fork of the [typescript-express-starter](https://github.com/ljlm0402/typescript-express-starter) repository. It has been customized to use [Bun](https://bun.sh/) for improved performance and a better developer experience

### Contributing

Feel free to fork this project, create issues, or submit pull requests to help improve **Rapid Express**.

### License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).