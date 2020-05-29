<template>
<section class="col-md-12">
    <h3>All Products</h3>
    <br />
    <mdb-tbl btn responsive striped class="my-5 rounded-top border border-light border-bottom-0 ">
        <mdb-tbl-head class="tempting-azure-gradient">
        <tr>
            <th>No</th>
            <th>Category </th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
        </tr>
        </mdb-tbl-head>
        <mdb-tbl-body>

        <tr v-for="(product, index) in products" :key="product.id" scope="row">
            <td>{{ index+1 }}</td>
            <td>{{ product.Category.name }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td class="col-sm-3">
              <mdb-btn @click="openDelete(product.id, product.name)" color="danger" class=" btn-sm"><i class="fas fa-trash mr-2" aria-hidden="true"></i> Delete</mdb-btn>
            </td>
        </tr>
        
        <tr v-if="products.length === 0" scope="row">
            <td colspan="6">
            No item here
            </td>
        </tr>
        
        </mdb-tbl-body>
    </mdb-tbl>
    <div style="margin-top: -50px; margin-bottom: 100px; text-align: left;" class="pl-4 text-secondary">*click to go to product detail page</div>

    <!-- // --- // -->
    <!-- // --- // -->
    <!-- // --- // -->
    <mdb-modal :show="showPicModal" @close="showPicModal = false" cascade class="text-left">
        <mdb-modal-header class="primary-color white-text">
            <h4 class="title">Manage Pictures<br><br>{{ managePicName }} </h4>
        </mdb-modal-header>
        <mdb-modal-body class="grey-text d-flex flex-wrap">

          <div class="col-md-3 mb-3" v-for="(picture, pictureIndex) in filterByProductId(managePicId)" :key="picture.id">
            <img @click="$store.commit('setLightboxIndex', pictureIndex);$store.commit('setLightboxItems', buildLightboxArray(filterByProductId(managePicId)))" class="img-fluid rounded-circle" style="width: 80px; height: 80px; cursor: pointer;" :src="picture.filename"/>
            <a @click="openDeletePicture(picture)" href="/#/admin" style="position: absolute; margin-left: -5px;"><i class="fa fa-times" aria-hidden="true"></i></a>
          </div>

          <div class="col-md-12" v-if="filterByProductId(managePicId).length < 1">
            No picture yet
          </div>
          
        </mdb-modal-body>
        <mdb-modal-footer>
        </mdb-modal-footer>
    </mdb-modal>
    <!-- // --- // -->
    <mdb-modal :show="confirmDelete" @close="confirmDelete = false" size="sm" class="text-center" danger>
      <mdb-modal-header class="young-passion-gradient" center :close="false">
        <p class="heading">Are you sure?</p>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-icon icon="times" class="animated bounce mr-1" /> Deleting product '{{ deleteName }}'
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn class="btn-sm" @click="deleteProduct" color="danger">Yes</mdb-btn>
        <mdb-btn class="btn-md" color="secondary" @click="confirmDelete=false">No</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!-- // -- // -->
    <mdb-modal :show="confirmPicDelete" @close="confirmPicDelete = false" size="sm" class="text-center" danger>
      <mdb-modal-header class="young-passion-gradient" center :close="false">
        <p class="heading">Are you sure?</p>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-icon icon="times" class="animated bounce mr-1" /> Deleting picture<hr/>
        <img class="img-fluid" style="" :src="deletePicUrl"/>
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn class="btn-sm" @click="deleteProductPicture" color="danger">Yes</mdb-btn>
        <mdb-btn class="btn-md" color="secondary" @click="confirmPicDelete=false">No</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!-- // -- // -->
    <!-- // -- // -->
</section>
</template>

<script>
import { 
    mdbBtn, 
    mdbTbl, 
    mdbTblHead, 
    mdbTblBody, 
    mdbModal, 
    mdbModalHeader,
    mdbModalBody, 
    mdbModalFooter,
    mdbIcon
    } from 'mdbvue'
import { baseUrl } from '../components/var'
import Axios from 'axios'

export default {
  name: 'adminTableProduct',
  components : {
    mdbTbl, 
    mdbTblHead, 
    mdbTblBody , 
    mdbModal, 
    mdbModalHeader, 
    mdbModalBody, 
    mdbModalFooter,
    mdbBtn,
    mdbIcon
  },
  data () {
    return {
      animatedClass : ``,
      showImage : false,
      showImageUrl : '',
      showEditModal : false,
      editHasError : '',
      editError : '',
      editHasInfo : '',
      editInfo : '',
      editName : '',
      editPrice : '',
      editStock : '',
      editId : 0,
      confirmDelete : false,
      confirmPicDelete : false,
      deleteName : '',
      deleteId : 0,
      showAddModal : false,
      addHasError : '',
      addError : '',
      addName : '',
      addPrice : '',
      addStock : '',
      selectedCategory : 'default',
      selectedCategoryName : '',
      showPicModal : false,
      managePicId : 0,
      managePicName : '',
      uploadDisabled : false,
      deletePicUrl : ``,
      uploaderLabel : 'Choose a file',
      deletePictureId : 0
    }
  },
  methods : {
    buildLightboxArray(obj) {
      let newArray = []
      for (let i = 0; i < obj.length;i++){
        newArray.push(obj[i].filename)
      }
      return newArray
    },
    filterByProductId (id) {
      let result = this.productPictures.filter( function(el) {
        return el.ProductId == id
      })
      return result
    },
    openPictureManager({id, name}){
      this.uploadDisabled = false
      this.showPicModal = true
      this.managePicId=id 
      this.filterByProductId(id)
      this.managePicName=name
      if(this.filterByProductId(id).length > 7) {
        this.uploadDisabled = true
      }
    },
    openDelete(id, name) {
      this.confirmDelete = true
      this.deleteId = id
      this.deleteName = name
    },
    openDeletePicture({id, filename}) {
      this.deletePictureId = id
      this.confirmPicDelete=true;
      this.deletePicUrl=filename
    },
    deleteProduct () {
      Axios.delete(`${baseUrl}/products/delete`, 
      {
        data : { id : this.deleteId },
        headers : {
          cmsaccesstoken : localStorage.cmsaccesstoken
        }
      }).then(() => {
          this.confirmDelete = false
          this.$store.dispatch('loadProducts')
          this.uploadDisabled = false
      }).catch ( err => {
          console.log(err.response)
      })
    },
    deleteProductPicture() {
      Axios.delete(`${baseUrl}/pictures/delete`, {
        data : { id : this.deletePictureId },
        headers : { cmsaccesstoken : localStorage.cmsaccesstoken }        
      }).then(() => {
        this.$store.dispatch('loadAllPictures')
          this.confirmPicDelete=false;
          this.uploadDisabled = false
      }).catch( err => {
          console.log(err.response.data.message)
          this.confirmPicDelete=false;
      })
    }

  }, 
  computed : {
    products () {
      return this.$store.state.products
    },
    categories () {
      return this.$store.state.categories
    },
    productPictures () {
      return this.$store.state.allpictures
    }
  },
  created : function () {
    this.$store.dispatch('loadCategories')
    this.$store.dispatch('loadProducts')
    this.$store.dispatch('loadAllPictures')
  }

}
</script>

<style>

</style>