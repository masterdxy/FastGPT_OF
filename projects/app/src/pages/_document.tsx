import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <title>{process.env.SYSTEM_NAME || 'Knowledge GPT'}</title>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
