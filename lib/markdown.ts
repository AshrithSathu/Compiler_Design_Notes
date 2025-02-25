import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const chaptersDirectory = path.join(process.cwd(), "mdchapters");

// Define ChapterMetadata interface
interface ChapterMetadata {
  title?: string;
  description?: string;
  order?: number;
}

// Cache for storing chapter data
type ChapterSummary = Pick<ChapterContent, "id" | "title"> & ChapterMetadata;
let chaptersCache: ChapterSummary[] | null = null;

interface ChapterContent {
  id: string;
  contentHtml: string;
  title: string;
  description?: string;
  order?: number;
}

const chapterContentCache: Map<string, ChapterContent> = new Map<
  string,
  ChapterContent
>();

export function getAllChapters(): Array<ChapterSummary> {
  // Return cached data if available
  if (chaptersCache) {
    return chaptersCache;
  }

  const fileNames = fs.readdirSync(chaptersDirectory);
  const chapters = fileNames.map((fileName) => {
    const id = encodeURIComponent(fileName.replace(/\.md$/, ""));
    const fullPath = path.join(chaptersDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      title:
        matterResult.data.title ||
        decodeURIComponent(fileName.replace(/\.md$/, "")),
      ...(matterResult.data as ChapterMetadata),
    };
  });

  // Store in cache
  chaptersCache = chapters;
  return chapters;
}

export async function getChapterContent(id: string): Promise<ChapterContent> {
  // Check cache first
  const cached = chapterContentCache.get(id);
  if (cached) {
    return cached;
  }

  const fileName = decodeURIComponent(id) + ".md";
  const fullPath = path.join(chaptersDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const chapterContent: ChapterContent = {
    id,
    contentHtml,
    title: matterResult.data.title || decodeURIComponent(id),
    ...(matterResult.data as ChapterMetadata),
  };

  // Store in cache
  chapterContentCache.set(id, chapterContent);
  return chapterContent;
}

// Function to clear cache if needed (e.g., in development)
export function clearCache() {
  chaptersCache = null;
  chapterContentCache.clear();
}
