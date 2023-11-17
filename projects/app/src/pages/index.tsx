import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { feConfigs } from '@/web/common/system/staticData';
import { serviceSideProps } from '@/web/common/utils/i18n';
import { useRouter } from 'next/router';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ability from './components/Ability';
import Choice from './components/Choice';
import Footer from './components/Footer';
import Loading from '@/components/Loading';
import Head from 'next/head';

const Home = ({ homeUrl = '/' }: { homeUrl: string }) => {
  const router = useRouter();

  if (homeUrl !== '/') {
    router.replace(homeUrl);
  }

  useEffect(() => {
    router.prefetch('/app/list');
    router.prefetch('/login');
  }, [router]);

  return (
    <>
      <Head>
        <title>{feConfigs?.systemTitle || 'Knowledge GPT'}</title>
      </Head>
      <Box id="home" bg={'myWhite.600'} h={'100vh'} overflowY={'auto'} overflowX={'hidden'}>
      </Box>
      {homeUrl !== '/' && <Loading bg={'white'} />}
    </>
  );
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      ...(await serviceSideProps(content)),
      homeUrl: process.env.HOME_URL || '/'
    }
  };
}

export default Home;
