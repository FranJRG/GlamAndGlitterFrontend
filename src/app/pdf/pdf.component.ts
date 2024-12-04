import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceSummary } from '../interfaces/serviceSummary';
import { SummaryServiceService } from './services/summary-service.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart, registerables } from 'chart.js';
import { Rating } from '../interfaces/rating';
import { CiteService } from '../cites/services/cite.service';
import { SummaryCites } from '../interfaces/summaryCites';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { AverageMedia } from '../interfaces/averageMedia';
import { addDays } from 'date-fns';

Chart.register(...registerables);

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.css',
})
export class PdfComponent implements OnInit {
  serviceSummary: ServiceSummary[] = [];
  reviewsFromService: Rating[] = [];
  lastCites: SummaryCites[] = [];
  bestRatings: Rating[] = [];
  worstRatings: Rating[] = [];
  seeReview: boolean = false;
  porcents!: number[];
  labels!: string[];
  averageMedia!: AverageMedia;
  totalMedia!: AverageMedia;

  sortDate: boolean = false;
  isSortDate: boolean = true;

  constructor(
    private serviceSummaryService: SummaryServiceService,
    private citeService: CiteService,
    private location : Location
  ) {}

  ngOnInit(): void {
    this.getServicesSummary();
    this.getLastCites();
    this.getAverageMedia();
    this.getTotalMedia();
    this.getComparationRatings();
  }

  //Con location podemos volver a la ruta de la que hemos venido
  goBack(){
    this.location.back();
  }

  getServicesSummary() {
    this.serviceSummaryService.getTopServices().subscribe({
      next: (data) => {
        this.serviceSummary = data;
        this.porcents = this.serviceSummary.map(
          (summary) => summary.reservationCount
        );
        this.labels = this.serviceSummary.map((summary) => summary.serviceName + " (" + summary.reservationCount + ")");
        this.createChart();
      },
      error: (err) =>
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  getAverageMedia() {
    this.serviceSummaryService.getAverageMediaLastMonth().subscribe({
      next: (data) => {
        this.averageMedia = data;
        this.createVelocimeter();
      },
      error: (err) =>
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  getComparationRatings() {
    this.serviceSummaryService.getBestRatings().subscribe({
      next: (data) => {
        this.bestRatings = data;
      },
      error: (err) =>
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
    this.serviceSummaryService.getWorstRatings().subscribe({
      next: (data) => {
        this.worstRatings = data;
      },
      error: (err) =>
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  getTotalMedia() {
    this.serviceSummaryService.getTotalMedia().subscribe({
      next: (data) => {
        this.totalMedia = data;
        this.createSecondVelocimeter();
      },
      error: (err) =>
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  createVelocimeter(): void {
    const ctx = document.getElementById(
      'velocimeterChartDownload'
    ) as HTMLCanvasElement;
    const ctx2 = document.getElementById(
      'velocimeterChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Average Score'],
        datasets: [
          {
            label:  `Average Score (${this.averageMedia.averageMedia})`,
            data: [this.averageMedia.averageMedia], // Mostrar la puntuación promedio
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0, // Valor mínimo
            max: 5, // Valor máximo, ajustado para una puntuación de 0 a 5
          },
        },
      },
    });
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Average Score'],
        datasets: [
          {
            label: `Average Score (${this.averageMedia.averageMedia})`,
            data: [this.averageMedia.averageMedia], // Mostrar la puntuación promedio
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0, // Valor mínimo
            max: 5, // Valor máximo, ajustado para una puntuación de 0 a 5
          },
        },
      },
    });
  }

  createSecondVelocimeter(): void {
    const ctx = document.getElementById(
      'secondVelocimeterChartDownload'
    ) as HTMLCanvasElement;
    const ctx2 = document.getElementById(
      'secondVelocimeterChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Average Score'],
        datasets: [
          {
            label: `Average Score (${this.totalMedia.averageMedia})`,
            data: [this.totalMedia.averageMedia], // Mostrar la puntuación promedio
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0, // Valor mínimo
            max: 5, // Valor máximo, ajustado para una puntuación de 0 a 5
          },
        },
      },
    });
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Average Score'],
        datasets: [
          {
            label: `Average Score (${this.totalMedia.averageMedia})`,
            data: [this.totalMedia.averageMedia], // Mostrar la puntuación promedio
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0, // Valor mínimo
            max: 5, // Valor máximo, ajustado para una puntuación de 0 a 5
          },
        },
      },
    });
  }

  createChart() {
    const ctx = document.getElementById('serviceChartDownload') as HTMLCanvasElement;
    const ctx2 = document.getElementById('serviceChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Number of request',
            data: this.porcents,
            backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#bcd400'],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Number of request',
            data: this.porcents,
            backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#bcd400'],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  generatePDF() {
    const reportContainer = document.getElementById('reportContainer');
    if (reportContainer) {

      reportContainer.classList.remove("hidden");
      reportContainer.classList.remove("z-index-behind");
      

      html2canvas(reportContainer as HTMLElement, { scale: 2 }).then(
        (canvas) => {
          const pdf = new jsPDF('p', 'mm', 'a4'); // Formato A4 en orientación vertical
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          const imgWidth = pdfWidth; // Ancho de la imagen ajustado al ancho del PDF
          const imgHeight = (canvas.height * pdfWidth) / canvas.width; // Altura proporcional de la imagen en el PDF
          const pageHeightPx = (pdfHeight * canvas.width) / pdfWidth; // Altura de la página en píxeles del canvas original

          let position = 0; // Posición inicial en el canvas original
          const totalPages = Math.ceil(canvas.height / pageHeightPx); // Número total de páginas necesarias

          for (let page = 0; page < totalPages; page++) {
            const pageCanvas = document.createElement('canvas');
            const ctx = pageCanvas.getContext('2d');

            // Configuramos el tamaño del canvas para cada fragmento
            pageCanvas.width = canvas.width;
            pageCanvas.height = Math.min(
              pageHeightPx,
              canvas.height - position
            ); // Altura restante o tamaño de la página

            // Dibujamos la parte visible para la página actual
            ctx?.drawImage(
              canvas,
              0,
              position, // Posición Y de inicio en el canvas original
              canvas.width,
              pageCanvas.height, // Altura que estamos copiando
              0,
              0,
              pageCanvas.width,
              pageCanvas.height
            );

            const imgData = pageCanvas.toDataURL('image/png'); // Convertimos el fragmento en una imagen
            pdf.addImage(
              imgData,
              'PNG',
              0,
              0,
              imgWidth,
              (pageCanvas.height * pdfWidth) / canvas.width
            ); // Añadimos la imagen al PDF

            position += pageHeightPx; // Avanzamos en el contenido original

            if (page < totalPages - 1) {
              pdf.addPage(); // Añadimos una nueva página si no es la última
            }
          }

          pdf.save('services-report.pdf');
        }
      );
      reportContainer.classList.add("hidden");
      reportContainer.classList.add("z-index-behind");
    }
  }

  getRatingFromService(id: number) {
    this.citeService.getRatingService(id).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.reviewsFromService = data;
          this.seeReview = !this.seeReview;
        } else {
          Toastify({
            text: 'This service no have ratings yet!',
            duration: 3000,
            gravity: 'bottom',
            position: 'center',
            style: {
              fontSize: '18px',
            },
            backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
          }).showToast();
        }
      },
      error: (err) => console.error(err.error.message),
    });
  }

  /**
   * Método para obtener una fecha formateada en formato HH:mm:ss de java time
   * @param date
   * @returns
   */
  getFormattedDate(date: string): string {
    const newDate = new Date(date); // Crea el objeto Date con la fecha
    const newDateWithAddedDay = addDays(newDate, 1);

    // Formateamos la fecha agregando ceros a las partes de la fecha
    const fechaFormateada = `${newDateWithAddedDay.getFullYear()}-${(
      newDateWithAddedDay.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${newDateWithAddedDay
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    return fechaFormateada;
  }

  getLastCites() {
    this.serviceSummaryService.getCitesInLathMonth().subscribe({
      next: (data) => {
        this.lastCites = data;
      },
      error: (err) =>
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    });
  }

  /**
   * Ordenar la tabla por fecha
   * Llamaremos al boolean para comprobar si es la primera vez que le damos a ordenar (visual html)
   * Comprobamos si esta ordenado asc o desc (isSortDate) en funcion de lo que nos devuelva ordenamos
   * Cambiamos el valor de isSortDate para altenar cada vez que el usuario haga click
   */
  sortByDate(): void {
    if (!this.sortDate) {
      this.sortDate = true;
    }

    this.lastCites.sort((a, b) => {
      const dateA = new Date(a.day).getTime();
      const dateB = new Date(b.day).getTime();

      if (this.isSortDate) {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    this.isSortDate = !this.isSortDate;
  }
}