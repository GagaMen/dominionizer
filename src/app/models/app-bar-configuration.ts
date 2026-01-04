import { MatMenu } from '@angular/material/menu';

export type NavigationAction = 'back' | 'sidenav' | 'none';

export interface Action {
    icon: string;
    matMenu?: MatMenu;
    onClick?: () => void;
}

export interface AppBarConfiguration {
    navigationAction: NavigationAction;
    actions: Action[];
}
