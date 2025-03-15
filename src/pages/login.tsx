import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Head from 'next/head';
import { useRouter } from 'next/router';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement authentication
      console.log(data);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} - Your Financial Mom</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">
              {isLogin ? 'Login to Your Account' : 'Create an Account'}
            </h2>

            <div className="space-y-4">
              <div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 
                         transition-colors disabled:bg-blue-400"
              >
                {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
              </button>
            </div>

            <div className="mt-6">
              <p className="text-center text-gray-600">Or continue with:</p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md 
                           hover:bg-red-600 transition-colors"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="flex-1 bg-black text-white px-4 py-2 rounded-md 
                           hover:bg-gray-800 transition-colors"
                >
                  Apple
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 