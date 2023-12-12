import { GradientText } from '@/components/GradientText';
import { Project } from '@/components/Project';
import { Section } from '@/components/Section';

import bookImage from './9781484226193.png';
import echoesImage from './echoes.png';
import readmImage from './readm-ui.png';

const ProjectList = ({ className = '' }) => (
  <Section
    className={`p-0 ${className}`}
    title={
      <>
        My <GradientText>Achievements</GradientText>
      </>
    }
  >
    <div className="grid gap-6">
      <Project
        name="ReadM"
        description="ReadM empowers teachers by providing an automated smart assessment tool for monitoring students' reading fluency (K-4th and ESL/ELL's students), while providing live reports with up to date insights."
        link="//readm.app"
        img={{
          src: readmImage.src,
          alt: 'Mobile & Web App Development',
        }}
        tags={['React', 'ChakraUI', 'TypeScript', 'Firebase', 'Cypress']}
      />
      <Project
        name="Echoes Player"
        description="A YouTube™ Alternative Web App Media Player (Made With Angular, Open Source, PWA)"
        link="//echoesplayer.netlify.app"
        img={{ src: echoesImage.src, alt: 'echoes ui' }}
        tags={['Angular', 'SCSS', 'Typescript']}
      />
      <Project
        name="Author of Reactive Programming with Angular & NgRx"
        description="Learn to harness the power of reactive programming with RxJS and ngrx"
        link="//link.springer.com/book/10.1007/978-1-4842-2620-9"
        img={{ src: bookImage.src, alt: 'book cover angular and ngrx' }}
        tags={['Book', 'Angular', 'Architecture', 'Typescript']}
      />
      <Project
        name="ngx-infinite-scroll"
        description={
          (
            <>
              My most popular npm module -{' '}
              <img
                src="//img.shields.io/npm/dm/ngx-infinite-scroll.svg"
                alt="npm downloads a month"
              />
              <img
                src="//img.shields.io/npm/dt/ngx-infinite-scroll.svg"
                alt="total npm downloads until today"
              />
              (UsedBy Google Microsoft Amazon Disney and others)
            </>
          ) as any
        }
        link="//npmjs.com/package/ngx-infinite-scroll"
        tags={['Npm', 'Typescript', 'Open Source']}
      />
    </div>
  </Section>
);

export { ProjectList };
