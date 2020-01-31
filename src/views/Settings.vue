<template>
  <div class="about">
    <router-link class="fab bg-grey-deep-dark pull-right shadow" to="/">OK</router-link>
    <h1>Einstellungen</h1>

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
      <div class="table-cell">
        <label>
          <span>Darlehen</span>
          <input type="number" v-model="darlehen" placeholder="Darlehen" />
        </label>
      </div>
    </div>
    <div class="table-row dark">
      <div class="table-cell">
        <label>
          <span>Zinsen</span>
          <input type="number" v-model="zinsen" placeholder="Zinsen" />
        </label>
      </div>
      <div class="table-cell">
        <label>
          <span>Tilgung</span>
          <input type="number" v-model="tilgung" placeholder="Tilgung" />
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
  </div>
</template>


<script>
export default {
  name: "app",

  data: function() {
    return {
      kaufpreis: 500000,
      eigenkapital: 10000,
      darlehen: 500000,
      zinsen: 2,
      tilgung: 2,
      datum: "2020-01-01",
      sondertilgung: 0
    };
  },
  mounted() {
    if (localStorage.kaufpreis) this.kaufpreis = localStorage.kaufpreis;
    if (localStorage.darlehen) this.darlehen = localStorage.darlehen;
    if (localStorage.eigenkapital)
      this.eigenkapital = localStorage.eigenkapital;
    if (localStorage.zinsen) this.zinsen = localStorage.zinsen;
    if (localStorage.tilgung) this.tilgung = localStorage.tilgung;
    if (localStorage.sondertilgung)
      this.sondertilgung = localStorage.sondertilgung;
    if (localStorage.datum) this.datum = localStorage.datum;
  },
  watch: {
    // whenever question changes, this function will run
    kaufpreis: function(newValue) {
      localStorage.kaufpreis = newValue;
    },
    eigenkapital: function(newValue) {
      localStorage.eigenkapital = newValue;
    },
    darlehen: function(newValue) {
      localStorage.darlehen = newValue;
    },
    zinsen: function(newValue) {
      localStorage.zinsen = newValue;
    },
    tilgung: function(newValue) {
      localStorage.tilgung = newValue;
    },
    datum: function(newValue) {
      localStorage.datum = newValue;
    },
    sondertilgung: function(newValue) {
      localStorage.sondertilgung = newValue;
    }
  }
};
</script>