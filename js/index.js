Vue.component("product-tabs", {
  template: `
  <div>

    <div style="margin-top: 50px;">
      <span 
        class="tab" 
        :class="{activeTab: tab == selectedTab}" 
        id="tab" @click="getSelected(tab)" 
        v-for="tab in tabs">{{tab}}
      </span>
    </div>

    <product-review v-show="selectedTab == 'Make a review'" @send-review="printReview"></product-review>

    <div v-show="selectedTab == 'Review'">
      <p v-if="reviewDetails.length == 0">There is no review</p>
      <ul>
          <li v-for="reviewDetail in reviewDetails">
              <p>{{reviewDetail.name}}</p>
              <p>{{reviewDetail.rating}}</p>
              <p>{{reviewDetail.review}}</p>
          </li>
      </ul>
    </div>

  </div>
 

  `,
  data() {
    return {
      tabs: ["Review", "Make a review"],
      selectedTab: "Make a review",
      reviewDetails: [],
    }; // End of return
  }, // ENd of data()
  methods: {
    getSelected(tab) {
      this.selectedTab = tab
    },
    printReview(reviewDetail) {
      this.reviewDetails.push(reviewDetail);
    },
  }
}); // End of product-tabs

Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
        </select>
    </p>
        
    <p>
        <input type="submit" value="Submit">  
    </p>    

    </form>
    `,

  data() {
    return {
      name: null,
      review: null,
      rating: null,
    }; // End of return
  }, // End of data
  methods: {
    onSubmit() {
      let reviewDetail = {
        name: this.name,
        review: this.review,
        rating: this.rating,
      };
      this.$emit("send-review", reviewDetail);
      this.name = null;
      this.review = null;
      this.rating = null;
    },
  }, //End of methods
}); // End of product-review

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  }, // End of props
  template: `
    <ul>
        <li v-for="detail in details">{{detail}}</li>
    </ul>
    `,
}); // End of product-details component

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    
    <div class="product">
      <div class="product-image">
        <img :src="image" alt="" />
      </div>

      <div class="product-info">
        <h1>{{title}}</h1>
        <p v-if="inStock">In Stock</p>
        <p v-else :class="{outStock: !inStock}">Out Stock</p>
        <p>{{shipping}}</p>
     
        <product-details :details="details"></product-details>

        <div
          v-for="(variant, index) in variants"
          :key="variant.variantId"
          @mouseover="updateProduct(index)"
          class="color-box"
          :style="{backgroundColor: variant.variantColor}"
        ></div>

        <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton : !inStock}">Add to cart</button>
        <button v-on:click="removeFromCart">Remove cart</button>

        <product-tabs></product-tabs>



        

       
       
      </div>  <!-- End of product-info div-->
    </div> <!-- End of product div-->

    `,
  data() {
    return {
      brand: "vue mastery",
      product: "Socks",
      description: "this is a sucks",
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "Green",
          variantImage: "img/vmSocks-green-onWhite.jpg",
          variantQuantity: 100,
        },
        {
          variantId: 2235,
          variantColor: "Blue",
          variantImage: "img/vmSocks-blue-onWhite.jpg",
          variantQuantity: 100,
        },
      ],
      reviewDetails: [],
    }; // End of return
  }, //End of data()
  methods: {
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
  }, //End of methods
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) return "Shipping is free";
      else return "Shipping is $20.99";
    },
  }, //End of computed
}); // End of component

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeCart(id) {
      //if (this.cart.length != 0) {
      for (var i = 0; i < this.cart.length; i++) {
        if (id == this.cart[i]) {
          this.cart.splice(i, 1);
          break;
        }
      } // End of for
    },
  },
}); // End of app
