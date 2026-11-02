import { unstable_cache } from "next/cache"

const cachedStars = unstable_cache(
  async () => {
    const response = await fetch("https://api.github.com/repos/Dino-Kupinic/sniptide", {
      cache: "no-store",
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
    const data: unknown = await response.json()
    if (
      typeof data !== "object" ||
      data === null ||
      !("stargazers_count" in data) ||
      typeof data.stargazers_count !== "number" ||
      !Number.isSafeInteger(data.stargazers_count) ||
      data.stargazers_count < 0
    ) {
      throw new Error("Invalid GitHub star count")
    }
    return data.stargazers_count
  },
  ["github-stars"],
  { revalidate: 3600 },
)

export async function getGithubStars(): Promise<number | null> {
  try {
    return await cachedStars()
  } catch {
    return null
  }
}
