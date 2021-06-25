import { ExpansionPage, WikiText } from '../wiki-client/api-models';
import { Expansion } from '../../../../../src/app/models/expansion';

export class ExpansionBuilder {
    build(expansionPage: ExpansionPage): Expansion[] {
        const releaseAmount = this.extractReleaseAmount(expansionPage);

        if (releaseAmount === 1) {
            return [
                {
                    id: expansionPage.pageid,
                    name: this.extractName(expansionPage),
                    icon: this.buildIcon(expansionPage, true),
                },
            ];
        }

        const expansions: Expansion[] = [];
        for (let release = 1; release <= releaseAmount; release++) {
            expansions.push({
                id: expansionPage.pageid + (release - 1) * 0.1,
                name: `${this.extractName(expansionPage)} (${release}. Edition)`,
                icon: this.buildIcon(expansionPage, release === releaseAmount),
            });
        }

        return expansions;
    }

    private extractReleaseAmount(expansionPage: ExpansionPage): number {
        const wikiText: WikiText = expansionPage.revisions[0]['*'] ?? '';
        const infoBox: WikiText = /\{\{Infobox Set\\n.*\}\}/.exec(wikiText)?.[0] ?? '';
        const release: WikiText = /\|release.*\\n/.exec(infoBox)?.[0] ?? '';

        return release?.split('/').length ?? 1;
    }

    private buildIcon(expansionPage: ExpansionPage, currentRelease: boolean): string {
        const name = this.extractName(expansionPage).replace(' ', '_');
        const suffix = currentRelease ? 'icon.png' : 'old_icon.png';

        return `${name}_${suffix}`;
    }

    private extractName(expansionPage: ExpansionPage): string {
        return /[\w\s]+/.exec(expansionPage.title)?.[0].trim() ?? '';
    }
}
