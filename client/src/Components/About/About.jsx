function About() {
    return ( <div>  
      <section className="about py-5" >
  <div className="container">
    <div className="row align-items-center">

      <div className="col-md-6">
        <img src="/Bill_img.jpg" className="img-fluid rounded" alt="billing"/>
      </div>

      <div className="col-md-6">
        <h2 className="fw-bold">About DukaanTech</h2>
        <h5 className="text-primary mb-3">
          Simple & Smart Billing for Modern Shops
        </h5>

        <p className="text-muted">
          DukaanTech is a smart digital billing platform designed to help
          shop owners generate bills quickly and manage daily sales easily.
          Our system allows businesses to create professional invoices,
          track transactions, and manage products in one place.
        </p>
        
        <p className="text-muted">
         With DukaanTech, shopkeepers can save valuable time, reduce manual errors, and keep accurate records of every sale, making business management simple and efficient.
        </p>
       
      </div>

    </div>
  </div>
</section>

</div>
     );
}

export default About;