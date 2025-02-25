import { getAllChapters } from "@/lib/markdown";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  const chapters = getAllChapters();

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Compiler Design</h1>
        <div className="grid gap-4">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/chapters/${chapter.id}`}
              className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{chapter.title}</h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
