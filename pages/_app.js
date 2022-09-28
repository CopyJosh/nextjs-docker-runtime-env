import App from 'next/app'
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

/**
 * A page that relies on publicRuntimeConfig must use getInitialProps or getServerSideProps
 * or your application must have a Custom App with getInitialProps to opt-out of Automatic
 * Static Optimization. Runtime configuration won't be available to any page (or component in a page)
 * without being server-side rendered.
 * @see https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
 */
MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps }
}

export default MyApp