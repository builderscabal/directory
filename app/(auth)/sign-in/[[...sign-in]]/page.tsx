import { Metadata } from 'next';
import SignIn from './_component/signin';

export const metadata: Metadata = {
  title: 'Sign in | BuildersCabal',
  description: 'Sign in to your account'
};

const Page = () => {
  return (
    <SignIn />
  )
};

export default Page;