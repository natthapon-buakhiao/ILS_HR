package com.example.demo.Controller;
import com.example.demo.Entity.Combobox.Department;
import com.example.demo.Repository.*;
import com.example.demo.Entity.*;
import com.sun.xml.messaging.saaj.packaging.mime.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@CrossOrigin(origins = "*")
public class MasterRoleController {
    @Autowired private MasterRoleRepository masterRoleRepository;
    @Autowired private EmployeeMasterRepository employeeMasterRepository;
    @Autowired private DepartmentMasterRoleRepository departmentMasterRoleRepository;

    @Autowired private MailService notificationService;

    @GetMapping(path = "/masterRole")
    public Iterable<MasterRole> masterRole() {
        return masterRoleRepository.findAll().stream().collect(Collectors.toList());
    }

    @PostMapping(path = "/sendEmailToSupervisor")
    public void emailtosupervisor(@RequestBody Map<String,String> body) throws MessagingException, javax.mail.MessagingException {

        long managerID = Integer.valueOf(body.get("managerID").toString());
        String leaveType = body.get("leaveType").toString();
        long empID = Integer.valueOf(body.get("empID").toString());
        String dateAndTotel = body.get("dateAndTotel").toString();
        String reason = body.get("reason").toString();

        EmployeeMaster manager = employeeMasterRepository.findById(managerID).get();
        EmployeeMaster emp = employeeMasterRepository.findById(empID).get();
        String managername = manager.getEmployeeMasterFirstName()+" "+manager.getEmployeeMasterLastName();
        String empname = emp.getEmployeeMasterFirstName()+" "+emp.getEmployeeMasterLastName();

        notificationService.sendEmailToSupervisor(managername,manager.getEmpEmail(),leaveType,empname,dateAndTotel,reason);
    }

    @PostMapping(path = "/sendEmailToManager")
    public void emailtomanager(@RequestBody Map<String,String> body) throws MessagingException, javax.mail.MessagingException {

        long managerID = Integer.valueOf(body.get("managerID").toString());
        long supervisorID = Integer.valueOf(body.get("supervisorID").toString());
        long empIdLeave = Integer.valueOf(body.get("empIdLeave").toString());
        String leaveType = body.get("leaveType").toString();
        String dateAndTotel = body.get("dateAndTotel").toString();
        String reason = body.get("reason").toString();

        EmployeeMaster manager = employeeMasterRepository.findById(managerID).get();
        EmployeeMaster supervisor = employeeMasterRepository.findById(supervisorID).get();
        EmployeeMaster empLeave = employeeMasterRepository.findById(empIdLeave).get();
        String managername = manager.getEmployeeMasterFirstName()+" "+manager.getEmployeeMasterLastName();
        String supervisorname = supervisor.getEmployeeMasterFirstName()+" "+supervisor.getEmployeeMasterLastName();
        String empLeavename = empLeave.getEmployeeMasterFirstName()+" "+empLeave.getEmployeeMasterLastName();

        notificationService.sendEmailToManager(managername,supervisorname,empLeavename,leaveType,dateAndTotel,supervisor.getEmpEmail(),reason);
    }

    @PostMapping(path = "/sendEmailToDCManager")
    public void emailtodcmanager(@RequestBody Map<String,String> body) throws MessagingException, javax.mail.MessagingException {

        long managerID = Integer.valueOf(body.get("managerID").toString());
        String leaveType = body.get("leaveType").toString();
        long empID = Integer.valueOf(body.get("empID").toString());
        String dateAndTotel = body.get("dateAndTotel").toString();
        String reason = body.get("reason").toString();

        EmployeeMaster manager = employeeMasterRepository.findById(managerID).get();
        EmployeeMaster emp = employeeMasterRepository.findById(empID).get();
        String managername = manager.getEmployeeMasterFirstName()+" "+manager.getEmployeeMasterLastName();
        String empname = emp.getEmployeeMasterFirstName()+" "+emp.getEmployeeMasterLastName();
        notificationService.sendEmailToDCManager(managername,manager.getEmpEmail(),leaveType,empname,dateAndTotel,reason);

    }


}
