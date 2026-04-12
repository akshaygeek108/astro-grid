import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface DasamsaHouseRowSignificator1 {
  house: number;
  signifies: string;
  whatWe: string;
  atWork: string;
}
interface DasamsaHouseRowSignificator2 {
  house: number;
  houses: string;
  lords: string;
}

@Component({
  selector: 'dasams-house', 
  templateUrl: './dasams-house.component.html',
  styleUrls: ['./dasams-house.component.css']
})
export class DasamsHouseComponent {
filteredData:  DasamsaHouseRowSignificator1[] = [];
tab1Data: DasamsaHouseRowSignificator1[] = [];
isLoading = true;
allHouse: number[] = [];
selectedHouse: number[] = [];

filteredData1:  DasamsaHouseRowSignificator2[] = [];
tab2Data: DasamsaHouseRowSignificator2[] = [];
isLoading1 = true;
allHouse1: number[] = [];
selectedHouse1: number[] = [];
constructor(private http: HttpClient) {}

ngOnInit(): void {
  this.loadData();
}

private loadData(): void {
  this.http.get<DasamsaHouseRowSignificator1[]>('assets/dasamsaHouseData.json').subscribe({
    next: (data) => {
      this.tab1Data = data;
      this.allHouse = data.map((item) => item.house);
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
    }
  });

  this.http.get<DasamsaHouseRowSignificator2[]>('assets/dasamsaHouseData2.json').subscribe({
    next: (data) => {
      this.tab2Data = data;
      this.allHouse1 = data.map((item) => item.house);
      this.isLoading1 = false;
    },
    error: () => {
      this.isLoading = false;
    }
  });
}
toggleSelectAll(): void {
  if (this.allSelected) {
    this.selectedHouse = [];
  } else {
    this.selectedHouse = [...this.allHouse];
  }
  this.onHouseSelectionChange();
}

get allSelected(): boolean {
  return this.selectedHouse.length === this.allHouse.length && this.allHouse.length > 0;
}
onHouseSelectionChange(): void {
  this.filteredData = this.selectedHouse.length
    ? this.tab1Data.filter((item) => this.selectedHouse.includes(item.house))
    : []; 
}

toggleSelectAll1(): void {
  if (this.allSelected1) {
    this.selectedHouse1 = [];
  } else {
    this.selectedHouse1 = [...this.allHouse1];
  }
  this.onHouseSelectionChange1();
}

get allSelected1(): boolean {
  return this.selectedHouse1.length === this.allHouse1.length && this.allHouse1.length > 0;
}
onHouseSelectionChange1(): void {
  this.filteredData1 = this.selectedHouse1.length
    ? this.tab2Data.filter((item) => this.selectedHouse1.includes(item.house))
    : []; 
}
}
