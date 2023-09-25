import fetch from 'node-fetch';
import styles from './home.module.scss';
const { test } = styles;

export default function Home(props) {
  console.log('props.products');
  console.log(props.products);

  const truncateDescription = (desc) => {
    const descSplit = desc.split(' ');

    if (descSplit.length > 10) {
      const descTruncated = descSplit.slice(0, 10);
      return `${descTruncated.join(' ')}...`;
    }

    return desc;
  };

  return (
    <>
      <main className={test}>hello world</main>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch(
    'https://spaces.nexudus.com/api/billing/products?page=1&size=25',
    {
      headers: {
        Authorization:
          'Bearer eSww7nb-4j7QC-PdmTZ24_a-c_G36IRYjCWyOYZdcOYCPlFLvUpTIjmRw6vdJBK3BDKC7Dr0Ogz13-NB5y7v1oxNxMAYBWi9qQPm_oIS71fEESQ4GlP011Jl7PrXpED8_UHjZZzI7y-OmwxZxLtQGHPoT33SlWZ7P2n4iQe9GLNMIg5E79JFeZ6RkUJQJT5nOtcataRvXFYYb7WzVxBYG2FeBnGSr0sEZ9peXlDnk9a-74t3hVBqZeFNXogHDXmTg9ZVVhwZOryKy2yqvpGme3nCm8bCZfmG69nvMePA92UXgNEWtBlY__eR_ZkBs9UQqh8DvcfYBTyUb0wMTzPKJPNOn-BGIDNQcRfeNH6GsJhZ_-R4MXxMCZHBo_i3cUOpKAoXHeR_UROAa1_ViLpnNuecJABcoPQ8F-BVFk5_5H7I-4vG4L8WZrZoOV7Kh9Yk6WcTtA',
      },
    }
  );

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
