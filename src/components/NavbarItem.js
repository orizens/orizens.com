import React from 'react';

export default function NavbarItem({ label, link, items }) {
  const hasItems = items && items.length;
  const fontSizeClass = 'is-size-6';
  const itemProps = hasItems
    ? {
        href: '#',
        'data-toggle': 'dropdown',
        className: `dropdown-toggle ${fontSizeClass}`,
        title: label
      }
    : {
        href: link,
        title: label
      };
  return (
    <li
      className={`menu-item ${
        hasItems ? 'menu-item-has-children dropdown' : ''
      }`}
    >
      <a className={fontSizeClass} {...itemProps}>
        {label}
      </a>
      {hasItems && (
        <ul role="menu" className=" dropdown-menu">
          {items.map(itemProps => (
            <NavbarItem {...itemProps} />
          ))}
        </ul>
      )}
    </li>
  );
}
