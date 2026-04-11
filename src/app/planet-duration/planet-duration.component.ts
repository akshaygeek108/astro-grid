import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface PlanetDuration {
  planet: string;
  natalChartD1: string;
  navanshD9: string;
  sashtiamshaD60: string;
}

@Component({
  selector: 'planet-duration',
  templateUrl: './planet-duration.component.html',
  styleUrls: ['./planet-duration.component.css']
})
export class PlanetDurationComponent implements OnInit {
  allPlanets: string[] = [];
  selectedPlanets: string[] = [];
  planetData: PlanetDuration[] = [];
  filteredData: PlanetDuration[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPlanetData();
  }

  private loadPlanetData(): void {
    this.http.get<PlanetDuration[]>('assets/planetDurationData.json').subscribe({
      next: (data) => {
        this.planetData = data;
        this.allPlanets = data.map((item) => item.planet);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get allSelected(): boolean {
    return this.selectedPlanets.length === this.allPlanets.length && this.allPlanets.length > 0;
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedPlanets = [];
    } else {
      this.selectedPlanets = [...this.allPlanets];
    }
    this.onPlanetSelectionChange();
  }

  onPlanetSelectionChange(): void {
    this.filteredData = this.selectedPlanets.length
      ? this.planetData.filter((item) => this.selectedPlanets.includes(item.planet))
      : [];
  }
}
