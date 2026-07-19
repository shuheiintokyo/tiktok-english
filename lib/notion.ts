import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY! });
const databaseId = process.env.NOTION_DATABASE_ID!;

export type NotionEntry = {
  pageId: string;
  sourcePlatform: string;
  rawText: string;
  myNote: string;
};

function plainText(richTextArray: any[]): string {
  return (richTextArray ?? []).map((t) => t.plain_text).join("");
}

export async function getNewNotionEntries(): Promise<NotionEntry[]> {
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
