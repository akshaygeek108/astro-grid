import { Component } from '@angular/core';
import { DataService, AstroRecord } from '../data.service';
@Component({
  selector: 'tamil-nadi',
  templateUrl: './tamil-nadi.component.html',
  styleUrls: ['./tamil-nadi.component.css']
})
export class TamilNadiComponent {
  data: AstroRecord[] = [];
  filtered: AstroRecord[] = [];

  houses: number[] = [];
  planets: string[] = [];

  selectedHouses: number[] = [];
  selectedPlanets: string[] = [];

  constructor(private dataSvc: DataService) { }

  ngOnInit(): void {
    this.dataSvc.getData().subscribe(arr => {
      this.data = arr;
      //this.filtered = arr;
      this.houses = Array.from(new Set(arr.map(x => x.house))).sort((a, b) => a - b);
      this.planets = Array.from(new Set(arr.map(x => x.planet))).sort();
      // No planets selected by default
    });
  }

  applyFilters() {
    this.filtered = this.data.filter(r => {
      const houseMatch = this.selectedHouses.length ? this.selectedHouses.includes(r.house) : true;
      const planetMatch = this.selectedPlanets.length ? this.selectedPlanets.includes(r.planet) : true;
      return houseMatch && planetMatch;
    });
  }

  clearFilters() {
    this.selectedHouses = [];
    this.selectedPlanets = [];
    this.filtered = [];
  }

  loadAllData() {
    this.selectedHouses = [];
    this.selectedPlanets = [];
    this.filtered = this.data;
  }
}
