export type NavigationAction = 'back' | 'sidenav' | 'none';

export interface Action {
    icon: string;
    onClick(): void;
}

export interface AppBarConfiguration {
    navigationAction: NavigationAction;
    actions: Array<Action>;
}
