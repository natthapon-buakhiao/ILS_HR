import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { HomeComponent } from './home/home.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { NewheaderComponent } from './newheader/newheader.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { ApproveBySupervisorComponent } from './approve-by-supervisor/approve-by-supervisor.component';
import { AddDepartmentRoleComponent } from './add-department-role/add-department-role.component';
import { AddUserroleComponent } from './add-userrole/add-userrole.component';
import { TestComponent } from './test/test.component';

    const routes: Routes = [
       { path: '', redirectTo: '/HR-ADMIN', pathMatch: 'full' },
       { path: 'HR-ADMIN', component: HomeComponent },
       { path: 'newheader', component: NewheaderComponent },

       { path: 'employee-add', component: EmployeeAddComponent },
       { path: 'employee-master', component: EmployeeMasterComponent },
       { path: 'employee-edit', component: EmployeeEditComponent },
       { path: 'attendance', component: AttendanceComponent },
       { path: 'approveBySupervisor', component: ApproveBySupervisorComponent },
       { path: 'add-Department-Role', component: AddDepartmentRoleComponent },
       { path: 'add-user-role', component: AddUserroleComponent },
        { path: 'test', component: TestComponent },

    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



