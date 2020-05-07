module.exports = {
  siteMetadata: {
    title: `Orizens`,
    author: `Oren Farhi`,
    occupation: `Senior Front End Engineer & Javascript Consultant`,
    description: `Front End, Angular, Javascript, React and much more`,
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
    "gatsby-plugin-sass",
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
              maxWidth: 590,
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
        icon: `content/assets/profile-picture.jpg`,
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
    `gatsby-plugin-netlify-cms`,
  ],
}
