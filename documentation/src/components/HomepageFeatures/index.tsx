import Heading from '@theme/Heading';
import clsx from 'clsx';
import type {ReactNode} from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
        title: 'Zmierz się z nami z tym wyzwaniem!',
        Svg: require('@site/static/img/joo-01.svg').default,
    description: (
      <>
            Sieć pracuje nad systemem wdrażania dostępności cyfrowej w podmiotach publicznych w&nbsp;Polsce.
      </>
    ),
  },
    {
        title: 'Miej wpływ na dostępność cyfrową!',
        Svg: require('@site/static/img/joo-04.svg').default,

    description: (
      <>
            Siłą Sieci dostępności cyfrowej jest doświadczenie i aktywność uczestniczek i uczestników.
      </>
    ),
  },
  {
      title: 'Dołącz do Sieci dostępności cyfrowej!',
      Svg: require('@site/static/img/joo-03.svg').default,
    description: (
      <>
            Jeśli chcesz mieć wpływ na tworzenie rozwiązań na rzecz dostępności cyfrowej, dołącz do nas!
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" aria-hidden="true" focusable="false" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h2">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
