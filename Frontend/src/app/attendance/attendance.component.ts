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
import { AppComponent } from '../app.component';
import { Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AttendanceShowLeavenumberComponent } from '../attendance-show-leavenumber/attendance-show-leavenumber.component';

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
  table : any = {
    leaID : '',
    empCode : '',
    fName : '',
    lName : '',
    empDep : '',
    empPos : '',
    StartDate : '',
    sumDate : '',
    status:'',
  };

  leavetatelAll : any = {
    leavesNumbersID: '',
    getDay : '',
    usedDay : '',
    BalanceDay: '',
    CompoundDay : '',
  };

  employeeMasterCustomerCode : String;
  empID : Array<any>;
  dataLeave : Array<any>;
  startDate : any;
  endDate : any;
  startTimeSelect='null';
  endTimeSelect='null';
  reason : any;
  labelLeaveHalfDay: any;
    startDate2 : any;
    endDate2 : any;
    reason2 : any;
    leaveTypeSelect2 : string;
  day="วัน";
  leaveNumber : Array<any>;
  totalAnnualLeave;
  leaveType : Array<any>;
  leaveTypeForAlldays : Array<any>;
  leaveTypeSelect : string;
  leaves2 : Array<any>;
  interval:any;
  diffTime1:number;
  diffDay:number;
  dis:true;
  hourdis;
  nowdate:Date;
  todayDate:Date;
  diffTime2:number;
  sumDay:number;
  sumDay_365:number;
  x:any=false;
  diff;
  empId = localStorage.getItem('empId');
  startDateInLogin = localStorage.getItem('startDateInLogin');
  departmentIDLogin = localStorage.getItem('departmentIDLogin');


  displayedColumns2: string[] = ['number','date','leaveType','startDate','endDate2','total', 'reason', /*'approvedBySupervisor', 'approvedByManager',*/'reasonNotApprove','isPayment','leaveStatus','del'];
  dataSource2 = new MatTableDataSource<leave2>(this.leaves2);

  constructor(private service:ServiceService,
            private router:Router,
            private route:ActivatedRoute,
            public dialog: MatDialog,
             private http: HttpClient,
             public api : AppComponent) { }
    public API1 = this.api.API;

  ngOnDestroy() {
    if (this.interval) { // show table Leave
      clearInterval(this.interval);
    }
  }

  ngOnInit() {
      this.service.getleaveTypeForAlldays().subscribe(data => {
        this.leaveTypeForAlldays = data;
        //console.table(this.leaveTypeForAlldays);
      });

            this.service.getSearchEmployeeForAttendance2(this.empId).subscribe(data1 => {
              //console.log('data1->',data1);
              this.table.leaID = this.empId;
              this.table.empCode = data1.employeeMasterCustomerCode;
              this.table.fName = data1.employeeMasterFirstName;
              this.table.lName = data1.employeeMasterLastName;
              this.table.empDep = data1.employeeDepartment;
              this.table.empPos = data1.employeePosition;

              this.SaveLeaveNumber();
              this.service.getShowLeaves2(this.table.leaID).subscribe(dataleave => {
                    this.leaves2 = dataleave;
                    this.dataSource2.data = this.leaves2;
                    //console.log('leaves2 -> ',this.leaves2);
              });
        });
  }
  RefreshTable(){
             setTimeout(() => {  //show table Leave
                this.service.getShowLeaves2(this.table.leaID).subscribe(data => {
                    this.leaves2 = data;
                    this.dataSource2.data = this.leaves2;
                    //console.log('leaves2 -> ',this.leaves2);
                });
                this.service.getSearchEmployeeForAttendance2(this.empId).subscribe(data1 => {
                  //console.log('data1->',data1);
                  this.table.leaID = this.empId;
                  this.table.empCode = data1.employeeMasterCustomerCode;
                  this.table.fName = data1.employeeMasterFirstName;
                  this.table.lName = data1.employeeMasterLastName;
                  this.table.empDep = data1.employeeDepartment;
                  this.table.empPos = data1.employeePosition;
                  this.SaveLeaveNumber();
                  this.service.getShowLeaves2(this.table.leaID).subscribe(dataleave => {
                        this.leaves2 = dataleave;
                        this.dataSource2.data = this.leaves2;
                        //console.log('leaves2 -> ',this.leaves2);
                  });
                });
             }, 1000);
  }
  totalTime:any;
  totalHour:number;
  totalMinute:number;
  totalMinute2:number;
  startHour;
  startMinute;
  EndHour;
  EndMinute;
  splitStartTime:Array<any>;
  splitEndTime:Array<any>;
  total:any;
  CalculateLeaveTime(){
      this.splitStartTime = this.startTimeSelect.split(":")
      this.startHour = parseInt(this.splitStartTime[0]);
      this.startMinute = parseInt(this.splitStartTime[1]);
      this.splitEndTime = this.endTimeSelect.split(":")
      this.EndHour = parseInt(this.splitEndTime[0]);
      this.EndMinute = parseInt(this.splitEndTime[1]);
      this.totalHour = this.EndHour - this.startHour;
      this.totalMinute = this.EndMinute - this.startMinute
      if(this.totalMinute<0) this.totalMinute2=this.totalMinute*(-1);
      this.total = this.totalHour+'.'+this.totalMinute2;
      //console.log(this.total,'ชั่วโมง');
    setTimeout(() => {
      this.http.post(this.API1  +/Time/+ this.startTimeSelect +'/'+ this.endTimeSelect ,{})
                        .subscribe(
                                       data => {
                                           console.log(data);
                                            this.totalTime = data;
                                       },
                                       error => {}
      );
    }, 100);
  }
  statusLabelLeaveHalfDay;
    SubmitData(){ // Half Day
        this.CalculateLeaveTime();
        this.Checktheleave(this.table.leaID,this.leaveTypeSelect);
        if(this.labelLeaveHalfDay=='ชั่วโมง') this.statusLabelLeaveHalfDay=1;
        else this.statusLabelLeaveHalfDay=0;

        if(this.leaveTypeSelect == null)  alert("กรุณาเลือกประเภทการลา");
        else if(this.labelLeaveHalfDay == null) alert("กรุณาเลือกเช้า-เย็น");
        else if(this.labelLeaveHalfDay=='ชั่วโมง' && this.startTimeSelect == 'null') alert("กรุณาเลือกเวลาเริ่มต้น");
        else if(this.labelLeaveHalfDay=='ชั่วโมง' && this.endTimeSelect == 'null') alert("กรุณาเลือกเวลาสิ้นสุด");
        else if(this.totalHour<0 || (this.totalHour==0&&this.totalMinute<=0)) alert("กรุณาเลือกเวลาให้ถูกต้อง");
        else if(this.startDate == null) alert("กรุณาเลือกวันลา");
        else if(this.reason == null) alert("กรุณากรอกเหตุผล");
        else{
             this.http.post(this.API1  +/SaveLeaveHalfDay/+ this.table.leaID +'/'+ this.leaveTypeSelect
                              +'/'+ this.labelLeaveHalfDay +'/'+ this.startDate  +'/'+ this.reason +'/'+
                              this.startTimeSelect +'/'+ this.endTimeSelect +'/'+ this.totalTime +'/'+
                              this.statusLabelLeaveHalfDay +'/'+ this.departmentIDLogin +'/'+ this.leavetatelAll.leavesNumbersID,{})
                        .subscribe(
                                       dataLeave => {
                                           console.log('PUT Request is successful', dataLeave);
                                           alert("ลาสําเร็จ รอการอนุมัติ");
                                            //window.location.reload(true);
                                            localStorage.setItem('links', 'attendance');
                                            this.x=false;
                                       },
                                       error => {
                                          alert("ไม่สำเร็จ กรุณาลองใหม่");
                                          window.location.reload(true);
                                           console.log('Error', error);
                                       }
                                      );
            this.ClearTextInput();
            this. RefreshTable();
            this.x=true;
        }
    }

    SubmitData2(){ //Full day
        this.CalculateLeaveDate(this.startDate2,this.endDate2);
        this.Checktheleave(this.table.leaID,this.leaveTypeSelect2);
        if(this.diffDay<1){
          this.startDate2  = null;
          this.endDate2  = null;
        }
        else if(this.leaveTypeSelect2 == null)  alert("กรุณาเลือกประเภทการลา");
        else if(this.startDate2 == null) alert("กรุณาเลือกวันลา");
        else if(this.endDate2 == null) alert("กรุณาเลือกวันสิ้นสุดการลา");
        else if(this.reason2 == null) alert("กรุณากรอกเหตุผล");
        else if(this.diffDay>this.leavetatelAll.BalanceDay && this.leavetatelAll.BalanceDay != 0){
            this.diff = this.diffDay-this.leavetatelAll.BalanceDay;
            alert("*คุณมีวัน"+this.leaveTypeSelect2+" = "+this.leavetatelAll.BalanceDay+"วัน\n"+"หากคุณต้องการ"+this.leaveTypeSelect2+" "+this.diffDay+"วัน คุณต้องคีย์ลา "+this.leavetatelAll.BalanceDay+"วัน หนึ่งครั้งและ "+this.diff+"วัน อีกหนึ่งครั้ง!");
        }
        else{
             this.http.post(this.API1  +/SaveLeaveFullDay/+ this.table.leaID +'/'+ this.leaveTypeSelect2 +'/'+ this.startDate2 +'/'+  this.endDate2 +'/'+ this.reason2 +'/'+ this.diffDay +'/'+ this.leavetatelAll.leavesNumbersID +'/'+ this.departmentIDLogin ,{})
                        .subscribe(
                                       dataLeave => {
                                           console.log('PUT Request is successful', dataLeave);
                                           alert(this.leaveTypeSelect2+"ลา "+this.diffDay+" วัน สำเร็จ รอการอนุมัติ");
                                            //window.location.reload(true);
                                            localStorage.setItem('links', 'attendance');
                                            this.x=false;
                                       },
                                       error => {
                                          console.log('Error', error);
                                          alert("ไม่สำเร็จ กรุณาลองใหม่");
                                          window.location.reload(true);
                                       }
                                      );
             this.ClearTextInput();
              this.RefreshTable();
              this.x=true;
        }

    }

    SaveLeaveNumber(){ //function
          this.todayDate = new Date();
          var CDate = new Date(this.startDateInLogin);
          this.CalculateStartWorkDate(CDate,this.todayDate);

           this.service.getShowLeavesNumber(this.empId).subscribe(data => {
                //console.table(data);
                if(data.length==0){
                        this.http.post(this.API1  +/saveleaveNumber/+ this.empId +'/'+ this.sumDay_365 +'/'+ this.leaveTypeForAlldays.length +'/'+ this.table.fName +'/'+ this.table.lName ,{})
                               .subscribe(dataleaveNumber => {console.log('PUT Request is successful');},error => {console.log('Error', error);});
                }
                else{
                    this.leaveNumber = data;
                    //console.log('SaveLeaveNumber -> ',this.leavecheck);
                }

          });

    }

    CancelDataAttendance(row : any){
            const dialogRef = this.dialog.open(AttendanceCancelDialog, {
                  width: '320px',
                  height:'200px',
                  data: row,
            });
            this.RefreshTable();
    }
    ShowLeaveNumberDailog(){
            const dialogRef = this.dialog.open(AttendanceShowLeavenumberComponent, {
                  width: 'auto;',
                  height:'auto;',
            });
            this.RefreshTable();
    }

    CalculateLeaveDate(date1:any,date2:any){
        this.diffTime1 = (date2 - date1);
        this.diffDay = Math.ceil((this.diffTime1 / (1000 * 60 * 60 * 24))+1);
        //console.log('Leave Day =>',this.diffDay);
    }

    CalculateStartWorkDate(date1:any,date2:any){
        this.diffTime2 = (date2 - date1);
        this.sumDay = Math.ceil((this.diffTime2 / (1000 * 60 * 60 * 24))-1);
        //console.log('start work =>',this.sumDay);
        this.sumDay_365 = this.sumDay/365.0;
        //console.log('work year =>',this.sumDay_365);
        if(this.sumDay_365<1) this.sumDay_365=0;
        else if(this.sumDay_365<2) this.sumDay_365=1;
        else if(this.sumDay_365<3) this.sumDay_365=2;
        else if(this.sumDay_365<4) this.sumDay_365=3;
        else if(this.sumDay_365<5) this.sumDay_365=4;
        else if(this.sumDay_365<6) this.sumDay_365=5;
        else if(this.sumDay_365<7) this.sumDay_365=6;
        else if(this.sumDay_365<8) this.sumDay_365=7;
        else if(this.sumDay_365<9) this.sumDay_365=8;
        else if(this.sumDay_365<10) this.sumDay_365=9;
        else this.sumDay_365=10;
    }

    ClearTextInput(){
        this.leaveTypeSelect="";
        this.leaveTypeSelect2="";
        this.startDate="";
        this.startDate2="";
        this.endDate2="";
        this.reason = "";
        this.reason2 = "";
        this.labelLeaveHalfDay="";
        this.startTimeSelect="";
        this.endTimeSelect="";
    }

    Checktheleave(empID1:any,leaveType1:any){ //checkว่าสามาถรลาได้มั้ยเมื่อเทียบกับวันลาที่มี
      setTimeout(() => {
         this.service.show1rowof1person(empID1,leaveType1).subscribe(data => {
          console.log('show1rowof1person -> ',data);
          for (let i of data) {
              this.leavetatelAll.leavesNumbersID = i.leavesNumbersID;
              this.leavetatelAll.BalanceDay = i.balanceDay;
          }
        });
      }, 100);
    }

    SettingTime(){
      setTimeout(() => {
          //console.log(this.labelLeaveHalfDay);
          if(this.labelLeaveHalfDay=='ชั่วโมง'){
            this.startTimeSelect = 'null';
            this.endTimeSelect = 'null';
            this.hourdis = true;
          }
          else if(this.labelLeaveHalfDay=='ครึ่งวันเช้า'){
            this.startTimeSelect = '08:00';
            this.endTimeSelect = '12:00';
            this.hourdis = false;
          }
          else if(this.labelLeaveHalfDay=='ครึ่งวันบ่าย'){
            this.startTimeSelect = '13:00';
            this.endTimeSelect = '17:00';
            this.hourdis = false;
          }
      }, 100);
    }

}

//Dialog AttendanceCancelDialog
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

