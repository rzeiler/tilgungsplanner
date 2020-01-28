<template>
  <div id="app">
    <input type="number" v-model="kaufpreis" placeholder="Kaufpreis" />
    <input type="number" v-model="eigenkapital" placeholder="Eigenkapital" />
    <input type="date" v-model="datum" placeholder="Start Datum" />
    <input type="number" v-model="darlehen" placeholder="Darlehen" />
    <input type="number" v-model="zinsen" placeholder="Zinsen" />
    <input type="number" v-model="tilgung" placeholder="Tilgung" />

    <input type="number" v-model="sondertilgung" placeholder="Sondertilgung" />
    <input type="number" v-model="sondertilgungsmonat" placeholder="Sondertilgungsmonat" />

    <div class="fixed">
      <div class="table-row">
        <div class="table-cell">Gezahlt: {{gezahlt.toFixed(2)}}</div>
        <div class="table-cell">Offen: {{offen.toFixed(2)}}</div>
        <div class="table-cell"></div>
        <div class="table-cell">
          Jahre: {{
          gesamtjahr.toFixed(1)
          }}
          Monate: {{
          months.length
          }}
        </div>
      </div>
      <div class="table-row">
        <div class="table-cell w50">nach 20 Jahren gezahlt: {{gezahltnach.toFixed(2)}}</div>
        <div class="table-cell w50">noch Offen nach: {{nochoffennach.toFixed(2)}}</div>
      </div>
      <div class="table-row border-bottom">
        <div class="table-cell index">Monat</div>
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
      <div class="table-cell zinsen">{{item.zinsen.toFixed(2)}} &euro;</div>
      <div class="table-cell tilgung">
        {{item.tilgung.toFixed(2)}} &euro;
        <br />
        {{item.sondertilgung}} &euro;
      </div>
      <div class="table-cell rate">{{item.rate.toFixed(2)}} &euro;</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: "app",

  data: function() {
    return {
      kaufpreis: 340000,
      eigenkapital: 62000,
      darlehen: 334000,
      zinsen: 1.65,
      tilgung: 2.25,
      rate: 0,
      months: [],
      datum: "2019-01-01",
      gezahlt: 0,
      offen: 0,
      gezahltnach: 0,
      nochoffennach: 0,
      gesamtjahr: 0,
      sondertilgung: 2000,
      sondertilgungsmonat: 12,
      keyIndex: 1
    };
  },
  methods: {
    calc: function() {
      this.months = [];
      let index = 1;
      let darlehen = this.darlehen;
      let rowstyle = "in-range";
      let now = new Date();
      let startdate = new Date(this.datum);

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

        if (darlehen == this.darlehen) {
          row.zinsen = (darlehen * (this.zinsen / 100)) / 12;
          row.tilgung = (darlehen * (this.tilgung / 100)) / 12;
          row.rate = row.zinsen + row.tilgung;
        } else {
          const lastRow = this.months[this.months.length - 1];
          row.zinsen = (darlehen * (this.zinsen / 100)) / 12;
          row.rate = lastRow.rate;
          row.tilgung = row.rate - row.zinsen;
        }

        if (row.index % 12 == 0) {
          row.sondertilgung = this.sondertilgung;
        }

        darlehen = darlehen - (row.tilgung + row.sondertilgung);
        startdate.setMonth(startdate.getMonth() + 1);

        if (row.state === "here") {
          this.gezahlt = this.darlehen - darlehen;
          this.offen = this.darlehen - this.gezahlt;
        }

        if (this.months.length % 12 == 0) {
          row.year = this.months.length / 12 + 1;
        }

        if (row.year == 21) {
          const lastRow = this.months[this.months.length - 1];
          this.gezahltnach = this.darlehen - lastRow.darlehen;
          this.nochoffennach = this.darlehen - this.gezahltnach;

          rowstyle = "outer-range";
        }

        row.rowstyle = rowstyle;

        this.months.push(row);
      } while (darlehen > 0);

      this.gesamtjahr = this.months.length / 12;

      //Vue.nextTick();

      this.$nextTick();
    }
  },
  watch: {
    // whenever question changes, this function will run
    kaufpreis: function() {
      this.calc();
    },
    eigenkapital: function() {
      this.calc();
    },
    darlehen: function() {
      this.calc();
    },
    zinsen: function() {
      this.calc();
    },
    tilgung: function() {
      this.calc();
    },
    datum: function() {
      this.calc();
    },
    sondertilgung: function() {
      this.calc();
    },
    sondertilgungsmonat: function() {
      this.calc();
    }
  },
  created: function() {
    this.calc();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
</style>
