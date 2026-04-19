export interface IChat {
  answer: string;
  isSkillQuery?: boolean;
    skills?:
    | {
        skill: string;
        similarity: number;
      }[]
    | undefined;
}
