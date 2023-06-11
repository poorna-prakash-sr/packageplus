import HomePage from '@/views/packageplus/Home';
import Head from 'next/head';
import React from 'react';

const Home = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="npm, NPM packages, Package management" />
        <meta name="author" content="Poorna Prakash SR" />
        <meta
          name="description"
          content="Simplify npm package analysis and supercharge your web development process with PackagePlus, the ultimate tool for efficient and effective package management."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PackagePlus - Streamline | Enhance</title>
        <link rel="shortcut icon" href="logo-package.png" />
      </Head>
      <HomePage />
    </>
  );
};

export default Home;
