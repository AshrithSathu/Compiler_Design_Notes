import { getChapterContent } from "@/lib/markdown";
import Link from "next/link";

export const revalidate = 3600; // Revalidate chapter content every hour

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const chapter = await getChapterContent(id);

    return (
      <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
        <main className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Chapters
          </Link>
          <h1 className="text-3xl font-bold mb-8">{chapter.title}</h1>
          <div
            className="prose prose-2xl max-w-none prose-headings:font-bold prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:mt-8 prose-h3:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-li:text-lg prose-li:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: chapter.contentHtml }}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading chapter:", error);
    return (
      <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
        <main className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Chapters
          </Link>
          <h1 className="text-3xl font-bold mb-8">Error</h1>
          <p>Unable to load chapter content.</p>
        </main>
      </div>
    );
  }
}
