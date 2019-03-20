import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

const PreviewCompatibleImage = ({ imageInfo, srcSet = '', ...rest }) => {
  const imageStyle = { borderRadius: '5px' };
  const { alt = '', childImageSharp, image } = imageInfo;

  if (!!image && !!image.childImageSharp) {
    console.log(1);
    return (
      <Img
        style={imageStyle}
        fluid={image.childImageSharp.fluid}
        alt={alt}
        {...rest}
      />
    );
  }

  if (!!childImageSharp) {
    console.log(2);
    return (
      <Img
        style={imageStyle}
        fluid={childImageSharp.fluid}
        alt={alt}
        {...rest}
      />
    );
  }

  if (!!image && typeof image === 'string') {
    console.log(3);
    const sources = srcSet ? { srcSet } : {};
    return <img style={imageStyle} src={image} alt={alt} {...sources} />;
  }

  return null;
};

PreviewCompatibleImage.propTypes = {
  imageInfo: PropTypes.shape({
    alt: PropTypes.string,
    childImageSharp: PropTypes.object,
    image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    style: PropTypes.object,
    srcSet: PropTypes.string
  }).isRequired
};

export default PreviewCompatibleImage;
