import { Component, OnInit } from '@angular/core';
import { ViewChild,Inject  } from '@angular/core';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { ServiceService } from '../service/service.service';
import { ExcelService } from '../excel.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {MatBottomSheet,MatBottomSheetRef} from '@angular/material';
import {  SelectionModel } from '@angular/cdk/collections';
import {  DatePipe} from '@angular/common';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { NewheaderComponent } from '../newheader/newheader.component';
import { EmployeeDeleteComponent } from '../employee-delete/employee-delete.component';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { API1 } from '../app.component';

export interface Emp{
    empCodeIDxx : number;
    employeeMasterCustomerCode : String;
}

@Component({
  selector: 'app-approve-by-supervisor',
  templateUrl: './approve-by-supervisor.component.html',
  styleUrls: ['./approve-by-supervisor.component.css']
})

export class ApproveBySupervisorComponent implements OnInit {
  leaves  : Array<any>;
  LeavesToComplete: Array<any>;
  isChecked;
  interval:any;
  interval2:any;
  interval3:any;
  leaveID;
  dis;
  dataSearch='';
  empId = localStorage.getItem('empId');
  firstNameOnLogin = localStorage.getItem('fName');
  lastNameOnLogin  = localStorage.getItem('lName');
  departmentOnLogin = localStorage.getItem('departmentlogin');
  progressBar=false;
  dateAndTotel;
  dataToInput;
  displayedColumns: string[] = ['number','employeeCode', 'name','department','date', 'leaveType','startDate', 'endDate','total','reason', /*'approvedBySupervisor', 'approvedByManager',*/'leaveStatus','approve','notApprove'];
  dataSource = new MatTableDataSource<Emp>(this.leaves);
  @ViewChild(MatPaginator, {static : true}) paginator : MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;

public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  constructor(private service:ServiceService,
            private router:Router,
            private route:ActivatedRoute ,
            public dialog: MatDialog,
             private http: HttpClient) { }

  ngOnDestroy() {
      clearInterval(this.interval);
      clearInterval(this.interval2);
      clearInterval(this.interval3);
  }
  ngOnInit() {
      this.progressBar = true;
      this.interval3 = setInterval(() => {
        this.service.getLeavesToNotCompleteBySupervisor(this.empId).subscribe(data => {
             this.progressBar = false;
            this.leaves = data;
            this.dataSource.data = this.leaves;
            //console.log('leaves -> ',this.leaves);
            for(let i of this.leaves){
              i.startDateForAllDay = this.SplitDate(i.startDateForAllDay);
              i.endDateForAllDay = this.SplitDate(i.endDateForAllDay);
            }
        });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1000);
  }
  SplitDate(date:any){
    var DateSplitted = date.split("-");
    return DateSplitted[2] +"-"+ DateSplitted[1] +"-"+ DateSplitted[0];
  }

  SentEmail(departmentid:any,leaveType:any,empidLeave:any,startDate:any,endDate:any,diffDay:any){
        this.service.getDepartmentMasterRoleFindByDepartmentID(departmentid).subscribe(data => {

          this.dateAndTotel = "ในวันที่ "+startDate+" น. ถึงวันที่ "+endDate+" น. รวมเป็นเวลา "+diffDay;

          for(let i of data){
            if(i.usePosition=="manager"){
              this.dataToInput = {
                  managerID:i.employeeMasterid.employeeMasterID,
                  leaveType:leaveType,
                  empidLeave:empidLeave,
                  supervisorID:this.empId,
                  dateAndTotel:this.dateAndTotel,
              };
              this.http.post(API1 + '/sendEmailToManager', JSON.stringify(this.dataToInput), {headers: {"Content-Type": "application/json"}
                   }).subscribe(data2 => {
                                  console.log("Sent Email is successfull");
                               },error => {
                                   console.log('Error', error);
                               }
              );
            }
          }
        });
  }

  approve(row : any){
        this.progressBar = true;
        let startDate = row.startDateForAllDay+' '+row.startTime;
        let endDate = row.endDateForAllDay+' '+row.endTime;

        this.http.post(API1 + '/approveBySupervisor/' + row.leavesID +'/'+ this.firstNameOnLogin +'/'+ this.lastNameOnLogin  ,{}).subscribe(data => {
            console.log('Approve is successful');
            alert("Approve successful");
             this.progressBar = false;
            this.SentEmail(row.departmentid.departmentID,row.leaveTypeForAllDay.leaveTypeForAlldayName,row.employeeMasterid.employeeMasterID,startDate,endDate,row.labelLeaveHalfDay);
          },
          error => {
            console.log('Error', error);
          }
        );
  }
  notApprove(row : any){
      const dialogRef = this.dialog.open(ReasonNotApproveDialog, {
                  width: '360px',
                  height:'270px',
                  data: row,
            });
  }

  onChange(){
           this.dataSearch='';
           this.progressBar = true;
            if(this.isChecked == true){
              clearInterval(this.interval2);
              clearInterval(this.interval3);
              this.dis=true;
              this.interval = setInterval(() => {  //show table Leave
                this.service.getLeavesSelectDepartmentBySupervisor(this.empId).subscribe(dataLeavesToComplete => {
                      this.leaves = dataLeavesToComplete;
                      this.dataSource.data = this.leaves;
                      this.progressBar = false;
                      for(let i of this.leaves){
                        i.startDateForAllDay = this.SplitDate(i.startDateForAllDay);
                        i.endDateForAllDay = this.SplitDate(i.endDateForAllDay);
                      }
                      //console.log('leaves -> ',this.leaves);
                  });

              }, 1000);
            }
            else{
              this.dis=false;
              clearInterval(this.interval);
              clearInterval(this.interval3);
              this.interval2 = setInterval(() => {
                  this.service.getLeavesToNotCompleteBySupervisor(this.empId).subscribe(data => {
                    this.leaves = data;
                    this.dataSource.data = this.leaves;
                    this.progressBar = false;
                    for(let i of this.leaves){
                      i.startDateForAllDay = this.SplitDate(i.startDateForAllDay);
                      i.endDateForAllDay = this.SplitDate(i.endDateForAllDay);
                    }
                    //console.log('leaves -> ',this.leaves);
                  });
              }, 1000);
            }

  }
  SearchInputNull(){
    this.ngOnDestroy();
    //console.log(this.dataSearch);
    if(this.dataSearch==''){
      this.onChange();
      this.progressBar = false;
    }
  }
  SearchEmployeeByCodeAndNameInApproveBySupNOTApprove(){
      this.ngOnDestroy();
      this.service.getSearchEmployeeByCodeAndNameInApproveBySup(this.dataSearch,this.empId).subscribe(data => {
              this.leaves = data;
              this.dataSource.data = this.leaves;
              for(let i of this.leaves){
                i.startDateForAllDay = this.SplitDate(i.startDateForAllDay);
                i.endDateForAllDay = this.SplitDate(i.endDateForAllDay);
              }
      });
  }
  SearchEmployeeByCodeAndNameInApproveBySupApprove(){
      this.ngOnDestroy();
      this.service.getgetSearchEmployeeByCodeAndNameInApproveBySupervisor(this.dataSearch,this.empId).subscribe(data => {
              this.leaves = data;
              this.dataSource.data = this.leaves;
              for(let i of this.leaves){
                i.startDateForAllDay = this.SplitDate(i.startDateForAllDay);
                i.endDateForAllDay = this.SplitDate(i.endDateForAllDay);
              }
      });
  }


}



//Dialog
export interface DialogData {
  leavesID : null;
  isActiveAttendance: string;
}
@Component({
    selector: 'reasonNotApprove',
    templateUrl: 'reasonNotApprove.html',
  })
  export class ReasonNotApproveDialog {
    leavesID: string;
    isActiveAttendance:string;
    reasonNotapprove=null;
    constructor(public dialogRef: MatDialogRef<ReasonNotApproveDialog> , public service:ServiceService,@Inject(MAT_DIALOG_DATA)  public date: DialogData,private http: HttpClient){
         this.leavesID = this.date.leavesID;
        this.isActiveAttendance = this.date.isActiveAttendance;
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

  notApprove(){
        this.http.post(API1 + '/notApproveBySupervisor/' + this.leavesID +'/'+ this.reasonNotapprove,{}).subscribe(data => {
            console.log('Not approve is successful');
            alert("Not approve successful");
          },
          error => {
            console.log('Error', error);
          }
        );
        this.dialogRef.close();
      }


  }
