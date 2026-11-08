function Footer({ main }) {
  if (!main) return null;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {year} {main.name}</p>
        <a className="back-to-top" href="#home">
          Back to top
        </a>
      </div>
    </footer>
  );
}

export default Footer;
