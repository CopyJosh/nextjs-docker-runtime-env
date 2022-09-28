import Head from 'next/head'
import styles from '../styles/Home.module.css'
import getConfig from 'next/config'
import { publicRuntimeConfig as libClientRuntime } from '../lib/client-runtime'

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

// Will only be available on the server-side
console.log('server* should be undefined in the browser');
console.log('server', serverRuntimeConfig.server)
console.log('serverBuildtime', serverRuntimeConfig.serverBuildtime)
console.log('serverRuntime', serverRuntimeConfig.serverRuntime)

// Will be available on both server-side and client-side
console.log('client* should be defined in the browser');
console.log('client', publicRuntimeConfig.client)
console.log('clientBuildtime', publicRuntimeConfig.clientBuildtime)
console.log('clientRuntime', publicRuntimeConfig.clientRuntime)

console.warn(libClientRuntime);

const Code = (p) => <code className={styles.inlineCode} {...p} />

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js</a> on Docker!
        </h1>

        <hr width="100%" />

        <h2>
          <u>Next.config Runtime</u>
        </h2>

        <p className={styles.description}>
          <strong>publicRuntimeConfig</strong>
        </p>
        <table className={styles.description}>
          <tbody>
            {Object.entries(publicRuntimeConfig).map(([key, value]) => (
              <tr key={key}>
                <td align="right">{key}</td>
                <td>=</td>
                <td align="left">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={styles.description}>
          <strong>serverRuntimeConfig</strong>
          <br />
          (Nothing to see here, or something went wrong)
        </p>
        <table>
          <tbody>
            {Object.entries(serverRuntimeConfig).map(([key, value]) => (
              <tr key={key}>
                <td align="right">{key}</td>
                <td>=</td>
                <td align="left">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>
          <u>Environment Variables</u>
        </h2>

        <p className={styles.description}>
          FROM_ENV_FILE:{' '}
          <Code>{process.env.FROM_ENV_FILE || 'Nothing to see here'}</Code>
        </p>

        <p className={styles.description}>
          NEXT_PUBLIC_FROM_ENV_FILE:{' '}
          <Code>{process.env.NEXT_PUBLIC_FROM_ENV_FILE}</Code>
        </p>

        <hr width="100%" />

        <p className={styles.description}>
          Get started by editing{' '}
          <Code>pages/index.js</Code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  return {
    props: {},
  }
}
