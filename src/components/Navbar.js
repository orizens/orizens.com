import React from 'react';
import { Link } from 'gatsby';
import github from '../img/github-icon.svg';
import logo from '../img/logo.svg';
import ensoLogoWhite from '../img/uploads/2017/12/enso-white.png';
import PreviewCompatibleImage from './PreviewCompatibleImage';

const Navbar = class extends React.Component {
  componentDidMount() {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll('.navbar-burger'),
      0
    );
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    }
  }

  render() {
    console.log('navbar items', this.props);
    const {
      items: {
        props,
        props: { image }
      }
    } = this.props;
    const isBlogPostWithFeaturedImage = image;
    const featuredImage = isBlogPostWithFeaturedImage
      ? {
          // image
          backgroundImage: `url(${image.childImageSharp.resolutions.src})`
        }
      : {};
    console.log('featuredImage: ', featuredImage);

    console.log('isBlogPostWithFeaturedImage: ', isBlogPostWithFeaturedImage);
    return (
      <header
        id="masthead"
        className="site-header primary-theme-bg"
        role="banner"
      >
        <nav className="navbar navbar-default" role="navigation">
          <div className="site-navigation-inner container">
            <div className="navbar-header">
              {/* <button type="button" className="btn navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button> */}
            </div>
            <div className="orizens-logo">
              <a href="/">
                <img
                  alt="File:enso-white.png"
                  className="enso"
                  src={ensoLogoWhite}
                  width="110"
                  height="136"
                  data-file-width="138"
                  data-file-height="136"
                />
                rizens
              </a>
            </div>
            <div className="collapse navbar-collapse navbar-ex1-collapse">
              <ul id="menu-main-menu" className="nav navbar-nav">
                <li
                  id="menu-item-837"
                  className="menu-item menu-item-type-custom menu-item-object-custom menu-item-837"
                >
                  <a title="Blog" href="http://orizens.com">
                    Blog
                  </a>
                </li>
                <li
                  id="menu-item-406"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-406"
                >
                  <a title="About" href="./about/">
                    About
                  </a>
                </li>
                <li
                  id="menu-item-407"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-407"
                >
                  <a title="Services" href="./services/">
                    Services
                  </a>
                </li>
                <li
                  id="menu-item-1159"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-1159 dropdown"
                >
                  <a
                    title="Articles"
                    href="#"
                    data-toggle="dropdown"
                    className="dropdown-toggle"
                  >
                    Articles{' '}
                  </a>
                  <ul role="menu" className=" dropdown-menu">
                    <li
                      id="menu-item-1164"
                      className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1164"
                    >
                      <a
                        title="Angular Articles Series"
                        href="./angular-2-article-series/"
                      >
                        Angular Articles Series
                      </a>
                    </li>
                    <li
                      id="menu-item-1166"
                      className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-1166"
                    >
                      <a title="AngularJS" href="./categories/angular/">
                        AngularJS
                      </a>
                    </li>
                    <li
                      id="menu-item-1161"
                      className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-1161"
                    >
                      <a title="ngrx" href="./categories/ngrx/">
                        <span className="glyphicon articles about angular 2 and ngrx/store, ngrx/effects" />
                        &nbsp;ngrx
                      </a>
                    </li>
                    <li
                      id="menu-item-1162"
                      className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-1162"
                    >
                      <a title="RxJS" href="./categories/rxjs/">
                        <span className="glyphicon Articles about RxJs" />
                        &nbsp;RxJS
                      </a>
                    </li>
                    <li
                      id="menu-item-1163"
                      className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-1163"
                    >
                      <a title="testing" href="./categories/testing/">
                        testing
                      </a>
                    </li>
                    <li
                      id="menu-item-1165"
                      className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-1165"
                    >
                      <a title="typescript" href="./categories/typescript/">
                        typescript
                      </a>
                    </li>
                  </ul>
                </li>
                <li
                  id="menu-item-405"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-405"
                >
                  <a title="Contact" href="./contact/">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {!isBlogPostWithFeaturedImage && (
          <div id="logo">
            <a className="main-logo" href="/" />
            <h1 className="main-tagline">Front End Consulting Services </h1>
            <div className="tagline">
              Javascript, Angular, UI Development, Web Technologies and Trends
            </div>
            <a
              href="https://goo.gl/RJgihR"
              className="btn btn-default btn-consulting-package"
            >
              Get Custom Angular Consulting Package
            </a>
          </div>
        )}
        {isBlogPostWithFeaturedImage && (
          <section className="mb-2">
            <h1 className="entry-title has-text-centered title">
              <a href="/" rel="bookmark">
                {props.title}
              </a>
            </h1>
            <a
              className="post-featured-image"
              href="/"
              title={props.title}
              style={featuredImage}
            >
              {/* <PreviewCompatibleImage
                imageInfo={featuredImage}
                className="single-featured"
                height="370"
              /> */}
            </a>
          </section>
        )}
      </header>
    );
  }
  //  render() {
  //    return (

  //   <nav className="navbar is-transparent" role="navigation" aria-label="main-navigation">
  //     <div className="container">
  //       <div className="navbar-brand">
  //         <Link to="/" className="navbar-item" title="Logo">
  //           <img src={logo} alt="Kaldi" style={{ width: '88px' }} />
  //         </Link>
  //         {/* Hamburger menu */}
  //         <div className="navbar-burger burger" data-target="navMenu">
  //           <span></span>
  //           <span></span>
  //           <span></span>
  //         </div>
  //       </div>
  //       <div id="navMenu" className="navbar-menu">
  //       <div className="navbar-start has-text-centered">
  //         <Link className="navbar-item" to="/about">
  //           About
  //         </Link>
  //         <Link className="navbar-item" to="/products">
  //           Products
  //         </Link>
  //         <Link className="navbar-item" to="/contact">
  //           Contact
  //         </Link>
  //         <Link className="navbar-item" to="/contact/examples">
  //           Form Examples
  //         </Link>
  //       </div>
  //       <div className="navbar-end has-text-centered">
  //         <a
  //           className="navbar-item"
  //           href="https://github.com/AustinGreen/gatsby-netlify-cms-boilerplate"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           <span className="icon">
  //             <img src={github} alt="Github" />
  //           </span>
  //         </a>
  //       </div>
  //       </div>
  //     </div>
  //   </nav>
  //   )}
};

export default Navbar;
