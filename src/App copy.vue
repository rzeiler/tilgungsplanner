<template>
  <div id="app" class="rounded">
    <div class="rounded">
      <div class="fixed head rounded-bottom z-index-3 shadow">
        <h1>{{offen.toLocaleString(local,currencyFormat)}}</h1>
        <span>Aktuell noch offen</span>
        <!-- </div>
        <div class="head rounded-bottom shadow" style="margin-top:-10px;">-->
        <div class="row rounded shadow bg-white m-1">
          <div class="col rounded bg-grey shadow z-index-2 text-dark p-2">
            <h5>Zinsen</h5>
            <span>{{zinsen.toLocaleString(local, { style: 'percent',minimumFractionDigits:2 }) }}</span>
          </div>
          <div class="col text-dark p-2">
            <h5>Darlehen</h5>
            <span>{{darlehen.toLocaleString(local, currencyFormat) }}</span>
          </div>
          <div class="col rounded bg-grey shadow z-index-2 text-dark p-2">
            <h5>Tilgung</h5>
            <span>{{tilgung.toLocaleString(local, { style: 'percent', minimumFractionDigits:2 }) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white">
        <h2>Laufzeit</h2>
        <p>{{gesamtjahr.toFixed(1)}} Jahr(e) / {{months.length}} Monat(e)</p>

        <h4 class="display-4">Details</h4>

        <div class="card m-3">
          <div class="card-body">
            <h5 class="card-title">Nach 20 Jahren Laufzeit</h5>
            <p class="card-text"></p>
            <div class="row">
              <div class="col">Darlehen</div>
              <div class="col">{{gezahltinlaufzeit.toLocaleString(local,currencyFormat)}}</div>
            </div>
            <div class="row">
              <div class="col">Zinsen</div>
              <div class="col">{{zinseninlaufzeit.toLocaleString(local,currencyFormat)}}</div>
            </div>
            <div class="row">
              <div class="col">Tilgung</div>
              <div class="col">{{tilgunginlaufzeit.toLocaleString(local,currencyFormat)}}</div>
            </div>
          </div>
        </div>
        <div class="card m-3">
          <div class="card-body">
            <h5 class="card-title">Restlaufzeit</h5>
            <p class="card-text"></p>
            <div class="row">
              <div class="col">Darlehen</div>
              <div class="col">{{gezahltinlaufzeit.toLocaleString('de-DE',currencyFormat)}}</div>
            </div>
            <div class="row">
              <div class="col">Zinsen</div>
              <div class="col">{{gezahltinlaufzeit.toLocaleString('de-DE',currencyFormat)}}</div>
            </div>
            <div class="row">
              <div class="col">Tilgung</div>
              <div class="col">{{gezahltinlaufzeit.toLocaleString('de-DE',currencyFormat)}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-row dark">
        <div class="table-cell">
          <label>
            <span>Kaufpreis</span>
            <input type="number" v-model="kaufpreis" placeholder="Kaufpreis" />
          </label>
        </div>
        <div class="table-cell">
          <label>
            <span>Eigenkapital</span>
            <input type="number" v-model="eigenkapital" placeholder="Eigenkapital" />
          </label>
        </div>
      </div>
      <div class="table-row dark">
        <div class="table-cell">
          <label>
            <span>Start Datum</span>
            <input type="date" v-model="datum" placeholder="Start Datum" />
          </label>
        </div>
      </div>

      <div class="table-row dark">
        <div class="table-cell">
          <label>
            <span>Sondertilgung</span>
            <input type="number" v-model="sondertilgung" placeholder="Sondertilgung" />
          </label>
        </div>
      </div>

      <div class="fixed">
        <div class="table-row">
          <div class="table-cell">Gezahlt: {{gezahlt.toFixed(2)}}</div>
          <div class="table-cell">Offen: {{offen.toFixed(2)}}</div>
          <div class="table-cell"></div>
          <div class="table-cell">Monate:</div>
        </div>
        <div class="table-row">
          <div class="table-cell w50">nach 20 Jahren gezahlt: {{gezahltnach.toFixed(2)}}</div>
          <div class="table-cell w50">noch Offen nach: {{nochoffennach.toFixed(2)}}</div>
        </div>
        <div class="table-row border-bottom">
          <div class="table-cell key">Monat</div>
          <div class="table-cell darlehen">darlehen</div>
          <div class="table-cell zinsen">zinsen</div>
          <div class="table-cell tilgung">tilgung</div>
          <div class="table-cell rate">rate</div>
        </div>
      </div>

      <div class="table-row" :class="item.rowstyle" v-for="item in months" v-bind:key="item.key">
        <div class="table-cell jahr w100" v-if="item.year">Jahr {{item.year}}</div>
        <div class="table-cell key" :class="item.state">{{item.index}}</div>
        <div class="table-cell darlehen">{{item.darlehen.toFixed(2)}} &euro;</div>
        <div
          class="table-cell zinsen"
          v-on:click="sum(item.index,'zinsen')"
        >{{item.zinsen.toFixed(2)}} &euro;</div>
        <div class="table-cell tilgung" v-on:click="sum(item.index,'tilgung')">
          {{item.tilgung.toFixed(2)}} &euro;
          <b
            v-if="item.sondertilgung"
          >*{{item.sondertilgung}} &euro;</b>
        </div>
        <div
          class="table-cell rate"
          v-on:click="sum(item.index,'rate')"
        >{{item.rate.toFixed(2)}} &euro;</div>
      </div>

      <div v-if="showSum" class="dialog" v-on:click="showSum=0">
        <div>{{showSum.toFixed(2)}} &euro;</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",

  data: function() {
    return {
      local: "de-DE",
      currencyFormat: { style: "currency", currency: "EUR" },
      kaufpreis: 500000,
      eigenkapital: 10000,
      darlehen: 500000,
      zinsen: 2,
      tilgung: 2,
      rate: 0,
      months: [],
      datum: "2020-01-01",
      gezahlt: 0,
      offen: 0,
      gezahltnach: 0,
      nochoffennach: 0,
      gesamtjahr: 0,
      sondertilgung: 0,
      keyIndex: 1,
      showSum: null,
      gezahltinlaufzeit: 0,
      zinseninlaufzeit: 0,
      tilgunginlaufzeit: 0
    };
  },
  mounted() {
    if (localStorage.kaufpreis) this.kaufpreis = localStorage.kaufpreis;
    if (localStorage.darlehen)
      this.darlehen = parseFloat(localStorage.darlehen);
    if (localStorage.eigenkapital)
      this.eigenkapital = localStorage.eigenkapital;
    if (localStorage.zinsen) this.zinsen = parseFloat(localStorage.zinsen);

    if (localStorage.tilgung) this.tilgung = parseFloat(localStorage.tilgung);
    if (localStorage.sondertilgung)
      this.sondertilgung = localStorage.sondertilgung;
    if (localStorage.datum) this.datum = localStorage.datum;

    window.addEventListener("resize", this.getWindowWidth);
  },

  methods: {
    getWindowWidth: function(w) {
      console.log(w.target.innerWidth);
      this.graph.width = w.target.innerWidth;
    },

    sum: function(index, attribute) {
      let _sum = 0;
      this.months.map(function(value) {
        if (parseInt(index) >= parseInt(value["index"])) {
          _sum += value[attribute];
        }
      });
      this.showSum = _sum;
    },

    calc: function() {
      this.months = [];
      let index = 1;
      let darlehen = parseFloat(this.darlehen);
      //let rowstyle = "in-range";
      let now = new Date();
      let startdate = new Date(this.datum);

      //let darlehenPath = "m";

      do {
        let row = {};

        let datum = new Date(startdate);
        row.index = index++;
        row.key = this.keyIndex++;
        row.darlehen = darlehen;
        row.datum = `${datum.getDate()}.${datum.getMonth() +
          1}.${datum.getFullYear()}`;
        row.state = startdate <= now ? "here" : "open";
        row.year = null;
        row.sondertilgung = 0;

        if (darlehen == parseFloat(this.darlehen)) {
          row.zinsen = (darlehen * (parseFloat(this.zinsen) / 100)) / 12;
          row.tilgung = (darlehen * (parseFloat(this.tilgung) / 100)) / 12;
          row.rate = row.zinsen + row.tilgung;
        } else {
          const lastRow = this.months[this.months.length - 1];
          row.zinsen = (darlehen * (parseFloat(this.zinsen) / 100)) / 12;
          row.rate = lastRow.rate;
          row.tilgung = row.rate - row.zinsen;
        }

        if (row.index % 12 == 0) {
          row.sondertilgung = parseFloat(this.sondertilgung);
        }

        darlehen = darlehen - (row.tilgung + row.sondertilgung);
        startdate.setMonth(startdate.getMonth() + 1);

        // if (row.state === "here") {
        //   this.gezahlt = parseFloat(this.darlehen) - darlehen;
        //   this.offen = parseFloat(this.darlehen) - this.gezahlt;
        // }

        // if (this.months.length % 12 == 0) {
        //   row.year = this.months.length / 12 + 1;
        // }

        // if (row.year == 21) {
        //   const lastRow = this.months[this.months.length - 1];
        //   this.gezahltnach = parseFloat(this.darlehen) - lastRow.darlehen;
        //   this.nochoffennach = parseFloat(this.darlehen) - this.gezahltnach;

        //   rowstyle = "outer-range";
        // }

        //row.rowstyle = rowstyle;

        this.months.push(row);
      } while (darlehen > 0);

      this.gesamtjahr = this.months.length / 12;

      this.gezahltinlaufzeit = 0;
      this.zinseninlaufzeit = 0;
      this.tilgunginlaufzeit = 0;
      /* nach 20 jahren */

      const m = this.months.slice();
      const l = 12 * 20 - 1;
      m.splice(0, l).map((val, i) => {
        this.zinseninlaufzeit += val.zinsen;
        this.tilgunginlaufzeit += val.tilgung;
        if (i + 1 == l) this.gezahltinlaufzeit = val.darlehen;
      });

 


    }
  },
  watch: {
    // whenever question changes, this function will run
    kaufpreis: function(newValue) {
      localStorage.kaufpreis = newValue;
      this.calc();
    },
    eigenkapital: function(newValue) {
      localStorage.eigenkapital = newValue;
      this.calc();
    },

    datum: function(newValue) {
      localStorage.datum = newValue;
      this.calc();
    },
    sondertilgung: function(newValue) {
      localStorage.sondertilgung = newValue;
      this.calc();
    }
  },
  created: function() {
    this.calc();
  }
};
</script>

<style>
html,
body {
  background-color: #6872ee;
  padding: 0;
  margin: 0;
}

.head {
  background-color: #4953cf;
  color: #fff;
  padding: 20px;
  line-height: 300%;
}

.head .table-row {
  background-color: #ffffff;
}

.head .bg-grey {
  background-color: #e0e0e0;
}

.z-index-2 {
  z-index: 200;
}
.z-index-3 {
  z-index: 300;
}

.funnel.svg-funnel-js {
  width: 100%;
  overflow: hidden;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  max-width: 400px;
  margin: auto;
  background-color: #ffffff;
}

label {
  display: flex;
}
label * {
  overflow: hidden;
  width: 50%;
  flex: 1;
  text-align: left;
}

.table-row {
  width: 100%;
  max-width: 600px;
  margin: auto;

  display: flex;
  flex-wrap: wrap;
}
.fixed {
  position: sticky;
  top: 0;
}
.fixed .table-cell {
  background-color: #bcd4c7;
  border-color: #87cfa5;
}

.border-bottom {
  border-bottom: 5px solid #9b9b9b;
}

.table-cell {
  border: 1px solid #e0e0e0;
  padding: 5px;
  background-color: #ffffff;
  overflow: hidden;
  width: 20%;
  flex: 1;
}

.table-row.dark .table-cell {
  line-height: 2;
  background-color: #323232;
  color: #e0e0e0;
  border: 1px solid #202020;
}
.table-row.dark .table-cell input {
  background-color: #555454;
  color: #e0e0e0;
  border: 1px solid #000000;
  padding-left: 5px;
}

.table-cell.w50 {
  width: 50%;
}

.table-cell.w16 {
  width: 16.667%;
}
.w100 {
  flex: 100%;
}

.outer-range {
  color: #a3a3a3;
}

.key {
  flex: 0 7%;
  text-align: center;
}
.jahr {
  background-color: #c8c8c8;
  border-color: #adacac;
}
.datum {
  text-align: right;
}
.darlehen {
  flex: 0 25%;
  text-align: right;
}
.zinsen {
  text-align: right;
}
.tilgung {
  text-align: right;
}
.tilgung b {
  white-space: nowrap;
}
.rate {
  text-align: right;
}

.here {
  border-color: #ff4f4f;
  background-color: #fb7575;
  color: #ffffff;
}

.open {
  border-color: #a3a3a3;
  background-color: #c5c5c5;
}
.dialog {
  position: sticky;

  bottom: 0;
  height: 100%;
  background-color: #33333355;
}
.dialog div {
  background-color: #a3a3a3;
  width: 300px;
  height: 100px;
  margin: auto;
  font-size: 50px;
  line-height: 100px;
}
</style>
