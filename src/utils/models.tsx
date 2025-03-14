export class Image {
    static from(mimetype: string, data: Promise<ArrayBuffer>): void {
        mimetype! = mimetype;
        data! = data;
    }
    id!: string;
    mimetype!: string;
    data!: string;
}

export class Artist {
    id!: string;
    name!: string;
    description!: string;
    instagram_url!: string;
    image!: Image;
    projects!: Project[] | null;
}

export class Location {
    static from(name: string, map_address: string): void {
        name! = name;
        map_address! = map_address;
    }
    id!: string;
    name!: string;
    map_address!: string;
}

export class Project {
    id!: string;
    name!: string;
    location!: Location;
    image!: Image;
    youtube_url!: string;
    artists!: Artist[] | null;
}

export class Event {
    id!: string;
    name!: string;
    description!: string;
    img!: Image;
    start_time!: Date;
    end_time!: Date;
    location!: Location;
}