import { Component, OnInit } from '@angular/core';
import { DataService, AstroRecord } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  data: AstroRecord[] = [];
  filtered: AstroRecord[] = [];

  houses: number[] = [];
  planets: string[] = [];

  selectedHouses: number[] = [];
  selectedPlanets: string[] = [];

  constructor(private dataSvc: DataService) {}

  ngOnInit(): void {
    this.dataSvc.getData().subscribe(arr => {
      this.data = arr;
      this.filtered = arr;
      this.houses = Array.from(new Set(arr.map(x => x.house))).sort((a,b)=>a-b);
      this.planets = Array.from(new Set(arr.map(x => x.planet))).sort();
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
    this.filtered = this.data;
  }
}
