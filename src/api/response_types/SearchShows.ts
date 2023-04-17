export interface SearchShowsItem {
    score: number,
    show: Show,
}

export interface Show {
    averageRuntime: number;
    dvdCountry: string | null;
    ended: string | null;
    genres: string[];
    id: number;
    language: string;
    name: string;
    network: ShowNetwork;
    officialSite: string | null;
    premiered: string;
    rating: ShowRating;
    runtime: number;
    status: ShowStatus,
    summary: string;
    type: ShowType;
    updated: number;
    url: string;
    weight: number;
}

export enum ShowType {
    PanelShow = "Panel Show"
}

export enum ShowStatus {
    Ended = "Ended",
}

export interface ShowRating {
    average: number | null;
}

export interface ShowNetworkCountry {
    code: string,
    name: string,
    timezone: string,
}

export interface ShowNetwork {
    country: ShowNetworkCountry,
    id: number,
    name: string,
    officialSite: string | null,
}
