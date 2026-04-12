import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
interface kakshyaRow {
  kakshyaNumber: number;
  degrees: string;
  lord: string;
}
@Component({
  selector: 'kakshya',
  templateUrl: './kakshya.component.html',
  styleUrls: ['./kakshya.component.css']
})
export class KakshyaComponent {
 allkakshyaNumber: string[] = [];
  selectedkakshyaNumber: string[] = [];
  kakshyaData: kakshyaRow[] = [];
  filteredData: kakshyaRow[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}
  
    ngOnInit(): void {
      this.loadKakshyaData();
    }
  private loadKakshyaData(): void {
    this.http.get<kakshyaRow[]>('assets/kakshyaData.json').subscribe({
      next: (data) => {
        this.kakshyaData = data;
        this.allkakshyaNumber = data.map((item) => item.kakshyaNumber.toString()  );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
onSignSelectionChange(): void {
    this.filteredData = this.selectedkakshyaNumber.length
      ? this.kakshyaData.filter((item) => this.selectedkakshyaNumber.includes(item.kakshyaNumber.toString()))
      : [];
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedkakshyaNumber = [];
    } else {
      this.selectedkakshyaNumber = [...this.allkakshyaNumber];
    }
    this.onSignSelectionChange();
  }

  get allSelected(): boolean {
    return this.selectedkakshyaNumber.length === this.allkakshyaNumber.length && this.allkakshyaNumber.length > 0;
  }
}
