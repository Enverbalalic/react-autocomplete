import { SearchShowsItem, Show } from "src/api/response_types/SearchShows";

const searchShowsEndpoint = `https://api.tvmaze.com/search/shows`;

export default class {
    public static searchShows(query: string): Promise<Show[]> {
        const url = new URL(searchShowsEndpoint);

        url.searchParams.append("q", query);

        return fetch(url).then(r => r.json()).then((r: SearchShowsItem[]) => {
            // This API does fuzzy search, so our query sometimes doesn't fully match.
            // Just filter out those items
            // Example: searching for "big bang" will return a show named "big ang"

            return r.filter(item => item.show.name.toLowerCase().includes(query.toLowerCase())).map(item => item.show);
        });
    }
}
