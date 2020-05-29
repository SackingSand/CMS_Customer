<template>
<section class="col-md-12">
    <h3>All Products</h3>
    <br />
    <mdb-btn @click="showAddModal = true; addHasError = false" color="primary" class="m-0"><i class="fas fa-book mr-2" aria-hidden="true"></i>Add New</mdb-btn>
    <br />
    <mdb-tbl btn responsive striped class="my-5 rounded-top border border-light border-bottom-0 ">
        <mdb-tbl-head class="tempting-azure-gradient">
        <tr>
            <th>No</th>
            <th>Category </th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Pictures</th>
            <th>Action</th>
        </tr>
        </mdb-tbl-head>
        <mdb-tbl-body>

        <tr v-for="(product, index) in products" :key="product.id" scope="row">
            <td @click="$router.push(`/products/${ product.Category.name }/${ product.name }/detail/${ product.id }`)" title="test" style="cursor: pointer;">{{ index+1 }}</td>
            <td @click="$router.push(`/products/${ product.Category.name }/${ product.name }/detail/${ product.id }`)" style="cursor: pointer;">{{ product.Category.name }}</td>
            <td @click="$router.push(`/products/${ product.Category.name }/${ product.name }/detail/${ product.id }`)" style="cursor: pointer;">{{ product.name }}</td>
            <td @click="$router.push(`/products/${ product.Category.name }/${ product.name }/detail/${ product.id }`)" style="cursor: pointer;">{{ product.price }}</td>
            <td @click="$router.push(`/products/${ product.Category.name }/${ product.name }/detail/${ product.id }`)" style="cursor: pointer;">{{ product.stock }}</td>
            <td><a @click="openPictureManager(product)" style="text-decoration : underline;" href="./#/merchant/">{{ filterByProductId(product.id).length }}</a></td>
            <td class="col-sm-3">
              <mdb-btn @click="openEdit(product.id, product.CategoryId, product.name, product.price, product.stock)" color="info" class=" btn-sm"><i class="fas fa-pencil-alt mr-2" aria-hidden="true"></i>Edit</mdb-btn> 
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
    <mdb-modal :show="showAddModal" @close="showAddModal = false;clearAddForm()" cascade class="text-left">
      <form @submit.prevent="addProduct">
        <mdb-modal-header class="primary-color white-text">
            <h4 class="title"><mdb-icon icon="pencil-alt" /> Add Product </h4>
        </mdb-modal-header>
        <mdb-modal-body class="grey-text">
            <mdb-alert v-if="addHasError" color="danger" class="animated" v-bind:class="animatedClass">{{ addError }}</mdb-alert>
            
            <select class="browser-default custom-select" v-model="selectedCategory">
                <option selected disabled value="default">Select Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id" @click="selectedCategoryName = category.name" >{{ category.name }}</option>
            </select>
            <mdb-input @change="addHasError = false" v-model="addName" size="sm" label="Name" group type="text" validate error="wrong" success="right"/>
            <mdb-input @change="addHasError = false" v-model="addPrice" size="sm" label="Price" group type="number" validate error="wrong" success="right"/>
            <mdb-input @change="addHasError = false" v-model="addStock" size="sm" label="Stock" group type="number" validate error="wrong" success="right"/>
        </mdb-modal-body>
        
        <mdb-modal-footer>
            <mdb-btn type="submit" class="col-sm-6 d-flex align-center mx-auto"><i class="fa fa-plus mr-2 pt-1 pl-5" aria-hidden="true"></i>Add</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- // --- // -->
    <mdb-modal :show="showEditModal" @close="showEditModal = false" cascade class="text-left">
      <form @submit.prevent="editProduct">
        <mdb-modal-header class="primary-color white-text">
            <h4 class="title"><mdb-icon icon="pencil-alt" /> Edit item </h4>
        </mdb-modal-header>
        <mdb-modal-body class="grey-text">
            <mdb-alert v-if="editHasError" color="danger" class="animated" v-bind:class="animatedClass">{{ editError }}</mdb-alert>
            <mdb-alert v-if="editHasInfo" color="info" class="animated" v-bind:class="animatedClass">{{ editInfo }}</mdb-alert>
            
            <select class="browser-default custom-select" v-model="selectedCategory">
                <option selected disabled value="default">Select Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id" >{{ category.name }}</option>
            </select>
            <mdb-input @change="editHasError = false" v-model="editName" size="sm" label="Name" group type="text" validate error="wrong" success="right"/>
            <mdb-input @change="editHasError = false" v-model="editPrice" size="sm" label="Price" group type="number" validate error="wrong" success="right"/>
            <mdb-input @change="editHasError = false" v-model="editStock" size="sm" label="Stock" group type="number" validate error="wrong" success="right"/>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn type="submit" class="col-sm-6 d-flex align-center mx-auto">Save Edit</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- // --- // -->
    <mdb-modal :show="showPicModal" @close="showPicModal = false" cascade class="text-left">
        <mdb-modal-header class="primary-color white-text">
            <h4 class="title">Manage Pictures<br><br>{{ managePicName }} </h4>
        </mdb-modal-header>
        <mdb-modal-body class="grey-text d-flex flex-wrap">

          <div class="col-md-3 mb-3" v-for="(picture, pictureIndex) in filterByProductId(managePicId)" :key="picture.id">
            <img @click="$store.commit('setLightboxIndex', pictureIndex);$store.commit('setLightboxItems', buildLightboxArray(filterByProductId(managePicId)))" class="img-fluid rounded-circle" style="width: 80px; height: 80px; cursor: pointer;" :src="picture.filename"/>
            <a @click="openDeletePicture(picture)" href="/#/merchant" style="position: absolute; margin-left: -5px;"><i class="fa fa-times" aria-hidden="true"></i></a>
          </div>

          <div class="col-md-12" v-if="filterByProductId(managePicId).length < 1">
            No picture yet
          </div>
          
        </mdb-modal-body>
        <mdb-modal-footer>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
            </div>
            <div class="custom-file">
              <input :disabled="uploadDisabled" @change="uploader($event, managePicId)" type="file" class="custom-file-input" id="uploader" accept="image/png, image/jpg, image/jpeg">
              <label v-if="uploaderLabel=='Choose a file'" class="custom-file-label" for="uploader">
                {{ uploaderLabel }}
              </label>
              <label v-else class="custom-file-label" for="uploader">
                <div class="spinner-grow spinner-grow-sm text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div> Uploading {{ uploaderLabel }}
              </label>
            </div>
          </div>
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
    <mdb-modal :show="showImage" centered @close="showImage = false" size="lg" class="text-center" >
      <!-- <img height="auto" :src="showImageUrl"/> -->
        <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
          <iframe :src="showImageUrl"
            allowfullscreen></iframe>
        </div>
    </mdb-modal>
    <!-- // -- // -->
</section>
</template>

<script>
import { 
    mdbAlert,
    mdbInput, 
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
  name: 'merchantTableProduct',
  components : {
    mdbAlert,
    mdbTbl, 
    mdbTblHead, 
    mdbTblBody , 
    mdbModal, 
    mdbModalHeader, 
    mdbModalBody, 
    mdbModalFooter,
    mdbInput, 
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
    clearAddForm(){
        this.addName = '',
        this.addPrice = '',
        this.addStock = '',
        this.selectedCategory = 'default'
    },
    openPictureManager({id, name}){
      this.uploadDisabled = false
      this.showPicModal = true
      this.filterByProductId(id)
      if(this.filterByProductId(id).length > 7) {
        this.uploadDisabled = true
      }
      this.managePicId=id 
      this.managePicName=name
    },
    openEdit(id, CategoryId, name, price, stock) {
      this.showEditModal = true
      this.editId = id
      this.selectedCategory = CategoryId
      this.editName = name
      this.editPrice = price
      this.editStock = stock
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
    editProduct () {
      this.animatedClass = ``
      this.editHasError = false
      Axios.put(`${baseUrl}/products/edit`, 
        {
          id: this.editId,
          name : this.editName, 
          price : this.editPrice, 
          stock : this.editStock, 
          CategoryId : this.selectedCategory
          },
        {
          headers : {
            cmsaccesstoken : localStorage.cmsaccesstoken
          } 
        })  .then( () => {
              this.showEditModal = false
              this.$store.dispatch('loadProducts')
              this.editName = ''
        })  .catch ( err => {
              console.log(err.response.data)
              this.editHasError = true,
              this.animatedClass = `pulse`
              this.editError = err.response.data.error
        })      
    },
    addProduct () {
      this.animatedClass = ``
      this.addHasError = false
      Axios.post(`${baseUrl}/products/add`, 
      {
        name : this.addName, 
        price : this.addPrice, 
        stock : this.addStock, 
        CategoryId : this.selectedCategory
      }, 
      {
        headers : {
          cmsaccesstoken : localStorage.cmsaccesstoken
        } 
      }).then( (result) => {
          this.showAddModal = false
          this.clearAddForm()
          this.$store.dispatch('loadProducts')
          this.openPictureManager(result.data)
      }).catch ( err => {
          this.addHasError = true,
          this.animatedClass = `pulse`
          this.addError = err.response.data.error
      })
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
    uploader (event, ProductId) {
        console.log(`sending`)
        this.uploadDisabled = true
        this.uploaderLabel = event.target.files[0].name
        let newdata = new FormData()
        let file = event.target.files[0]

        newdata.append('name',file.name)
        newdata.append('file',file)
        newdata.append('upload_preset', 'otnddjow')
        let axiosHead = {
          'Content-Type': `multipart/form-data;`,
        }
        
        Axios.post('https://api.cloudinary.com/v1_1/personal-learning-project/image/upload', newdata, axiosHead)
            .then(({data}) => {
              // console.log(data)
                this.uploadDisabled = false
                this.uploaderLabel = 'Choose a file'
                Axios.post(`${baseUrl}/pictures/add`, {
                  filename : data.secure_url,
                  ProductId
                }, {
                  headers : {
                    cmsaccesstoken : localStorage.cmsaccesstoken
                  }
                }).then(() => {
                  // console.log(result.data)
                  this.$store.dispatch('loadProductPictures')
                  if(this.filterByProductId(ProductId).length === 7) {
                    this.uploadDisabled = true
                  }
                }).catch( err => {
                  console.log(err)
                })
            }).catch((error) => {
                this.uploadDisabled = false
                console.log(error.response)
            });
    },
    deleteProductPicture() {
      Axios.delete(`${baseUrl}/pictures/delete`, {
        data : { id : this.deletePictureId },
        headers : { cmsaccesstoken : localStorage.cmsaccesstoken }        
      }).then(() => {
        this.$store.dispatch('loadProductPictures')
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
      let id = this.$store.state.userInfo.id
      return this.$store.state.products.filter( function (el) {
        return el.UserId == id
      });
    },
    categories () {
      return this.$store.state.categories
    },
    productPictures () {
      return this.$store.state.pictures
    }
  },
  created : function () {
    this.$store.dispatch('loadCategories')
    this.$store.dispatch('loadProducts')
    this.$store.dispatch('loadProductPictures')
  }

}
</script>

<style>

</style>