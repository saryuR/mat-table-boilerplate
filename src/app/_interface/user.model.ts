export interface userData {
    Id: number;
    UserId: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;
    FirstName: string;
    LastName: string;
    DisplayName: string;
    access_token?: string;
    Accounts: [
      {
        AccountId: number;
        AccountGroupId: number;
        AccountStatus: string;
        Contract: string;
        ReportsTo: [
          {
            Id: number;
            Name: string
          }
        ];
        JobTitles: [
          {
            Id: number;
            Name: string
          }
        ];
        Departments: [
          {
            Id: number;
            Name: string
          }
        ];
        Roles: [
          {
            Id: number;
            Name: string
          }
        ]
      }
    ];
    Prefix: [
      {
        Id: number;
        Prefix: string
      }
    ];
    PhoneNumber: string;
    Status: string;
    LockoutEnabled: boolean;
    PasswordExpired: boolean;
    CreatedBy: string;
    CreateTimestamp: string;
    ModifiedBy: string;
    ModifiedTimestamp: string;
    DataStateFlag: string;
    UserPrefix: string;
  }
  
export interface userViewProfile {
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


export interface roles {
      Id: number;
      Name: string;
}

export interface common {
  Id: number;
  Name: string;
}

export interface Prefix {
  Id: number;
  Prefix: string;
}

export interface extras {
  prefixs: Prefix[];
  localJobTitles: common[];
  localDepartment: common[];
  ReportsTo: common[];
};

