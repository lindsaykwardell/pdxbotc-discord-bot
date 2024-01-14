import axios from "axios";

function url(eventType: "tpk" | "rcg") {
  return `https://api.github.com/repos/lindsaykwardell/pdxbotc/contents/src/content/text/register-${eventType}.md`;
}

function getPostTitle(eventType: "tpk" | "rcg") {
  return eventType === "tpk"
    ? "TPK Brewing"
    : eventType === "rcg"
    ? "Red Castle Games"
    : "";
}

export async function postUpdateToGithub(
  eventType: "tpk" | "rcg",
  link: string
) {
  const title = getPostTitle(eventType);
  const fileUrl = url(eventType);

  const previousFile = await axios.get(fileUrl, {
    headers: {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    },
  });

  return axios.put(
    fileUrl,
    {
      message: `Updated link on ${title}`,
      branch: "master",
      author: {
        name: "PDXBOTC",
        email: "noreply@pdxbotc.com",
      },
      committer: {
        name: "PDXBOTC",
        email: "noreply@pdxbotc.com",
      },
      sha: previousFile.data.sha,
      content: Buffer.from(link).toString("base64"),
    },
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
      },
    }
  );
}
