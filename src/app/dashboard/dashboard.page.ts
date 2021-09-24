import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  chartData: ChartDataSets[] = [
    {
      data: [],
      label: ''
    }
  ];

  chartLabels: Label[];

  chartOptions = {
    responsive: true,
    title: {
      display: true,
      text: ''
    },
    pan: {
      enable: true,
      mode: 'xy'
    },
    zoom: {
      enable: true,
      mode: 'xy'
    }
  };

  chartColors: Color[] = [
    {
      borderColor: '#000000',
      backgroundColor: '#ff00ff'
    }
  ];

  chartType = 'line';
  showLegend = false;
  stock = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  getData() {
      this.http.get(`https://financialmodelingprep.com/api/v3/historical-price-full/
      ${this.stock}?from=2018-03-12&to=2019-03-12&apikey=9ad060530040031c876ce5ba819efbe4`).subscribe(res => {
      const history = res['historical'];

      this.chartLabels = [];
      this.chartData[0].data = [];

      for (const entry of history) {
        this.chartLabels.push(entry.date);
        this.chartData[0].data.push(entry['close']);
      }
    });
  }

  typeChanged(e) {
    const on = e.detail.checked;
    this.chartType = on ? 'line' : 'bar';
  }
}

