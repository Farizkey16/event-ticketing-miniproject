import AuthDropdown from "./authdropdown";

type NavbarProps = {
  onSignInClick: () => void;
  onSignUpClick: () => void;
};

export default function Navbar({ onSignInClick, onSignUpClick }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow bg-white">
      <div className="text-xl font-bold text-blue-600">LOCAL EVENT.COM</div>

      <div className="hidden md:flex gap-6 text-sm font-medium">
        <a href="#" className="hover:text-blue-500">Features</a>
        <a href="#" className="hover:text-blue-500">Industry</a>
        <a href="#" className="hover:text-blue-500">Enterprise</a>
        <a href="#" className="text-blue-600 font-semibold">Explore Events</a>
        <a href="#" className="hover:text-blue-500">Pricing</a>
        <a href="#" className="hover:text-blue-500">Help</a>
      </div>

      <div className="flex items-center space-x-3">
        <AuthDropdown onSignInClick={onSignInClick} onSignUpClick={onSignUpClick} />

        <button className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600">
          Create Event
        </button>

        
      </div>
    </nav>
  );
}
