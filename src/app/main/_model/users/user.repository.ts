import { Injectable } from "@angular/core";
import { UsersService } from "../../_service/user.service";
import { ShiftRepository } from "../shift/shift.repository";
import { User } from "./user.model";

@Injectable()
export class UserRepository {
    public employeeData: User[] = []
    constructor(private _userService: UsersService, private shiftRepo: ShiftRepository) {
        // _userService.getUserByBranch(shiftRepo.onBranch).subscribe(res => {
        //     this.employeeData = res.data['content']
        // })
    }

    get employees(): User[] {
        return this.employeeData
    }

    getEmployeesByUsername(username: string): User | undefined {
        return this.employeeData.find(x => x.username == username)
    }

    getUserById(id: string) {
        return this._userService.getUserById(id)
    }
}