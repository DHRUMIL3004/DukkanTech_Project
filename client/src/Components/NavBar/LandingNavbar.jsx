import './LandingNavbar.css';

function LandingNavbar() {
    return ( 
     <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
  <div className="container">
    <a className="navbar-brand" href="#"><img className='logo' src='/Logo.png'/></a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <a className="nav-link " href="/login">Login</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

     );
}

export default LandingNavbar;