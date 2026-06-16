import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center text-center px-6">
      <div className="max-w-3xl hero-fade">

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
          LandChain Registry
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
          Secure, transparent land registration powered by blockchain.
        </p>

        {/* CTA */}
        <Link
  to="/signup"
  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full 
  bg-gradient-to-r from-blue-500 to-indigo-600 
  text-white shadow-lg 
  hover:shadow-2xl hover:scale-105 
  transition-all duration-300"
>
  Get Started
</Link>

      </div>
    </div>
  );
}

export default Home;