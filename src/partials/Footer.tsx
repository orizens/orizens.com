import { Section } from 'astro-boilerplate-components';

import { AppConfig } from '@/utils/AppConfig';

const Footer = () => (
  <Section>
    <div className="text-center">
      © {new Date().getFullYear()}, Built by{' '}
      <span className="text-primary">{AppConfig.site_name}</span>
    </div>
  </Section>
);

export { Footer };
