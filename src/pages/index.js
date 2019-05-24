import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import Layout from '../components/Layout';
import Img from 'gatsby-image';

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <Layout>
        <section className="section is-padding-less">
          <div className="container">
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">Latest Stories</h1>
            </div>
            {posts.slice(0, 5).map(({ node: post }) => (
              <div
                className="content"
                style={{ padding: '2em 4em' }}
                key={post.id}
              >
                <p>
                  <Link
                    className="has-text-primary post-header"
                    to={post.frontmatter.permalink}
                  >
                    {post.frontmatter.title}
                  </Link>
                  <div>{post.frontmatter.date}</div>
                  <a
                    href={post.frontmatter.permalink}
                    title={post.frontmatter.title}
                  >
                    <Img
                      fixed={post.frontmatter.image.childImageSharp.fixed}
                      objectFit="cover"
                      objectPosition="50% 50%"
                      className="single-featured wp-post-image"
                      alt=""
                    />
                  </a>
                </p>
                <p>
                  {post.excerpt}
                  <br />
                  <br />
                  <Link
                    className="button is-small"
                    to={post.frontmatter.permalink}
                  >
                    Keep Reading →
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array
    })
  })
};

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            permalink
            date(formatString: "MMMM DD, YYYY")
            image {
              name
              absolutePath
              childImageSharp {
                fixed(height: 400, width: 800) {
                  src
                  srcSet
                }
              }
            }
          }
        }
      }
    }
  }
`;
