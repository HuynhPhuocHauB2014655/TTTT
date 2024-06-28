<template>
    <div class="bg-primary row pt-3 mt-auto">
          <div class="col-4">
               <p class="fs-3 fw-bold text-center">SHOP H&N</p>
          </div>
          <div class="col-4 border-start border-end border-5 px-5 d-flex justify-content-between">
                    <p class="fs-4 fw-bold">Follow us</p>
                    <div class="d-flex justify-content-evenly">
                         <i class="fa-brands fa-facebook fs-4 m-2"></i>
                         <i class="fa-brands fa-youtube fs-4 m-2"></i>
                         <i class="fa-brands fa-twitter fs-4 m-2"></i>
                         <i class="fa-brands fa-instagram fs-4 m-2"></i>
                         <i class="fa-solid fa-envelope fs-4 m-2"></i>
                    </div>
          </div>
          <div class="col-4">
               <router-link to="/about" >
                    <p class="fs-4 fw-bold text-dark text-center">Contact</p> 
               </router-link>  
          </div>
    </div>
</template>