import { Redirect } from 'expo-router';

// Entry point. Real auth state (mocked) will decide this redirect in a later milestone.
export default function Index() {
  return <Redirect href="/login" />;
}
