export function NavBar() {
  return (
    <nav className="bg-black p-1 text-sans">
      <li className="flex justify-evenly gap-2 p-2 text-white">
        <h1>Muthu Palaniyappan OL</h1>
        <ul>
          <a href="#" className="group text-white transition duration-100">
            Home
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </a>
        </ul>
        <ul>
          <a href="#" className="group text-white transition duration-100">
            About
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </a>
        </ul>
        <ul>
          <a href="#" className="group text-white transition duration-100">
            Contact
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
          </a>
        </ul>
      </li>
    </nav>
  );
}
