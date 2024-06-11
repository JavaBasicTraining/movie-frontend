export interface IMovie {
  id: number;
  name?: string | null;
  posterUrl: string | null;
  videoUrl: string | null;
  description: string | null;
}

export class Movie implements IMovie {
  private _id: number;
  private _name?: string | null | undefined;
  private _posterUrl: string | null;
  private _videoUrl: string | null;
  private _description: string | null;

  constructor(id: number, name: string | null | undefined, posterUrl: string | null, videoUrl: string | null, description: string | null) {
    this._id = id;
    this._name = name;
    this._posterUrl = posterUrl;
    this._videoUrl = videoUrl;
    this._description = description;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string | null | undefined {
    return this._name;
  }

  set name(value: string | null | undefined) {
    this._name = value;
  }

  get posterUrl(): string | null {
    return this._posterUrl;
  }

  set posterUrl(value: string | null) {
    this._posterUrl = value;
  }

  get videoUrl(): string | null {
    return this._videoUrl;
  }

  set videoUrl(value: string | null) {
    this._videoUrl = value;
  }

  get description(): string | null {
    return this._description;
  }

  set description(value: string | null) {
    this._description = value;
  }
}
