import { Component } from '@angular/core';

@Component({
  selector: 'age-calculator',
  templateUrl: './age-calculator.component.html',
  styleUrls: ['./age-calculator.component.css']
})
export class AgeCalculatorComponent {
  dob: Date | null = null;

  result = {
    years: 0,
    months: 0,
    days: 0
  };

  showResult = false;

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
    this.showResult = true;
  }

  clear(): void {
    this.dob = null;
    this.showResult = false;
  }
}
