import { Component, OnInit } from '@angular/core';
import { ViewChild,Inject  } from '@angular/core';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import { HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ServiceService } from '../service/service.service';
import {  MatPaginator, MatTableDataSource } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS} from './date.adapter';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";

export interface employeeMasters{
    Fname : String;
    Lname : String;
    Dename : String;
    Poname : String;
}
export interface leave{
    leavesID : String;
}
export interface leave2{
    leavesID : String;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]

})
export class AttendanceComponent implements OnInit {

  public API = '//localhost:8080';
  table : any = {
    leaID : '',
    empCode : '',
    fName : '',
    lName : '',
    empDep : '',
    empPos : '',
    StartDate : '',
    sumDate : '',
  };

  leavetatelAll : any = {
    leavesNumbersID : '',
    totalAnnualLeave : '',
    sumAnnualLeave: '',
    totalSickLeave : '',
    sumSickLeave: '',
    totalOthersLeave : '',
    sumOthersLeave: '',
    sumAllLeave : '',
  };
  employeeMasterCustomerCode : String;
  empID : Array<any>;
  dataLeave : Array<any>;
  nowDateToString : Array<string>;
  startDateToString : Array<string>;
  splitStartDate: Array<string>;

  startDate : any;
  endDate : any;
  reason : any;
  labelLeaveHalfDay: any;
    startDate2 : any;
    endDate2 : any;
    reason2 : any;
    leaveTypeSelect2 : string;

  leavecheck : Array<any>;
  totalAnnualLeave;
  leaveType : Array<any>;
  leaveTypeSelect : string;
  leaves : Array<any>;
  leaves2 : Array<any>;
  interval2:any;
  diffTime1:number;
  diffDay:number;
  empId = localStorage.getItem('empId');

  displayedColumns: string[] = ['number','leaveType','halfDay','startDate', 'reason', 'approvedBySupervisor', 'approvedByManager','leaveStatus','del'];
  dataSource = new MatTableDataSource<leave>(this.leaves);

  displayedColumns2: string[] = ['number','leaveType','startDate','endDate2', 'reason', 'approvedBySupervisor', 'approvedByManager','leaveStatus','del'];
  dataSource2 = new MatTableDataSource<leave2>(this.leaves2);

  constructor(private service:ServiceService,
            private router:Router,
            private route:ActivatedRoute,
            public dialog: MatDialog,
             private http: HttpClient,
         ) { }

  ngOnDestroy() {
    if (this.interval2) { // show table Leave
      clearInterval(this.interval2);
    }

  }
  ngOnInit() {

      this.service.getLeaveType().subscribe(data => {
        this.leaveType = data;
        //console.log('leaveType -> ',this.leaveType);
      });
      //console.log(new Date());
            this.service.getSearchEmployeeForAttendance2(this.empId).subscribe(data1 => {
              //console.log('data1->',data1);
              this.table.leaID = this.empId;
              this.table.empCode = data1.employeeMasterCustomerCode;
              this.table.fName = data1.employeeMasterFirstName;
              this.table.lName = data1.employeeMasterLastName;
              this.table.empDep = data1.employeeDepartment;
              this.table.empPos = data1.employeePosition;


              this.nowDateToString = new Date().toString().split(" ");
              //console.log(parseInt(this.nowDateToString[3]));
              this.table.StartDate = data1.employeeMasterStartDate;
              this.startDateToString = this.table.StartDate.toString().split("-");
              //console.log(parseInt(this.startDateToString[0]));
              this.table.sumDate = parseInt(this.nowDateToString[3]) - parseInt(this.startDateToString[0]);
              //console.log(this.table.sumDate);

              this.interval2 = setInterval(() => {  //show table Leave
                  this.service.getShowLeaves(this.table.leaID).subscribe(data => {
                  if(data!=null){
                    this.leaves = data;
                    this.dataSource.data = this.leaves;
                    //console.log('leaves -> ',this.leaves);
                  }
                  else console.log( this.table.fName,'--> ไม่มีการลาพักร้อน');
              });
                this.service.getShowLeaves2(this.table.leaID).subscribe(data => {
                    this.leaves2 = data;
                    this.dataSource2.data = this.leaves2;
                    //console.log('leaves2 -> ',this.leaves2);
                });
             }, 1000);

                 if(this.table.sumDate >= 10){
                      this.table.sumDate = 15;
                }
                else if(this.table.sumDate >= 5){
                      this.table.sumDate = 12;
                }
                else if(this.table.sumDate >= 3){
                      this.table.sumDate = 10;
                }
                else if(this.table.sumDate >= 1){
                      this.table.sumDate = 7;
                }
                else {
                      this.table.sumDate = 0;
                }
                 this.SaveLeaveNumber();
        });
  }
    SubmitData(){
        if(this.leaveTypeSelect == null)  alert("กรุณาเลือกประเภทการลา");
        else if(this.startDate == null) alert("กรุณาเลือกวันลา");
        else if(this.reason == null) alert("กรุณากรอกเหตุผล");
        else{
             this.http.post(this.API  +/leave/+ this.table.leaID +'/'+ this.leaveTypeSelect +'/'+ this.labelLeaveHalfDay +'/'+ this.startDate  +'/'+ this.reason,{})
                        .subscribe(
                                       dataLeave => {
                                           console.log('PUT Request is successful', dataLeave);
                                           alert("ลาสําเร็จ รอการอนุมัติ");
                                            //window.location.reload(true);
                                            localStorage.setItem('links', 'attendance');
                                       },
                                       error => {
                                           console.log('Error', error);
                                       }
                                      );
        }
        if(this.startDate != null&&this.endDate != null){
            this.CalculateLeaveDate();
        }
    }
    SubmitData2(){
        if(this.leaveTypeSelect2 == null)  alert("กรุณาเลือกประเภทการลา");
        else if(this.startDate2 == null) alert("กรุณาเลือกวันลา");
        else if(this.endDate2 == null) alert("กรุณาเลือกวันสิ้นสุดการลา");
        else if(this.reason2 == null) alert("กรุณากรอกเหตุผล");
        else{
             this.http.post(this.API  +/leave2/+ this.table.leaID +'/'+ this.leaveTypeSelect2 +'/'+ this.startDate2 +'/'+  this.endDate2 +'/'+ this.reason2 ,{})
                        .subscribe(
                                       dataLeave => {
                                           console.log('PUT Request is successful', dataLeave);
                                           alert("ลาสําเร็จ รอการอนุมัติ");
                                            //window.location.reload(true);
                                            localStorage.setItem('links', 'attendance');
                                       },
                                       error => {
                                           console.log('Error', error);
                                       }
                                      );
        }
        if(this.startDate != null&&this.endDate != null){
            this.CalculateLeaveDate();
        }
    }

    SaveLeaveNumber(){ //function
                this.service.getShowLeavesNumber(this.empId).subscribe(data => {
                        if(data==null){
                            this.http.post(this.API  +/saveleaveNumber/+ this.empId +'/'+ this.table.sumDate ,{})
                               .subscribe(dataleaveNumber => {console.log('PUT Request is successful');},error => {console.log('Error', error);});
                        }
                        else if(data!=null){
                            this.leavecheck = data;
                            this.leavetatelAll.leavesNumbersID = data.leavesNumbersID;
                            this.leavetatelAll.totalAnnualLeave = data.totalAnnualLeave;
                            this.leavetatelAll.sumAnnualLeave = data.sumAnnualLeave;
                            this.leavetatelAll.totalSickLeave = data.totalSickLeave;
                            this.leavetatelAll.sumSickLeave = data.sumSickLeave;
                            this.leavetatelAll.totalOthersLeave = data.totalOthersLeave;
                            this.leavetatelAll.sumOthersLeave = data.sumOthersLeave;
                            this.leavetatelAll.sumAllLeave = data.sumAllLeave;
                            //console.log('SaveLeaveNumber -> ',this.leavetatelAll.totalAnnualLeave);
                        }
                         if(this.leavetatelAll.totalAnnualLeave != this.table.sumDate || this.leavetatelAll.totalSickLeave != 30){


                        }

                      });
    }


    CancelDataAttendance(row : any){
            const dialogRef = this.dialog.open(AttendanceCancelDialog, {
                  width: '320px',
                  height:'200px',
                  data: row,
            });
          }

    CalculateLeaveDate(){
        this.diffTime1 = (this.endDate - this.startDate);
        this.diffDay = Math.ceil((this.diffTime1 / (1000 * 60 * 60 * 24))+1);
        console.log(this.diffDay);
    }






}

//Dialog
export interface DialogData {
  leavesID : null;
  isActiveAttendance: string;
}
@Component({
    selector: 'attendanceDelete',
    templateUrl: 'attendanceDelete.html',
  })
  export class AttendanceCancelDialog {
    public API = '//localhost:8080/';
    leavesID: string;
    isActiveAttendance:string;
    selectAttendanceDate : String;

    constructor(public dialogRef: MatDialogRef<AttendanceCancelDialog> , public service:ServiceService,@Inject(MAT_DIALOG_DATA)  public date: DialogData,private http: HttpClient){
          dialogRef.disableClose = true;
        this.leavesID = this.date.leavesID;
        this.isActiveAttendance = this.date.isActiveAttendance;
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

    DeleteAttendance(){
               this.http.post(this.API + '/CancelLeave/' + this.leavesID ,{})
                                     .subscribe(
                                         data => {
                                             console.log('PUT Request is successful');
                                             //window.location.reload(true);
                                              this.dialogRef.close();
                                              localStorage.setItem('links', 'attendance');

                                         },
                                         error => {
                                             console.log('Error', error);
                                         }
                                      );

        }


  }
