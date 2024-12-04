import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Auto-refresh auth state
pb.authStore.onChange(() => {
  console.log('Auth state changed:', pb.authStore.isValid);
});

// Type for PocketBase user
export type PBUser = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  created: string;
}; 

export { PocketBase };
