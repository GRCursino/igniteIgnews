import { GetStaticProps } from 'next';
import Head from "next/head";
import Image from 'next/image'
import logo from '../../public/images/avatar.svg';

import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

type HomeProps = {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome!</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month.</span>
          </p>

          <SubscribeButton priceId={product.priceId}/>
        </section>

        <Image src={logo} alt="Girls coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JNO9aFHyxaL1wvrZcJoVqbd')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100) // o valor vem em centavos, então dividindo por 100 encontra-se o inteiro
  };

  return { 
    props: {
      product
    },
    revalidate: 60 * 60 * 24  // atualiza o conteúdo a cada 24 horas 
  }
}
