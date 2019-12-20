import { Component, OnInit } from '@angular/core';
import { ViewChild,Inject  } from '@angular/core';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import { HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ServiceService } from '../service/service.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-approve-by-supervisor',
  templateUrl: './approve-by-supervisor.component.html',
  styleUrls: ['./approve-by-supervisor.component.css']
})

export class ApproveBySupervisorComponent implements OnInit {
  public API = '//localhost:8080';
  leaves  : Array<any>;
  LeavesToComplete: Array<any>;
  isChecked;
  interval:any;
  leaveID;
  dis;
  firstNameOnLogin = localStorage.getItem('fName');
  lastNameOnLogin  = localStorage.getItem('lName');
  departmentOnLogin = localStorage.getItem('departmentlogin');

  displayedColumns: string[] = ['number','employeeCode', 'name','date', 'leaveType', 'reason', 'startDate', 'endDate','total', 'approvedBySupervisor', 'approvedByManager','leaveStatus','approve','notApprove'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.leaves);
  @ViewChild(MatPaginator, {static : true}) paginator : MatPaginator;
  constructor(private service:ServiceService,
            private router:Router,
            private route:ActivatedRoute ,
            public dialog: MatDialog,
             private http: HttpClient,) { }


  ngOnInit() {
        this.service.getLeavesToNotCompleteBySupervisor(this.departmentOnLogin).subscribe(data => {
            this.leaves = data;
            this.dataSource.data = this.leaves;
            //console.log('leaves -> ',this.leaves);
        });
        this.dataSource.paginator = this.paginator;
  }
  approve(row : any){
        this.http.post(this.API + '/approveBySupervisor/' + row.leavesID +'/'+ this.firstNameOnLogin +'/'+ this.lastNameOnLogin  ,{}).subscribe(data => {
            console.log('Approve is successful');
            alert("Approve successful");
          },
          error => {
            console.log('Error', error);
          }
        );
  }
  notApprove(row : any){
        this.http.post(this.API + '/notApproveBySupervisor/' + row.leavesID ,{}).subscribe(data => {
            console.log('Not approve is successful');
            alert("Not approve successful");
          },
          error => {
            console.log('Error', error);
          }
        );

  }

  onChange(){
           this.interval = setTimeout(() => {  //show table Leave
              if(this.isChecked == true){
                this.service.getLeavesSelectDepartment(this.departmentOnLogin).subscribe(dataLeavesToComplete => {
                      this.leaves = dataLeavesToComplete;
                      this.dataSource.data = this.leaves;
                      //console.log('leaves -> ',this.leaves);
                  });
                  this.dis=true;
              }
              else{
                  this.service.getLeavesToNotCompleteBySupervisor(this.departmentOnLogin).subscribe(data => {
                    this.leaves = data;
                    this.dataSource.data = this.leaves;
                    //console.log('leaves -> ',this.leaves);
                  });
                  this.dis=false;
              }
            }, 1000);
  }


}
