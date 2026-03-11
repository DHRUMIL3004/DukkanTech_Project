const Footer = () => {
  return (
    <footer className="py-4 bg-dark text-white">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          <strong>DukaanTech</strong> &mdash; built with Bootstrap and React.
        </div>
        <div className="text-muted">© {new Date().getFullYear()} DukaanTech</div>
      </div>
    </footer>
  );
};

export default Footer;
