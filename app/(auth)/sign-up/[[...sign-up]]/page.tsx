import { Metadata } from 'next';
import SignUp from './_component/signup';

export const metadata: Metadata = {
  title: 'Create your account | BuildersCabal',
  description: 'Create a free account'
};

const Page = () => {
  return (
    <SignUp />
  )
};

export default Page;