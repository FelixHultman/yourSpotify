export interface Artist {
  id: string;
  name: string;
  images: Image[];
}

export interface Image {
  url: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  preview_url: string;
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Image[];
  owner: Owner;
  tracks: Track[];
}

export interface Owner {
  id: string;
  display_name: string;
  external_urls: ExternalUrls;
}

export interface ExternalUrls {
  spotify: string;
}

