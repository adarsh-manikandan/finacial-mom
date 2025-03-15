import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Your Financial Mom - Smart Financial Analysis</title>
        <meta name="description" content="Understand your financial patterns and make smarter spending choices" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
          Your Financial Mom
        </h1>
        <p className="text-lg md:text-xl mt-4 text-gray-600 max-w-2xl text-center">
          Understand your financial patterns and make smarter spending choices.
        </p>
        <button 
          onClick={() => router.push('/login')}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg font-medium shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </>
  );
} 