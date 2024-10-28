This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Live Demo

Check out the live demo of the project [here](https://audio-transcription-one.vercel.app).

## Getting Started

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/vishalmeena2211/audio-transcription.git
cd audio-transcription
```

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses the [Deepgram API](https://deepgram.com/) for transcription services. Make sure to set up your Deepgram API key in the environment variables.

## Using Deepgram API

To use the Deepgram API, follow these steps:

1. Sign up for a Deepgram account and get your API key.
2. Create a `.env` file in the root of your project and add your API key:

    ```plaintext
    DEEPGRAM_API_KEY=your_deepgram_api_key
    ```

3. Use the API key in your application to make transcription requests.

## Learn More

To learn more about the Deepgram API, visit the [official documentation](https://developers.deepgram.com/).

