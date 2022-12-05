import { MatLegacyMenu as MatMenu } from '@angular/material/legacy-menu';

export type NavigationAction = 'back' | 'sidenav' | 'none';

export interface Action {
    icon: string;
    matMenu?: MatMenu;
    onClick?: () => void;
}

export interface AppBarConfiguration {
    navigationAction: NavigationAction;
    actions: Array<Action>;
}
