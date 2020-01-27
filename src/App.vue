<template>
  <div id="app">
    <input type="number" v-model="kaufpreis" placeholder="Kaufpreis" />
    <input type="number" v-model="eigenkapital" placeholder="Eigenkapital" />
    <input type="date" v-model="datum" placeholder="Start Datum" />
    <input type="number" v-model="darlehen" placeholder="Darlehen" />
    <input type="number" v-model="zinsen" placeholder="Zinsen" />
    <input type="number" v-model="tilgung" placeholder="Tilgung" />

    <div class="table">
      <div class="table-row">
        <div class="table-cell">datum</div>
        <div class="table-cell">darlehen</div>
        <div class="table-cell">zinsen</div>
        <div class="table-cell">tilgung</div>
        <div class="table-cell">rate</div>
      </div>
      <div class="table-row" v-for="item in months" v-bind:key="item.key">
        <div class="table-cell">{{item.datum}}</div>
        <div class="table-cell">{{item.darlehen.toFixed(2)}} &euro;</div>
        <div class="table-cell">{{item.zinsen.toFixed(2)}} &euro;</div>
        <div class="table-cell">{{item.tilgung.toFixed(2)}} &euro;</div>
        <div class="table-cell">{{item.rate.toFixed(2)}} &euro;</div>
      </div>
    </div>
  </div>
</template>

<script>
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
      datum: "2020-01-01"
    };
  },
  methods: {
    calc: function() {
      this.months = [];
      let index = 0;
      let darlehen = this.darlehen;

      let startdate = new Date(this.datum);

      do {
        let row = {};

        let datum = new Date(startdate);

        row.key = index++;
        row.darlehen = darlehen;
        row.datum = `${datum.getDate()}.${datum.getMonth() +
          1}.${datum.getFullYear()}`;

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

        darlehen = darlehen - row.tilgung;
        startdate.setMonth(startdate.getMonth() + 1);

        this.months.push(row);
      } while (darlehen > 0);
    }
  },
  watch: {
    // whenever question changes, this function will run
    kaufpreis: function(newValue, oldValue) {
      console.log(newValue, oldValue);
    },
    eigenkapital: function(newValue, oldValue) {
      console.log(newValue, oldValue);
    },
    darlehen: function(newValue, oldValue) {
      console.log(newValue, oldValue);
    },
    zinsen: function(newValue, oldValue) {
      console.log(newValue, oldValue);
    },
    tilgung: function(newValue, oldValue) {
      console.log(newValue, oldValue);
    },
    datum: function(newValue, oldValue) {
      console.log(newValue, oldValue);
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
  margin-top: 60px;
}

.table {
  width: 100%;
  max-width: 600px;
  margin: auto;
  height: calc(100% - 66px);
  display: table;
}
.table-row {
  display: table-row;
}
.table-cell {
  display: table-cell;
}
</style>
