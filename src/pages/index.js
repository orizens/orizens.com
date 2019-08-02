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
        <section className="section">
          <div className="container">
            <h1 className="has-text-weight-bold is-size-2 index-primary-title">
              Latest Articles
            </h1>
            {posts
              .slice(0, 5)
              .map(
                ({
                  node: {
                    id,
                    excerpt,
                    frontmatter: { title, date, permalink, image }
                  }
                }) => (
                  <div
                    className="content"
                    style={{ padding: '2em 4em' }}
                    key={id}
                  >
                    <p>
                      <Link className="post-header" to={permalink}>
                        {title}
                      </Link>
                      <div>{date}</div>
                      <a href={permalink} title={title}>
                        <Img
                          fixed={image.childImageSharp.fixed}
                          objectFit="cover"
                          objectPosition="50% 50%"
                          className="single-featured wp-post-image"
                        />
                      </a>
                    </p>
                    <p>{excerpt}</p>
                    <Link className="btn-keep-reading" to={permalink}>
                      Keep Reading →
                    </Link>
                  </div>
                )
              )}
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
