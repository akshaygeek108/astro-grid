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
  x: number;  // X position within the house
  y: number; // Y position within the house
}

@Component({
  selector: 'surya-chakra-chart',
  templateUrl: './surya-chakra-chart.component.html',
  styleUrls: ['./surya-chakra-chart.component.css']
})
export class SuryaChakraChartComponent {
  @ViewChild('kundliContainer1', { static: true }) container1!: ElementRef;
  @ViewChild('kundliContainer2') container2!: ElementRef;  // Not static - created dynamically
  centerLabels: Record<number, string> = {
    1: '',
    2: ''
  };
  planets = [
    { id: 'sun', name: 'Su' },        // ☉ Surya
    { id: 'moon', name: 'Mo' },       // ☽ Chandra
    { id: 'mars', name: 'Ma' },       // ♂ Mangal
    { id: 'mercury', name: 'Me' },    // ☿ Budh
    { id: 'jupiter', name: 'Ju' },    // ♃ Guru
    { id: 'venus', name: 'Ve' },      // ♀ Shukra
    { id: 'saturn', name: 'Sa' },     // ♄ Shani
    { id: 'rahu', name: 'Ra' },       // ☊ North Node
    { id: 'ketu', name: 'Ke' },        // ☋ South Node
    { id: 'ascendant', name: 'As' }        // ☋ South Node
  ];

  houses = [{ id: '1', name: '1' }, { id: '2', name: '2' }, { id: '3', name: '3' }, { id: '4', name: '4' }, { id: '5', name: '5' }, { id: '6', name: '6' }, { id: '7', name: '7' }, { id: '8', name: '8' }, { id: '9', name: '9' }, { id: '10', name: '10' }, { id: '11', name: '11' }, { id: '12', name: '12' }]

  // Two kundlis: kundli1 (default) and kundli2 (optional)
  kundli2Enabled = false;

  kundlis: Record<number, Record<number, PlanetInstance[]>> = {
    1: {
      1: [], 2: [], 3: [], 4: [],
      5: [], 6: [], 7: [], 8: [],
      9: [], 10: [], 11: [], 12: []
    },
    2: {
      1: [], 2: [], 3: [], 4: [],
      5: [], 6: [], 7: [], 8: [],
      9: [], 10: [], 11: [], 12: []
    }
  };

  activeKundliId = 1;

  ngAfterViewInit() {
    this.drawBase(1);
    if (this.kundli2Enabled) {
      this.drawBase(2);
    }
  }

  // Add second kundli
  addKundli() {
    if (!this.kundli2Enabled) {
      this.kundli2Enabled = true;
      setTimeout(() => this.drawBase(2), 0);
    }
  }

  // Delete second kundli
  deleteKundli() {
    this.kundli2Enabled = false;
    // Clear kundli 2 data
    for (let houseId = 1; houseId <= 12; houseId++) {
      this.kundlis[2][houseId] = [];
    }
    // Clear the container
    if (this.container2) {
      this.centerLabels[2] = '';
      d3.select(this.container2.nativeElement).selectAll('*').remove();
    }
  }

  // Custom drag start - only transfer text, not the element
  onDragStart(event: DragEvent, planet: Planet, kundliId: number) {
    console.log('Drag started:', planet.name, 'for kundli:', kundliId);
    // Set drag data with kundli ID
    event.dataTransfer?.setData('text/plain', planet.name);
    event.dataTransfer?.setData('planet', JSON.stringify(planet));
    event.dataTransfer?.setData('kundliId', kundliId.toString());
    event.dataTransfer!.effectAllowed = 'copy';
    event.dataTransfer!.dropEffect = 'copy';
  }

  // Reset both grids
  resetGrid() {
    for (let k = 1; k <= 2; k++) {
      for (let houseId = 1; houseId <= 12; houseId++) {
        this.kundlis[k][houseId] = [];
      }
    }
    this.drawBase(1);
    if (this.kundli2Enabled) {
      this.drawBase(2);
    }
  }

  // Draw base for a specific kundli
  drawBase(kundliId: number = 1) {
    const container = kundliId === 1 ? this.container1 : this.container2;
    if (!container) return;

    const size = 400;

    // clear old render
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
      .style('background', '#fffafc'); // soft pinkish background (easy on eyes)

    // 🟦 Square
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', size)
      .attr('height', size)
      .attr('fill', 'none')
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    // 🔥 Vertical line 1 (1/3)
    svg.append('line')
      .attr('x1', size / 3)
      .attr('y1', 0)
      .attr('x2', size / 3)
      .attr('y2', size)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    // 🔥 Vertical line 2 (2/3)
    svg.append('line')
      .attr('x1', (size * 2) / 3)
      .attr('y1', 0)
      .attr('x2', (size * 2) / 3)
      .attr('y2', size)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    svg.append('line')
      .attr('x1', 0)
      .attr('y1', size / 3)
      .attr('x2', size)
      .attr('y2', size / 3)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    // 🔥 Horizontal line 2 (2/3 height)
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', (size * 2) / 3)
      .attr('x2', size)
      .attr('y2', (size * 2) / 3)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);
    const centerText = svg.append('text')
      .attr('x', size / 2)
      .attr('y', size / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '22px')
      .attr('font-weight', '600')
      .attr('fill', '#c2185b')
      .style('pointer-events', 'none')
      .text(this.centerLabels[kundliId] || '');


    svg.on('dblclick', (event: MouseEvent) => {
      const cell = size / 3;

      const x = event.offsetX;
      const y = event.offsetY;

      const isCenter =
        x > cell && x < 2 * cell &&
        y > cell && y < 2 * cell;

      if (!isCenter) return;

      const userText = prompt('Enter Rashi text:');

      if (userText !== null) {
        this.centerLabels[kundliId] = userText;  // 🔥 store per kundli
        this.drawBase(kundliId);                 // 🔥 redraw ONLY that chart
      }
    });
    const cell = size / 3;
    // Top Left (0,0)
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', cell)
      .attr('y2', cell)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    svg.append('line')
      .attr('x1', size)
      .attr('y1', 0)
      .attr('x2', 2 * cell)
      .attr('y2', cell)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    svg.append('line')
      .attr('x1', cell)
      .attr('y1', 2 * cell)
      .attr('x2', 0)
      .attr('y2', size)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    svg.append('line')
      .attr('x1', 2 * cell)
      .attr('y1', 2 * cell)
      .attr('x2', size)
      .attr('y2', size)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);
    const houseZones = [
      { id: 1, x: 150, y: 150, w: 100, h: 100 },  // Center
      { id: 2, x: 150, y: 0, w: 100, h: 100 },    // Top center
      { id: 3, x: 300, y: 0, w: 100, h: 200 },    // Top right (large)
      { id: 4, x: 300, y: 150, w: 100, h: 100 },  // Right center
      { id: 5, x: 300, y: 300, w: 100, h: 100 },  // Bottom right
      { id: 6, x: 150, y: 300, w: 100, h: 100 },  // Bottom center
      { id: 7, x: 0, y: 300, w: 100, h: 100 },    // Bottom left
      { id: 8, x: 0, y: 150, w: 100, h: 100 },    // Left center
      { id: 9, x: 0, y: 0, w: 100, h: 100 },      // Top left
      { id: 10, x: 250, y: 50, w: 50, h: 50 },    // Extra zone 1
      { id: 11, x: 250, y: 250, w: 50, h: 50 },   // Extra zone 2
      { id: 12, x: 50, y: 250, w: 50, h: 50 }     // Extra zone 3
    ];

    const self = this;

    svg.selectAll('.dropzone')
      .data(houseZones)
      .enter()
      .append('rect')
      .attr('class', 'dropzone')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .attr('fill', 'transparent')
      .attr('stroke', 'transparent')
      .attr('data-house', d => d.id)
      .style('cursor', 'pointer')
      .on('dragover', (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'copy';
      })
      .on('dragleave', function () {
        d3.select(this).attr('fill', 'transparent');
      })
      .on('drop', function (event: DragEvent) {
        event.preventDefault();
        const houseId = d3.select(this).attr('data-house');

        // Get the drop position relative to the SVG
        const svgElement = container.nativeElement.querySelector('svg');
        if (!svgElement) return;
        const svgRect = svgElement.getBoundingClientRect();

        // Calculate position within the house zone
        const dropX = event.clientX - svgRect.left;
        const dropY = event.clientY - svgRect.top;

        console.log('Drop on kundli:', kundliId, 'house:', houseId, 'at position:', dropX, dropY);
        if (houseId) {
          self.onDrop(event, parseInt(houseId), dropX, dropY, kundliId);
        }
      });

    // Render planets in houses
    this.renderPlanetsInHouses(svg, houseZones, kundliId);
  }

  // Render planets that have been dropped into houses
  renderPlanetsInHouses(svg: any, houseZones: any[], kundliId: number) {
    const planetsInHouses = this.kundlis[kundliId];

    houseZones.forEach(zone => {
      const planets = planetsInHouses[zone.id] || [];
      if (planets.length === 0) return;

      planets.forEach((planet: PlanetInstance) => {
        // Use the stored position if available, otherwise use center
        const x = planet.x > 0 ? planet.x : zone.x + (zone.w / 2);
        const y = planet.y > 0 ? planet.y : zone.y + (zone.h / 2);

        svg.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '14px')
          .attr('font-weight', '600')
          .attr('fill', '#000000')
          .style('pointer-events', 'none')
          .text(planet.name);
      });
    });
  }

  onDrop(event: DragEvent, houseId: number, dropX?: number, dropY?: number, kundliId: number = 1) {
    debugger
    event.preventDefault();
    console.log('Drop handler called for kundli:', kundliId, 'house:', houseId, 'at position:', dropX, dropY);

    const data = event.dataTransfer?.getData('planet');
    console.log('Drop data:', data);
    if (!data) return;

    if (houseId === 1) {
      console.log('Drop not allowed in center');
      return;
    }
    const planet: Planet = JSON.parse(data);
    console.log('Parsed planet:', planet);

    // Remove planet from ANY house in the SAME kundli only (move logic within kundli)
    for (let h = 1; h <= 12; h++) {
      this.kundlis[kundliId][h] = this.kundlis[kundliId][h].filter(
        p => p.planetId !== planet.id
      );
    }

    // Create new instance in the target house at the drop position
    const instance: PlanetInstance = {
      instanceId: crypto.randomUUID(),
      planetId: planet.id,
      name: planet.name,
      degree: 15,
      x: dropX ?? 0,  // Use drop position or default to center
      y: dropY ?? 0
    };

    // Add to target kundli's house
    this.kundlis[kundliId][houseId].push(instance);
    console.log('Planet added to kundli:', kundliId, 'house:', houseId, 'Total:', this.kundlis[kundliId][houseId].length);

    // Redraw to show the planet in the house
    this.drawBase(kundliId);
  }
}
