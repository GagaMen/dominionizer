export type NavigationAction = 'back' | 'sidenav' | 'none';

export interface AppBarConfiguration {
    navigationAction: NavigationAction;
    actions: Array<unknown>;
}
