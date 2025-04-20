# Questions with a Connection (Qwac!)
daily provocative questions that you can answer with friends.

## Getting Started
This app was created with create-next-app@latest

```
npx create-next-app@latest client
cd client
npm run dev
```

```
mkdir server
```

changed next.config.js to have reactScrictMode false because it causes components to render twice in development, which was confusing me.
const nextConfig = {reactStrictMode: false};


## Firebase Emulator
install firebase CLI (globally here)
```
npm install -g firebase-tools
firebase login
firebase init
```
firebase init will create a firebase.json file that the emulators will use
Start emulator and tell it to save data to seed folder location
```
firebase emulators:start --export-on-exit=./emulator_seed
//next time you start emulator use below command to import seed from last time
firebase emulators:start --import=./emulator_seed
```












This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
