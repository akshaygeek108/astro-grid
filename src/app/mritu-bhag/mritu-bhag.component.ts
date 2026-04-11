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
  allSigns: string[] = [];

  selectedPlanets: string[] = [];
  selectedDegrees: number[] = [];
  selectedSigns: string[] = [];

  mrituBhagData: MrituBhagRow[] = [];
  resultGrid: any[][] = [];

  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeDegrees();
    this.loadMrituBhagData();
  }

  get allSelected(): boolean {
    return (
      this.selectedDegrees.length === this.allDegrees.length &&
      this.allDegrees.length > 0
    );
  }

  private initializeDegrees(): void {
    this.allDegrees = Array.from({ length: 31 }, (_, i) => i);
  }

  private loadMrituBhagData(): void {
    this.http.get<MrituBhagRow[]>('assets/mrituBhagData.json').subscribe({
      next: (data) => {
        this.mrituBhagData = data;

        this.allPlanets = [...new Set(data.map(d => d.planet))].sort();
        this.allSigns = [...new Set(data.map(d => d.sign))].sort();

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedDegrees = [];
    } else {
      this.selectedDegrees = [...this.allDegrees];
    }
    this.onSelectionChange();
  }

  onSelectionChange(): void {
  this.resultGrid = [];

  // Minimum requirement: planets + degrees
  if (this.selectedPlanets.length === 0 || this.selectedDegrees.length === 0) {
    return;
  }

  // Header row
  const headerRow = ['Planet', ...this.selectedDegrees.map(d => d.toString())];
  this.resultGrid.push(headerRow);

  // Rows
  this.selectedPlanets.forEach((planet) => {
    const row: any[] = [planet];

    this.selectedDegrees.forEach((degree) => {
      // Step 1: all matches for planet + degree
      const baseMatches = this.mrituBhagData.filter(
        item => item.planet === planet && item.value === degree
      );

      // Step 2: optional sign filtering
      const finalMatches =
        this.selectedSigns.length > 0
          ? baseMatches.filter(item => this.selectedSigns.includes(item.sign))
          : baseMatches;

      // Step 3: output
      if (finalMatches.length > 0) {
        const signs = finalMatches.map(i => i.sign).join(', ');
        row.push(`Yes (${signs})`);
      } else {
        row.push('No');
      }
    });

    this.resultGrid.push(row);
  });
}

  clearSelections(): void {
    this.selectedPlanets = [];
    this.selectedDegrees = [];
    this.selectedSigns = [];
    this.resultGrid = [];
  }
}