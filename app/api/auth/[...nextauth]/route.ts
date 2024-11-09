// import { authOptions } from '@/app/_lib/auth';
// import nextAuth from 'next-auth';

// const handler = nextAuth(authOptions);

// export { handler as GET, handler as POST };

import { handlers } from '@/auth'; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;
