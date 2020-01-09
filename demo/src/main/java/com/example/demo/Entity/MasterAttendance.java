package com.example.demo.Entity;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class MasterAttendance {
    @Id
    private Long MasterAttendanceID;
    private int year;
    private double dayLeave;

    public Long getMasterAttendanceID() {
        return MasterAttendanceID;
    }

    public void setMasterAttendanceID(Long masterAttendanceID) {
        MasterAttendanceID = masterAttendanceID;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public double getDayLeave() {
        return dayLeave;
    }

    public void setDayLeave(double dayLeave) {
        this.dayLeave = dayLeave;
    }

    public void setDayLeave(int dayLeave) {
        this.dayLeave = dayLeave;
    }
}
