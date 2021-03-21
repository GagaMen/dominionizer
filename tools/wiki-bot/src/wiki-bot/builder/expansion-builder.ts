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
                    icon: '',
                },
            ];
        }

        const expansions: Expansion[] = [];
        for (let i = 0; i < releaseAmount; i++) {
            expansions.push({
                id: expansionPage.pageid + i * 0.1,
                name: `${this.extractName(expansionPage)} (${i + 1}. Edition)`,
                icon: '',
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

    private extractName(expansionPage: ExpansionPage): string {
        return /[\w\s]+/.exec(expansionPage.title)?.[0].trim() ?? '';
    }
}
