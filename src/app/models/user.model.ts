export interface User{
  uid:string,
  name:string,
  empresa:string,
  email:string,
  tel:string,
  password:string,
  role: 'client' | 'agent' | 'admin';
  image:string
}
