import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as XLSX from 'xlsx';

interface Planet {
  id: string;
  name: string;
}

interface PlanetInstance {
  instanceId: string;
  planetId: string;
  name: string;
  degree: number;
  x: number;
  y: number;
  houseNumber?: string;
}

@Component({
  selector: 'guru-chakra',
  templateUrl: './guru-chakra.component.html',
  styleUrls: ['./guru-chakra.component.css']
})
export class GuruChakraComponent implements AfterViewInit {

  @ViewChild('kundliContainer1', { static: true }) container1!: ElementRef;
  @ViewChild('kundliContainer2') container2!: ElementRef;

  centerLabels: Record<number, string> = { 1: '', 2: '' };

  planets = [
    { id: 'sun', name: 'Su' },
    { id: 'moon', name: 'Mo' },
    { id: 'mars', name: 'Ma' },
    { id: 'mercury', name: 'Me' },
    { id: 'jupiter', name: 'Ju' },
    { id: 'venus', name: 'Ve' },
    { id: 'saturn', name: 'Sa' },
    { id: 'rahu', name: 'Ra' },
    { id: 'ketu', name: 'Ke' },
    { id: 'ascendant', name: 'As' }
  ];

  houses = Array.from({ length: 12 }, (_, i) => ({
    id: (i + 1).toString(),
    name: (i + 1).toString()
  }));

  kundli2Enabled = false;

  kundlis: Record<number, Record<number, PlanetInstance[]>> = {
    1: this.createEmptyHouses(),
    2: this.createEmptyHouses()
  };

  activeKundliId = 1;

  ngAfterViewInit() {
    this.drawBase(1);
    if (this.kundli2Enabled) this.drawBase(2);
  }

  private createEmptyHouses() {
    const obj: Record<number, PlanetInstance[]> = {};
    for (let i = 1; i <= 13; i++) obj[i] = [];
    return obj;
  }

  addKundli() {
    if (!this.kundli2Enabled) {
      this.kundli2Enabled = true;
      setTimeout(() => this.drawBase(2));
    }
  }

  deleteKundli() {
    this.kundli2Enabled = false;

    for (let i = 1; i <= 12; i++) {
      this.kundlis[2][i] = [];
    }

    if (this.container2) {
      this.centerLabels[2] = '';
      d3.select(this.container2.nativeElement).selectAll('*').remove();
    }
  }

  onDragStart(event: DragEvent, planet: Planet, kundliId: number) {
    event.dataTransfer?.setData('text/plain', planet.name);
    event.dataTransfer?.setData('planet', JSON.stringify(planet));
    event.dataTransfer?.setData('kundliId', kundliId.toString());
    event.dataTransfer!.effectAllowed = 'copy';
    event.dataTransfer!.dropEffect = 'copy';
  }

  resetGrid() {
    [1, 2].forEach(k => {
      for (let i = 1; i <= 12; i++) {
        this.kundlis[k][i] = [];
      }
    });

    this.drawBase(1);
    if (this.kundli2Enabled) this.drawBase(2);
  }

  // 🔥 helper to draw line (removes duplication only)
  private drawLine(svg: any, x1: number, y1: number, x2: number, y2: number) {
    svg.append('line')
      .attr('x1', x1).attr('y1', y1)
      .attr('x2', x2).attr('y2', y2)
      .attr('stroke', '#ffb74d')
      .attr('stroke-width', 2)
      .attr('shape-rendering', 'crispEdges');
  }

  drawBase(kundliId: number = 1) {
    this.activeKundliId = kundliId;
    const container = kundliId === 1 ? this.container1 : this.container2;
    if (!container) return;

    const size = 400;
    const cell = size / 4;

    d3.select(container.nativeElement).selectAll('*').remove();

    const svg = d3.select(container.nativeElement)
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .attr('viewBox', `0 0 ${size} ${size}`)
      .attr('fill', 'none')
      .attr('font-size', '14px')
      .attr('font-family', 'Inter, Arial, sans-serif')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-weight', '600')
      .style('background', '#fffafc');

    // border
    svg.append('rect')
      .attr('width', size)
      .attr('height', size)
      .attr('fill', 'none')
      .attr('stroke', '#ffb74d')
      .attr('stroke-width', 2);

    // vertical
    this.drawLine(svg, cell, 0, cell, size);
    this.drawLine(svg, 3 * cell, 0, 3 * cell, size);

    // horizontal
    this.drawLine(svg, 0, cell, size, cell);
    this.drawLine(svg, 0, 3 * cell, size, 3 * cell);
    this.drawLine(svg, 0, 2 * cell, cell, 2 * cell);
    this.drawLine(svg, 3 * cell, 2 * cell, size, 2 * cell);

    // first + last rows
    [1, 2, 3].forEach(i => {
      this.drawLine(svg, i * cell, 0, i * cell, cell);
      this.drawLine(svg, i * cell, 3 * cell, i * cell, size);
    });

    // center text (UNCHANGED)
    svg.append('text')
      .attr('x', size / 2)
      .attr('y', size / 2)
      .attr('font-size', '20px')
      .attr('fill', '#c2185b')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('pointer-events', 'none')
      .text(this.centerLabels[kundliId] || '');

    // house numbers
    const houseValues = [
      12, 1, 2, 3,
      11, "", "", 4,
      10, "", "", 5,
      9, 8, 7, 6
    ];

    const houseValueMap: Record<number, string> = {};
    houseValues.forEach((val, i) => {
      if (!val) return;
      const row = Math.floor(i / 4);
      const col = i % 4;
      const key = row * 4 + col; // same index you used
      houseValueMap[key] = val.toString();
      svg.append('text')
        .attr('x', col * cell + cell - 6)
        .attr('y', row * cell + cell - 4)
        .attr('text-anchor', 'end')
        .attr('font-size', '12px')
        .attr('font-color', '#fa4424')
        .attr('fill', '#5e0d35')
        .text(val);
    });

    // dbl click center (UNCHANGED)
    svg.on('dblclick', (event: MouseEvent) => {
      const c = size / 3;
      const x = event.offsetX;
      const y = event.offsetY;

      if (x > c && x < 2 * c && y > c && y < 2 * c) {
        const txt = prompt('Enter Rashi text (max 20 chars):');
        if (txt !== null) {
          const trimmed = txt.length > 20 ? txt.slice(0, 20) : txt;

          this.centerLabels[kundliId] = txt;
          this.drawBase(kundliId);
        }
      }
    });

    const houseZones = [
      { id: 1, x: 150, y: 150, w: 100, h: 100 },
      { id: 2, x: 100, y: 0, w: 100, h: 100 },
      { id: 3, x: 200, y: 0, w: 100, h: 100 },
      { id: 4, x: 300, y: 0, w: 100, h: 100 },
      { id: 5, x: 300, y: 100, w: 100, h: 100 },
      { id: 6, x: 300, y: 200, w: 100, h: 100 },
      { id: 7, x: 300, y: 300, w: 100, h: 100 },
      { id: 8, x: 200, y: 300, w: 100, h: 100 },
      { id: 9, x: 100, y: 300, w: 100, h: 100 },
      { id: 10, x: 0, y: 300, w: 100, h: 100 },
      { id: 11, x: 0, y: 200, w: 100, h: 100 },
      { id: 12, x: 0, y: 100, w: 100, h: 100 },
      { id: 13, x: 0, y: 0, w: 100, h: 100 }
    ];
    const enrichedZones = houseZones.map((z, i) => ({
      ...z,
      houseValue: houseValues[i] || null
    }));
    svg.selectAll('.dropzone')
      .data(enrichedZones)
      .enter()
      .append('rect')
      .attr('class', 'dropzone')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .attr('fill', 'transparent')
      .attr('data-house', d => d.id)
      .on('dragover', (e: DragEvent) => e.preventDefault())
      .on('drop', (event: DragEvent, d: any) => {
        event.preventDefault();

        const rect = (container.nativeElement.querySelector('svg') as SVGElement)
          .getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.onDrop(event, d.id, x, y, kundliId);
      });

    this.renderPlanetsInHouses(svg, houseZones, kundliId);
  }
  private planetDrag = d3.drag<SVGTextElement, PlanetInstance>()
    .on('start', function () {
      d3.select(this).raise().style('cursor', 'grabbing');
    })
    .on('drag', (event, d: PlanetInstance) => {

      d.x = event.x;
      d.y = event.y;

      d3.select(event.sourceEvent.target)
        .attr('x', d.x)
        .attr('y', d.y);
    })
    .on('end', (event, d: PlanetInstance) => {

      const k = this.activeKundliId;

      for (let i = 1; i <= 12; i++) {
        const idx = this.kundlis[k][i]
          .findIndex(p => p.instanceId === d.instanceId);

        if (idx !== -1) {
          this.kundlis[k][i][idx].x = d.x;
          this.kundlis[k][i][idx].y = d.y;
          break;
        }
      }

      this.drawBase(k);
    });
  renderPlanetsInHouses(svg: any, houseZones: any[], kundliId: number) {
    const data = this.kundlis[kundliId];

    const planets = Object.values(data).flat();

    const sel = svg.selectAll('.planet')
      .data(planets, (d: any) => d.instanceId);

    sel.exit().remove();

    const enter = sel.enter()
      .append('text')
      .attr('class', 'planet')
      .attr('font-size', '14px')
      .attr('fill', '#000')
      .style('cursor', 'grab')
      .style('pointer-events', 'all')
      .text(d => d.name)
      .call(this.planetDrag);

    enter.merge(sel as any)
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  }
  onDrop(event: DragEvent, houseId: number, x?: number, y?: number, kundliId: number = 1) {
    event.preventDefault();

    if (houseId === 1) return;

    const data = event.dataTransfer?.getData('planet');
    if (!data) return;

    const planet: Planet = JSON.parse(data);
    console.log('Dropped planet:', planet, 'houseId:', houseId);
    for (let i = 1; i <= 13; i++) {
      this.kundlis[kundliId][i] =
        this.kundlis[kundliId][i].filter(p => p.planetId !== planet.id);
    }

    this.kundlis[kundliId][houseId].push({
      instanceId: crypto.randomUUID(),
      planetId: planet.id,
      name: planet.name,
      degree: 15,
      x: x ?? 0,
      y: y ?? 0,
      houseNumber: (houseId - 1).toString()
    });

    this.drawBase(kundliId);
  }

  generateExcelSideBySide() {

    const data1 = this.kundlis[1];
    const data2 = this.kundlis[2];

    const rows: any[] = [];

    for (let house = 1; house <= 12; house++) {

      const planets1 = data1[house] || [];
      const planets2 = data2[house] || [];

      const maxLen = Math.max(planets1.length, planets2.length, 1);

      for (let i = 0; i < maxLen; i++) {

        const p1 = planets1[i];
        const p2 = planets2[i];

        rows.push({
          House: house,

          // 🔵 Kundli 1 (Left Side)
          K1_Planet: p1 ? p1.name : '',

          // 🟣 Kundli 2 (Right Side)
          K2_Planet: p2 ? p2.name : '',
        });
      }
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // optional: widen columns for better readability
    worksheet['!cols'] = [
      { wch: 8 },   // House
      { wch: 12 },  // K1 Planet
      { wch: 12 },
      { wch: 10 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },  // K2 Planet
      { wch: 12 },
      { wch: 10 },
      { wch: 8 },
      { wch: 8 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Kundli Export'
    );

    XLSX.writeFile(workbook, 'KundliExport.xlsx');
  }
}