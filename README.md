What To Eat Ah? - Deployment Guide
This guide will help you set up and deploy your lunch decider app.

Prerequisites
Before you start, make sure you have Node.js and Docker installed on your computer.

Option 1: Running with Docker (Recommended)
This is the easiest way to run the application.

Step 1: Build the Docker Image
Open your terminal or command prompt.

Navigate into your project folder:

```
cd what-to-eat-app
```

Run the following command to build the Docker image. The -t flag tags the image with a name.

```
docker build -t what-to-eat-ah .
```

Step 2: Run the Docker Container
After the image is built, run this command to start the application:

```
docker run -p 8080:8080 what-to-eat-ah
```

This command runs a container from the image you just built and maps port `8080` on your computer to port `3000` inside the container.

Open your web browser and go to `http://localhost:8080`. Your app is now running!

Option 2: Running Locally with Node.js
Follow these steps if you want to run the app without Docker.

Step 1: Set Up Your Project
Create a new folder on your computer for the project, e.g., `what-to-eat-app`.

Place all the project files into the correct folders as shown in the file structure.

Step 2: Install Dependencies
Open your terminal and navigate into your project folder.

Run this command to install all the necessary libraries:

npm install

Step 3: Run the App Locally
To test the app on your computer, run:

npm run dev

This will start a local development server. Open your web browser and go to the address it shows (usually http://localhost:5173).

Step 4: Build for Production
When you are ready to deploy, create an optimized build of your app:

npm run build

This will create a dist folder containing the final static files.

Step 5: Deploy!
Upload the contents of the dist folder to any static web hosting service like Netlify, Vercel, or GitHub Pages.
