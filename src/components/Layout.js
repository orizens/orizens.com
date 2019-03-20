import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import Navbar from '../components/Navbar';
import './all.sass';

const TemplateWrapper = ({ children }) => (
  <StaticQuery
    query={graphql`
      query HeadingQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={data => (
      <div>
        <Helmet>
          <html lang="en" />
          <title>{data.site.siteMetadata.title}</title>
          <meta
            name="description"
            content={data.site.siteMetadata.description}
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/img/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            href="/img/favicon-32x32.png"
            sizes="32x32"
          />
          <link
            rel="icon"
            type="image/png"
            href="/img/favicon-16x16.png"
            sizes="16x16"
          />

          {/* <link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#ff4400" /> */}
          <meta name="theme-color" content="#fff" />

          <meta property="og:type" content="business.business" />
          <meta property="og:title" content={data.site.siteMetadata.title} />
          <meta property="og:url" content="/" />

          <meta
            name="google-site-verification"
            content="tm4cqyi4DBgxauSM6i7ka3Dl31o5496c1CX4IaN1iMM"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300|Quicksand"
            rel="stylesheet"
          />
          <link
            href="//fonts.googleapis.com/css?family=Lora%3A400%2C400italic%2C700%2C700italic%7CMontserrat%3A400%2C700%7CMaven+Pro%3A400%2C700"
            type="text/css"
            media="all"
            rel="stylesheet"
          />
        </Helmet>
        <Navbar items={children} />
        <div>{children}</div>
      </div>
    )}
  />
);

export default TemplateWrapper;
