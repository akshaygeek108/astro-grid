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
  selector: 'venus-chart',
  templateUrl: './venus-chart.component.html',
  styleUrls: ['./venus-chart.component.css']
})
export class VenusChartComponent {
  @ViewChild('kundliContainer1', { static: true }) container1!: ElementRef;
  @ViewChild('kundliContainer2') container2!: ElementRef;  // Not static - created dynamically


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

  ngOnInit() {

  }
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
    // this.resetLayout();
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

    // 🔷 Diagonal 1 (top-left → bottom-right)
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', size)
      .attr('y2', size)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    // 🔷 Diagonal 2 (top-right → bottom-left)
    svg.append('line')
      .attr('x1', size)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', size)
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    // ➖ Line: top center → left center
    svg.append('line')
      .attr('x1', size / 2)   // 200
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', size / 2)   // 200
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    // ➖ Line: top center → right center
    svg.append('line')
      .attr('x1', size / 2)   // 200
      .attr('y1', 0)
      .attr('x2', size)
      .attr('y2', size / 2)   // 200
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    // ➖ Line: bottom center → left center
    svg.append('line')
      .attr('x1', size / 2)   // 200
      .attr('y1', size)      // 400
      .attr('x2', 0)
      .attr('y2', size / 2)   // 200
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);

    // ➖ Line: bottom center → right center
    svg.append('line')
      .attr('x1', size / 2)   // 200
      .attr('y1', size)      // 400
      .attr('x2', size)
      .attr('y2', size / 2)   // 200
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


    const drag = d3.drag<SVGTextElement, any>()
      .on('start', function () {
        d3.select(this).raise();
      })
      .on('drag', function (event, d: any) {
        d.x = event.x;
        d.y = event.y;

        d3.select(this)
          .attr('x', d.x)
          .attr('y', d.y);
      })
      .on('end', () => {

      });


    const self = this;

    const planetDrag = d3.drag<SVGTextElement, PlanetInstance>()
      .on('start', function () {
        d3.select(this).raise();
      })
      .on('drag', function (event, d: PlanetInstance) {
        d.x = event.x;
        d.y = event.y;

        d3.select(this)
          .attr('x', d.x)
          .attr('y', d.y);
      })
      .on('end', function () {

      });

    // FLATTEN ALL PLANETS
    const allPlanets: PlanetInstance[] = [];
    Object.values(this.kundlis[kundliId]).forEach(h =>
      h.forEach(p => allPlanets.push(p))
    );

    // JOIN + ENTER
    const planetsSel = svg.selectAll('.planet')
      .data(allPlanets, (d: any) => d.instanceId);

    // EXIT
    planetsSel.exit().remove();

    // ENTER
    const enter = planetsSel.enter()
      .append('text')
      .attr('class', 'planet')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#000')
      .style('cursor', 'grab')
      .style('user-select', 'none')
      .style('pointer-events', 'all')
      .call(planetDrag)
      .text(d => d.name);

    // UPDATE
    planetsSel
      .attr('x', d => d.x)
      .attr('y', d => d.y);
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
      .style('cursor', 'pointer')
      .style('pointer-events', 'none')   // ✅ MUST BE ALL

    const svgNode = svg.node();

    d3.select(svgNode)
      .on('dragover', (event) => {
        event.preventDefault();
      })
      .on('drop', (event: DragEvent) => {
        event.preventDefault();

        const rect = svgNode.getBoundingClientRect();

        const viewBox = svg.attr('viewBox')!;
        const [, , vbW, vbH] = viewBox.split(' ').map(Number);

        const dropX = (event.clientX - rect.left) * (vbW / rect.width);
        const dropY = (event.clientY - rect.top) * (vbH / rect.height);

        // 🚀 NO ZONE CHECK — FREE DROP ANYWHERE
        self.onDrop(event, 1, dropX, dropY, kundliId);
      });

    svg.selectAll('.house-number')
      .raise();

    // Render planets in houses
    //  this.renderPlanetsInHouses(svg, houseZones, kundliId);
  }



  resetLayout() {
    localStorage.removeItem('kundli-house-layout');
    location.reload();
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

  onDrop(event: DragEvent, houseId: number, dropX: number, dropY: number, kundliId: number = 1) {
    event.preventDefault();

    const data = event.dataTransfer?.getData('planet');
    if (!data) return;

    const planet: Planet = JSON.parse(data);

    // remove old position
    for (let h = 1; h <= 12; h++) {
      this.kundlis[kundliId][h] =
        this.kundlis[kundliId][h].filter(p => p.planetId !== planet.id);
    }

    // ✅ NO HOUSE VALIDATION — free placement
    const instance: PlanetInstance = {
      instanceId: crypto.randomUUID(),
      planetId: planet.id,
      name: planet.name,
      degree: 15,
      x: dropX,
      y: dropY
    };

    // optional: keep houseId only as "last dropped zone" or ignore it
    this.kundlis[kundliId][houseId].push(instance);

    this.drawBase(kundliId);
  }
}
