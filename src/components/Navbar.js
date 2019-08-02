import React from 'react';
import { Link } from 'gatsby';
import github from '../img/github-icon.svg';
import logo from '../img/logo.svg';
import ensoLogoWhite from '../img/uploads/2017/12/enso-white.png';
import PreviewCompatibleImage from './PreviewCompatibleImage';
import NavbarItem from './NavbarItem';

const navItems = [
  {
    label: 'Blog',
    link: '/'
  },
  {
    label: 'About',
    link: '/about'
  },
  {
    label: 'Services',
    link: '/services'
  },
  {
    label: 'Articles',
    link: '#',
    items: [
      {
        label: 'Browse All Tags',
        link: '/tags'
      },
      {
        label: 'Angular Articles Series',
        link: '/tags/angular-2-article-series'
      },
      {
        label: 'NgRx',
        link: '/tags/ngrx'
      },
      {
        label: 'RxJS',
        link: '/tags/rxjs'
      },
      {
        label: 'Testing',
        link: '/tags/testing'
      },
      {
        label: 'Typescript',
        link: '/tags/typescript'
      }
    ]
  },
  {
    label: 'Contact',
    link: '/contact'
  }
];
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
    // console.log('navbar items', this.props);
    const {
      items: {
        props,
        props: { image }
      }
    } = this.props;
    const isBlogPostWithFeaturedImage = image;
    const featuredImage =
      isBlogPostWithFeaturedImage && image.childImageSharp.resolutions
        ? {
            // image
            backgroundImage: `url(${image.childImageSharp.resolutions.src})`
          }
        : {};
    // console.log('featuredImage: ', featuredImage);

    // console.log('isBlogPostWithFeaturedImage: ', isBlogPostWithFeaturedImage);
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
                {navItems.map(item => (
                  <NavbarItem {...item} />
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {!isBlogPostWithFeaturedImage && (
          <div id="logo">
            <a className="main-logo" href="/" />
            <section className="promo">
              <h1 className="main-tagline">Front End Consulting Services </h1>
              <h2 className="tagline">
                Javascript, Angular, UI Development, Web Technologies and Trends
              </h2>
              <a
                href="https://goo.gl/RJgihR"
                className="btn btn-default btn-consulting-package"
              >
                Ask For Angular/React Consulting Package
              </a>
            </section>
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
