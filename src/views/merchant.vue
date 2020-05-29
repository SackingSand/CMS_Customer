<template>
  <div class="home">

  <mdb-container class="mt-5" id="categoriesTable">
    <mdb-row class="mt-5 align-items-left justify-content-start">
      <MerchantTableProduct></MerchantTableProduct>
    </mdb-row>
  </mdb-container>
  </div>
</template>

<script>
import { 
  mdbContainer,
  mdbRow
    } from 'mdbvue'
import MerchantTableProduct from '../components/merchanttableproduct'

export default {
  name: 'merchant',
  components : {
    mdbContainer,
    mdbRow,
    MerchantTableProduct
  }
}
</script>

<style scoped>
</style>