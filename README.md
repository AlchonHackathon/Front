# Main React Project

Welcome to the Main React Project! This guide will help you set up and run the application on your local machine.

## Prerequisites

Before you begin, ensure you have the following software installed:

1. **Git** - To clone the repository.
2. **Node.js** and **npm** - To run the application.

### Installing Git

To install Git, follow the instructions on the [official Git website](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Installing Node.js and npm

Node.js and npm often come together. To install them, follow the instructions on the [Node.js official website](https://nodejs.org/).

To verify the installations, run the following commands in your terminal:
```bash
node -v
npm -v
```
### Cloning the Repository
To clone the repository, open your terminal and run the following command:

```bash
git clone https://github.com/AlchonHackathon/Main.git
```
Navigate to the project directory:

```bash
cd Main
```
### Installing Dependencies
Once you're inside the project directory, install the necessary dependencies by running:

```bash
npm install
```
Next, navigate to the backend directory and install its dependencies:

```bash
cd backend
npm install
```
### Running the Application
After the dependencies are installed, start the application by running:

```bash
npm start
```
This command will start the development server, and you should be able to see the application running at http://localhost:3000 in your web browser.

### File Structure

- `backend/` - Contains backend-related code.
- `frontend/` - Contains frontend-related code.
- `.env` - Environment variables.
- `.gitignore` - Specifies files to ignore in the repository.
- `package.json` - Lists dependencies and scripts.
- `package-lock.json` - Locks the versions of dependencies.

### Updating the Project

To update the project to the latest version, navigate to your project directory and run:
```bash
git pull origin main
```

Then, reinstall any new dependencies:

```bash
npm install
cd backend
npm install
```

### Contributing

If you wish to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

### Contact

For any questions or issues, please contact [faizchan23@gmail.com].

Happy coding!
