import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-tangerine font-body text-sm tracking-widest uppercase mb-4">
        404 Error
      </p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-bone mb-6">
        PAGE NOT FOUND
      </h1>
      <p className="text-bone/60 font-body max-w-md mb-10 text-lg">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-primary text-lg">
        BACK TO HOME
      </Link>
    </main>
  );
}
