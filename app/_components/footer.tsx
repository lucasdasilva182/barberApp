const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-secondary py-6 px-5">
      <div className="w-full flex items-center justify-between gap-2 container">
        <p className="text-grey-400 text-xs font-bold opacity-75">© {year} Copyright FSW Barber</p>
      </div>
    </footer>
  );
};

export default Footer;
