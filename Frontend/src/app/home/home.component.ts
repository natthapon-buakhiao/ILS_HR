import { Component, OnInit } from '@angular/core';
import { ViewChild,Inject  } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router,ActivatedRoute} from "@angular/router";
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef,  OnDestroy} from '@angular/core';
import { ServiceService } from '../service/service.service';
import { HttpClient} from '@angular/common/http';
import { API1 } from '../app.component';

export interface DialogData {
  employee : Array<any>;
  id : String ;
  NewPassword : String ;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    employee : Array<any>;
    userRole : Array<any>;
    masterRole: Array<any>;

    RoleEmployee = [4, 5];
    RoleManager = [4, 5, 8];
    RoleSupervisor = [4, 5, 7];
    RoleHR = [1, 2, 3, 4, 5, 6];

    hide:any;
    id : String = null;
    NewPassword : String = null ;
    x:any=false;
    leaveTypeForAlldays: Array<any>;
    progressBar=false;
    table : any = {
      leaID : '',
      empCode : '',
      fName : '',
      lName : '',
      empDep : '',
      empPos : '',
      StartDate : '',
      sumDate : '',
      rolestatus : '',
    };

  constructor(private router:Router,
            private route:ActivatedRoute ,
            public dialog: MatDialog,
             private http: HttpClient,
            private service:ServiceService,
            changeDetectorRef: ChangeDetectorRef,
           ) { }

    ngOnInit() {
          this.service.getMasterRole().subscribe(data => {
          this.masterRole = data;
          //console.log('masterRole == ',this.masterRole);
      });
    }

    login(id,NewPassword){
        if(this.id == null){
            alert("Please enter username");
            this.progressBar=false;
        }
        else if(this.NewPassword == null){
            alert("Please enter password");
            this.progressBar=false;
        }
        else{
              this.service.getUserPassword(id,NewPassword).subscribe(data => {
                if(data == null){
                    alert("UserID and password not complete");
                    this.progressBar=false;
                }
                else if(data != null){
                    this.employee = data;
                    //console.table(data);
                    this.table.leaID = data.employeeMasterID;
                    this.table.empCode = data.employeeMasterCustomerCode;
                    this.table.fName = data.employeeMasterFirstName;
                    this.table.lName = data.employeeMasterLastName;
                    this.table.rolestatus = data.roleStatus;
                    localStorage.setItem('loginstatus', 'true');
                    localStorage.setItem('empId', this.table.leaID);
                    localStorage.setItem('empCode', this.table.empCode);
                    localStorage.setItem('fName', this.table.fName);
                    localStorage.setItem('lName', this.table.lName);
                    localStorage.setItem('departmentIDLogin', data.departmentid.departmentID);
                    localStorage.setItem('startDateInLogin', data.employeeMasterStartDate);
                    console.log(this.table.rolestatus);
                    this.progressBar=false;

                    this.service.getUserRoles(data.employeeMasterID).subscribe(data => {
                        //this.userRole = data;
                        //console.log('userRole -> ',this.userRole);
                        if(data.length==0){
                          if(this.table.rolestatus == "ADMIN"){
                            for(let i=1;i<=this.masterRole.length;i++){
                                this.http.post(API1 + '/insertUserRole/' + this.table.leaID +'/'+ i ,{})
                                .subscribe(data => {
                                    console.log(i," InsertUserRole is successfull");
                                    this.router.navigate(['newheader']);
                                });
                            }
                          }
                          else if(this.table.rolestatus == "EMPLOYEE"){
                            for(let i=0;i<this.RoleEmployee.length;i++){
                                this.http.post(API1 + '/insertUserRole/' + this.table.leaID +'/'+ this.RoleEmployee[i] ,{})
                                .subscribe(data => {
                                    console.log(this.RoleEmployee[i]," InsertUserRole is successfull");
                                    this.router.navigate(['newheader']);
                                });
                            }
                          }
                          else if(this.table.rolestatus == "MANAGER"){
                            for(let i=0;i<this.RoleManager.length;i++){
                                this.http.post(API1 + '/insertUserRole/' + this.table.leaID +'/'+ this.RoleManager[i] ,{})
                                .subscribe(data => {
                                    console.log(this.RoleManager[i]," InsertUserRole is successfull");
                                    this.router.navigate(['newheader']);
                                });
                            }
                          }
                          else if(this.table.rolestatus == "SUPERVISOR"){
                            for(let i=0;i<this.RoleSupervisor.length;i++){
                                this.http.post(API1 + '/insertUserRole/' + this.table.leaID +'/'+ this.RoleSupervisor[i] ,{})
                                .subscribe(data => {
                                    console.log(this.RoleSupervisor[i]," InsertUserRole is successfull");
                                    this.router.navigate(['newheader']);
                                });
                            }
                          }
                          else if(this.table.rolestatus == "HR"){
                            for(let i=0;i<this.RoleHR.length;i++){
                                this.http.post(API1 + '/insertUserRole/' + this.table.leaID +'/'+ this.RoleHR[i] ,{})
                                .subscribe(data => {
                                    console.log(this.RoleHR[i]," InsertUserRole is successfull");
                                    this.router.navigate(['newheader']);
                                });
                            }
                          }
                        }
                        else{
                            this.router.navigate(['newheader']);
                        }
                    });
                    localStorage.setItem('logouts', 'false');
                }
              });
              this.progressBar=true;
              this.id = null;
              this.NewPassword = null;
        }

    }



}








