export interface User {
    id:number;
    name:string;
    email:string;
    phone:string;
    password:string;
    role:string;
    emailNotifications:boolean;
    smsNotifications:boolean;
    calendarNotifications:boolean;
}

export interface LoginResponse{
    user:User;
    token:string;
}