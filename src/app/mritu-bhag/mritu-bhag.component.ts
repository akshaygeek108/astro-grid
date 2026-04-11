import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface MrituBhagRow {
  planet: string;
  sign: string;
  value: number;
}

@Component({
  selector: 'mritu-bhag',
  templateUrl: './mritu-bhag.component.html',
  styleUrls: ['./mritu-bhag.component.css']
})
export class MrituBhagComponent implements OnInit {
  allPlanets: string[] = [];
  allDegrees: number[] = [];
  selectedPlanets: string[] = [];
  selectedDegrees: number[] = [];
  mrituBhagData: MrituBhagRow[] = [];
  resultGrid: any[][] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeDegrees();
    this.loadMrituBhagData();
  }
  get allSelected(): boolean {
    return this.selectedDegrees.length === this.allDegrees.length && this.allDegrees.length > 0;
  }
  private initializeDegrees(): void {
    this.allDegrees = Array.from({ length: 31 }, (_, i) => i); // 0 to 30
  }

  private loadMrituBhagData(): void {
    this.http.get<MrituBhagRow[]>('assets/mrituBhagData.json').subscribe({
      next: (data) => {
        this.mrituBhagData = data;
        this.allPlanets = [...new Set(data.map((item) => item.planet))].sort();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
toggleSelectAll(){
   if (this.allSelected) {
      this.selectedDegrees = [];
    } else {
      this.selectedDegrees = [...this.allDegrees];
    }
    this.onSelectionChange();
}
  onSelectionChange(): void {
    this.resultGrid = [];

    if (this.selectedPlanets.length > 0 && this.selectedDegrees.length > 0) {
      // Create header row with degrees
      const headerRow = ['Planet'];
      headerRow.push(...this.selectedDegrees.map(deg => deg.toString()));
      this.resultGrid.push(headerRow);

      // Create data rows for each planet
      this.selectedPlanets.forEach(planet => {
        const row = [planet];
        this.selectedDegrees.forEach(degree => {
          const matchingItem = this.mrituBhagData.find(
            item => item.planet === planet && item.value === degree
          );
          if (matchingItem) {
            row.push(`Yes (${matchingItem.sign})`);
          } else {
            row.push('No');
          }
        });
        this.resultGrid.push(row);
      });
    }
  }

  clearSelections(): void {
    this.selectedPlanets = [];
    this.selectedDegrees = [];
    this.resultGrid = [];
  }
}
