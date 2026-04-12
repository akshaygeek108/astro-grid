import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface AgeHouseRow{
house: number;
age: number;  
}

interface bcpAgeCalcuatorRow{
  year: string;
  planet: string;
}
@Component({
  selector: 'age-calculator',
  templateUrl: './age-calculator.component.html',
  styleUrls: ['./age-calculator.component.css']
})
export class AgeCalculatorComponent {
  constructor(private http: HttpClient) {}
  dob: Date | null = null;
ageHouseData: AgeHouseRow[] = [];
bcpAgeCalcuatorData:bcpAgeCalcuatorRow[] = [];
isLoading = true;
  result = {
    years: 0,
    months: 0,
    days: 0
  };
  dateHouse:any;
  showResult = false;
  ngOnInit(): void {  
  this.loadAgeHouseData();

  }
loadAgeHouseData(){
   this.http.get<AgeHouseRow[]>('assets/ageHouseData.json').subscribe({
      next: (data) => {
        this.ageHouseData = data; 
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.http.get<bcpAgeCalcuatorRow[]>('assets/bcpAgeData.json').subscribe({
      next: (data) => {
        this.bcpAgeCalcuatorData = data;
      
      },
      error: () => {
      
      }
    });
}

  calculateAge(): void {
    if (!this.dob) {
      this.showResult = false;
      return;
    }

    const today = new Date();

    // ✅ normalize date
    const birth = new Date(
      this.dob.getFullYear(),
      this.dob.getMonth(),
      this.dob.getDate()
    );

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    this.result = { years, months, days };
     this.dateHouse = this.ageHouseData.filter((item) => item.age === this.result.years);
     
    this.showResult = true;
  }

  clear(): void {
    this.dob = null;
    this.showResult = false;
  }
}
