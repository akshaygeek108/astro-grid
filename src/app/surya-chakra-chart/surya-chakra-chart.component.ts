import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

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
}

interface Zone {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

@Component({
  selector: 'surya-chakra-chart',
  templateUrl: './surya-chakra-chart.component.html',
  styleUrls: ['./surya-chakra-chart.component.css']
})
export class SuryaChakraChartComponent {


  planets: Planet[] = [
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
  @ViewChild('kundliContainer1', { static: true }) container1!: ElementRef;
  @ViewChild('kundliContainer2') container2!: ElementRef;

  centerLabels: Record<number, string> = { 1: '', 2: '' };

  readonly SIZE = 400;

  kundli2Enabled = false;

  kundlis: Record<number, Record<number, PlanetInstance[]>> = {
    1: this.createEmpty(),
    2: this.createEmpty()
  };

  ngAfterViewInit() {
    this.drawBase(1);
    if (this.kundli2Enabled) this.drawBase(2);
  }

  // -------------------------
  // INIT HELPERS
  // -------------------------

  private createEmpty() {
    return Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [i + 1, []])
    ) as Record<number, PlanetInstance[]>;
  }

  // -------------------------
  // KUNDLI MANAGEMENT
  // -------------------------

  addKundli() {
    this.kundli2Enabled = true;
    setTimeout(() => this.drawBase(2));
  }

  deleteKundli() {
    this.kundli2Enabled = false;
    this.kundlis[2] = this.createEmpty();
    this.centerLabels[2] = '';

    if (this.container2) {
      d3.select(this.container2.nativeElement).selectAll('*').remove();
    }
  }

  resetGrid() {
    this.kundlis = { 1: this.createEmpty(), 2: this.createEmpty() };
    this.drawBase(1);
    if (this.kundli2Enabled) this.drawBase(2);
  }

  // -------------------------
  // DRAG START
  // -------------------------

  onDragStart(event: DragEvent, planet: Planet, kundliId: number) {
    event.dataTransfer?.setData('planet', JSON.stringify(planet));
  }

  // -------------------------
  // BASE RENDER
  // -------------------------

  drawBase(kundliId: number = 1) {
    const container = this.getContainer(kundliId);
    if (!container) return;

    const size = this.SIZE;

    const svg = this.createSvg(container, size);

    this.drawGrid(svg, size);
    this.drawDiagonals(svg, size);
    this.drawCenter(svg, size, kundliId);
    this.drawDropZones(svg, container, kundliId);
    this.renderPlanets(svg, kundliId);
  }

  private getContainer(id: number) {
    return id === 1 ? this.container1 : this.container2;
  }

  private createSvg(container: ElementRef, size: number) {
    d3.select(container.nativeElement).selectAll('*').remove();

    return d3.select(container.nativeElement)
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .attr('viewBox', `0 0 ${size} ${size}`)
      .style('background', '#fffafc');
  }

  // -------------------------
  // GRID
  // -------------------------

  private drawGrid(svg: any, size: number) {
    svg.append('rect')
      .attr('width', size)
      .attr('height', size)
      .attr('fill', 'none')
      .attr('stroke', 'orange');

    [1, 2].forEach(i => {
      const pos = (size * i) / 3;

      svg.append('line').attr('x1', pos).attr('y1', 0).attr('x2', pos).attr('y2', size).attr('stroke', 'orange');
      svg.append('line').attr('x1', 0).attr('y1', pos).attr('x2', size).attr('y2', pos).attr('stroke', 'orange');
    });
  }

  private drawDiagonals(svg: any, size: number) {
    const c = size / 3;

    const lines = [
      [0, 0, c, c],
      [size, 0, 2 * c, c],
      [c, 2 * c, 0, size],
      [2 * c, 2 * c, size, size]
    ];

    lines.forEach(([x1, y1, x2, y2]) => {
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', 'orange');
    });
  }

  // -------------------------
  // CENTER TEXT
  // -------------------------
  private drawCenter(svg: any, size: number, id: number) {

    const textValue = this.centerLabels[id] || '';
    const maxWidth = size / 3 - 12;
    const lineHeight = 18;

    const centerX = size / 2;
    const centerY = size / 2;

    const text = svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '18px')
      .attr('fill', '#c2185b')
      .style('pointer-events', 'none');

    const words = textValue.split(/\s+/).filter(Boolean);

    let line: string[] = [];
    let lineNumber = 0;

    const createTspan = (t: string, dy: number) => {
      return text.append('tspan')
        .attr('x', centerX)
        .attr('dy', dy)
        .text(t);
    };

    let tspan = createTspan('', 0);

    words.forEach(word => {
      line.push(word);

      tspan.text(line.join(' '));

      if (tspan.node()!.getComputedTextLength() > maxWidth) {
        line.pop(); // remove last word

        tspan.text(line.join(' '));

        line = [word];
        tspan = createTspan(word, lineNumber === 0 ? lineHeight : lineHeight);
        lineNumber++;
      }
    });

    // -------------------------
    // DOUBLE CLICK (unchanged)
    // -------------------------
    svg.on('dblclick', (event: MouseEvent) => {
      const cell = size / 3;

      if (
        event.offsetX < cell ||
        event.offsetX > 2 * cell ||
        event.offsetY < cell ||
        event.offsetY > 2 * cell
      ) return;

      const input = prompt('Enter Rashi text (max 20 characters):');

      if (input !== null) {
        const trimmed = input.length > 20 ? input.slice(0, 20) : input;
        this.centerLabels[id] = trimmed;
        this.drawBase(id);
      }
    });
  }

  // -------------------------
  // DROP ZONES
  // -------------------------

  private drawDropZones(svg: any, container: ElementRef, kundliId: number) {
    const zones: Zone[] = this.getZones();
    const self = this;

    svg.selectAll('.dropzone')
      .data(zones)
      .enter()
      .append('rect')
      .attr('class', 'dropzone')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .attr('fill', 'transparent')
      .on('dragover', (e: DragEvent) => e.preventDefault())
      .on('drop', function (event: DragEvent, d: Zone) {

        const svgElement = container.nativeElement.querySelector('svg');
        const rect = svgElement.getBoundingClientRect();

        const dropX = event.clientX - rect.left;
        const dropY = event.clientY - rect.top;

        self.onDrop(event, d.id, dropX, dropY, kundliId);
      });
  }

  // -------------------------
  // PLANETS RENDER
  // -------------------------

  private renderPlanets(svg: any, kundliId: number) {
    const zones = this.getZones();
    const data = this.kundlis[kundliId];

    zones.forEach(zone => {
      const planets = data[zone.id] || [];

      planets.forEach((p, index) => {

        const drag = d3.drag()
          .on('drag', function (event: any) {
            d3.select(this)
              .attr('x', event.x)
              .attr('y', event.y);
          })
          .on('end', function (event: any) {
            p.x = event.x;
            p.y = event.y;
            data[zone.id][index] = p;
          });

        svg.append('text')
          .attr('x', p.x || zone.x + zone.w / 2)
          .attr('y', p.y || zone.y + zone.h / 2)
          .text(p.name)
          .style('cursor', 'grab')
          .call(drag);
      });
    });
  }

  // -------------------------
  // DROP HANDLER
  // -------------------------

  onDrop(event: DragEvent, houseId: number, dropX?: number, dropY?: number, kundliId: number = 1) {
    const raw = event.dataTransfer?.getData('planet');
    if (!raw || houseId === 1) return;

    const planet: Planet = JSON.parse(raw);

    for (let h = 1; h <= 12; h++) {
      this.kundlis[kundliId][h] =
        this.kundlis[kundliId][h].filter(p => p.planetId !== planet.id);
    }

    this.kundlis[kundliId][houseId].push({
      instanceId: crypto.randomUUID(),
      planetId: planet.id,
      name: planet.name,
      degree: 15,
      x: dropX ?? 0,
      y: dropY ?? 0
    });

    this.drawBase(kundliId);
  }

  // -------------------------
  // ZONES
  // -------------------------

  private getZones(): Zone[] {
    return [
      { id: 1, x: 150, y: 150, w: 100, h: 100 },
      { id: 2, x: 150, y: 0, w: 100, h: 100 },
      { id: 3, x: 300, y: 0, w: 100, h: 200 },
      { id: 4, x: 300, y: 150, w: 100, h: 100 },
      { id: 5, x: 300, y: 300, w: 100, h: 100 },
      { id: 6, x: 150, y: 300, w: 100, h: 100 },
      { id: 7, x: 0, y: 300, w: 100, h: 100 },
      { id: 8, x: 0, y: 150, w: 100, h: 100 },
      { id: 9, x: 0, y: 0, w: 100, h: 100 },
      { id: 10, x: 250, y: 50, w: 50, h: 50 },
      { id: 11, x: 250, y: 250, w: 50, h: 50 },
      { id: 12, x: 50, y: 250, w: 50, h: 50 }
    ];
  }
}