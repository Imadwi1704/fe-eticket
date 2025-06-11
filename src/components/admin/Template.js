/* eslint-disable @next/next/no-before-interactive-script-outside-document */
/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/no-css-tags */
import Head from "next/head";
import Script from "next/script";

const Template = () => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="shortcut icon"
          type="image/png"
          href="/assets/images/logos/favicon.png"
        />
        <link rel="stylesheet" href="/assets/css/styles.min.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
        />
      </Head>

      {/* Load Bootstrap JS CDN */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />

      {/* Load Local JS Files */}
      <Script src="/assets/libs/jquery/dist/jquery.min.js" strategy="afterInteractive" />
      <Script src="/assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/sidebarmenu.js" strategy="afterInteractive" />
      <Script src="/assets/js/app.min.js" strategy="afterInteractive" />
      <Script src="/assets/libs/apexcharts/dist/apexcharts.min.js" strategy="afterInteractive" />
      <Script src="/assets/libs/simplebar/dist/simplebar.js" strategy="afterInteractive" />
      <Script src="/assets/js/dashboard.js" strategy="afterInteractive" />
    </>
  );
};

export default Template;
