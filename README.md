# Nominate Movies

The web application has been deployed to https://nominate-movies-d9f6a.web.app/.

## Quick Start 🚀

1. Install the dependencies: `npm ci`.
1. Start the development server: `npm run dev`.
1. Open a browser and open `http://localhost:3000`.

Note: I have Node v14.16.0 and npm v6.14.11 installed. Other recent versions of Node and npm should work.

## Run Tests ✅

Please ensure both Firefox and Chrome has been installed. I've tested the work on Chrome 90 and Firefox 88.

1. Ensure the development server is running: `npm run dev`
1. Run the tests on Chrome and Firefox. (Remove the `--headless` flag to see the interactions on the browsers.)

```
npx cypress run --browser chrome --headless
npx cypress run --browser firefox --headless
```

## Deploy to Firebase 🔥

1. Create a new Firebase project. Note the project's name. Put the project name in `.firebaserc`.
1. Build the production code: `npm run build`.
1. Ensure Firebase could deploy the web application locally: `npx firebase emulators:start`. You should be able to open the web application on a web browser on `http://localhost:5000`.
1. Deploy to Firebase hosting: `npx firebase deploy --only hosting`.
