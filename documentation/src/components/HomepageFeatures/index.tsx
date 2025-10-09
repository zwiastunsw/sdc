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
        title: 'Miej wpływ na dostępność cyfrową!',
        Svg: require('@site/static/img/joo-01.svg').default,
    description: (
      <>
            Celem Sieci jest wypracowanie spójnego sposobu wdrażania dostępności cyfrowej w podmiotach publicznych w&nbsp;Polsce.
      </>
    ),
  },
    {
        title: 'Zmierz się z nami z tym wyzwaniem!',
        Svg: require('@site/static/img/joo-04.svg').default,

    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
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
        <Svg className={styles.featureSvg} role="img" />
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
