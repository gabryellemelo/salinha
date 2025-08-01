import { Guardian } from "../components/ListGuardians/ListGuardians";

export interface IChild {
  id: string;
  name: string;
  age: number;
  intolerances_restrictions: string;
  image_authorization: boolean;
  released_by: string;
  guardian: Guardian;
}
