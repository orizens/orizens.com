import React from 'react';
import PropTypes from 'prop-types';
import PreviewCompatibleImage from './PreviewCompatibleImage';
const packages = [
  {
    className: 'package1',
    url: 'https://goo.gl/RJgihR'
  },
  {
    className: 'package2',
    url: 'https://goo.gl/7zg4y9'
  },
  {
    className: 'package3',
    url: 'https://goo.gl/6iAYIi'
  }
];

const Packages = () => (
  <article className="columns">
    {packages.map(({ className, url }) => (
      <section key={url} className="column">
        <a href={url} className={`package ${className}`} />
      </section>
    ))}
  </article>
);

Packages.propTypes = {};

export default Packages;
