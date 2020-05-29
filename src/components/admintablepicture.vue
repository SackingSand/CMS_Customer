<template>
<section class="col-md-12">
    <h3>All Pictures</h3>
    <br />
    <br />
    <mdb-Container class="col-xs-12 d-flex p-0 flex-wrap">
      <div class="col-lg-2 col-md-3 col-sm-6 col-xs-12 m-0 p-0" v-for="picture in productPictures" :key="picture.id">
        <div @click="$store.commit('setLightboxIndex', 0);$store.commit('setLightboxItems', [picture.filename])" >
          <mdb-view zoom hover :src="picture.filename" class="img-fluid" style="height:150px; cursor: pointer;">
            <mdb-mask  overlay="blue-slight" flexBottom class="" style=""></mdb-mask>
          </mdb-view>
        </div>
          <a @click="openDeletePicture(picture)" class="text-primary" style="position: absolute; margin-top: -150px;margin-left: 75px;"><i class="fa fa-times" aria-hidden="true"></i></a>
      </div>

    </mdb-Container>
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
    mdbContainer,
    mdbBtn,
    mdbModal, 
    mdbModalHeader,
    mdbModalBody, 
    mdbModalFooter,
    mdbIcon,
    mdbView,
    mdbMask,
    } from 'mdbvue'
import { baseUrl } from '../components/var'
import Axios from 'axios'

export default {
  name: 'adminTableProduct',
  components : {
    mdbContainer,
    mdbModal, 
    mdbModalHeader, 
    mdbModalBody, 
    mdbModalFooter,
    mdbBtn,
    mdbIcon,
    mdbView,
    mdbMask,
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