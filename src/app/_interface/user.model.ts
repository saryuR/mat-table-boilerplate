export interface USERDATA {
  id: number;
  name: string;
  age: string;
  work: string;
  email: string;
  address: string;
  city: string;
  enable: boolean;
}
export interface USERVIEWPROFILE {
  Id: number;
  UserId: string;
  AccountId: number;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  FirstName: string;
  LastName: string;
  DisplayName: string;
  ReportsTo: number;
  Prefix: string;
  PhoneNumber: string;
  Status: string;
  LockoutEnabled: boolean;
  PasswordExpired: boolean;
  JobTitleId: number;
  Departments: [];
  Roles: [];
  Accounts: [];
  LoggedInRoleId: number;
  CreatedBy: string;
  CreateTimestamp: string;
  ModifiedBy: string;
  ModifiedTimestamp: string;
  DataStateFlag: string
}


export interface ROLES {
  Id: number;
  Name: string;
}

export interface COMMON {
  Id: number;
  Name: string;
}

export interface PREFIX {
  Id: number;
  Prefix: string;
}



