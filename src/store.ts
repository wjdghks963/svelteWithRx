import { writable, type Writable } from 'svelte/store';
import { BehaviorSubject } from 'rxjs';

const countSubject = new BehaviorSubject(0);
const count: Writable<number> = writable(countSubject.value);

countSubject.subscribe((value) => count.set(value));

export { count, countSubject };
