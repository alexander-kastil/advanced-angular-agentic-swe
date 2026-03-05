import { Topic } from '../topics/topic.model';
export class Skill {
  id: number = 0;
  topicId: number = 0;
  topic?: Topic;
  name: string = '';
  hours: number = 0;
  completed: boolean = false;
  duedate: Date = new Date();
  sortOrder: number = 0;
}
