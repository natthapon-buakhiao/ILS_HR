package com.example.demo.Entity;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;

@Entity
@Table(name = "LeaveType")
public class LeaveType {
    @Id
    @SequenceGenerator(name = "LeaveType_seq", sequenceName = "LeaveType_seq")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LeaveType_seq")
    private long leaveTypeID;
    private String leaveTypeName;

    public long getLeaveTypeID() {
        return leaveTypeID;
    }

    public void setLeaveTypeID(long leaveTypeID) {
        this.leaveTypeID = leaveTypeID;
    }

    public String getLeaveTypeName() {
        return leaveTypeName;
    }

    public void setLeaveTypeName(String leaveTypeName) {
        this.leaveTypeName = leaveTypeName;
    }



}