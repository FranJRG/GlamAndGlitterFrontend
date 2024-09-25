export interface User {
    id:number;
    name:string;
    email:string;
    phone:string;
    password:string;
    role:string;
    notifications:boolean;
}

export interface LoginResponse{
    user:User;
    token:string;
}