import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/calculators/annuity-certain');
}
