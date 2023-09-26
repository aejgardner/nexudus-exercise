import styles from './home.module.scss';
const { linkWrapper } = styles;
import { EuiButton } from '@elastic/eui';

export default function Home(props) {
  return (
    <div className={linkWrapper}>
      <EuiButton href="/products" iconType="arrowRight" iconSide={'right'}>
        Click here to view products!
      </EuiButton>
    </div>
  );
}
