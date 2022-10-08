export class UserLogin {
    constructor(
        public id?: string,
        public username?: string,
        public firstName?: string,
        public lastName?: string,
        public lastLogin?: string,
        public picture?: string,
        public role?: string,
        public branchId?: number,
        public branch?: string,
        public subBranch?: UserLoginSubBranch[],
        public level?: string,
        public subBranchId?: number,
    ) { }
}

export class UserLoginSubBranch {
    constructor(
        public id?: number,
        public name?: string
    ) { }
}