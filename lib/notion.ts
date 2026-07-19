import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY! });
const configuredId = process.env.NOTION_DATABASE_ID!;

export type NotionEntry = {
  pageId: string;
  sourcePlatform: string;
  rawText: string;
  myNote: string;
};

function plainText(richTextArray: any[]): string {
  return (richTextArray ?? []).map((t) => t.plain_text).join("");
}

let resolvedDatabaseId: string | null = null;

// NOTION_DATABASE_ID might be the ID of the page that CONTAINS the database
// (that's what you get from "Copy link" on a full-page database), rather
// than the database itself. This tries the ID directly first, and if that
// fails, looks for the actual database living inside that page instead.
async function resolveDatabaseId(): Promise<string> {
  if (resolvedDatabaseId) return resolvedDatabaseId;

  try {
    await notion.databases.retrieve({ database_id: configuredId });
    resolvedDatabaseId = configuredId;
    return resolvedDatabaseId;
  } catch {
    const children = await notion.blocks.children.list({
      block_id: configuredId,
    });
    const dbBlock = children.results.find(
      (b: any) => b.type === "child_database"
    );
    if (!dbBlock) {
      throw new Error(
        "NOTION_DATABASE_ID isn't a database, and no database was found inside it either. Double check the ID."
      );
    }
    resolvedDatabaseId = dbBlock.id;
    return resolvedDatabaseId;
  }
}

export async function getNewNotionEntries(): Promise<NotionEntry[]> {
  const databaseId = await resolveDatabaseId();

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      select: { equals: "New" },
    },
  });

  return response.results.map((page: any) => ({
    pageId: page.id,
    sourcePlatform: page.properties["Source Platform"]?.select?.name ?? "",
    rawText: plainText(page.properties["Raw Text"]?.rich_text),
    myNote: plainText(page.properties["My Note"]?.rich_text),
  }));
}

export async function setNotionStatus(
  pageId: string,
  status: "Processed" | "Skipped"
) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Status: { select: { name: status } },
    },
  });
}