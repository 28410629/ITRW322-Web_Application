export interface User {
   uid: string;
   email: string;
   displayName: string;
   photoURL: string;
   emailVerified: boolean;
}

export interface UserData {
  displayName: string;
  photoURL: string;
  uid: string;
}
