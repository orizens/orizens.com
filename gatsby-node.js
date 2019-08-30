const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const createPaginatedPages = require("gatsby-paginate")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              excerpt
              fields {
                slug
              }
              frontmatter {
                image {
                  childImageSharp {
                    fixed(width: 400, height: 60) {
                      src
                      srcSet
                    }
                    fluid(maxWidth: 2048, quality: 100) {
                      src
                      srcSet
                    }
                  }
                }
                id
                author
                date
                permalink
                templateKey
                title
                dsq_thread_id
                tags
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  createPaginatedPages({
    edges: posts,
    createPage: createPage,
    pageTemplate: "src/templates/index.js",
    pageLength: 5, // This is optional and defaults to 10 if not used
    // pathPrefix: "blog", // This is optional and defaults to an empty string if not used
    // context: {}, // This is optional and defaults to an empty object if not used
  })
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      // path: post.node.fields.slug,
      path: post.node.frontmatter.permalink || post.node.fields.slug,
      component: blogPost,
      context: {
        // slug: post.node.fields.slug,
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
