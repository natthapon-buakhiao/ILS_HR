package com.example.demo.Controller;
import com.example.demo.Entity.Combobox.Department;
import com.example.demo.Entity.Combobox.EmpStatus;
import com.example.demo.Entity.DepartmentMasterRole;
import com.example.demo.Entity.EmployeeMaster;
import com.example.demo.Repository.*;
import com.example.demo.Repository.ComboboxRepository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
public class DepartmentMasterRoleController {
    @Autowired private DepartmentMasterRoleRepository departmentMasterRoleRepository;
    @Autowired private EmployeeMasterRepository employeeMasterRepository;
    @Autowired private DepartmentRepository departmentRepository;

    @GetMapping(path = "/DepartmentMasterRole")
    public Iterable<DepartmentMasterRole> departmentMasterRoles() {
        return departmentMasterRoleRepository.findAll().stream().collect(Collectors.toList());
    }

    @PostMapping(path = "/insertDataDepartmentRole/{employeeMasterID}/{departmentSelect}")
    public DepartmentMasterRole departmentMasterRole(@PathVariable Long employeeMasterID,@PathVariable String departmentSelect) {
            EmployeeMaster employeeMaster = employeeMasterRepository.findById(employeeMasterID).get();
            Department department = departmentRepository.findByDepartmentName(departmentSelect);
            DepartmentMasterRole departmentMasterRole = new DepartmentMasterRole();
            departmentMasterRole.setEmployeeMasterid(employeeMaster);
            departmentMasterRole.setDepartmentid(department);
            return  departmentMasterRoleRepository.save(departmentMasterRole);
    }

    @GetMapping("/DepartmentMasterRoleFindByEmpIDAndDepartmentID/{employeeMasterID}/{departmentSelect}")
    public DepartmentMasterRole DepartmentMasterRoleFindByEmpIDAndDepartmentID(@PathVariable long employeeMasterID,@PathVariable String departmentSelect) {
        EmployeeMaster employeeMaster = employeeMasterRepository.findById(employeeMasterID).get();
        Department department = departmentRepository.findByDepartmentName(departmentSelect);
        DepartmentMasterRole departmentMasterRole = departmentMasterRoleRepository.findByEmployeeMasteridAndDepartmentid(employeeMaster,department);
        return departmentMasterRole;
    }

    @GetMapping("/getDepartmentMasterRole/{employeeMasterID}")
    public Iterable<DepartmentMasterRole> getDepartmentMasterRole(@PathVariable long employeeMasterID) {
        return this.departmentMasterRoleRepository.queryDepartmentMasterRole(employeeMasterID);
    }
    @GetMapping("/getDepartmentMasterRoleFindByEmpCode/{empCode}")
    public Iterable<DepartmentMasterRole> getDepartmentMasterRoleFindByEmpCode(@PathVariable String empCode) {
        EmployeeMaster employeeMaster = employeeMasterRepository.findByemployeeMasterCustomerCode(empCode);
        return this.departmentMasterRoleRepository.queryDepartmentMasterRole(employeeMaster.getEmployeeMasterID());
    }

    @DeleteMapping("/deleteRole/{departmentRoleID}")
    public DepartmentMasterRole deleteRole(@PathVariable long departmentRoleID) {
        DepartmentMasterRole departmentMasterRole = departmentMasterRoleRepository.findById(departmentRoleID).get();
        departmentMasterRoleRepository.delete(departmentMasterRole);
        return null;
    }

}
