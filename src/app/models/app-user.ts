// import { UserInfo } from 'firebase/auth';

// interface User extends UserInfo {
//   isAdmin: boolean;
// }
interface User {
  isAdmin: boolean;
}
export type AppUser = User | null;
