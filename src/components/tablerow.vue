<template>
  <div class="table-row" :class="cssClass">
    <div class="table-cell p-1" v-for="(item,i) in items" :key="i">
      <h2 :style="{color: item.color}" >{{item.titel}}</h2>
      <h3>{{item.value}}</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableRow",
  props: {
    cssClass: String,
    items: Array
  }
   
};
</script>
