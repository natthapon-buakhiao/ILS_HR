import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ServiceService {

  public API = '//localhost:8080';
  //public API = 'http://192.168.1.47:8080';

  constructor( private http: HttpClient ) { }

  getemployee(): Observable<any>{
      return this.http.get(this.API+'/ILS_HR'+'/employee',{})
  }
  getemployee1person(empID:any): Observable<any>{
      return this.http.get(this.API+'/getemployee1person/'+empID,{})
  }
  getBank():Observable<any>{
      return this.http.get(this.API+'/bank',{})
  }
  getPrefix():Observable<any>{
      return this.http.get(this.API+'/prefix',{})
  }
  getGender2():Observable<any>{
      return this.http.get(this.API+'/gender',{})
  }
  getDepartment():Observable<any>{
      return this.http.get(this.API+'/department',{})
  }
  getPosition():Observable<any>{
      return this.http.get(this.API+'/position',{})
  }
  getEmployeeType():Observable<any>{
      return this.http.get(this.API+'/employeeType',{})
  }
  getEducation():Observable<any>{
      return this.http.get(this.API+'/education',{})
  }
  getEmpStatus():Observable<any>{
      return this.http.get(this.API+'/empStatus',{})
  }
  getRoleStatus():Observable<any>{
      return this.http.get(this.API+'/roleStatus',{})
  }
  getleaveTypeForAlldays():Observable<any>{
      return this.http.get(this.API+'/leaveTypeForAlldays',{})
  }
  getLeavesToNotCompleteBySupervisor(empId:String):Observable<any>{
      return this.http.get(this.API+'/LeavesToNotCompleteBySupervisor/'+empId,{})
  }
  getShowLeaves2(leaID : String):Observable<any>{
      return this.http.get(this.API+'/showleave3/'+leaID,{})
  }
  getShowLeavesNotApproveBySup(empID:String):Observable<any>{
      return this.http.get(this.API+'/NotApproveBySup/'+empID,{})
  }
  getshowLeavesToComplete():Observable<any>{
      return this.http.get(this.API+'/showLeavesToComplete',{})
  }
  getshowLeavesToNotComplete():Observable<any>{
      return this.http.get(this.API+'/showLeavesToNotComplete',{})
  }
  getSearchEmployeeForAttendance(employeeMasterID:String): Observable<any>{
      return this.http.get(this.API+'/SearchEmployeeForAttendance/'+employeeMasterID,{})
  }
  getSearchEmployeeForAttendance2(id:String): Observable<any>{
      return this.http.get(this.API+'/SearchEmployeeForAttendance2/'+id,{})
  }
  getUserPassword(employeeCode: String, password : String): Observable<any>{
      return this.http.get(this.API+'/login/'+employeeCode+'/'+password,{})
  }
  getShowLeavesNumber(leaID : String):Observable<any>{
      return this.http.get(this.API+'/showleaveNumber/'+leaID,{})
  }
  getSearchEmployee(dataSearch:String):Observable<any>{
      return this.http.get(this.API+'/SearchEmployee/'+dataSearch,{})
  }
  getLeavesSelectDepartment(empID:String):Observable<any>{
      return this.http.get(this.API+'/LeavesSelectDepartment/'+empID,{})
  }
  show1rowof1person(empID:String,leaveID:String):Observable<any>{
      return this.http.get(this.API+'/show1rowof1person/'+empID+'/'+leaveID,{})
  }
  getDepartmentMasterRole():Observable<any>{
      return this.http.get(this.API+'/DepartmentMasterRole',{})
  }
  getSearchEmployeeByCodeAndName(empID:String):Observable<any>{
      return this.http.get(this.API+'/SearchEmployeeByCodeAndName' +'/'+ empID,{})
  }
  getSearchEmployeeByDepartmentID(departmentID:String):Observable<any>{
      return this.http.get(this.API+'/SearchEmployeeByDepartmentID' +'/'+ departmentID,{})
  }
  getLeavesFindByID(leavesID : any):Observable<any>{
      return this.http.get(this.API+'/showLeavesFindByID' +'/'+ leavesID,{})
  }
  getSearchEmpCode(EmpCode : String):Observable<any>{
      return this.http.get(this.API+'/SearchEmpCode' +'/'+ EmpCode,{})
  }
  getDepartmentMasterRole2(employeeMasterID : any):Observable<any>{
      return this.http.get(this.API+'/getDepartmentMasterRole' +'/'+ employeeMasterID,{})
  }
  getDepartmentMasterRoleFindByEmpCode(empCode : String):Observable<any>{
      return this.http.get(this.API+'/getDepartmentMasterRoleFindByEmpCode' +'/'+ empCode,{})
  }


}
