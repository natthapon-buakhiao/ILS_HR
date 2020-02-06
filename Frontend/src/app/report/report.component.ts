import { Component, OnInit } from '@angular/core';
import { ViewChild,Inject  } from '@angular/core';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import { HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ServiceService } from '../service/service.service';
import {  MatPaginator, MatTableDataSource } from '@angular/material';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { API1 } from '../app.component';
import { Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AttendanceShowLeavenumberComponent } from '../attendance-show-leavenumber/attendance-show-leavenumber.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe]
})
export class ReportComponent implements OnInit {

  progressBar=false;
  leaveType: Array<any>;
  department: Array<any>;

  startDateSearch;
  endDateSearch;
  hide=false;
  leaveTypeSearch;
  leaveStatusSearch;
  departmentSelect;
  leavePayment;
  showTable: Array<any>;
  dataSearch;
  constructor(private service:ServiceService,
            private router:Router,
            private route:ActivatedRoute,
            public dialog: MatDialog,
             private http: HttpClient,
             public datepipe: DatePipe) { }

  ngOnInit() {
      this.service.getleaveTypeForAlldays().subscribe(data => {
        this.leaveType = data;
        //console.table(this.leaveType);
      });
      this.service.getDepartment().subscribe(data => {
        this.department = data;
        //console.log('department == ',this.department);
      });

  }

clickSearch(){
<<<<<<< HEAD
    let statususer =   sessionStorage.getItem('roleStatusInLogin');
=======
    let statususer =   localStorage.getItem('roleStatusInLogin');

>>>>>>> add HR-ADMIN
    if(statususer == 'MANAGER'){

      if(this.startDateSearch == undefined || this.endDateSearch == undefined){
              if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }
              this.service.getLeavesManager(sessionStorage.getItem('empId') , this.leaveTypeSearch , this.leaveStatusSearch ,
                 this.departmentSelect , this.leavePayment,this.dataSearch).subscribe(data => {
                     this.showTable = data;
                     console.table(this.showTable);
               });
      }
      else{
              if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }
              this.service.getLeavesManagerHavedate(sessionStorage.getItem('empId') , this.leaveTypeSearch , this.leaveStatusSearch ,
                 this.departmentSelect , this.leavePayment,this.dataSearch,this.datepipe.transform(this.startDateSearch, 'yyyy-MM-dd'),this.datepipe.transform(this.endDateSearch, 'yyyy-MM-dd')).subscribe(data => {
                     this.showTable = data;
                     console.table(this.showTable);
               });
      }


    }else if(statususer == 'SUPERVISOR'){

      if(this.startDateSearch == undefined || this.endDateSearch == undefined){
              if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }
              this.service.getLeavesSupervisor(sessionStorage.getItem('empId') , this.leaveTypeSearch , this.leaveStatusSearch ,
                 this.departmentSelect , this.leavePayment,this.dataSearch).subscribe(data => {
                     this.showTable = data;
                     console.table(this.showTable);
               });
      }
      else{
            if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }

          this.service.getLeavesSupervisorHaveDate(sessionStorage.getItem('empId') , this.leaveTypeSearch , this.leaveStatusSearch ,
                 this.departmentSelect , this.leavePayment,this.dataSearch,this.datepipe.transform(this.startDateSearch, 'yyyy-MM-dd'),this.datepipe.transform(this.endDateSearch, 'yyyy-MM-dd')).subscribe(data => {
                     this.showTable = data;
                     console.table(this.showTable);
               });
      }



    }else if(statususer == 'EMPLOYEE'){

          if(this.startDateSearch == undefined || this.endDateSearch == undefined){ //ถ้าไม่ใส่วันที่
              if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }
             this.service.getLeavesEmployeeNoDate(sessionStorage.getItem('empId') , this.leaveTypeSearch , this.leaveStatusSearch ,
             this.departmentSelect , this.leavePayment,this.dataSearch).subscribe(data => {
                 this.showTable = data;
                 console.table(this.showTable);
               });

          }else{ //ถ้าใส่วันที่
                if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }
                this.service.getLeavesEmployeeHaveDate(sessionStorage.getItem('empId') , this.leaveTypeSearch , this.leaveStatusSearch ,
                 this.departmentSelect , this.leavePayment,this.dataSearch,this.datepipe.transform(this.startDateSearch, 'yyyy-MM-dd'),this.datepipe.transform(this.endDateSearch, 'yyyy-MM-dd')).subscribe(data => {
                     this.showTable = data;
                     console.table(this.showTable);
               });


          }


    }else if(statususer == 'DC-MANAGER'){


          if(this.startDateSearch == undefined || this.endDateSearch == undefined){ //ถ้าไม่ใส่วันที่
              if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }
              this.service.getLeavesDCManager( this.leaveTypeSearch , this.leaveStatusSearch ,
                   this.departmentSelect , this.leavePayment,this.dataSearch).subscribe(data => {
                    this.showTable = data;
                   console.table(this.showTable);
               });

          }else{ //ถ้าใส่วันที่
                if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }

                this.service.getLeavesDCManagerHavedate(this.leaveTypeSearch , this.leaveStatusSearch ,
                 this.departmentSelect , this.leavePayment,this.dataSearch,this.datepipe.transform(this.startDateSearch, 'yyyy-MM-dd'),this.datepipe.transform(this.endDateSearch, 'yyyy-MM-dd')).subscribe(data => {
                     this.showTable = data;
                     console.table(this.showTable);
               });

          }
    }else if(statususer == 'HR-ADMIN'){

          if(this.startDateSearch == undefined || this.endDateSearch == undefined){ //ถ้าไม่ใส่วันที่
              if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }

              this.service.getLeavesHRADMIN( this.leaveTypeSearch , this.leaveStatusSearch ,
                   this.departmentSelect , this.leavePayment,this.dataSearch).subscribe(data => {
                    this.showTable = data;
                   console.table(this.showTable);
               });

          }else{ //ถ้าใส่วันที่
                if(this.dataSearch == ''){
                  this.dataSearch=undefined;
              }

              this.service.getLeavesHRADMINHavedate(this.leaveTypeSearch , this.leaveStatusSearch ,
                 this.departmentSelect , this.leavePayment,this.dataSearch,this.datepipe.transform(this.startDateSearch, 'yyyy-MM-dd'),this.datepipe.transform(this.endDateSearch, 'yyyy-MM-dd')).subscribe(data => {
                     this.showTable = data;
                     console.table(this.showTable);
               });

          }
    }

}

exportexcel(){

}



}
