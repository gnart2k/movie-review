import SearchClient from "./Search";

export default async function Search(props: { searchParams: Promise<{ q: string; with_keywords: string }> }) {
  const searchParams = await props.searchParams;
  
  return <SearchClient query={searchParams.q} withKeywords={searchParams.with_keywords} />;
}
