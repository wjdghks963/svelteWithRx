import { writable, type Writable } from 'svelte/store';
import { BehaviorSubject } from 'rxjs';

// counter
const countSubject = new BehaviorSubject(0);
const count: Writable<number> = writable(countSubject.value);

export { countSubject, count };
