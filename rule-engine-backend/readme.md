## Rule-Engine-AST - Backend

### Overview
The **Rule-Engine-AST Backend** is responsible for creating, evaluating, and managing rules using Abstract Syntax Trees (ASTs). It supports CRUD operations on rules, combining multiple rules, and evaluating them against provided datasets. The backend is built using **Node.js**, **Express.js**, and **MongoDB**, focusing on rule-based logic management.

---

### Prerequisites

Ensure you have the following installed before proceeding:
- [Node.js](https://nodejs.org/en/) (v14 or above)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [npm](https://www.npmjs.com/) (Node Package Manager)

---

### Setup and Installation

#### Step 1: Clone the Repository

First, clone the **backend** repository to your local machine:

```bash
git clone https://github.com/hitaarthh/rule-engine-ast-backend.git
cd rule-engine-ast-backend
```

#### Step 2: Install Dependencies

Install the required packages and dependencies by running:

```bash
npm install
```

This will install:
- `express` - Web framework for Node.js.
- `mongoose` - MongoDB object modeling tool.
- `body-parser` - Middleware for parsing request bodies.
- `cors` - Enables CORS for frontend communication.

#### Step 3: Set Up MongoDB

Ensure MongoDB is installed and running locally or remotely. By default, the app connects to `mongodb://localhost:27017/rule-engine`. Update the MongoDB URI in the `server.js` file if using a different instance.

#### Step 4: Run the Backend Server

Start the backend server using:

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

---

### Key Functionalities

1. **Create Rules**
   - Allows users to create rules by parsing rule strings into ASTs and storing them in MongoDB.
   
2. **Evaluate Rules**
   - Evaluates rules against provided data and returns results based on the rule logic.

3. **Combine Multiple Rules**
   - Combines multiple existing rules into a single, new rule.

4. **Fetch Rule Structures**
   - Retrieves the structure of a rule in an understandable format.

---

### Database Design

The backend uses **MongoDB** to store rules and nodes for representing ASTs. Below is a detailed design of the MongoDB schemas used:

<div align="center">
<img width="798" alt="Screenshot 2024-10-19 at 1 50 53 PM" src="https://github.com/user-attachments/assets/ec159483-0f36-450c-b81f-5c297ee18854">
</div>


1. **Node Schema**
   - Represents individual nodes of an AST.
   - Each node can be of type 'operator' or 'operand'.
   - Nodes can have references to left and right child nodes, forming a binary tree structure.


- **Node Fields:**
  - `type`: Defines whether the node is an 'operator' or 'operand'.
  - `value`: Stores the value of the node, such as operators (e.g., 'AND', 'OR') or operands (e.g., 'age > 18').
  - `left` and `right`: References to child nodes, forming a binary tree structure.

- **Rule Fields:**
  - `name`: Unique identifier for the rule.
  - `rootNode`: Reference to the root node of the AST, forming the entry point of the rule.

### Services and Endpoints

1. **Create Rule**
   - **Endpoint**: `/api/rules/create`
   - **Method**: POST
   - **Description**: Accepts rule name and rule string, converts the rule string into an AST, and stores it in the database.

2. **Combine Rules**
   - **Endpoint**: `/api/rules/combine`
   - **Method**: POST
   - **Description**: Combines multiple rules specified by their IDs into a new rule.

3. **Evaluate Rule**
   - **Endpoint**: `/api/rules/evaluate/:ruleId`
   - **Method**: POST
   - **Description**: Evaluates the rule identified by `ruleId` against the provided data.

4. **Get Rule Structure**
   - **Endpoint**: `/api/rules/structure/:ruleId`
   - **Method**: GET
   - **Description**: Retrieves the structure of the rule identified by `ruleId`.

5. **Get All Rules**
   - **Endpoint**: `/api/rules`
   - **Method**: GET
   - **Description**: Fetches all rules stored in the database.

6. **Delete Rule**
   - **Endpoint**: `/api/rules/:ruleId`
   - **Method**: DELETE
   - **Description**: Deletes the rule identified by `ruleId` and its associated nodes from the database.

---

### Additional Features

- **Error Handling**: Comprehensive error handling for all endpoints and database operations.
- **Extensible**: The backend is designed to accommodate additional features, such as rule optimization, debugging tools, and integration with other services.
