export interface IClass {
  id: string;
  name: string;
  max_age: number;
  min_age: number;
}

export interface IClassDetail {
  schedule: {
    id: string;
    datetime: string;
    class: IClass;
  };
}
