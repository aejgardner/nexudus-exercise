import { useState, useEffect } from 'react';
import fetch from 'node-fetch';
import countryToCurrency from 'country-to-currency';
import { useWindowSize } from '@uidotdev/usehooks';
import '@elastic/eui/dist/eui_theme_light.css';
import { EuiBasicTable, EuiHealth } from '@elastic/eui';
import styles from './products.module.scss';
const { productPage, title, productNameColumn } = styles;

export default function Products(props) {
  const { Records } = props.products;
  const [isClient, setIsClient] = useState(false);
  const [userLanguage, setUserLanguage] = useState(null);
  const windowSize = useWindowSize();
  const currencySymbols = {
    USD: '$',
    GBP: '£',
    EUR: '€',
  };
  // I would normally use something like ipapi or https://www.geoapify.com/ip-geolocation-api here
  const userCountry = userLanguage?.slice(-2)?.toUpperCase();
  // I noticed that there is actually a CurrencyCode property on each record, but the task states to base the currency on the browser's locale
  const userCurrency = countryToCurrency[userCountry];

  useEffect(() => {
    // Prevents Next.js hydration error: https://nextjs.org/docs/messages/react-hydration-error
    setIsClient(true);
    // window object is only accessible once client has loaded
    setUserLanguage(window.navigator.userLanguage || window.navigator.language);
  }, []);

  const truncate = (str, wordLimit) => {
    const strSplit = str.split(' ');

    if (strSplit.length > wordLimit) {
      const strTruncated = strSplit.slice(0, wordLimit);
      return `${strTruncated.join(' ')}...`;
    }

    return str;
  };

  const columnsDesktop = [
    {
      field: 'Name',
      name: 'Product Name',
      className: productNameColumn,
      footer: ({ items }) => <span>{items.length} records</span>,
    },
    {
      field: 'Description',
      name: 'Product Description',
      render: (desc) => truncate(desc, 10),
    },
    {
      field: 'Visible',
      name: 'Visible',
      dataType: 'boolean',
      render: (visible) => {
        const color = visible ? 'success' : 'danger';
        const label = visible ? 'Yes' : 'No';
        return <EuiHealth color={color}>{label}</EuiHealth>;
      },
    },
    {
      field: 'Price',
      name: 'Price',
      render: (price) => `${currencySymbols[userCurrency]}${price}`,
    },
  ];

  // Couldn't quite find a way to configure breakpoints in the ElasticUI table component
  // So creating two sets of columns, one for desktop one for mobile
  const columnsMobile = columnsDesktop.filter(
    (column) => column.field !== 'Description' && column.field !== 'Visible'
  );

  return isClient && Records?.length ? (
    <div className={productPage}>
      <h1 className={title}>Products</h1>
      <EuiBasicTable
        columns={windowSize.width >= 1024 ? columnsDesktop : columnsMobile}
        items={Records}
      />
    </div>
  ) : null;
}

export async function getStaticProps() {
// Usually this would be created when logging in and saved as a cookie
// Creating it manually and storing it in .env for this task for safety
const bearerToken = process.env.BEARER_TOKEN;

  const res = await fetch('https://spaces.nexudus.com/api/billing/products', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  const data = await res.json();

  return {
    props: {
      products: data,
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 10, // In seconds
    },
  };
}
