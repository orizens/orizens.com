require("dotenv").config()

module.exports = {
  siteMetadata: {
    title: `Orizens`,
    author: `Oren Farhi`,
    occupation: `Front End Engineer Tech Lead`,
    description: `Front End Engineer Tech Lead, React Consultant, Software Architect, Javascript, Angular and much more`,
    siteUrl: `https://orizens.com`,
    disqus: `orizens`,
    social: {
      twitter: `orizens`,
      github: `orizens`,
      npm: `orizens`,
      linkedin: `orenfarhi`,
    },
    publications: {
      angular: `//www.apress.com/us/book/9781484226193`,
    },
  },
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/pages`,
        name: `pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/img`,
        name: "images",
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-1207545-1`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Orizens Website`,
        short_name: `OrizenS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#23d160`,
        display: `minimal-ui`,
        icon: `content/assets/profile-2021.jpg`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `orizens`,
      },
    },
    // `gatsby-plugin-netlify-cms`,
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: require("./src/utils/algolia-queries"),
      },
    },
    `gatsby-plugin-feed`
  ],
}
