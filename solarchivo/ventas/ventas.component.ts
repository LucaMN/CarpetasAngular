// src/app/ventas/ventas.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  colorPaleta: string[] = [];

  ngOnInit() {
    this.prepareTable();
  }
   
  initializeData(numAgencias: number) {
    const datos = Array.from({ length: 13 }, () => Array.from({ length: numAgencias + 1 }, () => 0));
  }

  genTable1(Nfil: number, Ncol: number, agencies: string[]) {
    const Mes = ["", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    let tStr = "<tr>";
    Ncol++;
    Nfil++;
    for (let c = 0; c < Ncol; c++) {
      tStr += '<th id="BGC"> ' + (c === 0 ? "Mes" : agencies[c - 1]) + ' </th>';
    }
    tStr += "</tr>";

    for (let f = 1; f < Nfil; f++) {
      tStr += "<tr>";
      tStr += '<td id="BGC"> ' + Mes[f] + '</td>';
      for (let c = 1; c < Ncol; c++) {
        tStr += '<td id="BGC"><input class="NF2" name="NFIL" type="text" id="C' + c + "_" + f + '" value="0" (click)="ClkTD(this.id)" (keypress)="myFunction($event)"></td>';
      }
      tStr += "</tr>";
    }
    return tStr;
  }

  prepareTable() {
    const numAgencias = parseInt(prompt("Ingrese la cantidad de agencias:") || '0', 10);
    const agencies: string[] = [];
    this.colorPaleta = [];
    for (let i = 0; i < numAgencias; i++) {
      agencies.push(prompt("Ingrese el nombre de la agencia " + (i + 1) + ":") || '');
      this.colorPaleta.push(this.generateRandomColor());
    }
    this.initializeData(numAgencias);
    const emptyTable = document.getElementById("emptyTable");
    if (emptyTable) {
      emptyTable.innerHTML = this.genTable1(12, numAgencias, agencies);
    }
    this.selGraf();
    this.prepEvent();
  }

  generateRandomColor() {
    return "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
  }

  prepEvent() {
    const x = document.getElementsByClassName("NF2");
    for (let i = 0; i < x.length; i++) {
      x[i].addEventListener("blur", () => this.selGraf());
    }
  }

  findMax() {
    const x = document.getElementsByClassName("NF2");
    let Max = 0;
    for (let i = 0; i < x.length; i++) {
      if (Number((x[i] as HTMLInputElement).value) > Max) {
        Max = Number((x[i] as HTMLInputElement).value);
      }
    }
    return Max;
  }

  findMaxSuma() {
    const x = document.getElementsByClassName("NF2");
    const numAgencias = x.length / 12;
    let Max = 0;

    for (let i = 0; i < 12; i++) {
      let Suma = 0;
      for (let j = 0; j < numAgencias; j++) {
        Suma += Number((x[i * numAgencias + j] as HTMLInputElement).value);
      }
      if (Suma > Max) {
        Max = Suma;
      }
    }
    return Max;
  }

  selGraf() {
    if ((document.getElementById("Lineas") as HTMLInputElement).checked) this.redib();
    if ((document.getElementById("Barras") as HTMLInputElement).checked) this.grafBarras();
    if ((document.getElementById("Apiladas") as HTMLInputElement).checked) this.grafApiladas();
  }

  redib() {
    const Max = this.findMax();
    const numAgencias = document.getElementsByClassName("NF2").length / 12;
    const svgWidth = 12;
  
    let Salida = `<svg Id="P" width="600px" height="400px" viewBox="0 0 ${svgWidth} 100" preserveAspectRatio="none">\n`;
    Salida += '<rect width="100%" height="100%" style="fill:rgb(220,220,220);stroke-width:0.1;stroke:rgb(255,255,0)" />\n';
  
    for (let c = 1; c <= numAgencias; c++) {
      Salida += '<polyline points="';
      let TMP = "";
  
      for (let f = 1; f <= 12; f++) {
        const tId = "C" + c + "_" + f;
        const XG = (svgWidth / 12) * (f - 1);
        const YG = 100 * (1 - Number((document.getElementById(tId) as HTMLInputElement).value) / Max);
        TMP += " " + XG + "," + YG;
      }
      Salida += TMP + '" style="fill:none;stroke:' + this.colorPaleta[c - 1] + ';stroke-width:0.1" />\n';
    }
  
    Salida += '</svg>';
    const grafElement = document.getElementById("Graf");
    if (grafElement) {
      grafElement.innerHTML = Salida;
    }
  }
  

  grafBarras() {
    const Max = this.findMax();
    const x = document.getElementsByClassName("NF2");
    const numAgencias = x.length / 12;
    const svgWidth = 12 * numAgencias * 3;
  
    let Salida = `<svg Id="P" width="600px" height="400px" viewBox="0 0 ${svgWidth} 100" preserveAspectRatio="none" >\n`;
    Salida += '<rect width="100%" height="100%" style="fill:rgb(220,220,220);stroke-width:0.1;stroke:rgb(255,255,0)" />\n';
  
    const barWidth = 2;
    const barGap = 1;
  
    for (let mes = 0; mes < 12; mes++) {
      for (let agencia = 0; agencia < numAgencias; agencia++) {
        const index = mes * numAgencias + agencia;
        const height = 100 * Number((x[index] as HTMLInputElement).value) / Max;
        const y = 100 - height;
        const xPosition = mes * (numAgencias * (barWidth + barGap)) + agencia * (barWidth + barGap);
  
        Salida += '<rect x="' + xPosition + '" y="' + y + '" width="' + barWidth + '" height="' + height + '" style="fill:' + this.colorPaleta[agencia] + ';stroke-width:0.05;stroke:rgb(0,0,0)" />\n';
      }
    }
  
    Salida += '</svg>';
    const grafElement = document.getElementById("Graf");
    if (grafElement) {
      grafElement.innerHTML = Salida;
    }
  }
  

  grafApiladas() {
    const Max = this.findMaxSuma();
    const x = document.getElementsByClassName("NF2");
    const numAgencias = x.length / 12;
    const svgWidth = 12 * (10 + 2);
  
    let Salida = `<svg Id="P" width="600px" height="400px" viewBox="0 0 ${svgWidth} 100" preserveAspectRatio="none" >\n`;
    Salida += '<rect width="100%" height="100%" style="fill:rgb(220,220,220);stroke-width:0.1;stroke:rgb(255,255,0)" />\n';
  
    const barWidth = 10;
    const barGap = 2;
  
    for (let mes = 0; mes < 12; mes++) {
      let yOffset = 0;
      for (let agencia = 0; agencia < numAgencias; agencia++) {
        const index = mes * numAgencias + agencia;
        const altura = 100 * Number((x[index] as HTMLInputElement).value) / Max;
        const y = 100 - (altura + yOffset);
        const xPosicion = mes * (barWidth + barGap);
  
        Salida += '<rect x="' + xPosicion + '" y="' + y + '" width="' + barWidth + '" height="' + altura + '" style="fill:' + this.colorPaleta[agencia] + ';stroke-width:0.05;stroke:rgb(0,0,0)" />\n';
  
        yOffset += altura;
      }
    }
  
    Salida += '</svg>';
    const grafElement = document.getElementById("Graf");
    if (grafElement) {
      grafElement.innerHTML = Salida;
    }
  }
  

  ClkTD(kk: string) {
    (document.getElementById("CLK") as HTMLInputElement).value = kk;
  }

  myFunction(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      (document.getElementById("CLK") as HTMLInputElement).focus();
    }
  }
}
