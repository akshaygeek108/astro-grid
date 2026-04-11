import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface ChandraNavmanshaRow {
  sign: string;
  age1List: string;
  age2List: string;
  age3List: string;
  age4List: string;
  age5List: string;
}

@Component({
  selector: 'chandra-navmansha',
  templateUrl: './chandra-navmansha.component.html',
  styleUrls: ['./chandra-navmansha.component.css']
})
export class ChandraNavmanshaComponent implements OnInit {
  allSigns: string[] = [];
  selectedSigns: string[] = [];
  signData: ChandraNavmanshaRow[] = [];
  filteredData: ChandraNavmanshaRow[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSignData();
  }

  private loadSignData(): void {
    this.http.get<ChandraNavmanshaRow[]>('assets/chandraNavmanshData.json').subscribe({
      next: (data) => {
        this.signData = data;
        this.allSigns = data.map((item) => item.sign);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get allSelected(): boolean {
    return this.selectedSigns.length === this.allSigns.length && this.allSigns.length > 0;
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedSigns = [];
    } else {
      this.selectedSigns = [...this.allSigns];
    }
    this.onSignSelectionChange();
  }

  onSignSelectionChange(): void {
    this.filteredData = this.selectedSigns.length
      ? this.signData.filter((item) => this.selectedSigns.includes(item.sign))
      : [];
  }
}
