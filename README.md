 Please use this link to launch the app **https://mailmaestro.vercel.app**
# MailMaestro

MailMaestro is a Next.js application that uses Google authentication to fetch and classify emails from a user's Gmail account. This project leverages `next-auth` for authentication and the Google APIs to access Gmail data.

## Features

- **Google Sign-In**: Secure authentication using Google OAuth 2.0.
- **Fetch Emails**: Retrieve the latest emails from the user's Gmail account.
- **Classify Emails**: Classify emails using Gemini API {} (with user-provided API key).

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (version 14 or later)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/getting-started/install)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/mailmaestro.git
    cd mailmaestro
    ```

2. **Install dependencies:**

    Using npm:
    ```bash
    npm install
    ```

    Using yarn:
    ```bash
    yarn install
    ```

3. **Create a `.env.local` file in the root directory with the following environment variables:**

    ```bash
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    NEXTAUTH_SECRET=your-next-auth-secret
    NEXTAUTH_URL=http://localhost:3000
    ```

    - Replace `your-google-client-id` and `your-google-client-secret` with your Google OAuth credentials.
    - Replace `your-next-auth-secret` with a secure random string (used to sign NextAuth.js tokens).

4. **Configure Google API Console:**

    - Go to the [Google API Console](https://console.developers.google.com/).
    - Create a new project or select an existing one.
    - Enable the Gmail API and OAuth 2.0 Client IDs.
    - Add the following URL to your authorized redirect URIs:
      ```
      http://localhost:3000/api/auth/callback/google
      ```

5. **Run the development server:**

    Using npm:
    ```bash
    npm run dev
    ```

    Using yarn:
    ```bash
    yarn dev
    ```

    The application should now be running on `http://localhost:3000`.

### Usage

1. **Sign in with Google:**

   - Enter your Gemini API key when prompted.
    - Click the "Sign in with Google" button on the homepage.
    - Complete the Google sign-in process.

2. **Fetch Emails:**

    - Once signed in, click the "Fetch Emails" button to retrieve the latest emails from your Gmail account.

3. **Classify Emails:**

    - Click the "Classify Emails" button and 
    - The app will use Gemini to classify the fetched emails.

### Project Structure

- `app/`: Contains the main application components and pages.
- `lib/gmail.ts`: Utility functions for interacting with the Gmail API.
- `pages/api/auth/[...nextauth].ts`: NextAuth.js configuration for Google OAuth.
- `pages/api/fetch-emails.ts`: API route to fetch emails from Gmail.
- `pages/api/classify-emails.ts`: API route to classify emails using Gemini API.

### Customization

You can customize the project by modifying the following:

- **Authentication Providers**: Add or remove providers in `app/api/auth/route.ts`.
- **Gmail Scopes**: Adjust the permissions and data you want to access from Gmail.
- **Gemini Integration**: Modify how emails are classified or use different models/APIs.

### Troubleshooting

- Ensure you have set up your `.env.local` file correctly.
- Check the console for any error messages.
- Verify that your Google API credentials and permissions are correctly configured.


