<template>
  <div>
    <div class="bg-grey-deep-dark rounded shadow sticky head">
      <div class="p-1 text-center">
        <br />
        <h1>Tilgungsplanner</h1>
        <br />
        <small class="text-justify">
          {{formatPercent(credit.zinsen)}} Zinsen
          / {{formatPercent(credit.tilgung)}} Tilgung
        </small>
        <br />
        <h1>
          323.000,00€
          <small>/ {{formatCurrency(credit.darlehen)}}</small>
        </h1>
        <br />
      </div>
    </div>
    <div class="p-1 not-mobile">
      <div class="bg-white rounded shadow">
        <br />
        <br />
        <br />
        <div class="p-1">
          <br />
          <h3>
            Laufzeit 20 Jahre
            <small
              class="pull-right"
            >{{formatCurrency(credit.sondertilgung)}} Sondertilgung</small>
          </h3>
          <br />
          <h6>Gesamtlaufzeit {{credit.yearCount}} Jahre</h6>
          <tablerow
            cssClass="b-t-b m-3"
            :items="[
{titel:'Monat',value: credit.range.count},
{titel:'Rate',value: formatCurrency(credit.rate)},
{titel:'Restschuld',value: formatCurrency(credit.range.open)}
]"
          ></tablerow>
          <div class="rounded bg-grey-light m-3 shadow">
            <div class="table-row">
              <div class="table-cell p-1 w-auto">
                <h1 class="fab warn">20</h1>
              </div>
              <div class="table-cell p-1">
                <h2>Gezahlt in der Laufzeit von 20 Jahren.</h2>
                <h3>Gesamtausgaben: {{formatCurrency(credit.range.rate)}}</h3>
              </div>
            </div>
            <tablerow
              :items="[
{titel:'Zinsen',value: formatCurrency(credit.range.zinsen)},
{titel:'Tilgung',value: formatCurrency(credit.range.tilgung)},
{titel:'Raten',value: formatCurrency(credit.range.rate)}
]"
            ></tablerow>
          </div>
        </div>
      </div>
      <br />
      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="200px"
        class="chart"
        preserveAspectRatio="none"
      >
        <g transform="translate(10,5)">
          <path
            d="m 0,0 0,110"
            fill="none"
            stroke-linecap="round"
            stroke="#00000066"
            stroke-width=".6"
          />
          <path
            d="m 0,110 100,0"
            fill="none"
            stroke-linecap="round"
            stroke="#00000066"
            stroke-width="1"
          />
          <polyline
            class="path"
            v-for="(g,i) in grapth"
            :key="i"
            fill="none"
            stroke-linecap="round"
            :stroke="g.color"
            stroke-width="2"
            :points="g.points.join(' ')"
          />
        </g>
      </svg>
      <tablerow
        cssClass="text-center"
        :items="[
{titel:'Zinsen',value: formatCurrency(this.grapth.c.from) + '/' + formatCurrency(this.grapth.c.to), color:this.grapth.c.color },
{titel:'Tilgung',value: formatCurrency(this.grapth.b.from) + '/' + formatCurrency(this.grapth.b.to), color:this.grapth.b.color },
{titel:'Darlehen',value:formatCurrency(this.grapth.a.from) + '/' + formatCurrency(this.grapth.a.to), color:this.grapth.a.color }
]"
      ></tablerow>
      <br />
      <div class="bg-blue rounded shadow">
        <div class="p-1">
          <div class="table-row">
            <div class="table-cell p-1 w-auto">
              <h1 class="fab accent">{{credit.yearCount.toFixed(0)}}</h1>
            </div>
            <div class="table-cell p-1">
              <h2>Gezahlt in der Laufzeit von {{credit.yearCount}} Jahren.</h2>
              <h3>Gesamtausgaben: {{formatCurrency(credit.rangeComplete.rate)}}</h3>
            </div>
          </div>
          <tablerow
            :items="[
{titel:'Zinsen',value: formatCurrency(credit.rangeComplete.zinsen)},
{titel:'Tilgung',value: formatCurrency(credit.rangeComplete.tilgung)},
{titel:'Raten',value: formatCurrency(credit.rangeComplete.rate)}
]"
          ></tablerow>
        </div>
      </div>
    </div>
    <div class="sticky bottom">
      <router-link class="fab bg-grey-deep-dark pull-right shadow" to="/settings">S</router-link>
    </div>
  </div>
</template>

<script>
import tablerow from "@/components/tablerow.vue";

export default {
  name: "app",
  components: {
    tablerow
  },
  data: function() {
    return {
      grapth: {
        a: {
          points: [],
          from: 0,
          to: 0,
          color: "#0074d9"
        },
        b: {
          points: [],
          from: 0,
          to: 0,
          color: "#ff74d9"
        },
        c: {
          points: [],
          from: 0,
          to: 0,
          color: "#aa74d9"
        }
      },
      credit: {
        darlehen: 500000,
        zinsen: 2,
        tilgung: 2,
        rate: 0,
        gezahlt: 0,
        offen: 0,
        yearCount: 0,
        monthCount: 0,
        sondertilgung: 0,
        data: [],
        range: {
          zinsen: 0,
          tilgung: 0,
          rate: 0
        },
        rangeComplete: {
          zinsen: 0,
          tilgung: 0,
          rate: 0
        }
      }
    };
  },
  mounted() {
    if (localStorage.darlehen)
      this.credit.darlehen = parseFloat(localStorage.darlehen);

    if (localStorage.zinsen) this.credit.zinsen = localStorage.zinsen;
    if (localStorage.tilgung) this.credit.tilgung = localStorage.tilgung;
    if (localStorage.sondertilgung)
      this.credit.sondertilgung = parseFloat(localStorage.sondertilgung);

    this.credit = this.creditlistbuild(
      this.credit.darlehen,
      this.credit.zinsen,
      this.credit.tilgung,
      this.credit.sondertilgung
    );

    this.grapth.a.points = [];
    this.grapth.b.points = [];
    this.grapth.c.points = [];

    let firstTilgung = this.credit.data[0].tilgung;
    let firstZinsen = this.credit.data[0].zinsen;

    let twentyYears = this.credit.data;
    twentyYears.map((val, i) => {
      if (i <= 240) {
        this.credit.range.zinsen += val.zinsen;
        this.credit.range.tilgung += val.tilgung;
        this.credit.range.rate += val.rate;
      }
      this.credit.rangeComplete.zinsen += val.zinsen;
      this.credit.rangeComplete.tilgung += val.tilgung;
      this.credit.rangeComplete.rate += val.rate;

      let y = 100 - (val.darlehen * 100) / this.credit.darlehen;
      let x = (i * 100) / twentyYears.length;
      this.grapth.a.points.push([x.toFixed(2), y.toFixed(2)]);

      y = (firstTilgung * 100) / val.tilgung;
      x = (i * 100) / twentyYears.length;
      this.grapth.b.points.push([x.toFixed(2), y.toFixed(2)]);

      y = 110 - (val.zinsen * 100) / firstZinsen;
      x = (i * 100) / twentyYears.length;
      this.grapth.c.points.push([x.toFixed(2), y.toFixed(2)]);
    });

    this.grapth.a.from = this.credit.data[0].darlehen;
    this.grapth.a.to = this.credit.data[this.credit.monthCount - 1].darlehen;

    this.grapth.b.from = this.credit.data[0].tilgung;
    this.grapth.b.to = this.credit.data[this.credit.monthCount - 1].tilgung;

    this.grapth.c.from = this.credit.data[0].zinsen;
    this.grapth.c.to = this.credit.data[this.credit.monthCount - 1].zinsen;

    this.credit.range.open = this.credit.darlehen - this.credit.range.rate;
  },

  methods: {
    creditlistbuild: function(Darlehen, Zinsen, Tilgung, Sondertilgung) {
      let credit = {
        darlehen: 500000,
        zinsen: 2,
        tilgung: 2,
        rate: 0,
        gezahlt: 0,
        offen: 0,
        yearCount: 0,
        monthCount: 0,
        sondertilgung: 0,
        data: [],
        range: {
          zinsen: 0,
          tilgung: 0,
          rate: 0,
          open: 0,
          count: 240
        },
        rangeComplete: {
          zinsen: 0,
          tilgung: 0,
          rate: 0
        }
      };
      let list = [];
      let index = 1;
      let currentDarlehen = Darlehen;
      let allDarlehen = Darlehen;
      let currentZinsen = Zinsen;
      let currentTilgung = Tilgung;
      let currentSondertilgung = Sondertilgung;

      credit.sondertilgung = currentSondertilgung;
      credit.darlehen = currentDarlehen;
      credit.zinsen = currentZinsen;
      credit.tilgung = currentTilgung;

      do {
        let row = {};
        row.index = index++;
        row.darlehen = currentDarlehen;
        row.sondertilgung = 0;
        row.zinsen = 0;
        row.tilgung = 0;
        row.rate = 0;
        row.year = null;

        if (currentDarlehen == allDarlehen) {
          row.zinsen = (currentDarlehen * (currentZinsen / 100)) / 12;
          row.tilgung = (currentDarlehen * (currentTilgung / 100)) / 12;
          row.rate = row.zinsen + row.tilgung;
          if (credit.rate == 0) credit.rate = row.rate;
        } else {
          const lastRow = list[list.length - 1];
          row.zinsen = (currentDarlehen * (currentZinsen / 100)) / 12;
          row.rate = lastRow.rate;
          row.tilgung = row.rate - row.zinsen;
        }

        if (list.length % 12 == 0) {
          row.year = list.length / 12 + 1;
          row.sondertilgung = currentSondertilgung;
        }

        currentDarlehen = currentDarlehen - (row.tilgung + row.sondertilgung);
        list.push(row);
      } while (currentDarlehen > 0);

      credit.yearCount = parseFloat((list.length / 12).toFixed(1));
      credit.monthCount = list.length;
      credit.data = list;

      return credit;
    },
    formatPercent(a) {
      return parseFloat(a / 100).toLocaleString("de-DE", {
        style: "percent",
        minimumFractionDigits: 2
      });
    },
    formatCurrency(a) {
      if (a == undefined) a = 0;

      return a.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR"
      });
    },
    settings: function() {},
    sum: function(index, attribute) {
      let _sum = 0;
      this.months.map(function(value) {
        if (parseInt(index) >= parseInt(value["index"])) {
          _sum += value[attribute];
        }
      });
      this.showSum = _sum;
    }
  }
};
</script>

 